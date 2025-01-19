import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DefaultLayoutAdmin from "../../../layout/DefaultLayoutAdmin";
import { BreadcrumbAdmin, ButtonOne } from "../../../components";
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../services/api';
import { LOAN_ENDPOINTS, USER_ENDPOINTS, TRANSACTION_ENDPOINTS } from '../../../constants/apiEndpoints';
import toast from 'react-hot-toast';

const LoanDetails = () => {
  const { loanId } = useParams();
  const { state, dispatch } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loanDetails, setLoanDetails] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transaction, setTransaction] = useState({
    amount: "",
    date: "",
    image: null,
    comments: ""
  });

  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(ITEMS_PER_PAGE);

  // Fetch loan and related data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch loan details
        const loanResponse = await api.get(LOAN_ENDPOINTS.DETAILS(loanId));
        setLoanDetails(loanResponse.data);

        // Fetch customer details using constant endpoint
        const customerResponse = await api.get(USER_ENDPOINTS.DETAILS(loanResponse.data.customer_id));
        setCustomerDetails(customerResponse.data);

        // Fetch transactions
        const transactionsResponse = await api.get(LOAN_ENDPOINTS.GET_LOAN_TRASACTIONS(loanId));
        setTransactions(transactionsResponse.data);

      } catch (error) {
        toast.error('Failed to fetch loan details');
        console.error('Error fetching loan details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (loanId) {
      fetchData();
    }
  }, [loanId]);

  // Calculate summary data
  const summaryCards = [
    {
      title: "Total Amount Paid",
      amount: `₹${transactions?.reduce((sum, t) => sum + parseFloat(t.amount), 0).toFixed(2)}`,
      bgColor: "bg-success/10",
      textColor: "text-success",
    },
    {
      title: "Balance Remaining",
      amount: `₹${loanDetails?.remaining_balance || 0}`,
      bgColor: "bg-danger/10",
      textColor: "text-danger",
    },
    {
      title: "Total Interest",
      amount: `₹${(parseFloat(loanDetails?.loan_amount || 0) * 0.1).toFixed(2)}`,
      bgColor: "bg-warning/10",
      textColor: "text-warning",
    },
  ];

  // Reset transaction form
  const resetTransactionForm = () => {
    setTransaction({
      amount: "",
      date: "",
      image: null,
      comments: "",
      transaction_type: "credit"
    });

    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Refresh transaction data
  const refreshTransactionData = async () => {
    try {
      const [transactionsResponse, loanResponse] = await Promise.all([
        api.get(LOAN_ENDPOINTS.GET_LOAN_TRASACTIONS(loanId)),
        api.get(LOAN_ENDPOINTS.DETAILS(loanId))
      ]);

      setTransactions(transactionsResponse.data);
      setLoanDetails(loanResponse.data);
      
      // Reset pagination to first page
      setCurrentPage(1);
      setStartIndex(0);
      setEndIndex(ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Failed to refresh transaction data');
    }
  };

  // Handle add transaction
  const handleTransaction = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Adding transaction...');

    try {
      const formData = new FormData();
      
      // Add required fields
      formData.append('loan_id', loanId);
      formData.append('customer_id', state.user.user_id);
      formData.append('amount', transaction.amount);
      formData.append('transaction_type', 'credit');
      
      // Add optional fields
      formData.append('date', transaction.date);
      formData.append('comments', transaction.comments);
      if (transaction.image) {
        formData.append('receipt', transaction.image);
      }

      // Make API call using constant endpoint
      await api.post(TRANSACTION_ENDPOINTS.CREATE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Refresh data and reset form
      await refreshTransactionData();
      resetTransactionForm();

      toast.success('Transaction added successfully', {
        id: loadingToast,
      });
    } catch (error) {
      console.error('Transaction error:', error);
      toast.error(error.response?.data?.message || 'Failed to add transaction', {
        id: loadingToast,
      });
    }
  };

  // Pagination handlers
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      setStartIndex(prev => prev - ITEMS_PER_PAGE);
      setEndIndex(prev => prev - ITEMS_PER_PAGE);
    }
  };

  const goToNextPage = () => {
    if (currentPage < Math.ceil(transactions.length / ITEMS_PER_PAGE)) {
      setCurrentPage(prev => prev + 1);
      setStartIndex(prev => prev + ITEMS_PER_PAGE);
      setEndIndex(prev => prev + ITEMS_PER_PAGE);
    }
  };

  // Modal component for viewing receipts
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
            <p className="text-sm font-medium">Transaction ID: {transaction.id}</p>
            <p className="text-sm font-medium">Date: {transaction.date}</p>
            <p className="text-sm font-medium">Amount: ${transaction.amount}</p>
            <p className="text-sm font-medium">Comments: {transaction.comments}</p>
          </div>
          <div className="flex justify-center">
            <img
              src={transaction.receipt}
              alt="Receipt"
              className="max-h-[500px] rounded-lg object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );

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
      <BreadcrumbAdmin pageName="Loan Details" />

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {summaryCards.map((card, index) => (
          <div key={index} className={`rounded-lg p-4 ${card.bgColor}`}>
            <h3 className="text-sm font-medium">{card.title}</h3>
            <p className={`text-2xl font-bold ${card.textColor}`}>
              {card.amount}
            </p>
          </div>
        ))}
      </div>

      {/* Customer & Loan Details */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Customer Details */}
        <div className="rounded-lg bg-white p-6 shadow-default dark:bg-boxdark">
          <h2 className="mb-4 text-xl font-semibold">Customer Details</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Customer ID</label>
              <input
                type="text"
                className="w-full rounded-md border border-stroke p-3 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                value={customerDetails?.user_id || ''}
                disabled
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Customer Name</label>
              <input
                type="text"
                className="w-full rounded-md border border-stroke p-3 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                value={customerDetails?.username || ''}
                disabled
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                type="text"
                className="w-full rounded-md border border-stroke p-3 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                value={customerDetails?.email || ''}
                disabled
              />
            </div>
          </div>
        </div>

        {/* Loan Details */}
        <div className="rounded-lg bg-white p-6 shadow-default dark:bg-boxdark">
          <h2 className="mb-4 text-xl font-semibold">Loan Details</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Loan ID</label>
              <input
                type="text"
                className="w-full rounded-md border border-stroke p-3 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                value={loanDetails?.loan_id || ''}
                disabled
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Loan Amount</label>
              <input
                type="text"
                className="w-full rounded-md border border-stroke p-3 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                value={`₹${loanDetails?.loan_amount || 0}`}
                disabled
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Status</label>
              <input
                type="text"
                className="w-full rounded-md border border-stroke p-3 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                value={loanDetails?.status || ''}
                disabled
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Transaction Form */}
      <div className="mt-6 rounded-lg bg-white p-6 shadow-default dark:bg-boxdark">
        <h2 className="mb-4 text-xl font-semibold">Add Transaction</h2>
        <form onSubmit={handleTransaction} id="transactionForm">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Amount</label>
              <input
                type="number"
                className="w-full rounded-md border border-stroke p-3 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                value={transaction.amount}
                onChange={(e) => setTransaction({ ...transaction, amount: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Date</label>
              <input
                type="date"
                className="w-full rounded-md border border-stroke p-3 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                value={transaction.date}
                onChange={(e) => setTransaction({ ...transaction, date: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Upload Receipt</label>
              <input
                type="file"
                className="w-full rounded-md border border-stroke p-3 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                onChange={(e) => setTransaction({ ...transaction, image: e.target.files[0] })}
                accept="image/*"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Comments</label>
              <input
                type="text"
                className="w-full rounded-md border border-stroke p-3 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                value={transaction.comments}
                onChange={(e) => setTransaction({ ...transaction, comments: e.target.value })}
              />
            </div>
            <div className="md:col-span-2 flex gap-4">
              <ButtonOne type="submit">
                Add Transaction
              </ButtonOne>
              <ButtonOne type="button" onClick={resetTransactionForm}>
                Reset Form
              </ButtonOne>
            </div>
          </div>
        </form>
      </div>

      {/* Transaction History */}
      <div className="mt-6 rounded-lg bg-white p-6 shadow-default dark:bg-boxdark">
        <h2 className="mb-4 text-xl font-semibold">Transaction History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-2 dark:bg-meta-4">
                <th className="px-4 py-4 text-left">Transaction ID</th>
                <th className="px-4 py-4 text-left">Date</th>
                <th className="px-4 py-4 text-left">Amount</th>
                <th className="px-4 py-4 text-left">Receipt</th>
                <th className="px-4 py-4 text-left">Comments</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(startIndex, endIndex).map((transaction, index) => (
                <tr key={transaction.id || index}>
                  <td className="border-b border-[#eee] px-4 py-4 dark:border-strokedark">
                    {transaction.id}
                  </td>
                  <td className="border-b border-[#eee] px-4 py-4 dark:border-strokedark">
                    {transaction.date}
                  </td>
                  <td className="border-b border-[#eee] px-4 py-4 dark:border-strokedark">
                  ₹{transaction.amount}
                  </td>
                  <td className="border-b border-[#eee] px-4 py-4 dark:border-strokedark">
                    <button
                      className="text-primary hover:underline"
                      onClick={() => {
                        setSelectedTransaction(transaction);
                        setShowModal(true);
                      }}
                    >
                      View Receipt
                    </button>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-4 dark:border-strokedark">
                    {transaction.comments}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="rounded-lg border border-primary px-4 py-2 text-primary hover:bg-primary hover:text-white disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {Math.ceil(transactions.length / ITEMS_PER_PAGE)}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === Math.ceil(transactions.length / ITEMS_PER_PAGE)}
            className="rounded-lg border border-primary px-4 py-2 text-primary hover:bg-primary hover:text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Receipt Modal */}
      {showModal && (
        <ReceiptModal
          transaction={selectedTransaction}
          onClose={() => setShowModal(false)}
        />
      )}
    </DefaultLayoutAdmin>
  );
};

export default LoanDetails;