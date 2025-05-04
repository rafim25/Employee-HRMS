import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import BreadcrumbAdmin from '../../../../components/atoms/Breadcrumb/BreadcrumbAdmin';
import Pagination from '../../../../components/molecules/Pagination/Pagination';
import DataTable from '../../../../components/molecules/DataTable/DataTable';
import FilterModal from '../../../../components/molecules/FilterModal/FilterModal';
import ConfirmationModal from '../../../../components/molecules/Modal/ConfirmationModal';
import RejectionModal from '../../../../components/molecules/RejectionModal/RejectionModal';
import InterviewProcessMilestone from '../../../../components/molecules/Milestones/InterviewProcessMilestones';
import { useAuth } from '../../../../context/AuthContext';
import { fetchJobById } from '../../../../context/actions/jobActions';
import { format, isValid, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaUsers,
  FaRegClock,
  FaBuilding,
  FaEnvelope,
  FaLocationArrow,
  FaMoneyBillWave,
  FaUserClock,
  FaListUl,
  FaQuestionCircle,
  FaCheckCircle,
  FaArrowLeft,
  FaDownload,
  FaShare,
  FaFilter,
  FaExclamationTriangle,
  FaEdit,
  FaEye,
} from 'react-icons/fa';
import { BiSearch } from 'react-icons/bi';
import { BsTrash3 } from 'react-icons/bs';
import { checkUserPermission } from '../../../../utils/permissions';

