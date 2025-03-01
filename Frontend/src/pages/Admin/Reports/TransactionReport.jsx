import React, { useState } from 'react';
import DefaultLayoutAdmin from '../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin } from '../../../components';
import { FaFileExcel, FaSearch, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../../utils/formatCurrency';

const ITEMS_PER_PAGE = 7;

const TransactionReport = () => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'created_at',
    direction: 'desc'
  });

  const fetchTransactions = async () => {
    if (!fromDate || !toDate) {
      toast.error('Please select both From and To dates');
      return;
    }

    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    endDate.setHours(23, 59, 59);

    if (startDate > endDate) {
      toast.error('From date cannot be later than To date');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`/api/transactions/report?fromDate=${fromDate}&toDate=${toDate}`);
      setTransactions(response.data);
      if (response.data.length === 0) {
        toast.error('No transactions found for the selected date range');
      }
    } catch (error) {
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig((prevSort) => ({
      key,
      direction: prevSort.key === key && prevSort.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Render sort icon
  const renderSortIcon = (columnKey) => {
    if (sortConfig.key === columnKey) {
      return sortConfig.direction === 'asc' ? 
        <FaSortUp className="inline ml-1 text-primary" /> : 
        <FaSortDown className="inline ml-1 text-primary" />;
    }
    return <FaSort className="inline ml-1 text-gray-400 hover:text-primary" />;
  };

  // Sort and paginate transactions
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortConfig.key === 'customer_name') {
      const aName = a.customer?.username || '';
      const bName = b.customer?.username || '';
      return sortConfig.direction === 'asc' 
        ? aName.localeCompare(bName)
        : bName.localeCompare(aName);
    }
    if (sortConfig.key === 'loan_id') {
      return sortConfig.direction === 'asc'
        ? a.loan_id.localeCompare(b.loan_id)
        : b.loan_id.localeCompare(a.loan_id);
    }
    if (sortConfig.key === 'created_at') {
      return sortConfig.direction === 'asc'
        ? new Date(a.created_at) - new Date(b.created_at)
        : new Date(b.created_at) - new Date(a.created_at);
    }
    // Default sort by created_at
    return sortConfig.direction === 'asc'
      ? new Date(a.created_at) - new Date(b.created_at)
      : new Date(b.created_at) - new Date(a.created_at);
  });

  // Pagination calculations
  const totalPages = Math.ceil(sortedTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTransactions = sortedTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

  const handleDownloadExcel = async () => {
    if (!fromDate || !toDate) {
      toast.error('Please select both From and To dates');
      return;
    }

    try {
      const response = await axios.get(
        `/api/transactions/download?fromDate=${fromDate}&toDate=${toDate}`,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transactions_${fromDate}_to_${toDate}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Report downloaded successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to download report';
      toast.error(errorMessage);
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
      <BreadcrumbAdmin pageName="Transaction Report" />

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap items-center gap-3">
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
              onClick={fetchTransactions}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              <FaSearch className="text-lg" />
              {loading ? 'Loading...' : 'Search'}
            </button>
            <button
              onClick={handleDownloadExcel}
              disabled={loading || transactions.length === 0}
              className="inline-flex items-center justify-center gap-2.5 rounded-md bg-success py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              <FaFileExcel className="text-lg" />
              Download Excel
            </button>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th onClick={() => handleSort('loan_id')}
                    className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer hover:bg-gray-1 dark:hover:bg-meta-3">
                  Purchase ID {renderSortIcon('loan_id')}
                </th>
                <th onClick={() => handleSort('customer_name')}
                    className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer hover:bg-gray-1 dark:hover:bg-meta-3">
                  Customer Name {renderSortIcon('customer_name')}
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Amount
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Type
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Status
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Comments
                </th>
                <th onClick={() => handleSort('created_at')}
                    className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer hover:bg-gray-1 dark:hover:bg-meta-3">
                  Created At {renderSortIcon('created_at')}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">
                        No transactions found
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        Select a date range and click search to view transactions
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((transaction) => (
                  <tr key={transaction.transaction_id}>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {transaction.loan_id}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {transaction.customer?.username || 'N/A'}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {formatCurrency(transaction.amount)}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                        transaction.transaction_type === 'credit'
                          ? 'bg-success/10 text-success'
                          : 'bg-danger/10 text-danger'
                      }`}>
                        {transaction.transaction_type}
                      </span>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <span className="inline-block rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary">
                        {transaction.status || 'Completed'}
                      </span>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {transaction.comments || '-'}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                      {new Date(transaction.created_at).toISOString().split('T')[0]}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-gray-5 dark:text-gray-4 text-sm py-4">
              {paginatedTransactions.length > 0 ? (
                `Showing ${startIndex + 1}-${Math.min(startIndex + ITEMS_PER_PAGE, sortedTransactions.length)} of ${sortedTransactions.length} Transactions`
              ) : (
                'No transactions to display'
              )}
            </span>
          </div>
          {paginatedTransactions.length > 0 && (
            <div className="flex space-x-2 py-4">
              <button
                disabled={currentPage === 1}
                onClick={goToPrevPage}
                className="py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50"
              >
                Prev
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={goToNextPage}
                className="py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </DefaultLayoutAdmin>
  );
};

export default TransactionReport; 