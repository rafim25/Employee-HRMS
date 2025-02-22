import React, { useState, useEffect } from 'react';
import DefaultLayoutAdmin from '../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin } from '../../../components';
import { FaFileExcel, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../../utils/formatCurrency';

const TransactionReport = () => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const fetchTransactions = async () => {
    if (!fromDate || !toDate) {
      toast.error('Please select both From and To dates');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`/api/transactions/report?fromDate=${fromDate}&toDate=${toDate}`);
      setTransactions(response.data);
      toast.success('Transactions fetched successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch transactions';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
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
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Date
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Transaction ID
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Customer Name
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Amount
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Type
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Status
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Comments
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
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
                transactions.map((transaction) => (
                  <tr key={transaction.transaction_id}>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {transaction.transaction_id}
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DefaultLayoutAdmin>
  );
};

export default TransactionReport; 