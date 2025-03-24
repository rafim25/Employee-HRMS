import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin } from '../../../../components';
import { useAuth } from '../../../../context/AuthContext';
import { fetchJobById } from '../../../../context/actions/jobActions';
import { format, isValid, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import {
  FaBriefcase, FaMapMarkerAlt, FaUsers, FaRegClock, FaBuilding,
  FaEnvelope, FaLocationArrow, FaMoneyBillWave, FaUserClock,
  FaListUl, FaQuestionCircle, FaCheckCircle, FaUserTie, FaArrowLeft
} from 'react-icons/fa';
import InterviewProcessMilestone from '../../../../components/molecules/Milestones/InterviewProcessMilestones';
import DataTable from '../../../../components/molecules/DataTable/DataTable';

const JobDetails = () => {
  const { id } = useParams();
  const { dispatch, state: authState } = useAuth();
  const userId = authState?.user?.user_id;
  const [activeTab, setActiveTab] = useState('details');
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);

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
            ? { ...candidate, status: newStatus }
            : candidate
        )
      );

      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = parseISO(dateString);
    return isValid(date) ? format(date, 'MMM dd, yyyy') : 'Invalid date';
  };

  // Add this columns configuration
  const columns = [
    {
      key: 'name',
      header: 'Candidate Details',
      className: 'min-w-[220px] xl:pl-11',
      render: (candidate) => (
        <div className="flex flex-col gap-1">
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
      className: 'min-w-[120px]',
      type: 'status'
    },
    {
      key: 'source',
      header: 'Source',
      className: 'min-w-[120px]',
      render: (candidate) => (
        <>
          <p className="text-black dark:text-white">
            {candidate.source || 'Direct'}
          </p>
          {candidate.referred_by && (
            <p className="text-sm text-gray-500">
              Ref: {candidate.referred_by}
            </p>
          )}
        </>
      )
    },
    {
      key: 'createdAt',
      header: 'Applied Date',
      className: 'min-w-[120px]',
      type: 'date',
      format: 'MMM dd, yyyy'
    }
  ];

  // Add status options
  const statusOptions = [
    { value: 'applied', label: 'Applied' },
    { value: 'screening', label: 'Screening' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'interviewed', label: 'Interviewed' },
    { value: 'selected', label: 'Selected' },
    { value: 'rejected', label: 'Rejected' }
  ];

  // Add status colors
  const statusColors = {
    applied: 'bg-warning/10 text-warning',
    screening: 'bg-info/10 text-info',
    shortlisted: 'bg-success/10 text-success',
    interviewed: 'bg-primary/10 text-primary',
    selected: 'bg-success/10 text-success',
    rejected: 'bg-danger/10 text-danger'
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
      <div className="flex items-center justify-between mb-4">
        <BreadcrumbAdmin pageName='Job Details' />
        <button
          onClick={() => navigate('/admin/recruitments/job-management')}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
        >
          <FaArrowLeft />
          Back to Jobs
        </button>
      </div>

      {/* Header Card */}
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
              <FaUserTie className="mr-2" />
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
                      CTC: {job?.minSalary} - {job?.maxSalary} LPA
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
          {candidates.length > 0 ? (
            <DataTable
              data={candidates}
              columns={columns}
              actions={true}
              statusOptions={statusOptions}
              onStatusChange={handleStatusChange}
              onView={(candidate) => navigate(`/admin/recruitments/candidates/${candidate.uuid}`)}
              onDownload={(candidate) => window.open(candidate.resume_url, '_blank')}
              statusColors={statusColors}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <FaUsers className="text-5xl text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">
                No candidates have applied yet
              </h3>
              <p className="text-gray-400 dark:text-gray-500 mt-2">
                Candidates who apply for this position will appear here
              </p>
            </div>
          )}
        </div>
      )}
    </DefaultLayoutAdmin>
  );
};

export default JobDetails; 