import { useState, useEffect, useCallback } from 'react';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { Link, useNavigate } from "react-router-dom";
import { BreadcrumbAdmin, ButtonOne } from '../../../../components';
import { FaRegEdit, FaPlus, FaHistory } from 'react-icons/fa';
import { BsTrash3 } from 'react-icons/bs';
import { BiSearch } from 'react-icons/bi';
import { useAuth } from '../../../../context/AuthContext';
import { fetchLoans, deleteLoan } from '../../../../context/actions/loanActions';
import toast from 'react-hot-toast';

const ITEMS_PER_PAGE = 4;

const LendingDetails = () => {
    const navigate = useNavigate();
    const { state, dispatch } = useAuth();
    const { loading, error, list: loans } = state.loans || { loading: false, error: null, list: [] };
    
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Pagination calculations
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    // Memoize the fetch function
    const loadLoans = useCallback(async () => {
        await fetchLoans(dispatch);
    }, [dispatch]);

    useEffect(() => {
        loadLoans();
    }, [loadLoans]);

    // Filter and search logic
    const filteredLoans = loans?.filter(loan => {
        const matchesSearch = loan.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !statusFilter || loan.status?.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    }) || [];

    const totalPages = Math.ceil(filteredLoans.length / ITEMS_PER_PAGE);
    const paginatedLoans = filteredLoans.slice(startIndex, endIndex);

    const handleDelete = async (loanId) => {
        if (window.confirm('Are you sure you want to delete this loan?')) {
            try {
                await deleteLoan(dispatch, loanId);
                toast.success('Loan deleted successfully');
            } catch (error) {
                toast.error('Failed to delete loan');
            }
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

    if (error) {
        return (
            <DefaultLayoutAdmin>
                <div className="text-center text-red-500 p-4">
                    Error: {error}
                </div>
            </DefaultLayoutAdmin>
        );
    }

    return (
        <DefaultLayoutAdmin>
            <BreadcrumbAdmin pageName='Lending Details' />
            <Link to="/admin/master-data/lending/add-lending">
                <ButtonOne>
                    <span>Add Lending</span>
                    <span>
                        <FaPlus />
                    </span>
                </ButtonOne>
            </Link>

            <div className='rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6'>
                <div className="flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between">
                    <div className="relative flex-1 md:mr-2 mb-4 md:mb-0 ">
                        <input
                            type='text'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder='Search by customer name...'
                            className='rounded-lg border-[1.5px] border-stroke bg-transparent py-2 pl-10 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary left-0'
                        />
                        <span className='absolute left-2 py-3 text-xl'>
                            <BiSearch />
                        </span>
                    </div>

                    <div className="relative flex-2 mb-4 md:mb-0">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className='rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full'
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>

                <div className='max-w-full overflow-x-auto py-4'>
                    <table className='w-full table-auto'>
                        <thead>
                            <tr className='bg-gray-2 text-left dark:bg-meta-4'>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Customer Name
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Lending Amount
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Balance Remaining
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Paid Amount
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Total Interest
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
                            {paginatedLoans.map((loan) => (
                                <tr key={loan.loan_id}>
                                    <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                        <p className='text-black dark:text-white'>{loan.customer_name}</p>
                                    </td>
                                    <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                        <p className='text-black dark:text-white'>${loan.loan_amount}</p>
                                    </td>
                                    <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                        <p className='text-black dark:text-white'>${loan.remaining_balance}</p>
                                    </td>
                                    <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                        <p className='text-black dark:text-white'>${loan.loan_amount - loan.remaining_balance}</p>
                                    </td>
                                    <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                        <p className='text-black dark:text-white'>${loan.interest_amount}</p>
                                    </td>
                                    <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                        <span className={`inline-block px-3 py-1 rounded-full ${
                                            loan.status.toLowerCase() === 'active' 
                                                ? 'text-success bg-success/10' 
                                                : 'text-danger bg-danger/10'
                                        }`}>
                                            {loan.status}
                                        </span>
                                    </td>
                                    <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                        <div className='flex items-center space-x-3.5'>
                                            <button 
                                                onClick={() => navigate(`/admin/master-data/lending/edit/${loan.loan_id}`)}
                                                className='hover:text-black'
                                            >
                                                <FaRegEdit className="text-primary text-xl hover:text-black dark:hover:text-white" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(loan.loan_id)}
                                                className='hover:text-black'
                                            >
                                                <BsTrash3 className="text-danger text-xl hover:text-black dark:hover:text-white" />
                                            </button>
                                            <button 
                                                onClick={() => navigate(`/admin/lending/${loan.loan_id}`)}
                                                className='hover:text-black'
                                            >
                                                <FaHistory className="text-success text-xl hover:text-black dark:hover:text-white" />
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
                            Showing {startIndex + 1}-{Math.min(endIndex, filteredLoans.length)} of {filteredLoans.length} Loans
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

export default LendingDetails;