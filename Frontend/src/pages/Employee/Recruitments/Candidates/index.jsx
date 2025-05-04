import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEdit, FaFilter, FaPlus, FaUser, FaDownload, FaEllipsisV } from 'react-icons/fa';
import { BiSearch } from 'react-icons/bi';
import toast from 'react-hot-toast';
import DefaultLayoutEmployee from '../../../../layout/DefaultLayoutPegawai';
import { BreadcrumbPegawai, ButtonOne } from '../../../../components';
import { useAuth } from '../../../../context/AuthContext';
import DataTable from '../../../../components/molecules/DataTable/DataTable';
import FilterModal from '../../../../components/molecules/FilterModal/FilterModal';
import { MdSource } from 'react-icons/md';
import RejectionModal from '../../../../components/molecules/RejectionModal/RejectionModal';
import { checkUserPermission } from '../../../../utils/permissions';
import { fetchCandidates, updateCandidateStatus } from '../../../../context/actions/candidateActions';

const ITEMS_PER_PAGE = 5;

const CandidateList = () => {
  const { state: authState } = useAuth();
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    source: '',
    experience: { min: '', max: '' },
    location: '',
    dateRange: {
      start: '',
      end: ''
    },
    salary: { min: '', max: '' },
    jobApplied: ''
  });
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const navigate = useNavigate();

  // Status options and colors (same as admin)
  const statusOptions = [
    { value: 'applied', label: 'Applied' },
    { value: 'screening', label: 'Screening' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'interviewed', label: 'Interviewed' },
    { value: 'selected', label: 'Selected' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'joined', label: 'Joined' },
    // { value: 'on_hold', label: 'On Hold' }
  ];


  const statusColors = {
    applied: 'bg-warning/10 text-warning hover:bg-warning hover:text-white cursor-pointer',
    screening: 'bg-info/10 text-info hover:bg-info hover:text-white cursor-pointer',
    shortlisted: 'bg-success/10 text-success hover:bg-success hover:text-white cursor-pointer',
    interviewed: 'bg-primary/10 text-primary hover:bg-primary hover:text-white cursor-pointer',
    selected: 'bg-success/10 text-success hover:bg-success hover:text-white cursor-pointer',
    joined: 'bg-success/10 text-success hover:bg-success hover:text-white cursor-pointer',
    rejected: 'bg-danger/10 text-danger pointer-events-none opacity-75',
    // on_hold: 'bg-gray-500/10 text-gray-500 pointer-events-none opacity-75'
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/employee/candidates', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch candidates');

      const data = await response.json();
      setCandidates(data);
    } catch (error) {
      toast.error('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  const filterConfig = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: statusOptions
    },
    {
      key: 'jobApplied',
      label: 'Job Applied For',
      type: 'select',
      options: Array.from(new Set(candidates.map(c => c.job?.title)))
        .filter(Boolean)
        .map(title => ({ value: title, label: title }))
    },
    {
      key: 'source',
      label: 'Source',
      type: 'select',
      icon: <MdSource className="text-xl" />,
      options: [
        { value: 'Direct', label: 'Direct' },
        { value: 'LinkedIn', label: 'LinkedIn' },
        { value: 'Indeed', label: 'Indeed' },
        { value: 'Referral', label: 'Referral' },
        { value: 'Other', label: 'Other' }
      ]
    },
    {
      key: 'experience',
      label: 'Experience',
      type: 'range',
      placeholder: 'Years of experience'
    },
    {
      key: 'dateRange',
      label: 'Date Range',
      type: 'dateRange'
    },
    {
      key: 'location',
      label: 'Location',
      type: 'search',
      placeholder: 'Search location'
    }
  ];

  const handleApplyFilters = () => {
    setShowFilterModal(false);
  };

  const handleResetFilters = () => {
    setFilters({
      status: '',
      source: '',
      experience: { min: '', max: '' },
      location: '',
      dateRange: { start: '', end: '' },
      salary: { min: '', max: '' },
      jobApplied: ''
    });
  };

  const handleStatusChange = async (candidateId, newStatus) => {
    const candidate = candidates.find(c => c.uuid === candidateId);
    if (!checkUserPermission(candidate, authState?.user)) {
      toast.error("You don't have permission to change this candidate's status");
      return;
    }

    if (newStatus === 'rejected') {
      setSelectedCandidate(candidate);
      setShowRejectionModal(true);
      return;
    }

    try {
      const response = await fetch(`/api/candidates/${candidateId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus,
          changed_by: authState?.user?.user_id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Update local state
      const updatedCandidates = candidates.map(candidate =>
        candidate.uuid === candidateId
          ? { ...candidate, application_status: newStatus }
          : candidate
      );

      setCandidates(updatedCandidates);
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleRejectionConfirm = async (rejectionDetails) => {
    try {
      const response = await fetch(`/api/candidates/${selectedCandidate.uuid}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'rejected',
          rejection_reason: rejectionDetails.reason,
          rejection_details: {
            ...rejectionDetails,
            rejected_by: authState?.user?.username,
            rejected_at: new Date().toISOString()
          },
          changed_by: authState?.user?.user_id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update rejection details');
      }

      // Update local state
      const updatedCandidates = candidates.map(candidate =>
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
      );

      setCandidates(updatedCandidates);
      toast.success('Candidate rejected successfully');
      setShowRejectionModal(false);
      setSelectedCandidate(null);
    } catch (error) {
      console.error('Error rejecting candidate:', error);
      toast.error('Failed to reject candidate');
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      candidate.name?.toLowerCase().includes(searchLower) ||
      candidate.email?.toLowerCase().includes(searchLower) ||
      candidate.phone?.includes(searchTerm) ||
      candidate.job?.title?.toLowerCase().includes(searchLower);

    const matchesStatus = !filters.status || candidate.status === filters.status;
    const matchesSource = !filters.source || candidate.source === filters.source;
    const matchesExperience = (!filters.experience.min || candidate.experience >= Number(filters.experience.min)) &&
      (!filters.experience.max || candidate.experience <= Number(filters.experience.max));
    const matchesLocation = !filters.location ||
      candidate.current_location?.toLowerCase().includes(filters.location.toLowerCase());
    const matchesDateRange = (!filters.dateRange.start || new Date(candidate.createdAt) >= new Date(filters.dateRange.start)) &&
      (!filters.dateRange.end || new Date(candidate.createdAt) <= new Date(filters.dateRange.end));
    const matchesJob = !filters.jobApplied || candidate.job?.title === filters.jobApplied;

    return matchesSearch &&
      matchesStatus &&
      matchesSource &&
      matchesExperience &&
      matchesLocation &&
      matchesDateRange &&
      matchesJob;
  });

  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex);

  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
      <div className='flex gap-2'>
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className='py-2 px-4 rounded-lg border border-primary text-primary font-medium hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-primary'
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`py-2 px-4 rounded-lg border transition-colors
              ${pageNum === currentPage
                ? 'bg-primary text-white border-primary'
                : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
              }`}
          >
            {pageNum}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className='py-2 px-4 rounded-lg border border-primary text-primary font-medium hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-primary'
        >
          Next
        </button>
      </div>
    );
  };

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
      key: 'job',
      header: 'Job Applied For',
      className: 'min-w-[150px] py-4.5 px-4',
      render: (candidate) => (
        <div className="flex flex-col gap-1">
          <p className="text-black dark:text-white font-medium">
            {candidate.job?.title}
          </p>
          <p className="text-sm text-gray-500">{candidate.job?.type}</p>
        </div>
      )
    },
    {
      key: 'resume',
      header: 'Resume',
      className: 'min-w-[120px] py-4.5 px-4',
      render: (candidate) => (
        <div>
          {candidate.resume_url ? (
            <a
              href={candidate.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200"
            >
              <FaDownload className="text-base" />
              <span className="text-sm font-medium">View CV</span>
            </a>
          ) : (
            <span className="text-sm text-gray-500">No resume</span>
          )}
        </div>
      )
    },
    {
      key: 'application_status',
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
      key: 'createdAt',
      header: 'Applied Date',
      className: 'min-w-[120px] py-4.5 px-4',
      render: (candidate) => (
        <p className="text-black dark:text-white">
          {format(new Date(candidate.createdAt), 'MMM dd, yyyy')}
        </p>
      )
    }
  ];

  const tableActions = [
    {
      icon: <FaEye />,
      label: 'View',
      onClick: (candidate) => {
        navigate(`/employee/recruitments/candidates/${candidate.uuid}`);
      },
      show: () => true
    },
    {
      icon: <FaEdit />,
      label: 'Edit',
      onClick: (candidate) => {
        if (checkUserPermission(candidate, authState?.user)) {
          navigate(`/employee/recruitments/candidates/edit/${candidate.uuid}`);
        } else {
          toast.error("You don't have permission to edit this candidate");
        }
      },
      show: (candidate) => candidate.created_by_id === authState?.user?.user_id
    }
  ];

  // const renderCustomCell = (column, item) => {
  //   if (column.key === 'application_status') {
  //     const status = item.application_status?.toLowerCase() || 'applied';
  //     const statusOption = statusOptions.find(opt => opt.value === status);
  //     console.log("status", status);
  //     return (
  //       <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap
  //         ${statusColors[status] || 'bg-gray-100 text-gray-500'}`}
  //       >
  //         {statusOption?.label || status.charAt(0).toUpperCase() + status.slice(1)}
  //       </span>
  //     );
  //   }
  //   return null;
  // };

  return (
    <DefaultLayoutEmployee>
      <BreadcrumbPegawai pageName='My Candidates' icon={FaUser} />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="p-4 md:p-6 xl:p-7.5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="w-full sm:w-auto">
              <Link to="/employee/recruitments/candidates/add">
                <ButtonOne className="w-full sm:w-auto">
                  <span className="mr-2">Add Candidate</span>
                  <FaPlus />
                </ButtonOne>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-grow sm:flex-grow-0 sm:w-72">
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-12 pr-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
                />
                <BiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-500" />
              </div>

              <button
                onClick={() => setShowFilterModal(true)}
                className="inline-flex items-center justify-center rounded-lg border border-primary bg-primary py-3 px-6 text-center font-medium text-white hover:bg-opacity-90 transition-all duration-200 ease-in-out"
              >
                <FaFilter className="mr-2" />
                Filters
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-stroke dark:border-strokedark">
            <div className="max-w-full overflow-x-auto">
              <DataTable
                data={paginatedCandidates}
                columns={columns}
                actions={tableActions}
                onStatusChange={handleStatusChange}
                statusOptions={statusOptions}
                statusColors={statusColors}
                className="w-full table-auto"
              />
            </div>

            <div className="p-4 md:p-6 border-t border-stroke dark:border-strokedark">
              <div className='flex justify-between items-center flex-col md:flex-row gap-4'>
                <div className='text-sm text-gray-500 dark:text-gray-400'>
                  Showing {filteredCandidates.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, filteredCandidates.length)} of {filteredCandidates.length} Candidates
                </div>
                {filteredCandidates.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        filters={filters}
        setFilters={setFilters}
        config={filterConfig}
      />

      <RejectionModal
        isOpen={showRejectionModal}
        onClose={() => {
          setShowRejectionModal(false);
          setSelectedCandidate(null);
        }}
        onConfirm={handleRejectionConfirm}
        currentStage={selectedCandidate?.current_round}
      />
    </DefaultLayoutEmployee>
  );
};

export default CandidateList; 