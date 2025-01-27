import { useState, useEffect, useCallback } from 'react';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { Link } from "react-router-dom";
import { BreadcrumbAdmin, ButtonOne } from '../../../../components';
import { FaRegEdit, FaPlus } from 'react-icons/fa'
import { BsTrash3 } from 'react-icons/bs'
import { BiSearch } from 'react-icons/bi'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
import { useAuth } from '../../../../context/AuthContext';
import { fetchUsers, deleteUser } from '../../../../context/actions/userActions';
import { toast } from 'react-hot-toast';

const ITEMS_PER_PAGE = 5;

const CustomerData = () => {
    const { state, dispatch } = useAuth();
    const { users, loading } = state;
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

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

    // Filter and search logic
    const filteredUsers = users?.filter(user => {
        const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.user_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !statusFilter || user.status?.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    }) || [];

    // Pagination calculations
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            await deleteUser(dispatch, userId);
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
            <BreadcrumbAdmin pageName='Customer Data' />
            <Link to="/admin/master-data/data-pegawai/form-data-pegawai">
                <ButtonOne>
                    <span>Add Customer</span>
                    <span><FaPlus /></span>
                </ButtonOne>
            </Link>

            <div className='rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6'>
                <div className="flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between">
                    <div className="relative flex-1 md:mr-2 mb-4 md:mb-0">
                        <div className='relative w-48'>
                            <select 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className='w-full relative appearance-none rounded border border-stroke bg-transparent py-3 pl-4 pr-8 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input'
                            >
                                <option value=''>All Status</option>
                                <option value='active'>Active</option>
                                <option value='inactive'>Inactive</option>
                            </select>
                            <span className='absolute right-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none'>
                                <MdOutlineKeyboardArrowDown />
                            </span>
                        </div>
                    </div>
                    <div className="relative flex-2 mb-4 md:mb-0">
                        <input
                            type='text'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder='Search by name, ID or email...'
                            className='rounded-lg border-[1.5px] border-stroke bg-transparent py-2 pl-10 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary left-0'
                        />
                        <span className='absolute left-2 py-3 text-xl'>
                            <BiSearch />
                        </span>
                    </div>
                </div>

                <div className='max-w-full overflow-x-auto py-4'>
                    <table className='w-full table-auto'>
                        <thead>
                            <tr className='bg-gray-2 text-left dark:bg-meta-4'>
                                {/* <th className='py-4 px-4 font-medium text-black dark:text-white'>Photo</th> */}
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
                            {paginatedUsers.map((customer) => (
                                <tr key={customer.user_id}>
                                    {/* <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                        <img 
                                            src={customer.url || customer.photo} 
                                            alt={customer.username}
                                            className="w-10 h-10 rounded-full"
                                        />
                                    </td> */}
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
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className='flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between'>
                    <div className='flex items-center space-x-2'>
                        <span className='text-gray-5 dark:text-gray-4 text-sm py-4'>
                            Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} Customers
                        </span>
                    </div>
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
                </div>
            </div>
        </DefaultLayoutAdmin>
    );
};

export default CustomerData;