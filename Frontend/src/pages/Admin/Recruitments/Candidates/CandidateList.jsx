import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash, FaUserPlus, FaFilter, FaSearch, FaEllipsisV, FaRegEdit, FaPlus, FaHistory, FaFileExcel, FaSort, FaSortUp, FaSortDown, FaDownload, FaUserCircle, FaUser } from 'react-icons/fa';
import { BsTrash3, BsThreeDotsVertical } from 'react-icons/bs';
import { BiSearch, BiSortAlt2 } from 'react-icons/bi';
import toast from 'react-hot-toast';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin, ButtonOne, ButtonTwo, ButtonThree } from '../../../../components';
import { useAuth } from '../../../../context/AuthContext';
import { fetchCandidates, updateCandidateStatus, deleteCandidate } from '../../../../context/actions/candidateActions';
import DataTable from '../../../../components/molecules/DataTable/DataTable';
import FilterModal from '../../../../components/molecules/FilterModal/FilterModal';
import RejectionModal from '../../../../components/molecules/RejectionModal/RejectionModal';
import { MdSource } from 'react-icons/md';
import DeleteConfirmationModal from '../../../../components/DeleteConfirmationModal';
import { checkUserPermission } from '../../../../utils/permissions';
import * as XLSX from 'xlsx';

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
    createdBy: '',
    experience: { min: '', max: '' },
    location: '',
    dateRange: {
      start: '',
      end: ''
    },
    salary: { min: '', max: '' },
    jobApplied: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(ITEMS_PER_PAGE);

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
    { value: 'rejected', label: 'Rejected' },
    { value: 'joined', label: 'Joined' }
  ];

  const userId = authState?.user?.user_id;

  // Add these states
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Add state for users list
  const [users, setUsers] = useState([]);
  const [sources, setSources] = useState([
    'Direct', 'LinkedIn', 'Indeed', 'Naukri',
    'Referral', 'Agency', 'Other'
  ]);

  // Add these state variables at the top with other states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(null);

  // Add user from Redux state

  useEffect(() => {
    loadCandidates();
    fetchUsers();
  }, [dispatch, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const candidates = await fetchCandidates(dispatch);
      setCandidates(candidates);
      console.log(candidates);
    } catch (error) {
      toast.error('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

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
      key: 'jobApplied',
      label: 'Job Applied For',
      type: 'select',
      options: Array.from(new Set(candidates.map(c => c.job?.title)))
        .filter(Boolean)
        .map(title => ({ value: title, label: title }))
    },
    {
      key: 'salary',
      label: 'Expected Salary (LPA)',
      type: 'range',
      min: 0,
      max: 100,
      step: 1,
      placeholder: 'Expected salary range'
    },
    {
      key: 'source',
      label: 'Source',
      type: 'select',
      icon: <MdSource className="text-xl" />,
      options: [
        { value: 'Naukri', label: 'Naukri' },
        { value: 'Direct', label: 'Direct' },
        { value: 'LinkedIn', label: 'LinkedIn' },
        { value: 'Indeed', label: 'Indeed' },
        { value: 'Naukri', label: 'Naukri' },
        { value: 'Referral', label: 'Referral' },
        { value: 'Agency', label: 'Agency' },
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
    },
    {
      key: 'createdBy',
      label: 'Created By',
      type: 'select',
      icon: <FaUser className="text-xl" />,
      options: users.map(user => ({
        value: user.user_id,
        label: user.username
      }))
    }
  ];

  const handleApplyFilters = () => {
    // Apply your filters logic here
    setShowFilterModal(false);
  };

  const handleResetFilters = () => {
    setFilters({
      status: '',
      source: '',
      createdBy: '',
      experience: { min: '', max: '' },
      location: '',
      dateRange: { start: '', end: '' },
      salary: { min: '', max: '' },
      jobApplied: ''
    });
  };

  // Update the handleStatusChange function
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

  // Add this function to handle rejection confirmation
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

      // Update the candidates state with application_status
      setCandidates(prev =>
        prev.map(candidate =>
          candidate.uuid === selectedCandidate.uuid
            ? {
              ...candidate,
              application_status: 'rejected', // Update this field
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

  // Replace the existing handleDelete function with this new version
  const handleDelete = (candidateId) => {
    const candidate = candidates.find(c => c.uuid === candidateId);
    if (!checkUserPermission(candidate, authState?.user)) {
      toast.error("You don't have permission to delete this candidate");
      return;
    }

    setCandidateToDelete(candidateId);
    setShowDeleteModal(true);
  };

  // Add this new function to handle the actual deletion
  const confirmDelete = async () => {
    try {
      await deleteCandidate(dispatch, candidateToDelete);
      toast.success('Candidate deleted successfully');
      // Refresh the candidates list
      loadCandidates();
    } catch (error) {
      toast.error('Failed to delete candidate');
    } finally {
      setShowDeleteModal(false);
      setCandidateToDelete(null);
    }
  };

  const statusColors = {
    applied: 'bg-warning/10 text-warning hover:bg-warning hover:text-white cursor-pointer',
    screening: 'bg-info/10 text-info hover:bg-info hover:text-white cursor-pointer',
    shortlisted: 'bg-success/10 text-success hover:bg-success hover:text-white cursor-pointer',
    interviewed: 'bg-primary/10 text-primary hover:bg-primary hover:text-white cursor-pointer',
    selected: 'bg-success/10 text-success hover:bg-success hover:text-white cursor-pointer',
    joined: 'bg-success/10 text-success hover:bg-success hover:text-white cursor-pointer',
    rejected: 'bg-danger/10 text-danger pointer-events-none opacity-75'
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
      render: (candidate) => {
        return (
          <div>
            {candidate.resume_url ? (
              <a
                href={candidate.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  // Add error handling for the URL
                  if (candidate.resume_url.startsWith('http')) {
                    window.open(candidate.resume_url, '_blank');
                  } else {
                    toast.error('Invalid resume URL');
                  }
                }}
              >
                <FaDownload className="text-base" />
                <span className="text-sm font-medium">View CV</span>
              </a>
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                No resume
              </span>
            )}
          </div>
        );
      }
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
    }
  ];

  const filteredCandidates = candidates.filter(candidate => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      candidate.name?.toLowerCase().includes(searchLower) ||
      candidate.email?.toLowerCase().includes(searchLower) ||
      candidate.phone?.includes(searchTerm) ||
      candidate.job?.title?.toLowerCase().includes(searchLower);

    const matchesStatus = !filters.status || candidate.application_status === filters.status;
    const matchesSource = !filters.source || candidate.source === filters.source;
    const matchesExperience = (!filters.experience.min || candidate.experience >= Number(filters.experience.min)) &&
      (!filters.experience.max || candidate.experience <= Number(filters.experience.max));
    const matchesLocation = !filters.location ||
      candidate.city?.toLowerCase().includes(filters.location.toLowerCase()) ||
      candidate.state?.toLowerCase().includes(filters.location.toLowerCase());
    const matchesDateRange = (!filters.dateRange.start || new Date(candidate.createdAt) >= new Date(filters.dateRange.start)) &&
      (!filters.dateRange.end || new Date(candidate.createdAt) <= new Date(filters.dateRange.end));
    const matchesSalary = (!filters.salary.min || candidate.expected_salary >= Number(filters.salary.min)) &&
      (!filters.salary.max || candidate.expected_salary <= Number(filters.salary.max));
    const matchesJob = !filters.jobApplied || candidate.job?.title === filters.jobApplied;
    const matchesCreatedBy = !filters.createdBy || candidate.created_by_id === filters.createdBy;

    return matchesSearch &&
      matchesStatus &&
      matchesSource &&
      matchesExperience &&
      matchesLocation &&
      matchesDateRange &&
      matchesSalary &&
      matchesJob &&
      matchesCreatedBy;
  });

  // Keep this calculation
  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex);

  // Update the Pagination component with this simplified version
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
      if (totalPages <= 3) {
        // If there are 3 or fewer pages, show all of them
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      if (currentPage === 1) {
        // If on first page, show 1, 2, ...
        return [1, 2, '...'];
      }

      if (currentPage === totalPages) {
        // If on last page, show ..., lastPage-1, lastPage
        return ['...', totalPages - 1, totalPages];
      }

      // In middle, show currentPage-1, currentPage, currentPage+1
      return [currentPage - 1, currentPage, currentPage + 1];
    };

    return (
      <div className='flex gap-2'>
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className='py-2 px-4 rounded-lg border border-primary text-primary font-medium hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-primary'
        >
          Previous
        </button>

        {getPageNumbers().map((pageNum, idx) => (
          <button
            key={idx}
            onClick={() => typeof pageNum === 'number' ? onPageChange(pageNum) : null}
            disabled={pageNum === '...'}
            className={`py-2 px-4 rounded-lg border transition-colors
              ${pageNum === currentPage
                ? 'bg-primary text-white border-primary'
                : pageNum === '...'
                  ? 'border-gray-200 text-gray-400 cursor-default'
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

  // Add permission check for bulk actions if you have any
  const canAddCandidate = authState?.user?.role === 'admin' || authState?.user?.permissions?.includes('create_candidate');

  // Add this function for Excel download
  const handleDownloadExcel = () => {
    try {
      const candidatesForExcel = filteredCandidates.map(candidate => ({
        'Candidate ID': candidate.uuid || 'N/A',
        'Name': candidate.name || 'N/A',
        'Email': candidate.email || 'N/A',
        'Phone': candidate.phone || 'N/A',
        'Job Applied': candidate.job?.title || 'N/A',
        'Status': candidate.application_status || 'N/A',
        'Source': candidate.source || 'N/A',
        'Experience': candidate.experience || 'N/A',
        'Current Company': candidate.current_company || 'N/A',
        'Current CTC': candidate.current_ctc ? `₹${candidate.current_ctc}` : 'N/A',
        'Expected CTC': candidate.expected_ctc ? `₹${candidate.expected_ctc}` : 'N/A',
        'Notice Period': candidate.notice_period ? `${candidate.notice_period} days` : 'N/A',
        'Current Location': candidate.current_location || 'N/A',
        'Preferred Location': candidate.preferred_location || 'N/A',
        'Applied Date': format(new Date(candidate.createdAt), 'MMM dd, yyyy') || 'N/A',
        'Created By': candidate.created_by || 'N/A'
      }));

      const ws = XLSX.utils.json_to_sheet(candidatesForExcel);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Candidates');
      XLSX.writeFile(wb, 'candidates_list.xlsx');

      toast.success('Excel file downloaded successfully');
    } catch (error) {
      console.error('Error generating Excel:', error);
      toast.error('Failed to generate Excel file');
    }
  };

  return (
    <DefaultLayoutAdmin>
      <BreadcrumbAdmin pageName='Candidates' icon={FaUser} backButton={false} />

      {/* Wrap all content in a fragment */}
      <>
        {/* Main Container with better spacing */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          {/* Header Section with Actions */}
          <div className="p-4 md:p-6 xl:p-7.5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              {/* Add Candidate Button */}
              <div className="w-full sm:w-auto">
                <Link to="/admin/recruitments/candidates/add">
                  <ButtonOne className="w-full sm:w-auto">
                    <span className="mr-2">Add Candidate</span>
                    <FaPlus />
                  </ButtonOne>
                </Link>
              </div>

              {/* Search and Filter Controls */}
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                {/* Search Box with improved styling */}
                <div className="relative flex-grow sm:flex-grow-0 sm:w-72">
                  <input
                    type="text"
                    placeholder="Search by name, email, phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-12 pr-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
                  />
                  <BiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-500" />
                </div>

                {/* Filter Button */}
                <button
                  onClick={() => setShowFilterModal(true)}
                  className="inline-flex items-center justify-center rounded-lg border border-primary bg-primary py-3 px-6 text-center font-medium text-white hover:bg-opacity-90 transition-all duration-200 ease-in-out"
                >
                  <FaFilter className="mr-2" />
                  Filters
                </button>

                {/* Add Excel Download Button */}
                <button
                  onClick={handleDownloadExcel}
                  disabled={filteredCandidates.length === 0}
                  className="inline-flex items-center justify-center rounded-lg border border-success bg-success py-3 px-6 text-center font-medium text-white hover:bg-opacity-90 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaFileExcel className="mr-2" />
                  Export Excel
                </button>
              </div>
            </div>

            {/* Table Container with improved spacing */}
            <div className="rounded-lg border border-stroke dark:border-strokedark">
              <div className="max-w-full overflow-x-auto">
                <DataTable
                  data={paginatedCandidates}
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
                  statusColors={statusColors}
                  className="w-full table-auto"
                />
              </div>

              {/* Pagination with improved spacing */}
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

        <RejectionModal
          isOpen={showRejectionModal}
          onClose={() => {
            setShowRejectionModal(false);
            setSelectedCandidate(null);
          }}
          onConfirm={handleRejectionConfirm}
          currentStage={selectedCandidate?.current_round}
        />

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <DeleteConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setCandidateToDelete(null);
            }}
            onConfirm={confirmDelete}
            title="Delete Candidate"
            message="Are you sure you want to delete this candidate? This action cannot be undone."
          />
        )}

        {/* Filter Section */}

      </>
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