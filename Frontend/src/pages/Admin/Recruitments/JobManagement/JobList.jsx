import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { Link } from "react-router-dom";
import { BreadcrumbAdmin, ButtonOne } from '../../../../components';
import { FaRegEdit, FaPlus, FaFileExcel, FaRegClock, FaUsers, FaBriefcase, FaArchive, FaExclamationTriangle, FaFilter } from 'react-icons/fa';
import { BsTrash3 } from 'react-icons/bs';
import { BiSearch } from 'react-icons/bi';
import { useAuth } from '../../../../context/AuthContext';
import { fetchJobs, deleteJob } from '../../../../context/actions/jobActions';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import JobCard from '../../../../components/molecules/JobCard';
import FilterModal from '../../../../components/molecules/FilterModal/FilterModal';
import { skillIcons } from '../../../../config/skillIcons';

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
                'JavaScript',
                'React',
                'Node.js',
                'Python',
                'Java',
                'SQL',
                'AWS',
                'Docker',
                'TypeScript',
                'Spring',
                'Kubernetes'
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

    // Update the filtering logic to handle both tab and other filters
    const filteredJobs = jobsArray.filter((job) => {
        // First check tab filter
        const matchesTab = activeTab === 'all' || job.status === activeTab;
        if (!matchesTab) return false;

        // Then check search term
        const matchesSearch = !searchTerm ||
            job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job?.description?.toLowerCase().includes(searchTerm.toLowerCase());
        if (!matchesSearch) return false;

        // Then check other filters
        const matchesType = !filters.type || job.type === filters.type;
        const matchesSalary = (!filters.salary.min || job.minSalary >= filters.salary.min) &&
            (!filters.salary.max || job.maxSalary <= filters.salary.max);
        const matchesLocation = !filters.location ||
            job.city.toLowerCase().includes(filters.location.toLowerCase()) ||
            job.state.toLowerCase().includes(filters.location.toLowerCase());
        const matchesSkills = !filters.skills.length ||
            filters.skills.every(skill => job.skills.includes(skill));

        return matchesType && matchesSalary && matchesLocation && matchesSkills;
    });

    // Update the tabs definition to use the filtered count
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
        },
        {
            id: 'expired',
            label: 'Expired',
            icon: FaExclamationTriangle,
            count: jobsArray.filter(job => job.status === 'expired').length
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

    useEffect(() => {
        if (location.state?.refresh) {
            loadJobs();
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

    const handleDelete = async (jobId) => {
        setJobToDelete(jobId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteJob(dispatch, jobToDelete);
            toast.success('Job deleted successfully');
            loadJobs();
        } catch (error) {
            const errorMessage = error.response?.data?.msg || 'Failed to delete job';
            toast.error(errorMessage);
        } finally {
            setShowDeleteModal(false);
            setJobToDelete(null);
        }
    };

    const handleDownloadExcel = () => {
        try {
            const jobsForExcel = filteredJobs.map(job => ({
                'Job ID': job?.job_id || 'N/A',
                'Title': job?.title || 'N/A',
                'Description': job?.description || 'N/A',
                'Status': job?.status || 'N/A',
            }));

            const ws = XLSX.utils.json_to_sheet(jobsForExcel);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Jobs');
            XLSX.writeFile(wb, 'jobs_list.xlsx');

            toast.success('Excel file downloaded successfully');
        } catch (error) {
            console.error('Error generating Excel:', error);
            toast.error('Failed to generate Excel file');
        }
    };

    if (loading) {
        return (
            <DefaultLayoutAdmin>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </DefaultLayoutAdmin>
        );
    }

    return (
        <DefaultLayoutAdmin>
            <BreadcrumbAdmin pageName='Job List' />

            <div className="flex flex-wrap items-center justify-between gap-2.5 mb-6">
                <div className="flex items-center gap-3 flex-1 justify-between">
                    <Link to="/admin/recruitments/job-management/form-job">
                        <ButtonOne>
                            <span>Add Job</span>
                            <span><FaPlus /></span>
                        </ButtonOne>
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search jobs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="rounded-lg border-[1.5px] border-stroke bg-transparent py-3 pl-10 pr-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full"
                            />
                            <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-500" />
                        </div>

                        <button
                            onClick={() => setShowFilterModal(true)}
                            className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-3 px-6 text-center font-medium text-white hover:bg-opacity-90"
                        >
                            <FaFilter />
                            Filters
                        </button>

                        <button
                            onClick={handleDownloadExcel}
                            disabled={filteredJobs.length === 0}
                            className="inline-flex items-center justify-center gap-2.5 rounded-md bg-success py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaFileExcel className="text-lg" />
                            Download Excel
                        </button>
                    </div>
                </div>
            </div>

            <div className="mb-6 bg-white dark:bg-boxdark rounded-lg shadow-sm">
                <div className="flex flex-wrap gap-2 p-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setCurrentPage(1);
                                }}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all
                                    ${activeTab === tab.id
                                        ? 'bg-primary text-white shadow-lg scale-105'
                                        : 'hover:bg-gray-100 dark:hover:bg-meta-4 text-gray-600 dark:text-gray-300'
                                    }`}
                            >
                                <Icon className={activeTab === tab.id ? 'text-white' : 'text-primary'} />
                                <span>{tab.label}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs
                                    ${activeTab === tab.id
                                        ? 'bg-white/20 text-white'
                                        : 'bg-gray-100 dark:bg-meta-4 text-gray-600 dark:text-gray-400'
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
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
                            key={job.id || job.job_id}
                            job={job}
                            onEdit={(jobId) => navigate(`/admin/recruitments/job-management/edit/${job.id}`)}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>

            <div className='flex justify-between items-center mt-6 flex-col md:flex-row'>
                <div className='text-sm text-gray-500 dark:text-gray-400'>
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredJobs.length)} of {filteredJobs.length} Jobs
                </div>
                {filteredJobs.length > 0 && (
                    <div className='flex gap-2 mt-4 md:mt-0'>
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className='py-2 px-4 rounded-lg border border-primary text-primary font-medium hover:bg-primary hover:text-white transition-colors disabled:opacity-50'
                        >
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`py-2 px-4 rounded-lg border transition-colors
                                    ${currentPage === i + 1
                                        ? 'bg-primary text-white border-primary'
                                        : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className='py-2 px-4 rounded-lg border border-primary text-primary font-medium hover:bg-primary hover:text-white transition-colors disabled:opacity-50'
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {showDeleteModal && (
                <DeleteConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={confirmDelete}
                    title="Delete Job"
                    message="Are you sure you want to delete this job? This action cannot be undone."
                />
            )}

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
        </DefaultLayoutAdmin>
    );
};

export default JobList; 