import React, { useState, useEffect } from 'react';
import DefaultLayoutEmployee from '../../../layout/DefaultLayoutPegawai';
import { api } from '../../../services/api';
import {
  FaBriefcase,
  FaUsers,
  FaUserPlus,
  FaChartLine,
  FaRegClock,
  FaBuilding
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const EmployeeDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    user: {},
    stats: {
      totalJobs: 0,
      totalCandidates: 0,
      totalOpenPositions: 0,
      openPositions: 0,
      activeJobs: 0,
      pendingCandidates: 0,
      selectedCandidates: 0,
      rejectedCandidates: 0
    },
    recentActivities: [],
    openPositions: [],
    candidateStats: {
      total: 0,
      pending: 0,
      selected: 0,
      rejected: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getStatusColor = (status) => {
    const statusColors = {
      applied: 'bg-warning/10 text-warning',
      screening: 'bg-info/10 text-info',
      shortlisted: 'bg-success/10 text-success',
      interviewed: 'bg-primary/10 text-primary',
      selected: 'bg-success/10 text-success',
      rejected: 'bg-danger/10 text-danger',
      on_hold: 'bg-gray-500/10 text-gray-500'
    };

    return statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-500';
  };

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/dashboard/employee-stats');
        setDashboardData(response.data);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const { user, stats, recentActivities, openPositions, candidateStats } = dashboardData;

  // Calculate success rate
  const successRate = candidateStats.total > 0
    ? ((candidateStats.selected / candidateStats.total) * 100).toFixed(1)
    : 0;

  return (
    <DefaultLayoutEmployee>
      <div className="p-4">
        {/* User Profile Summary */}
        <div className="mb-6 bg-white rounded-lg shadow-md p-6 border border-stroke dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center gap-4">
            <img
              src={user.photo || '/default-avatar.png'}
              alt={user.name || 'User'}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold text-black dark:text-white">{user.name || user.email}</h2>
              <p className="text-sm text-gray-500">{user.designation || 'No designation'} - {user.department || 'No department'}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-stroke dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Open Positions</p>
                <h3 className="text-2xl font-bold text-black dark:text-white">
                  {stats.totalOpenPositions}
                </h3>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <FaBriefcase className="text-primary text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-stroke dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Your Jobs</p>
                <h3 className="text-2xl font-bold text-black dark:text-white">
                  {stats.totalJobs}
                </h3>
              </div>
              <div className="h-12 w-12 bg-success/10 rounded-full flex items-center justify-center">
                <FaUsers className="text-success text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-stroke dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Candidates</p>
                <h3 className="text-2xl font-bold text-black dark:text-white">
                  {stats.totalCandidates}
                </h3>
              </div>
              <div className="h-12 w-12 bg-warning/10 rounded-full flex items-center justify-center">
                <FaUserPlus className="text-warning text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-stroke dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Success Rate</p>
                <h3 className="text-2xl font-bold text-black dark:text-white">
                  {successRate}%
                </h3>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <FaChartLine className="text-primary text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Jobs and Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Open Jobs */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-stroke dark:border-strokedark dark:bg-boxdark">
            <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Open Positions</h2>
            <div className="space-y-4">
              {openPositions && openPositions.length > 0 ? (
                openPositions.map((job) => (
                  <div key={job.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <FaBuilding className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-black dark:text-white">
                        {job.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {job.type} • {job.openings} openings
                      </p>
                    </div>
                    <Link
                      to={`/employee/recruitments/job-management/details/${job.id}`}
                      className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full hover:bg-primary/20"
                    >
                      View
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No open positions available</p>
              )}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-stroke dark:border-strokedark dark:bg-boxdark">
            <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Recent Activities</h2>
            <div className="space-y-4">
              {recentActivities && recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <FaRegClock className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-black dark:text-white">
                        {activity.candidateName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.jobTitle} • {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.application_status)}`}>
                      {activity.application_status?.toUpperCase() || 'N/A'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No recent activities</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DefaultLayoutEmployee>
  );
};

export default EmployeeDashboard; 