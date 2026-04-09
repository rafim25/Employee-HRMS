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
import { deleteCandidate } from '../../../../context/actions/candidateActions';
import DataTable from '../../../../components/molecules/DataTable/DataTable';
import FilterModal from '../../../../components/molecules/FilterModal/FilterModal';
import RejectionModal from '../../../../components/molecules/RejectionModal/RejectionModal';
import { MdSource } from 'react-icons/md';
import DeleteConfirmationModal from '../../../../components/DeleteConfirmationModal';
import { checkUserPermission } from '../../../../utils/permissions';
import * as XLSX from 'xlsx';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const ITEMS_PER_PAGE = 50;

const CandidateList = () => {
  const { dispatch, state: authState } = useAuth();
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
  const [tempFilters, setTempFilters] = useState({
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
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const queryClient = useQueryClient();

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
  const [exportLoading, setExportLoading] = useState(false);

  // Add user from Redux state

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const hasSearchOrFilters = () =>
    !!searchTerm.trim() ||
    !!filters.status ||
    !!filters.source ||
    !!filters.createdBy ||
    !!filters.jobApplied ||
    !!filters.location ||
    !!filters.experience.min ||
    !!filters.experience.max ||
    !!filters.salary.min ||
    !!filters.salary.max ||
    !!filters.dateRange.start ||
    !!filters.dateRange.end;

  const buildCandidateQueryParams = (page = 1, limit = ITEMS_PER_PAGE) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (searchTerm.trim()) params.append('search', searchTerm.trim());
    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.createdBy) params.append('createdBy', filters.createdBy);
    if (filters.jobApplied) params.append('jobApplied', filters.jobApplied);
    if (filters.location) params.append('location', filters.location);
    if (filters.experience.min) params.append('minExperience', filters.experience.min);
    if (filters.experience.max) params.append('maxExperience', filters.experience.max);
    if (filters.salary.min) params.append('minSalary', filters.salary.min);
    if (filters.salary.max) params.append('maxSalary', filters.salary.max);
    if (filters.dateRange.start) params.append('fromDate', filters.dateRange.start);
    if (filters.dateRange.end) params.append('toDate', filters.dateRange.end);

    return params;
  };

  const candidatesQuery = useQuery({
    queryKey: ['candidates', authState?.user?.user_id, currentPage, searchTerm, filters],
    queryFn: async () => {
      const params = buildCandidateQueryParams(currentPage, ITEMS_PER_PAGE);
      const endpoint = hasSearchOrFilters()
        ? '/api/candidates/search'
        : '/api/candidates/paginated';

      const response = await fetch(`${endpoint}?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load candidates');
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (candidatesQuery.data) {
      setCandidates(candidatesQuery.data?.data || []);
      setTotalPages(candidatesQuery.data?.pagination?.totalPages || 1);
      setTotalRecords(candidatesQuery.data?.pagination?.totalRecords || 0);
    }
  }, [candidatesQuery.data]);

  useEffect(() => {
    if (candidatesQuery.error) {
      toast.error(candidatesQuery.error.message || 'Failed to load candidates');
    }
  }, [candidatesQuery.error]);

  const loading = candidatesQuery.isLoading || candidatesQuery.isFetching;
  const usersQuery = useQuery({
    queryKey: ['users', authState?.user?.user_id],
    queryFn: async () => {
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to load users');
      }
      return response.json();
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (usersQuery.data) {
      setUsers(usersQuery.data || []);
    }
  }, [usersQuery.data]);

  useEffect(() => {
    if (usersQuery.error) {
      toast.error(usersQuery.error.message || 'Failed to load users');
    }
  }, [usersQuery.error]);

  const usersLoading = usersQuery.isLoading || usersQuery.isFetching;

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

  const handleApplyFilters = (shouldReset = false) => {
    if (shouldReset) {
      const resetFilters = {
        status: '',
        source: '',
        createdBy: '',
        experience: { min: '', max: '' },
        location: '',
        dateRange: { start: '', end: '' },
        salary: { min: '', max: '' },
        jobApplied: ''
      };
      setTempFilters(resetFilters);
      setFilters(resetFilters);
      setCurrentPage(1);
      return;
    }
    setFilters(tempFilters);
    setCurrentPage(1);
    setShowFilterModal(false);
  };

  const handleResetFilters = () => {
    setTempFilters({
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

  const resetFilters = () => {
    const reset = {
      status: '',
      source: '',
      createdBy: '',
      experience: { min: '', max: '' },
      location: '',
      dateRange: { start: '', end: '' },
      salary: { min: '', max: '' },
      jobApplied: ''
    };

    setFilters(reset);
    setTempFilters(reset);
    setCurrentPage(1);
  };

  const getAppliedFiltersCount = () => {
    let count = 0;
    if (filters.status) count += 1;
    if (filters.source) count += 1;
    if (filters.createdBy) count += 1;
    if (filters.jobApplied) count += 1;
    if (filters.location) count += 1;
    if (filters.experience.min || filters.experience.max) count += 1;
    if (filters.salary.min || filters.salary.max) count += 1;
    if (filters.dateRange.start || filters.dateRange.end) count += 1;
    return count;
  };

  const appliedFiltersCount = getAppliedFiltersCount();
  const hasAppliedFilters = appliedFiltersCount > 0;

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
      queryClient.invalidateQueries({ queryKey: ['candidates'] });

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
      queryClient.invalidateQueries({ queryKey: ['candidates'] });

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
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
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

  const startIndex = candidates.length > 0 ? ((currentPage - 1) * ITEMS_PER_PAGE) + 1 : 0;
  const endIndex = ((currentPage - 1) * ITEMS_PER_PAGE) + candidates.length;

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
  const handleDownloadExcel = async () => {
    try {
      setExportLoading(true);
      const exportLimit = 200;
      let exportPage = 1;
      let exportTotalPages = 1;
      let allCandidates = [];

      const endpoint = hasSearchOrFilters()
        ? '/api/candidates/search'
        : '/api/candidates/paginated';

      do {
        const exportParams = buildCandidateQueryParams(exportPage, exportLimit);
        const response = await fetch(`${endpoint}?${exportParams.toString()}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch candidates for export');
        }

        const result = await response.json();
        allCandidates = allCandidates.concat(result?.data || []);
        exportTotalPages = result?.pagination?.totalPages || 1;
        exportPage += 1;
      } while (exportPage <= exportTotalPages);

      const candidatesForExcel = allCandidates.map(candidate => ({
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

      toast.success(`Excel downloaded with ${allCandidates.length} candidates`);
    } catch (error) {
      console.error('Error generating Excel:', error);
      toast.error('Failed to generate Excel file');
    } finally {
      setExportLoading(false);
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
              {/* Left side - Add Candidate Button */}
              <div className="w-full sm:w-auto flex-shrink-0">
                <Link to="/admin/recruitments/candidates/add">
                  <ButtonOne className="w-full sm:w-auto">
                    <span className="mr-2">Add Candidate</span>
                    <FaPlus />
                  </ButtonOne>
                </Link>
              </div>

              {/* Right side - Search and Filter Controls */}
              <div className="w-full sm:w-auto flex flex-wrap items-center justify-end gap-3">
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
                  onClick={() => {
                    setTempFilters(filters);
                    setShowFilterModal(true);
                  }}
                  className={`inline-flex items-center justify-center rounded-lg border py-3 px-6 text-center font-medium transition-all duration-200 ease-in-out ${
                    hasAppliedFilters
                      ? 'border-warning bg-warning text-white hover:bg-opacity-90'
                      : 'border-primary bg-primary text-white hover:bg-opacity-90'
                  }`}
                >
                  <FaFilter className="mr-2" />
                  Filters {hasAppliedFilters ? `(${appliedFiltersCount})` : ''}
                </button>

                {hasAppliedFilters && (
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center justify-center rounded-lg border border-danger bg-danger py-3 px-6 text-center font-medium text-white hover:bg-opacity-90 transition-all duration-200 ease-in-out"
                  >
                    Clear Filters
                  </button>
                )}

                {/* Add Excel Download Button */}
                <button
                  onClick={handleDownloadExcel}
                  disabled={loading || usersLoading || exportLoading || totalRecords === 0}
                  className="inline-flex items-center justify-center rounded-lg border border-success bg-success py-3 px-6 text-center font-medium text-white hover:bg-opacity-90 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaFileExcel className="mr-2" />
                  {exportLoading ? 'Exporting...' : 'Export Excel'}
                </button>
              </div>
            </div>

            {/* Table Container with improved spacing */}
            <div className="rounded-lg border border-stroke dark:border-strokedark">
              <div className="max-w-full overflow-x-auto">
                {(loading || usersLoading) ? (
                  <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-sm text-gray-500">
                      {loading ? 'Loading candidates...' : 'Loading users...'}
                    </p>
                  </div>
                ) : (
                  <DataTable
                    data={candidates}
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
                )}
              </div>

              {/* Pagination with improved spacing */}
              <div className="p-4 md:p-6 border-t border-stroke dark:border-strokedark">
                <div className='flex justify-between items-center flex-col md:flex-row gap-4'>
                  <div className='text-sm text-gray-500 dark:text-gray-400'>
                    Showing {totalRecords === 0 ? '0-0' : `${startIndex}-${endIndex}`} of {totalRecords} Candidates
                  </div>
                  {totalRecords > 0 && (
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
          onApply={() => handleApplyFilters(false)}
          onReset={handleResetFilters}
          filters={tempFilters}
          setFilters={setTempFilters}
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