import React, { useEffect, useCallback } from 'react';
import DefaultLayoutAdmin from '../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin } from '../../../components';
import { useAuth } from '../../../context/AuthContext';
import { fetchRecruitmentDashboardData } from '../../../context/actions/dashboardActions';
import { FaUsers, FaBriefcase, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// Chart imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardAdmin = () => {
  const { dispatch, state } = useAuth();

  const loadDashboardData = useCallback(() => {
    fetchRecruitmentDashboardData(dispatch);
  }, [dispatch]);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 300000);
    return () => clearInterval(interval);
  }, [loadDashboardData]);

  // Updated to use recruitmentDashboard instead of dashboard
  const statusChartData = {
    labels: state.recruitmentDashboard?.candidateStatusData?.map(item =>
      item.status.charAt(0).toUpperCase() + item.status.slice(1)
    ) || [],
    datasets: [{
      data: state.recruitmentDashboard?.candidateStatusData?.map(item => item.count) || [],
      backgroundColor: [
        '#3B82F6', '#EF4444', '#F59E0B',
        '#10B981', '#6366F1', '#22C55E',
      ],
    }]
  };

  const sourceChartData = {
    labels: state.recruitmentDashboard?.sourceDistribution?.map(item => item.source) || [],
    datasets: [{
      data: state.recruitmentDashboard?.sourceDistribution?.map(item => item.count) || [],
      backgroundColor: [
        '#3B82F6', '#10B981', '#F59E0B',
        '#6366F1', '#EF4444', '#8B5CF6', '#EC4899',
      ],
    }]
  };

  // Format date helper function
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <DefaultLayoutAdmin>
      <BreadcrumbAdmin pageName='Recruitment Dashboard' backButton={false} />

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5'>
        {/* Active Jobs Card */}
        <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <FaBriefcase className="fill-primary dark:fill-white" />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {state.recruitmentDashboard?.activeJobs || 0}
              </h4>
              <span className="text-sm font-medium">Active Jobs</span>
            </div>
          </div>
        </div>

        {/* Total Candidates Card */}
        <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <FaUsers className="fill-primary dark:fill-white" />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {state.recruitmentDashboard?.totalCandidates || 0}
              </h4>
              <span className="text-sm font-medium">Total Candidates</span>
            </div>
          </div>
        </div>

        {/* Selected Candidates Card */}
        <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <FaCheckCircle className="fill-success" />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {state.recruitmentDashboard?.selectedCandidates || 0}
              </h4>
              <span className="text-sm font-medium">Selected Candidates</span>
            </div>
          </div>
        </div>

        {/* Rejected Candidates Card */}
        <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <FaTimesCircle className="fill-danger" />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {state.recruitmentDashboard?.rejectedCandidates || 0}
              </h4>
              <span className="text-sm font-medium">Rejected Candidates</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        {/* Candidate Status Chart */}
        <div className="col-span-12 xl:col-span-8">
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
              Candidate Status Distribution
            </h4>
            <Bar data={statusChartData} options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      return `Count: ${context.raw}`;
                    }
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1
                  }
                }
              }
            }} />
          </div>
        </div>

        {/* Source Distribution Chart */}
        <div className="col-span-12 xl:col-span-4">
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
              Candidate Sources
            </h4>
            <Pie data={sourceChartData} options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    usePointStyle: true,
                    padding: 20
                  }
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const label = context.label || '';
                      const value = context.raw || 0;
                      return `${label}: ${value}`;
                    }
                  }
                }
              }
            }} />
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-7">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
              Recent Activities
            </h4>
            <div className="flex flex-col gap-4">
              {state.recruitmentDashboard?.recentActivities?.map((activity, index) => (
                <div key={index} className="flex items-center justify-between border-b border-stroke pb-4 dark:border-strokedark">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center ${activity.type === 'new_candidate' ? 'bg-primary/10 text-primary' :
                      activity.type === 'status_change' ? 'bg-success/10 text-success' :
                        'bg-warning/10 text-warning'
                      }`}>
                      {activity.type === 'new_candidate' ? <FaUsers /> : <FaCheckCircle />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black dark:text-white">
                        {activity.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DefaultLayoutAdmin>
  );
};

export default DashboardAdmin;
