import React, { useState, useEffect } from 'react';
import DefaultLayoutPegawai from '../../../layout/DefaultLayoutPegawai';
import { BreadcrumbPegawai } from '../../../components';
import { api } from '../../../services/api';
import { 
    FaMoneyBillWave, 
    FaFileInvoiceDollar, 
    FaHandHoldingUsd, 
    FaChartLine,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaUserTie,
    FaUserCircle,
    FaVenusMars,
    FaShieldAlt,
    FaLink,
    FaUniversity,
    FaCopy
} from 'react-icons/fa';

const DashboardPegawai = () => {
    const [employeeData, setEmployeeData] = useState({
        name: '',
        position: '',
        joinDate: '',
        status: '',
        email: '',
        gender: '',
        mobile_number: '',
        address: '',
        photo: '',
        url: '',
        permissions: ''
    });

    const [loanData, setLoanData] = useState({
        totalLoans: 0,
        totalAmountPaid: 0,
        totalAdvancePaid: 0,
        activeLoans: 0
    });

    // Calculate total amount including advance
    const totalAmountPaid = (loanData.totalAmountPaid || 0) + (loanData.totalAdvancePaid || 0);

    const [recentLoans, setRecentLoans] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedLoanId, setSelectedLoanId] = useState('');
    const [loanTransactions, setLoanTransactions] = useState([]);
    const [loadingTransactions, setLoadingTransactions] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    // Add new state for copy notification
    const [copyNotification, setCopyNotification] = useState('');

    // Function to copy text to clipboard
    const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopyNotification(`${field} copied!`);
            setTimeout(() => setCopyNotification(''), 2000);
        });
    };

    // Bank details object
    const bankDetails = {
        accountHolder: "Raghav Elite Projects",
        accountNumber: "120027350028",
        ifsc: "CNRB0010623",
        branch: "Ballari Zilla Panchayat Branch",
        accountType: "SAVING",
        mmid: "583015115" 
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const [
                    employeeResponse,
                    loanStatsResponse,
                    recentLoansResponse,
                    activitiesResponse
                ] = await Promise.all([
                    api.get('/api/employee/profile'),
                    api.get('/api/employee/loan-statistics'),
                    api.get('/api/employee/recent-loans'),
                    api.get('/api/employee/recent-activities')
                ]);

                setEmployeeData(employeeResponse.data);
                setLoanData(loanStatsResponse.data);
                setRecentLoans(recentLoansResponse.data);
                setRecentActivities(activitiesResponse.data);

            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.response?.data?.error || 'An error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Add function to fetch transactions for selected loan
    const fetchLoanTransactions = async (loanId) => {
        if (!loanId) return;
        
        try {
            setLoadingTransactions(true);
            const response = await api.get(`/api/loan-transactions/${loanId}`);
            setLoanTransactions(response.data);
        } catch (error) {
            console.error('Error fetching loan transactions:', error);
        } finally {
            setLoadingTransactions(false);
        }
    };

    // Handle loan selection change
    const handleLoanChange = (e) => {
        const loanId = e.target.value;
        setSelectedLoanId(loanId);
        fetchLoanTransactions(loanId);
    };

    // Receipt Modal component
    const ReceiptModal = ({ transaction, onClose }) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-boxdark">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h3 className="mb-4 text-xl font-semibold">Transaction Receipt</h3>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-medium">Transaction ID: {transaction.transaction_id}</p>
                        <p className="text-sm font-medium">Date: {new Date(transaction.created_at).toLocaleDateString()}</p>
                        <p className="text-sm font-medium">Amount: ₹{Number(transaction.amount).toFixed(2)}</p>
                        <p className="text-sm font-medium">Comments: {transaction.comments}</p>
                    </div>
                    {transaction.receipt_url && (
                        <div className="flex justify-center">
                            <img
                                src={transaction.receipt_url}
                                alt="Receipt"
                                className="max-h-[500px] rounded-lg object-contain"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    if (error) {
        return (
            <DefaultLayoutPegawai>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-meta-1 mb-4">Error Loading Dashboard</h2>
                        <p className="text-gray-500">{error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="mt-4 bg-meta-3 text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </DefaultLayoutPegawai>
        );
    }

    return (
        <DefaultLayoutPegawai>
            <BreadcrumbPegawai pageName='Dashboard' />
            
            {/* Employee Profile Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 px-4 mt-6">
                <div className="md:col-span-1">
                    <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="flex flex-col items-center">
                            {employeeData.photo ? (
                                <img 
                                    src={employeeData.photo} 
                                    alt={employeeData.name} 
                                    className="h-32 w-32 rounded-full object-cover mb-4"
                                />
                            ) : (
                                <div className="h-32 w-32 flex items-center justify-center mb-4">
                                    <FaUserCircle className="h-full w-full text-gray-300" />
                                </div>
                            )}
                            <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                                {employeeData.name || 'Employee Name'}
                            </h3>
                            <p className="text-meta-3 font-medium">{employeeData.position || 'Position'}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <span className={`inline-block rounded-full py-1 px-3 text-xs font-medium ${
                                    employeeData.status === 'active' ? 'bg-success text-white' : 'bg-danger text-white'
                                }`}>
                                    {employeeData.status || 'Status'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
                        <h4 className="text-xl font-semibold text-black dark:text-white mb-4">
                            Customer Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center">
                                <FaEnvelope className="text-meta-3 mr-3 text-xl" />
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium break-all">{employeeData.email || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <FaPhone className="text-meta-5 mr-3 text-xl" />
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-medium">{employeeData.mobile_number || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <FaVenusMars className="text-meta-6 mr-3 text-xl" />
                                <div>
                                    <p className="text-sm text-gray-500">Gender</p>
                                    <p className="font-medium capitalize">{employeeData.gender || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <FaCalendarAlt className="text-meta-7 mr-3 text-xl" />
                                <div>
                                    <p className="text-sm text-gray-500">Join Date</p>
                                    <p className="font-medium">
                                        {employeeData.joinDate ? new Date(employeeData.joinDate).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <FaMapMarkerAlt className="text-meta-3 mr-3 text-xl" />
                                <div>
                                    <p className="text-sm text-gray-500">Address</p>
                                    <p className="font-medium break-words">{employeeData.address || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <FaShieldAlt className="text-meta-5 mr-3 text-xl" />
                                <div>
                                    <p className="text-sm text-gray-500">Permissions</p>
                                    <p className="font-medium capitalize">{employeeData.permissions || 'N/A'}</p>
                                </div>
                            </div>
                            {employeeData.url && (
                                <div className="flex items-center md:col-span-2">
                                    <FaLink className="text-meta-6 mr-3 text-xl" />
                                    <div>
                                        <p className="text-sm text-gray-500">Profile URL</p>
                                        <a 
                                            href={employeeData.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-medium text-primary hover:underline break-all"
                                        >
                                            {employeeData.url}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Bank Details Section right after the profile card */}
            <div className="grid grid-cols-1 gap-4 mb-6 px-4 mt-6">
                <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke pb-4 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white flex items-center gap-2">
                            <FaUniversity className="text-xl text-primary" />
                            Raghav Projects Bank Details
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">You can pay your EMI directly to the below account</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-500">Account Holder</label>
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-black dark:text-white">{bankDetails.accountHolder}</p>
                                    <button 
                                        onClick={() => copyToClipboard(bankDetails.accountHolder, 'Account holder name')}
                                        className="text-primary hover:text-meta-3 transition-colors"
                                        title="Copy account holder name"
                                    >
                                        <FaCopy size={14} />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Account Number</label>
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-black dark:text-white">{bankDetails.accountNumber}</p>
                                    <button 
                                        onClick={() => copyToClipboard(bankDetails.accountNumber, 'Account number')}
                                        className="text-primary hover:text-meta-3 transition-colors"
                                        title="Copy account number"
                                    >
                                        <FaCopy size={14} />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">IFSC Code</label>
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-black dark:text-white">{bankDetails.ifsc}</p>
                                    <button 
                                        onClick={() => copyToClipboard(bankDetails.ifsc, 'IFSC code')}
                                        className="text-primary hover:text-meta-3 transition-colors"
                                        title="Copy IFSC code"
                                    >
                                        <FaCopy size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-500">Branch</label>
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-black dark:text-white">{bankDetails.branch}</p>
                                    <button 
                                        onClick={() => copyToClipboard(bankDetails.branch, 'Branch name')}
                                        className="text-primary hover:text-meta-3 transition-colors"
                                        title="Copy branch name"
                                    >
                                        <FaCopy size={14} />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Account Type</label>
                                <p className="font-medium text-black dark:text-white">{bankDetails.accountType}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">MMID</label>
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-black dark:text-white">{bankDetails.mmid}</p>
                                    <button 
                                        onClick={() => copyToClipboard(bankDetails.mmid, 'MMID')}
                                        className="text-primary hover:text-meta-3 transition-colors"
                                        title="Copy MMID"
                                    >
                                        <FaCopy size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Copy Notification */}
                    {copyNotification && (
                        <div className="mt-4 text-sm text-success animate-fade-in-out">
                            {copyNotification}
                        </div>
                    )}
                </div>
            </div>

            {/* Loan Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 px-4">
                <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                        <FaFileInvoiceDollar className="fill-primary dark:fill-white text-xl" />
                    </div>
                    <div className="mt-4 flex items-end justify-between">
                        <div>
                            <h4 className="text-2xl font-bold text-black dark:text-white">
                                {loanData.totalLoans}
                            </h4>
                            <span className="text-sm font-medium">Total Land Purchase</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                        <FaMoneyBillWave className="fill-primary dark:fill-white text-xl" />
                    </div>
                    <div className="mt-4 flex items-end justify-between">
                        <div>
                            <h4 className="text-2xl font-bold text-black dark:text-white">
                                ₹{totalAmountPaid.toFixed(2)}
                            </h4>
                            <span className="text-sm font-medium">Total Amount Paid</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                        <FaHandHoldingUsd className="fill-primary dark:fill-white text-xl" />
                    </div>
                    <div className="mt-4 flex items-end justify-between">
                        <div>
                            <h4 className="text-2xl font-bold text-black dark:text-white">
                                ₹{loanData.totalAdvancePaid.toFixed(2)}
                            </h4>
                            <span className="text-sm font-medium">Advance Paid</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                        <FaChartLine className="fill-primary dark:fill-white text-xl" />
                    </div>
                    <div className="mt-4 flex items-end justify-between">
                        <div>
                            <h4 className="text-2xl font-bold text-black dark:text-white">
                                {loanData.activeLoans}
                            </h4>
                            <span className="text-sm font-medium">Active Purchase</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Loans */}
            <div className="px-4 mb-6">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-4 py-4 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Recent Land Purchase
                        </h3>
                    </div>
                    <div className="p-4">
                        {loading ? (
                            <p>Loading...</p>
                        ) : recentLoans.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto">
                                    <thead>
                                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                            <th className="py-4 px-4 font-medium text-black dark:text-white">Purchase ID</th>
                                            <th className="py-4 px-4 font-medium text-black dark:text-white">Amount</th>
                                            <th className="py-4 px-4 font-medium text-black dark:text-white">Date</th>
                                            <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
                                            <th className="py-4 px-4 font-medium text-black dark:text-white">Paid Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentLoans.map((loan, index) => (
                                            <tr key={index} className="border-b border-[#eee] dark:border-strokedark">
                                                <td className="py-4 px-4">{loan.loanId}</td>
                                                <td className="py-4 px-4">₹{Number(loan.amount).toFixed(2)}</td>
                                                <td className="py-4 px-4">{new Date(loan.date).toLocaleDateString()}</td>
                                                <td className="py-4 px-4">
                                                    <span className={`inline-block rounded-full py-1 px-3 text-sm font-medium ${
                                                        loan.status === 'active' ? 'bg-success text-white' :
                                                        loan.status === 'completed' ? 'bg-meta-3 text-white' :
                                                        'bg-danger text-white'
                                                    }`}>
                                                        {loan.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">₹{Number(loan.paidAmount).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">No recent land Purchase</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Activities */}
            <div className="px-4 mb-6">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-4 py-4 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Recent Activities
                        </h3>
                    </div>
                    <div className="p-4">
                        {loading ? (
                            <p>Loading...</p>
                        ) : recentActivities.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {recentActivities.map((activity, index) => (
                                    <div 
                                        key={index} 
                                        className="flex items-center justify-between border-b border-stroke pb-4 dark:border-strokedark"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                                                <FaFileInvoiceDollar className="fill-primary dark:fill-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-black dark:text-white">
                                                    {activity.description}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(activity.date).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">No recent activities</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Replace Quick Actions with Loan Transactions */}
            <div className="px-4 mb-6">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-4 py-4 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Land Purchase Transactions
                        </h3>
                    </div>
                    <div className="p-4">
                        {/* Loan Selector */}
                        <div className="mb-4">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Select Land Purchase
                            </label>
                            <div className="relative z-20 bg-white dark:bg-form-input">
                                <select
                                    value={selectedLoanId}
                                    onChange={handleLoanChange}
                                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                                >
                                    <option value="">Select a purchase</option>
                                    {recentLoans.map((loan) => (
                                        <option key={loan.loanId} value={loan.loanId}>
                                            Purchase ID: {loan.loanId} - Amount: ₹{Number(loan.amount).toFixed(2)}
                                        </option>
                                    ))}
                                </select>
                                <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <g opacity="0.8">
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                                fill="#637381"
                                            ></path>
                                        </g>
                                    </svg>
                                </span>
                            </div>
                        </div>

                        {/* Transactions Table */}
                        {loadingTransactions ? (
                            <div className="text-center py-4">
                                <p>Loading transactions...</p>
                            </div>
                        ) : selectedLoanId ? (
                            loanTransactions.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full table-auto">
                                        <thead>
                                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                                <th className="py-4 px-4 font-medium text-black dark:text-white">
                                                    Transaction ID
                                                </th>
                                                <th className="py-4 px-4 font-medium text-black dark:text-white">
                                                    Type
                                                </th>
                                                <th className="py-4 px-4 font-medium text-black dark:text-white">
                                                    Amount
                                                </th>
                                                <th className="py-4 px-4 font-medium text-black dark:text-white">
                                                    Date
                                                </th>
                                                <th className="py-4 px-4 font-medium text-black dark:text-white">
                                                    Receipt
                                                </th>
                                                <th className="py-4 px-4 font-medium text-black dark:text-white">
                                                    Comments
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loanTransactions.map((transaction) => (
                                                <tr key={transaction.transaction_id}>
                                                    <td className="border-b border-[#eee] px-4 py-4 dark:border-strokedark">
                                                        {transaction.transaction_id}
                                                    </td>
                                                    <td className="border-b border-[#eee] px-4 py-4 dark:border-strokedark">
                                                        <span className={`inline-block rounded-full py-1 px-3 text-sm font-medium ${
                                                            transaction.transaction_type === 'credit' 
                                                                ? 'bg-success text-white' 
                                                                : 'bg-meta-3 text-white'
                                                        }`}>
                                                            {transaction.transaction_type === 'credit' ? 'Payment' : 'Advance'}
                                                        </span>
                                                    </td>
                                                    <td className="border-b border-[#eee] px-4 py-4 dark:border-strokedark">
                                                        ₹{Number(transaction.amount).toFixed(2)}
                                                    </td>
                                                    <td className="border-b border-[#eee] px-4 py-4 dark:border-strokedark">
                                                        {new Date(transaction.created_at).toLocaleString()}
                                                    </td>
                                                    <td className="border-b border-[#eee] px-4 py-4 dark:border-strokedark">
                                                        {transaction.receipt_url ? (
                                                            <button
                                                                className="text-primary hover:underline"
                                                                onClick={() => {
                                                                    setSelectedTransaction(transaction);
                                                                    setShowModal(true);
                                                                }}
                                                            >
                                                                View Receipt
                                                            </button>
                                                        ) : (
                                                            <span className="text-gray-400">No Receipt</span>
                                                        )}
                                                    </td>
                                                    <td className="border-b border-[#eee] px-4 py-4 dark:border-strokedark">
                                                        {transaction.comments || '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-gray-500">No transactions found for this purchase</p>
                                </div>
                            )
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-500">Select a purchase to view its transactions</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Receipt Modal */}
            {showModal && (
                <ReceiptModal
                    transaction={selectedTransaction}
                    onClose={() => setShowModal(false)}
                />
            )}
        </DefaultLayoutPegawai>
    );
};

export default DashboardPegawai;
