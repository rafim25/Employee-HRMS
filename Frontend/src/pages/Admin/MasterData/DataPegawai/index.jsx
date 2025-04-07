import { useState, useEffect, useCallback } from 'react';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { Link } from "react-router-dom";
import { BreadcrumbAdmin, ButtonOne, ButtonTwo } from '../../../../components';
import { FaRegEdit, FaPlus, FaFileExcel } from 'react-icons/fa'
import { BsTrash3 } from 'react-icons/bs'
import { BiSearch } from 'react-icons/bi'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
import { useAuth } from '../../../../context/AuthContext';
import { fetchUsers, deleteUser } from '../../../../context/actions/userActions';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { USER_ENDPOINTS } from '../../../../constants/apiEndpoints';
import DeleteConfirmationModal from '../../../../components/DeleteConfirmationModal';
import * as XLSX from 'xlsx';

const ITEMS_PER_PAGE = 6;

const CustomerData = () => {
    const { state, dispatch } = useAuth();
    const { users, loading } = state;
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    // Memoize the fetch function
    const loadUsers = useCallback(async () => {
        try {
            await fetchUsers(dispatch);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch users';
            toast.error(errorMessage);
        }
    }, [dispatch]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    // Filter users based on search and status
    const filteredUsers = users?.filter((user) => {
        const matchesSearch =
            (user?.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (user?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        const matchesStatus = !statusFilter || statusFilter === 'all' ||
            (user?.status?.toLowerCase() === statusFilter.toLowerCase());

        return matchesSearch && matchesStatus;
    }) || [];

    // Pagination calculations
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    const handleDelete = async (userId) => {
        setUserToDelete(userId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteUser(dispatch, userToDelete);
            toast.success('User deleted successfully');
            loadUsers(); // Refresh the user list
        } catch (error) {
            const errorMessage = error.response?.data?.msg || 'Failed to delete user';
            if (errorMessage.includes('active purchase')) {
                toast.error('Cannot delete user with active purchases. Please close or reassign all purchases first.');
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setShowDeleteModal(false);
            setUserToDelete(null);
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handleDownloadExcel = () => {
        try {
            // Validate dates
            if (!fromDate || !toDate) {
                toast.error('Please select both From and To dates');
                return;
            }

            // Convert input dates to start and end of day
            const from = new Date(fromDate);
            from.setHours(0, 0, 0, 0);

            const to = new Date(toDate);
            to.setHours(23, 59, 59, 999);

            // Filter users based on search, status, and date range for Excel only
            const usersForExcel = users?.filter((user) => {
                // Parse date_joined properly
                const dateJoined = user?.date_joined ? new Date(user.date_joined.replace(' ', 'T')) : null;
                if (!dateJoined) return false;

                const matchesSearch =
                    (user?.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                    (user?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
                const matchesStatus = !statusFilter || statusFilter === 'all' ||
                    (user?.status?.toLowerCase() === statusFilter.toLowerCase());
                const matchesDateRange = dateJoined >= from && dateJoined <= to;

                return matchesSearch && matchesStatus && matchesDateRange;
            }) || [];

            if (usersForExcel.length === 0) {
                toast.error('No data available for the selected criteria');
                return;
            }

            // Prepare data for Excel
            const excelData = usersForExcel.map(user => ({
                'User ID': user?.user_id || 'N/A',
                'Name': user?.username || 'N/A',
                'Email': user?.email || 'N/A',
                'Gender': user?.gender || 'N/A',
                'Phone': user?.mobile_number || 'N/A',
                'Address': user?.address || 'N/A',
                'Status': user?.status || 'N/A',
                'Role': user?.role || 'N/A',
                'Date Joined': user?.date_joined ? new Date(user.date_joined.replace(' ', 'T')).toLocaleDateString() : 'N/A',
                'Permissions': user?.permissions || 'N/A'
            }));

            // Create worksheet
            const ws = XLSX.utils.json_to_sheet(excelData);

            // Set column widths
            const colWidths = [
                { wch: 15 }, // User ID
                { wch: 20 }, // Name
                { wch: 30 }, // Email
                { wch: 15 }, // Gender
                { wch: 15 }, // Phone
                { wch: 40 }, // Address
                { wch: 15 }, // Status
                { wch: 15 }, // Role
                { wch: 20 }, // Date Joined
                { wch: 20 }  // Permissions
            ];
            ws['!cols'] = colWidths;

            // Create workbook
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Customers');

            // Generate filename with date range
            const filename = `customers_${fromDate}_to_${toDate}.xlsx`;

            // Generate Excel file
            XLSX.writeFile(wb, filename);

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
            <BreadcrumbAdmin pageName='Employee Details' backButton={false} />

            <div className="flex flex-wrap items-center justify-between gap-2.5 mb-6">
                <div className="flex items-center gap-3 flex-1 justify-between">
                    <Link to="/admin/master-data/data-pegawai/form-data-pegawai">
                        <ButtonOne>
                            <span>Add User &nbsp; </span>
                            <span><FaPlus /></span>
                        </ButtonOne>
                    </Link>

                    {/* <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <label className="text-black dark:text-white font-medium">From:</label>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-black dark:text-white font-medium">To:</label>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            />
                        </div>

                        <button
                            onClick={handleDownloadExcel}
                            disabled={filteredUsers.length === 0 || !fromDate || !toDate}
                            className="inline-flex items-center justify-center gap-2.5 rounded-md bg-success py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={!fromDate || !toDate ? "Please select both From and To dates" : ""}
                        >
                            <FaFileExcel className="text-lg" />
                            Download Excel
                        </button>
                    </div> */}
                </div>
            </div>

            <div className='rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <div className="flex items-center justify-between w-full">
                        <div className='relative w-48'>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className='w-full relative appearance-none rounded border border-stroke bg-transparent py-3 pl-4 pr-8 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input'
                            >
                                <option value='all'>All Status</option>
                                <option value='active'>Active</option>
                                <option value='inactive'>Inactive</option>
                            </select>
                            <span className='absolute right-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none'>
                                <MdOutlineKeyboardArrowDown />
                            </span>
                        </div>

                        <div className="relative w-72">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="rounded-lg border-[1.5px] border-stroke bg-transparent py-3 pl-10 pr-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2">
                                <BiSearch className="text-xl" />
                            </span>
                        </div>
                    </div>
                </div>

                <div className='max-w-full overflow-x-auto py-4'>
                    <table className='w-full table-auto'>
                        <thead>
                            <tr className='bg-gray-2 text-left dark:bg-meta-4'>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>User ID</th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>Username</th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>Email</th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>Mobile</th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>Status</th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>Role</th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">
                                        <div className="flex flex-col items-center justify-center">
                                            <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">No customers found</p>
                                            <p className="text-sm text-gray-400 dark:text-gray-500">
                                                {searchTerm || statusFilter ?
                                                    'Try adjusting your search or filter to find what you\'re looking for.' :
                                                    'Get started by adding your first customer.'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedUsers.map((customer) => (
                                    <tr key={customer.user_id}>
                                        <td className='border-b text-black border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            {customer.user_id}
                                        </td>
                                        <td className='border-b text-black border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            {customer.username}
                                        </td>
                                        <td className='border-b text-black border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            {customer.email}
                                        </td>
                                        <td className='border-b text-black border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            {customer.mobile_number}
                                        </td>
                                        <td className='border-b text-black border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            {customer.status}
                                        </td>
                                        <td className='border-b text-black border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            {customer.role}
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <div className='flex items-center space-x-3.5'>
                                                <Link to={`/admin/master-data/data-pegawai/edit/${customer.user_id}`}>
                                                    <FaRegEdit className="text-primary text-xl hover:text-black dark:hover:text-white" />
                                                </Link>
                                                <button onClick={() => handleDelete(customer.user_id)}>
                                                    <BsTrash3 className="text-danger text-xl hover:text-black dark:hover:text-white" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className='flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between'>
                    <div className='flex items-center space-x-2'>
                        <span className='text-gray-5 dark:text-gray-4 text-sm py-4'>
                            {paginatedUsers.length > 0 ? (
                                `Showing ${startIndex + 1}-${Math.min(endIndex, filteredUsers.length)} of ${filteredUsers.length} Customers`
                            ) : (
                                'No customers to display'
                            )}
                        </span>
                    </div>
                    {paginatedUsers.length > 0 && (
                        <div className='flex space-x-2 py-4'>
                            <button
                                disabled={currentPage === 1}
                                onClick={goToPrevPage}
                                className='py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50'
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
                                    return (
                                        <p
                                            key={i}
                                            className="py-2 px-4 border border-gray-2 dark:bg-transparent text-black font-medium bg-gray dark:border-strokedark dark:text-white"
                                        >
                                            ...
                                        </p>
                                    );
                                } else if (page === totalPages - 1 && currentPage < totalPages - 3) {
                                    return (
                                        <p
                                            key={i}
                                            className="py-2 px-4 border border-gray-2 dark:bg-transparent text-black font-medium bg-gray dark:border-strokedark dark:text-white"
                                        >
                                            ...
                                        </p>
                                    );
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
                                } else {
                                    return null;
                                }
                            })}
                            <button
                                disabled={currentPage === totalPages}
                                onClick={goToNextPage}
                                className='py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50'
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <DeleteConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={confirmDelete}
                    title="Delete Customer"
                    message="Are you sure you want to delete this customer? This action cannot be undone."
                />
            )}
        </DefaultLayoutAdmin>
    );
};

export default CustomerData;