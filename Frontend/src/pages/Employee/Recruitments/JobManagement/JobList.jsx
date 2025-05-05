import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DefaultLayoutEmployee from '../../../../layout/DefaultLayoutPegawai';
import { Link } from "react-router-dom";
import { BreadcrumbPegawai, ButtonOne } from '../../../../components';
import { FaRegEdit, FaPlus, FaFileExcel, FaRegClock, FaUsers, FaBriefcase, FaArchive, FaExclamationTriangle, FaFilter, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { BiSearch } from 'react-icons/bi';
import { useAuth } from '../../../../context/AuthContext';
import { fetchJobs, deleteJob, updateJobStatus } from '../../../../context/actions/jobActions';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import JobCard from '../../../../components/molecules/JobCard';
import FilterModal from '../../../../components/molecules/FilterModal/FilterModal';
import Pagination from '../../../../components/molecules/Pagination/Pagination';
import DeleteConfirmationModal from '../../../../components/DeleteConfirmationModal';
import api from '../../../../services/api';
import { checkUserPermission } from '../../../../utils/permissions';

const ITEMS_PER_PAGE = 6;

const JobList = () => {
  const location = useLocation();
  const { state, dispatch } = useAuth();
  const { jobs = [], loading } = state;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    experience: { min: '', max: '' },
    salary: { min: '', max: '' },
    location: '',
    skills: [],
    status: ''
  });
  const navigate = useNavigate();
  const { user } = state;

  // Ensure jobs is always an array
  const jobsArray = Array.isArray(jobs) ? jobs : [];

  const filterConfig = [
    {
      key: 'type',
      label: 'Job Type',
      type: 'select',
      options: [
        { value: 'Full-time', label: 'Full-time' },
        { value: 'Part-time', label: 'Part-time' },
        { value: 'Contract', label: 'Contract' },
        { value: 'Internship', label: 'Internship' }
      ]
    },
    {
      key: 'salary',
      label: 'CTC Range (LPA)',
      type: 'range',
      min: 0,
      max: 100,
      step: 1
    },
    {
      key: 'location',
      label: 'Location',
      type: 'search',
      placeholder: 'Search city or state'
    },
    {
      key: 'skills',
      label: 'Required Skills',
      type: 'multiSelect',
      options: [
        'JavaScript', 'React', 'Node.js', 'Python', 'Java',
        'SQL', 'AWS', 'Docker', 'TypeScript', 'Spring', 'Kubernetes'
      ].map(skill => ({
        value: skill,
        label: skill
      }))
    },
    {
      key: 'status',
      label: 'Job Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'draft', label: 'Draft' },
        { value: 'closed', label: 'Closed' },
        { value: 'archived', label: 'Archived' }
      ]
    }
  ];

  const tabs = [
    {
      id: 'all',
      label: 'All Jobs',
      icon: FaBriefcase,
      count: jobsArray.length
    },
    {
      id: 'active',
      label: 'Active',
      icon: FaUsers,
      count: jobsArray.filter(job => job.status === 'active').length
    },
    {
      id: 'draft',
      label: 'Draft',
      icon: FaRegEdit,
      count: jobsArray.filter(job => job.status === 'draft').length
    },
    {
      id: 'closed',
      label: 'Closed',
      icon: FaRegClock,
      count: jobsArray.filter(job => job.status === 'closed').length
    },
    {
      id: 'archived',
      label: 'Archived',
      icon: FaArchive,
      count: jobsArray.filter(job => job.status === 'archived').length
    }
  ];

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, filters]);

  const loadJobs = useCallback(async () => {
    const loadingToast = toast.loading('Loading jobs...');
    try {
      await fetchJobs(dispatch);
      toast.success('Jobs loaded successfully', { id: loadingToast });
    } catch (error) {
      console.error('Error loading jobs:', error);
      toast.error('Failed to load jobs', { id: loadingToast });
    }
  }, [dispatch]);

  useEffect(() => {
    loadJobs();
  }, []);

  // Filter jobs based on all criteria
  const filteredJobs = jobsArray.filter((job) => {
    const matchesTab = activeTab === 'all' || job.status === activeTab;
    if (!matchesTab) return false;

    const matchesSearch = !searchTerm ||
      job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job?.description?.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    const matchesType = !filters.type || job.type?.toLowerCase() === filters.type?.toLowerCase();
    const matchesSalary = (!filters.salary.min || job.minSalary >= Number(filters.salary.min)) &&
      (!filters.salary.max || job.maxSalary <= Number(filters.salary.max));
    const matchesLocation = !filters.location ||
      job.city?.toLowerCase().includes(filters.location.toLowerCase()) ||
      job.state?.toLowerCase().includes(filters.location.toLowerCase());
    const matchesSkills = !filters.skills.length ||
      filters.skills.every(skill => job.skills?.includes(skill));
    const matchesStatus = !filters.status || job.status?.toLowerCase() === filters.status?.toLowerCase();

    return matchesType && matchesSalary && matchesLocation && matchesSkills && matchesStatus;
  });

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  const handleStatusChange = async (jobId, newStatus) => {
    const job = jobs.find(j => j.id === jobId);
    if (!checkUserPermission(job, user)) {
      toast.error("You don't have permission to change this job's status");
      return;
    }

    try {
      const response = await api.patch(`/api/jobs/${jobId}/status`, {
        status: newStatus,
        updated_by: user.username,
        updated_by_id: user.user_id
      });

      if (response.data) {
        toast.success(`Job status updated to ${newStatus}`);
        loadJobs();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update job status');
    }
  };

  return (
    <DefaultLayoutEmployee>
      <BreadcrumbPegawai pageName="Job Management" icon={FaBriefcase} backButton={false} />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="p-4 md:p-6 xl:p-7.5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="w-full sm:w-auto">
              <Link to="/employee/recruitments/job-management/add">
                <ButtonOne className="w-full sm:w-auto">
                  <span className="mr-2">Add New Job</span>
                  <FaPlus />
                </ButtonOne>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-grow sm:flex-grow-0 sm:w-72">
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-12 pr-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
                />
                <BiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-500" />
              </div>

              <button
                onClick={() => setShowFilterModal(true)}
                className="inline-flex items-center justify-center rounded-lg border border-primary bg-primary py-3 px-6 text-center font-medium text-white hover:bg-opacity-90"
              >
                <FaFilter className="mr-2" />
                Filters
              </button>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="bg-white dark:bg-boxdark rounded-lg shadow-default p-2 mb-6 border border-stroke dark:border-strokedark">
            <div className="flex flex-wrap gap-3">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300
                                            ${activeTab === tab.id
                        ? 'bg-primary text-white shadow-md transform scale-105'
                        : 'bg-gray-50 dark:bg-meta-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-meta-3'
                      }`}
                  >
                    <Icon className={activeTab === tab.id ? 'text-white' : 'text-primary'} />
                    <span className="font-medium">{tab.label}</span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                                            ${activeTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'bg-white dark:bg-boxdark text-gray-600 dark:text-gray-400'
                      }`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Jobs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <FaRegClock className="text-4xl text-gray-400 mb-4" />
                <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">No jobs found</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center">
                  {searchTerm
                    ? 'Try adjusting your search to find what you\'re looking for.'
                    : activeTab === 'all'
                      ? 'Get started by adding your first job.'
                      : `No ${activeTab} jobs available.`
                  }
                </p>
              </div>
            ) : (
              paginatedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onEdit={() => {
                    if (!checkUserPermission(job, user)) {
                      toast.error("You don't have permission to change this job's status");
                      return;
                    } else {
                      navigate(`/employee/recruitments/job-management/edit/${job.id}`)
                    }
                  }}
                  onStatusChange={handleStatusChange}
                  hasPermission={checkUserPermission(job, user)}
                  onJobClick={() => navigate(`/employee/recruitments/job-management/details/${job.id}`)}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          {filteredJobs.length > 0 && (
            <div className="mt-6 border-t border-stroke pt-4 dark:border-strokedark">
              <Pagination
                currentPage={currentPage}
                totalItems={filteredJobs.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
                showingText={`Showing ${startIndex + 1}-${Math.min(endIndex, filteredJobs.length)} of ${filteredJobs.length} Jobs`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={(newFilters) => {
          setFilters(newFilters);
          setShowFilterModal(false);
        }}
        onReset={() => {
          setFilters({
            type: '',
            experience: { min: '', max: '' },
            salary: { min: '', max: '' },
            location: '',
            skills: [],
            status: ''
          });
        }}
        filters={filters}
        setFilters={setFilters}
        config={filterConfig}
      />
    </DefaultLayoutEmployee>
  );
};

export default JobList; 