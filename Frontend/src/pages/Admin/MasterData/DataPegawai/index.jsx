import { useState, useEffect, useCallback } from 'react';
import { Link } from "react-router-dom";
import { BreadcrumbAdmin, ButtonOne } from '../../../../components';
import { FaRegEdit, FaPlus } from 'react-icons/fa'
import { BsTrash3 } from 'react-icons/bs'
import { BiSearch } from 'react-icons/bi'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
import { useAuth } from '../../../../context/AuthContext';
import { fetchUsers, deleteUser } from '../../../../context/actions/userActions';

const ITEMS_PER_PAGE = 4;

const CustomerDetails = () => {
    console.log('CustomerDetails');
    const { state, dispatch } = useAuth();
    const { users, loading, error } = state;
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Memoize the fetch function
    const loadUsers = useCallback(async () => {
        await fetchUsers(dispatch);
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

    return (
        <>
            <BreadcrumbAdmin pageName='Customer Details' />

            <div className='rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'>
                <div className='flex flex-col md:flex-row justify-between items-center mb-5'>
                    <div className='relative flex-1 md:mr-4 mb-4 md:mb-0'>
                        <input
                            type='text'
                            placeholder='Search by name, ID, or email...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full rounded-lg border border-stroke bg-transparent py-2 pl-10 pr-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                        />
                        <BiSearch className='absolute left-4 top-1/2 transform -translate-y-1/2 text-xl' />
                    </div>

                    <div className='flex items-center space-x-4'>
                        <Link to='/admin/master-data/customers/add'>
                            <ButtonOne>
                                <FaPlus className="mr-2" /> Add Customer
                            </ButtonOne>
                        </Link>
                    </div>
                </div>

                {/* Table */}
                <div className='max-w-full overflow-x-auto'>
                    <table className='w-full table-auto'>
                        <thead>
                            <tr className='bg-gray-2 text-left dark:bg-meta-4'>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Customer ID
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Name
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Email
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Status
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.map((user) => (
                                <tr key={user.user_id}>
                                    <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                        {user.user_id}
                                    </td>
                                    <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                        {user.username}
                                    </td>
                                    <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                        {user.email}
                                    </td>
                                    <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                        <span className={`inline-block rounded px-2.5 py-0.5 text-sm font-medium ${
                                            user.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                        }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                        <div className='flex items-center space-x-3.5'>
                                            <Link to={`/admin/master-data/customers/edit/${user.user_id}`} className='hover:text-primary'>
                                                <FaRegEdit className="text-lg" />
                                            </Link>
                                            <button onClick={() => handleDelete(user.user_id)} className='hover:text-red-600'>
                                                <BsTrash3 className="text-lg" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className='flex justify-between items-center mt-4 mb-6'>
                    <div className='text-sm text-gray-600 dark:text-gray-400'>
                        Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} entries
                    </div>
                    <div className='flex space-x-2'>
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className='px-3 py-1 border rounded-md disabled:opacity-50'
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className='px-3 py-1 border rounded-md disabled:opacity-50'
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CustomerDetails;