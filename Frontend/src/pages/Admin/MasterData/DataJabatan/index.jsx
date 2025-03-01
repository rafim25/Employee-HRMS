import { useState, useEffect, useCallback } from 'react';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { Link, useNavigate } from "react-router-dom";
import { BreadcrumbAdmin, ButtonOne } from '../../../../components';
import { FaRegEdit, FaPlus, FaHistory, FaFileExcel, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { BsTrash3 } from 'react-icons/bs';
import { BiSearch, BiSortAlt2, BiUpArrow, BiDownArrow } from 'react-icons/bi';
import { useAuth } from '../../../../context/AuthContext';
import { fetchLoans, deleteLoan } from '../../../../context/actions/loanActions';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

const ITEMS_PER_PAGE = 5;

const LendingDetails = () => {
    const { state, dispatch } = useAuth();
    const loans = state.loans?.list || [];
    const loading = state.loans?.loading || false;
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loanToDelete, setLoanToDelete] = useState(null);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [sortConfig, setSortConfig] = useState({
        key: 'updated_at',
        direction: 'desc'
    });

    // Pagination calculations
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    // Memoize the fetch function
    const loadLoans = useCallback(async () => {
        try {
            await fetchLoans(dispatch);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch loans';
            toast.error(errorMessage);
        }
    }, [dispatch]);

    useEffect(() => {
        loadLoans();
    }, [loadLoans]);

    // Add sort handler
    const handleSort = (key) => {
        setSortConfig((prevSort) => ({
            key,
            direction: prevSort.key === key && prevSort.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    // Update the filtered and sorted loans logic
    const filteredLoans = loans.filter(loan => {
        const matchesSearch = loan.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !statusFilter || loan.status?.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    }).sort((a, b) => {
        if (sortConfig.key === 'customer_name') {
            return sortConfig.direction === 'asc' 
                ? a.customer_name.localeCompare(b.customer_name)
                : b.customer_name.localeCompare(a.customer_name);
        }
        if (sortConfig.key === 'referred_by') {
            const aRef = a.referred_by || '';
            const bRef = b.referred_by || '';
            return sortConfig.direction === 'asc'
                ? aRef.localeCompare(bRef)
                : bRef.localeCompare(aRef);
        }
        if (sortConfig.key === 'status') {
            return sortConfig.direction === 'asc'
                ? a.status.localeCompare(b.status)
                : b.status.localeCompare(a.status);
        }
        // Default sort by updated_at
        return sortConfig.direction === 'asc'
            ? new Date(a.updated_at) - new Date(b.updated_at)
            : new Date(b.updated_at) - new Date(a.updated_at);
    });

    const totalPages = Math.ceil(filteredLoans.length / ITEMS_PER_PAGE);
    const paginatedLoans = filteredLoans.slice(startIndex, endIndex);

    const handleDelete = async (loanId) => {
        setLoanToDelete(loanId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await deleteLoan(dispatch, loanToDelete);
            if (response?.status === 200) {
                toast.success('Purchase deleted successfully');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to delete purchase';
            toast.error(errorMessage);
        } finally {
            setShowDeleteModal(false);
            setLoanToDelete(null);
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

    // Add download function
    const handleDownloadExcel = () => {
        if (!fromDate || !toDate) {
            toast.error('Please select both From and To dates');
            return;
        }

        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59); // Set to end of day

        if (startDate > endDate) {
            toast.error('From date cannot be later than To date');
            return;
        }

        const filteredData = loans.filter(loan => {
            const loanDate = new Date(loan.created_at);
            return loanDate >= startDate && loanDate <= endDate;
        });

        if (filteredData.length === 0) {
            toast.error('No purchase records found for the selected date range');
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(filteredData.map(loan => ({
            'Customer Name': loan.customer_name,
            'Purchase Amount': loan.loan_amount,
            'Advance Paid': loan.advance_amount,
            'Balance Remaining': loan.remaining_balance,
            'Paid Amount': loan.loan_amount - loan.remaining_balance,
            'Referred By': loan.referred_by || 'N/A',
            'Status': loan.status,
            'Date': new Date(loan.created_at).toLocaleDateString()
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Purchases');
        
        // Generate filename with date range
        const filename = `purchases_${fromDate}_to_${toDate}.xlsx`;
        XLSX.writeFile(workbook, filename);
        
        toast.success('Purchase report downloaded successfully');
    };

    const renderSortIcon = (columnKey) => {
        if (sortConfig.key === columnKey) {
            return sortConfig.direction === 'asc' ? 
                <FaSortUp className="inline ml-1 text-primary" /> : 
                <FaSortDown className="inline ml-1 text-primary" />;
        }
        return <FaSort className="inline ml-1 text-gray-400 hover:text-primary" />;
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
            <BreadcrumbAdmin pageName='Purchase Details' />
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <Link to="/admin/master-data/lending/add-lending">
                    <ButtonOne>
                        <span>Add Purchase</span>
                        <span>
                            <FaPlus />
                        </span>
                    </ButtonOne>
                </Link>

                <div className="flex flex-wrap items-center gap-3 ml-auto">
                    <div className="flex items-center gap-2">
                        <label className="text-black dark:text-white font-medium">From:</label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                        <label className="text-black dark:text-white font-medium ml-4">To:</label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                    </div>
                    <button
                        onClick={handleDownloadExcel}
                        className="inline-flex items-center justify-center rounded-md bg-success py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 transition duration-200 ease-in-out ml-4"
                    >
                        <FaFileExcel className="mr-2" />
                        Download Excel
                    </button>
                </div>
            </div>

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
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                </div>

                <div className='max-w-full overflow-x-auto py-4'>
                    <table className='w-full table-auto'>
                        <thead>
                            <tr className='bg-gray-2 text-left dark:bg-meta-4'>
                                <th onClick={() => handleSort('customer_name')} 
                                    className='min-w-[170px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer hover:bg-gray-1 dark:hover:bg-meta-3'>
                                    Customer{renderSortIcon('customer_name')}
                                </th>
                                <th className='min-w-[150px] py-4 px-4 font-medium text-black dark:text-white'>
                                    Purchase Amount
                                </th>
                                <th className='min-w-[120px] py-4 px-4 font-medium text-black dark:text-white'>
                                    Advance Amount
                                </th>
                                <th className='min-w-[120px] py-4 px-4 font-medium text-black dark:text-white'>
                                    Balance Amount
                                </th>
                                <th className='min-w-[120px] py-4 px-4 font-medium text-black dark:text-white'>
                                    Total Paid
                                </th>
                                <th onClick={() => handleSort('referred_by')}
                                    className='min-w-[150px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer hover:bg-gray-1 dark:hover:bg-meta-3'>
                                    Referred By {renderSortIcon('referred_by')}
                                </th>
                                <th onClick={() => handleSort('status')}
                                    className='min-w-[120px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer hover:bg-gray-1 dark:hover:bg-meta-3'>
                                    Status {renderSortIcon('status')}
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedLoans.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-8">
                                        <div className="flex flex-col items-center justify-center">
                                            <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">No purchase records found</p>
                                            <p className="text-sm text-gray-400 dark:text-gray-500">
                                                {searchTerm || statusFilter ? 
                                                    'Try adjusting your search criteria or status filter.' : 
                                                    'Get started by adding your first purchase record.'}
                                            </p>
                                            <Link 
                                                to="/admin/master-data/lending/add-lending"
                                                className="mt-4 inline-flex items-center text-primary hover:underline"
                                            >
                                                <FaPlus className="mr-2" />
                                                Add New Purchase
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedLoans.map((loan) => (
                                    <tr key={loan.loan_id}>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{loan.customer_name}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>₹{Number(loan.loan_amount).toFixed(2)}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>₹{Number(loan.advance_amount).toFixed(2)}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>₹{Number(loan.remaining_balance).toFixed(2)}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>₹{Number(loan.loan_amount - loan.remaining_balance).toFixed(2)}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{loan.referred_by || 'N/A'}</p>
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className='flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between'>
                    <div className='flex items-center space-x-2'>
                        <span className='text-gray-5 dark:text-gray-4 text-sm py-4'>
                            {paginatedLoans.length > 0 ? (
                                `Showing ${startIndex + 1}-${Math.min(endIndex, filteredLoans.length)} of ${filteredLoans.length} Purchases`
                            ) : (
                                'No purchase records to display'
                            )}
                        </span>
                    </div>
                    {paginatedLoans.length > 0 && (
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

            {showDeleteModal && (
                <div className="fixed inset-0 z-999999 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="rounded-sm border border-stroke bg-white p-8 shadow-default dark:border-strokedark dark:bg-boxdark max-w-lg w-full mx-4">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-danger/20 flex items-center justify-center mb-4">
                                <BsTrash3 className="text-danger text-xl" />
                            </div>
                            <h2 className="mb-3 text-xl font-semibold text-black dark:text-white">Delete Purchase Record</h2>
                            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                                Are you sure you want to delete this purchase record? This action cannot be undone and will remove all associated transaction history.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:justify-center">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="rounded-lg border border-stroke py-2 px-6 text-black hover:shadow-1 dark:border-strokedark dark:text-white w-full sm:w-auto"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="rounded-lg border border-danger bg-danger py-2 px-6 text-white hover:bg-opacity-90 w-full sm:w-auto"
                                >
                                    Yes, Delete Purchase
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DefaultLayoutAdmin>
    );
};

export default LendingDetails;