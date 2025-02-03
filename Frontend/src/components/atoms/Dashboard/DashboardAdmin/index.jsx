import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CardFour from '../../Card/CardFour';
import CardOne from '../../Card/CardOne';
import CardThree from '../../Card/CardThree';
import CardTwo from '../../Card/CardTwo';
import ChartOne from '../../Chart/ChartOne';
import ChartThree from '../../Chart/ChartThree';
import ChartTwo from '../../Chart/ChartTwo';
import TableOne from '../../Tables/TableOne';
import { toast } from 'react-hot-toast';

const DashboardAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/dashboard/stats');
      setDashboardData(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Failed to fetch dashboard data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="flex items-center justify-center w-16 h-16 mb-6">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-lg font-medium text-black dark:text-white">Loading dashboard...</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Please wait while we fetch the data</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg font-medium text-danger mb-2">Error Loading Dashboard</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardOne />
        <CardTwo />
        <CardThree />
        <CardFour />
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne 
          monthlyExpenses={dashboardData?.monthlyExpenses || []}
          monthlyIncome={dashboardData?.monthlyIncome || []}
        />
        <ChartTwo />
        <ChartThree />
        <div className="col-span-12">
          <TableOne />
        </div>
      </div>
    </>
  );
};

export default DashboardAdmin; 