const JobDetails = () => {
  const { id } = useParams();
  const { dispatch, state: authState } = useAuth();
  const userId = authState?.user?.user_id;
  const [activeTab, setActiveTab] = useState('details');
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    source: '',
    experience: { min: '', max: '' },
    location: '',
    dateRange: {
      start: '',
      end: ''
    }
  });
  const [showShareConfirmation, setShowShareConfirmation] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const jobData = await fetchJobById(dispatch, id);
        setJob(jobData);
      } catch (error) {
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [id, dispatch]);

  const fetchCandidates = async () => {
    try {
      const response = await fetch(`/api/candidates/job/${id}`);
      if (!response.ok) throw new Error('Failed to fetch candidates');
      const data = await response.json();
      console.log('data', data);
      setCandidates(data);
    } catch (error) {
      toast.error('Failed to load candidates');
    }
  };

  useEffect(() => {
    if (activeTab === 'candidates') {
      fetchCandidates();
    }
  }, [activeTab]);

  const handleStatusChange = async (candidateId, newStatus) => {
    const candidate = candidates.find(c => c.uuid === candidateId);
    if (!checkUserPermission(candidate, authState?.user)) {
      toast.error("You don't have permission to change this candidate's status");
      return;
    }
    if (newStatus === 'rejected') {
      setSelectedCandidate(candidates.find(c => c.uuid === candidateId));
      setShowRejectionModal(true);
      return;
    }

    try {
      const response = await fetch(`/api/candidates/${candidateId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          status: newStatus,
          changed_by: userId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      setCandidates(prev =>
        prev.map(candidate =>
          candidate.uuid === candidateId
            ? { ...candidate, application_status: newStatus }
            : candidate
        )
      );

      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRejectionConfirm = async (rejectionDetails) => {
    try {
      const response = await fetch(`/api/candidates/${selectedCandidate.uuid}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          status: 'rejected',
          rejection_reason: rejectionDetails.reason,
          rejection_details: {
            ...rejectionDetails,
            rejected_by: authState?.user?.username,
            rejected_at: new Date().toISOString()
          },
          changed_by: userId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update rejection details');
      }

      setCandidates(prev =>
        prev.map(candidate =>
          candidate.uuid === selectedCandidate.uuid
            ? {
              ...candidate,
              application_status: 'rejected',
              rejection_reason: rejectionDetails.reason,
              rejection_details: {
                ...rejectionDetails,
                rejected_by: authState?.user?.username,
                rejected_at: new Date().toISOString()
              }
            }
            : candidate
        )
      );

      toast.success('Candidate rejected successfully');
      setShowRejectionModal(false);
      setSelectedCandidate(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = parseISO(dateString);
    return isValid(date) ? format(date, 'MMM dd, yyyy') : 'Invalid date';
  };

  // Add filter configuration
  const filterConfig = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'applied', label: 'Applied' },
        { value: 'screening', label: 'Screening' },
        { value: 'shortlisted', label: 'Shortlisted' },
        { value: 'interviewed', label: 'Interviewed' },
        { value: 'selected', label: 'Selected' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'hold', label: 'Hold' }
      ]
    },
    {
      key: 'source',
      label: 'Source',
      type: 'select',
      options: [
        { value: 'Naukri', label: 'Naukri' },
        { value: 'Direct', label: 'Direct' },
        { value: 'Referral', label: 'Referral' },
        { value: 'LinkedIn', label: 'LinkedIn' },
        { value: 'Agency', label: 'Agency' }
      ]
    },
    {
      key: 'experience',
      label: 'Experience',
      type: 'range',
      min: 0,
      max: 20,
      step: 1,
      placeholder: 'Years of experience'
    },
    {
      key: 'dateRange',
      label: 'Applied Date',
      type: 'dateRange'
    },
    {
      key: 'location',
      label: 'Location',
      type: 'search',
      placeholder: 'Search location'
    }
  ];

  // Add status options
  const statusOptions = [
    { value: 'applied', label: 'Applied' },
    { value: 'screening', label: 'Screening' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'interviewed', label: 'Interviewed' },
    { value: 'selected', label: 'Selected' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'joined', label: 'Joined' }
  ];

  // Add status colors
  const statusColors = {
    applied: 'bg-warning/10 text-warning hover:bg-warning hover:text-white cursor-pointer',
    screening: 'bg-info/10 text-info hover:bg-info hover:text-white cursor-pointer',
    shortlisted: 'bg-success/10 text-success hover:bg-success hover:text-white cursor-pointer',
    interviewed: 'bg-primary/10 text-primary hover:bg-primary hover:text-white cursor-pointer',
    selected: 'bg-success/10 text-success hover:bg-success hover:text-white cursor-pointer',
    joined: 'bg-success/10 text-success hover:bg-success hover:text-white cursor-pointer',
    rejected: 'bg-danger/10 text-danger pointer-events-none opacity-75'
  };

  // Update the columns configuration
  const columns = [
    {
      key: 'name',
      header: 'Candidate Details',
      className: 'min-w-[220px] py-4.5 px-4 xl:pl-11',
      render: (candidate) => (
        <div className="flex flex-col gap-1.5">
          <h5 className="font-medium text-black dark:text-white">
            {candidate.name}
          </h5>
          <p className="text-sm text-gray-500">{candidate.email}</p>
          <p className="text-sm text-gray-500">
            📞 {candidate.phone}
          </p>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      className: 'min-w-[120px] py-4.5 px-4',
      render: (candidate) => (
        <span
          className={`inline-flex rounded-full py-1 px-3 text-sm font-medium transition-all duration-200 ${statusColors[candidate.application_status] || 'bg-gray-100 text-gray-500'
            }`}
        >
          {candidate.application_status}
        </span>
      )
    },
    {
      key: 'source',
      header: 'Source',
      className: 'min-w-[120px] py-4.5 px-4',
      render: (candidate) => (
        <div className="flex flex-col gap-1">
          <p className="text-black dark:text-white font-medium">
            {candidate.source || 'Direct'}
          </p>
          {candidate.referred_by && (
            <p className="text-sm text-gray-500">
              Ref: {candidate.referred_by}
            </p>
          )}
          <p className="text-sm text-gray-500">
            Created by: {candidate.created_by || 'N/A'}
          </p>
        </div>
      )
    },
    {
      key: 'createdAt',
      header: 'Applied Date',
      className: 'min-w-[120px] py-4.5 px-4',
      render: (candidate) => (
        <p className="text-black dark:text-white">
          {format(new Date(candidate.createdAt), 'MMM dd, yyyy')}
        </p>
      )
    },
    {
      key: 'resume',
      header: 'Resume',
      className: 'min-w-[120px] py-4.5 px-4',
      render: (candidate) => (
        <div>
          {candidate.resume_url ? (
            <button
              onClick={() => window.open(candidate.resume_url, '_blank')}
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200"
            >
              <FaDownload className="text-base" />
              <span className="text-sm font-medium">Download CV</span>
            </button>
          ) : (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              No resume uploaded
            </span>
          )}
        </div>
      )
    }
  ];

  // Add share functionality
  const handleShareWithClient = async () => {
    try {
      const loadingToast = toast.loading('Sharing shortlisted candidates...');

      // Filter only shortlisted candidates
      const shortlistedCandidates = candidates.filter(c => c.application_status === 'shortlisted');

      if (shortlistedCandidates.length === 0) {
        toast.error('No shortlisted candidates to share');
        return;
      }

      const response = await fetch('/api/candidates/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          jobId: id,
          clientEmail: job.clientEmail,
          clientName: job.clientName,
          jobTitle: job.title,
          candidates: shortlistedCandidates // Send only shortlisted candidates
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to share candidates');
      }

      toast.success(`Successfully shared ${shortlistedCandidates.length} shortlisted candidates`, {
        id: loadingToast,
        duration: 4000,
        icon: '✉️'
      });

      // Update local state for shared candidates
      setCandidates(prev => prev.map(candidate =>
        candidate.application_status === 'shortlisted'
          ? { ...candidate, shared_with_client: true, shared_at: new Date() }
          : candidate
      ));

      setShowShareConfirmation(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Add filter handling functions
  const handleApplyFilters = () => {
    const filteredCandidates = candidates.filter(candidate => {
      const matchesStatus = !filters.status || candidate.application_status === filters.status;
      const matchesSource = !filters.source || candidate.source === filters.source;
      const matchesExperience = (!filters.experience.min || candidate.experience >= Number(filters.experience.min)) &&
        (!filters.experience.max || candidate.experience <= Number(filters.experience.max));
      const matchesLocation = !filters.location ||
        candidate.city?.toLowerCase().includes(filters.location.toLowerCase()) ||
        candidate.state?.toLowerCase().includes(filters.location.toLowerCase());
      const matchesDateRange = (!filters.dateRange.start || new Date(candidate.createdAt) >= new Date(filters.dateRange.start)) &&
        (!filters.dateRange.end || new Date(candidate.createdAt) <= new Date(filters.dateRange.end));

      return matchesStatus &&
        matchesSource &&
        matchesExperience &&
        matchesLocation &&
        matchesDateRange;
    });

    setCandidates(filteredCandidates);
    setShowFilterModal(false);
  };

  const handleResetFilters = () => {
    setFilters({
      status: '',
      source: '',
      experience: { min: '', max: '' },
      location: '',
      dateRange: { start: '', end: '' }
    });
    // Reload original candidates
    fetchCandidates();
  };

  // Update the share button click handler
  const handleShareClick = () => {
    const shortlistedCount = candidates.filter(c => c.application_status === 'shortlisted').length;
    if (shortlistedCount === 0) {
      toast.error('No shortlisted candidates to share');
      return;
    }
    setShowShareConfirmation(true);
  };

  // Add this function to filter candidates
  const getFilteredCandidates = () => {
    return candidates.filter(candidate => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm ||
        candidate.name?.toLowerCase().includes(searchLower) ||
        candidate.email?.toLowerCase().includes(searchLower) ||
        candidate.phone?.includes(searchTerm) ||
        candidate.source?.toLowerCase().includes(searchLower) ||
        candidate.created_by?.toLowerCase().includes(searchLower);

      const matchesStatus = !filters.status || candidate.application_status === filters.status;
      const matchesSource = !filters.source || candidate.source === filters.source;
      const matchesExperience = (!filters.experience.min || candidate.experience >= Number(filters.experience.min)) &&
        (!filters.experience.max || candidate.experience <= Number(filters.experience.max));
      const matchesLocation = !filters.location ||
        candidate.current_location?.toLowerCase().includes(filters.location.toLowerCase());
      const matchesDateRange = (!filters.dateRange.start || new Date(candidate.createdAt) >= new Date(filters.dateRange.start)) &&
        (!filters.dateRange.end || new Date(candidate.createdAt) <= new Date(filters.dateRange.end));

      return matchesSearch &&
        matchesStatus &&
        matchesSource &&
        matchesExperience &&
        matchesLocation &&
        matchesDateRange;
    });
  };

  // Add this to get paginated data
  const getPaginatedData = () => {
    const filteredCandidates = getFilteredCandidates();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCandidates.slice(startIndex, endIndex);
  };

  if (loading) {
    return (
      <DefaultLayoutAdmin>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DefaultLayoutAdmin>
    );
  }

  return (
    <DefaultLayoutAdmin>
      <BreadcrumbAdmin pageName='Job Details' icon={FaBriefcase} backUrl="/admin/recruitments/job-management" />
      <div className="bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark p-6 mb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white mb-2">
              {job?.title}
            </h1>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-4">
              <span className="flex items-center">
                <FaBriefcase className="mr-2" />
                {job?.type}
              </span>
              <span className="flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                {job?.city}, {job?.state}
              </span>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${job?.status === 'active' ? 'bg-success/10 text-success' :
            job?.status === 'draft' ? 'bg-warning/10 text-warning' :
              'bg-danger/10 text-danger'
            }`}>
            {job?.status?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark mb-4">
        <div className="flex border-b border-stroke dark:border-strokedark">
          <button
            className={`px-6 py-3 text-sm font-medium ${activeTab === 'details'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-primary'
              }`}
            onClick={() => setActiveTab('details')}
          >
            <span className="flex items-center">
              <FaListUl className="mr-2" />
              Job Details
            </span>
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${activeTab === 'candidates'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-primary'
              }`}
            onClick={() => setActiveTab('candidates')}
          >
            <span className="flex items-center">
              <FaUsers className="mr-2" />
              Candidates
            </span>
          </button>
        </div>
      </div>

      {activeTab === 'details' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Job Description */}
            <div className="bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark p-6">
              <h2 className="text-xl font-bold text-black dark:text-white mb-4 flex items-center">
                <FaListUl className="mr-2" /> Job Description
              </h2>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {job?.description}
              </p>
            </div>

            {/* Required Skills */}
            <div className="bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark p-6">
              <h2 className="text-xl font-bold text-black dark:text-white mb-4">
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {job?.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Interview Process */}
            <div className="bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark p-4">
              <h2 className="text-xl font-bold text-black dark:text-white mb-4">
                Interview Process
              </h2>
              <InterviewProcessMilestone
                rounds={job?.interviewRounds || []}
              // currentStep={2}
              />
            </div>

            {/* Interview Questions */}
            <div className="bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark p-6">
              <h2 className="text-xl font-bold text-black dark:text-white mb-4 flex items-center">
                <FaQuestionCircle className="mr-2" /> Interview Questions
              </h2>
              <div className="space-y-3">
                {job?.questions?.filter(q => q.trim())?.map((question, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-meta-4">
                    <FaCheckCircle className="text-primary mt-1" />
                    <p className="text-gray-700 dark:text-gray-300">{question}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Key Details Card */}
            <div className="bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark p-6">
              <h2 className="text-xl font-bold text-black dark:text-white mb-4">
                Job Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <FaMoneyBillWave className="mr-3 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Salary Range</p>
                    <p className="text-success font-semibold">
                      CTC: ₹ {job?.minSalary} - ₹ {job?.maxSalary} LPA
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <FaUserClock className="mr-3 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Experience Required</p>
                    <p>{job?.experienceRange[0]} - {job?.experienceRange[1]} Years</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <FaRegClock className="mr-3 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Application Deadline</p>
                    <p>{formatDate(job?.deadline)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Information Card */}
            <div className="bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark p-6">
              <h2 className="text-xl font-bold text-black dark:text-white mb-4">
                Client Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <FaBuilding className="mr-3 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Client Name</p>
                    <p>{job?.clientName}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <FaEnvelope className="mr-3 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p>{job?.clientEmail}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <FaLocationArrow className="mr-3 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p>{job?.clientLocation}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            {/* Search and Filter Controls */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* Search Box */}
              <div className="relative flex-grow sm:flex-grow-0 sm:w-72">
                <input
                  type="text"
                  placeholder="Search by name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                  className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-12 pr-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
                />
                <BiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-500" />
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilterModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-opacity-90"
              >
                <FaFilter />
                Filters
              </button>

              {/* Share Button */}
              {getFilteredCandidates().some(c => c.application_status === 'shortlisted') && (
                <button
                  onClick={handleShareClick}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-opacity-90"
                >
                  <FaShare />
                  Share Shortlisted
                </button>
              )}
            </div>
          </div>

          {getFilteredCandidates().length > 0 ? (
            <>
              <div className="rounded-lg border border-stroke dark:border-strokedark">
                <div className="max-w-full overflow-x-auto">
                  <DataTable
                    data={getPaginatedData()}
                    columns={columns}
                    actions={[
                      {
                        icon: <FaEye />,
                        label: 'View',
                        onClick: (candidate) => navigate(`/admin/recruitments/candidates/${candidate.uuid}`),
                        show: () => true // View is always available to everyone
                      },
                      {
                        icon: <FaEdit />,
                        label: 'Edit',
                        onClick: (candidate) => {
                          if (checkUserPermission(candidate, authState?.user)) {
                            navigate(`/admin/recruitments/candidates/edit/${candidate.uuid}`);
                          } else {
                            toast.error("You don't have permission to edit this candidate");
                          }
                        },
                        show: (candidate) => checkUserPermission(candidate, authState?.user)
                      },
                      {
                        icon: <BsTrash3 />,
                        label: 'Delete',
                        onClick: (candidate) => {
                          if (checkUserPermission(candidate, authState?.user)) {
                            handleDelete(candidate.uuid);
                          } else {
                            toast.error("You don't have permission to delete this candidate");
                          }
                        },
                        show: (candidate) => checkUserPermission(candidate, authState?.user)
                      }
                    ]}
                    statusOptions={statusOptions}
                    onStatusChange={handleStatusChange}
                    // onView={(candidate) => navigate(`/admin/recruitments/candidates/${candidate.uuid}`)}
                    // onEdit={(candidate) => navigate(`/admin/recruitments/candidates/edit/${candidate.uuid}`)}
                    onDownload={(candidate) => window.open(candidate.resume_url, '_blank')}
                    statusColors={statusColors}
                    className="w-full table-auto"
                  />
                </div>
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalItems={getFilteredCandidates().length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                showingText="Showing"
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <FaUsers className="text-5xl text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">
                No candidates found
              </h3>
              <p className="text-gray-400 dark:text-gray-500 mt-2">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}

          {/* Filter Modal */}
          <FilterModal
            isOpen={showFilterModal}
            onClose={() => setShowFilterModal(false)}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
            filters={filters}
            setFilters={setFilters}
            config={filterConfig}
          />

          {/* Share Confirmation Modal */}
          <ConfirmationModal
            isOpen={showShareConfirmation}
            onClose={() => setShowShareConfirmation(false)}
            onConfirm={handleShareWithClient}
            title="Share Shortlisted Candidates"
            message={`Are you sure you want to share ${candidates.filter(c => c.application_status === 'shortlisted').length
              } shortlisted candidate(s) with ${job?.clientName}? An email will be sent with the candidates' details and resumes.`}
            confirmText="Share Candidates"
            cancelText="Cancel"
            confirmButtonClass="bg-primary"
            icon={<FaExclamationTriangle className="text-2xl text-warning" />}
          />

          {/* Rejection Modal */}
          <RejectionModal
            isOpen={showRejectionModal}
            onClose={() => {
              setShowRejectionModal(false);
              setSelectedCandidate(null);
            }}
            onConfirm={handleRejectionConfirm}
            currentStage={selectedCandidate?.current_round}
          />
        </div>
      )}
    </DefaultLayoutAdmin>
  );
};

export default JobDetails; 