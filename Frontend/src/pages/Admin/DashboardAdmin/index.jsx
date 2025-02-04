import React,{useEffect, useCallback} from 'react';
import DefaultLayoutAdmin from '../../../layout/DefaultLayoutAdmin';
import { CardOne, CardTwo, CardThree, CardFour, CardFive, ChartOne, ChartTwo, BreadcrumbAdmin } from '../../../components';
import { useAuth } from '../../../context/AuthContext';
import { fetchDashboardData } from '../../../context/actions/dashboardActions';

const DashboardAdmin = () => {
  const { dispatch, state } = useAuth();

  const loadDashboardData = useCallback(() => {
    fetchDashboardData(dispatch);
  }, [dispatch]);

  useEffect(() => {
    loadDashboardData();
    // Optional: Set up refresh interval
    const interval = setInterval(loadDashboardData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [loadDashboardData]);

  return (
    <DefaultLayoutAdmin>
      <BreadcrumbAdmin pageName='Dashboard' />
      
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-5 2xl:gap-7.5'>
        <div className="xl:col-span-1">
          <CardOne />
        </div>
        <div className="xl:col-span-1">
          <CardTwo />
        </div>
        <div className="xl:col-span-1">
          <CardThree />
        </div>
        <div className="xl:col-span-1">
          <CardFour />
        </div>
        <div className="xl:col-span-1">
          <CardFive />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-8">
          <ChartOne 
            monthlyExpenses={state.dashboard?.monthlyExpenses || []}
            monthlyIncome={state.dashboard?.monthlyIncome || []}
          />
        </div>
        <div className="col-span-12 xl:col-span-4">
          <ChartTwo />
        </div>
      </div>
    </DefaultLayoutAdmin>
  );
};

export default DashboardAdmin;
