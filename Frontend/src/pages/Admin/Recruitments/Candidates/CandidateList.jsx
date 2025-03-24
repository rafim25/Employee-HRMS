import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash, FaUserPlus, FaFilter, FaSearch, FaEllipsisV, FaRegEdit, FaPlus, FaHistory, FaFileExcel, FaSort, FaSortUp, FaSortDown, FaDownload, FaUserCircle } from 'react-icons/fa';
import { BsTrash3, BsThreeDotsVertical } from 'react-icons/bs';
import { BiSearch, BiSortAlt2 } from 'react-icons/bi';
import toast from 'react-hot-toast';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin, ButtonOne, ButtonTwo, ButtonThree } from '../../../../components';
import { useAuth } from '../../../../context/AuthContext';
import { fetchCandidates, updateCandidateStatus, deleteCandidate } from '../../../../context/actions/candidateActions';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import DataTable from '../../../../components/molecules/DataTable/DataTable';

const ITEMS_PER_PAGE = 5;

const CandidateList = () => {
  const { dispatch, state: authState } = useAuth();
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    source: '',
    experience: '',
    location: '',
    dateRange: {
      start: '',
      end: ''
    }
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(ITEMS_PER_PAGE);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  // Add this state
  const [statusUpdateId, setStatusUpdateId] = useState(null);

  // Add these status options
  const statusOptions = [
    { value: 'applied', label: 'Applied' },
    { value: 'screening', label: 'Screening' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'interviewed', label: 'Interviewed' },
    { value: 'selected', label: 'Selected' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const userId = authState?.user?.user_id;

  useEffect(() => {
    loadCandidates();
  }, [dispatch, currentPage]);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const candidates = await fetchCandidates(dispatch);
      // const data = state.candidates || [];
      setCandidates(candidates);
      console.log(candidates);
      setTotalPages(Math.ceil(candidates.length / itemsPerPage));
    } catch (error) {
      toast.error('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  // Filter Modal Component
  const FilterModal = () => (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-boxdark px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg font-medium mb-4 dark:text-white">Filter Candidates</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium dark:text-white">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 dark:border-form-strokedark dark:bg-form-input"
                >
                  <option value="">All Status</option>
                  <option value="applied">Applied</option>
                  <option value="screening">Screening</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="selected">Selected</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium dark:text-white">Source</label>
                <select
                  value={filters.source}
                  onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 dark:border-form-strokedark dark:bg-form-input"
                >
                  <option value="">All Sources</option>
                  <option value="Direct">Direct</option>
                  <option value="Referral">Referral</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Agency">Agency</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium dark:text-white">Experience Range</label>
                <select
                  value={filters.experience}
                  onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 dark:border-form-strokedark dark:bg-form-input"
                >
                  <option value="">All Experience</option>
                  <option value="0-2">0-2 years</option>
                  <option value="2-5">2-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium dark:text-white">Date Range</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => setFilters({
                      ...filters,
                      dateRange: { ...filters.dateRange, start: e.target.value }
                    })}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 dark:border-form-strokedark dark:bg-form-input"
                  />
                  <input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => setFilters({
                      ...filters,
                      dateRange: { ...filters.dateRange, end: e.target.value }
                    })}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-boxdark px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <ButtonOne
              type="button"
              className="w-full sm:w-auto sm:ml-3"
              onClick={() => {
                // Apply filters
                setShowFilterModal(false);
              }}
            >
              Apply Filters
            </ButtonOne>
            <ButtonTwo
              type="button"
              className="w-full sm:w-auto sm:ml-3"
              onClick={() => {
                setFilters({
                  status: '',
                  source: '',
                  experience: '',
                  location: '',
                  dateRange: { start: '', end: '' }
                });
              }}
            >
              Reset
            </ButtonTwo>
            <ButtonThree
              type="button"
              className="w-full sm:w-auto"
              onClick={() => setShowFilterModal(false)}
            >
              Cancel
            </ButtonThree>
          </div>
        </div>
      </div>
    </div>
  );

  // Add this function to handle status change
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

      // Update the local state to reflect the change
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

  const handleDelete = async (candidateId) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await deleteCandidate(dispatch, candidateId);
        toast.success('Candidate deleted successfully');
      } catch (error) {
        toast.error('Failed to delete candidate');
      }
    }
  };

  const statusColors = {
    applied: 'bg-warning/10 text-warning',
    screening: 'bg-info/10 text-info',
    shortlisted: 'bg-success/10 text-success',
    interviewed: 'bg-primary/10 text-primary',
    selected: 'bg-success/10 text-success',
    rejected: 'bg-danger/10 text-danger'
  };

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
      key: 'job',
      header: 'Job Applied For',
      className: 'min-w-[150px]',
      render: (candidate) => (
        <>
          <p className="text-black dark:text-white">
            {candidate.job?.title}
          </p>
          <p className="text-sm text-gray-500">{candidate.job?.type}</p>
        </>
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

  return (
    <DefaultLayoutAdmin>
      <BreadcrumbAdmin pageName='Candidates' />

      {/* Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <Link to="/admin/recruitments/candidates/add">
          <ButtonOne>
            <span>Add Candidate</span>
            <span><FaPlus /></span>
          </ButtonOne>
        </Link>

        <div className="flex flex-wrap items-center gap-3 ml-auto">
          <div className="flex items-center gap-2">
            <label className="text-black dark:text-white font-medium">From:</label>
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => setFilters({
                ...filters,
                dateRange: { ...filters.dateRange, start: e.target.value }
              })}
              className="rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
            <label className="text-black dark:text-white font-medium ml-4">To:</label>
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => setFilters({
                ...filters,
                dateRange: { ...filters.dateRange, end: e.target.value }
              })}
              className="rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
          <button
            onClick={() => setShowFilterModal(true)}
            className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 transition duration-200 ease-in-out ml-4"
          >
            <FaFilter className="mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className='rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'>
        <div className="flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between">
          <div className="relative flex-1 md:mr-2 mb-4 md:mb-0">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by candidate name..."
              className="rounded-lg border-[1.5px] border-stroke bg-transparent py-2 pl-10 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary left-0"
            />
            <span className="absolute left-2 py-3 text-xl">
              <BiSearch />
            </span>
          </div>

          <div className="relative flex-2 mb-4 md:mb-0">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full"
            >
              <option value="">All Status</option>
              <option value="applied">Applied</option>
              <option value="screening">Screening</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interviewed">Interviewed</option>
              <option value="selected">Selected</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <DataTable
          data={candidates}
          columns={columns}
          actions={true}
          statusOptions={statusOptions}
          onStatusChange={handleStatusChange}
          onDelete={(candidate) => handleDelete(candidate.uuid)}
          onEdit={(candidate) => navigate(`/admin/recruitments/candidates/edit/${candidate.uuid}`)}
          onView={(candidate) => navigate(`/admin/recruitments/candidates/${candidate.uuid}`)}
          onDownload={(candidate) => window.open(candidate.resume_url, '_blank')}
          statusColors={statusColors}
        />

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-gray-5 dark:text-gray-4 text-sm py-4">
              {candidates.length > 0 ? (
                `Showing ${((currentPage - 1) * itemsPerPage) + 1}-${Math.min(currentPage * itemsPerPage, candidates.length)} of ${candidates.length} Candidates`
              ) : (
                'No candidates to display'
              )}
            </span>
          </div>
          {candidates.length > 0 && (
            <div className="flex space-x-2 py-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50"
              >
                Prev
              </button>
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                const page = i + 1;
                if (page === currentPage) {
                  return (
                    <div
                      key={i}
                      className="py-2 px-4 rounded-lg border border-primary bg-primary text-white font-semibold hover:bg-primary dark:text-white dark:bg-primary dark:hover:bg-primary"
                    >
                      {page}
                    </div>
                  );
                } else if (page === 2 && currentPage > 4) {
                  return <p key={i} className="py-2 px-4 border border-gray-2 dark:bg-transparent text-black font-medium bg-gray dark:border-strokedark dark:text-white">...</p>;
                } else if (page === totalPages - 1 && currentPage < totalPages - 3) {
                  return <p key={i} className="py-2 px-4 border border-gray-2 dark:bg-transparent text-black font-medium bg-gray dark:border-strokedark dark:text-white">...</p>;
                } else if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <div
                      key={i}
                      className="py-2 px-4 rounded-lg border border-gray-2 text-black dark:bg-transparent bg-gray font-medium dark:border-strokedark dark:text-white"
                    >
                      {page}
                    </div>
                  );
                }
                return null;
              })}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {showFilterModal && <FilterModal />}
    </DefaultLayoutAdmin>
  );
};

// Add this CSS to your styles
const styles = `
.dropdown-button {
  position: relative;
}

.dropdown-button + div {
  transform: translateY(-50%);
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}
`;

// Add the style tag to your document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default CandidateList; 