import React, { useEffect, useState } from 'react';
import DefaultLayoutAdmin from '../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { FaBed, FaUsers, FaMoneyBillWave, FaCalendarCheck, FaFilter } from 'react-icons/fa';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

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

const BookingDashboard = () => {
  const { dispatch, state } = useAuth();
  const [bookingData, setBookingData] = useState({
    today: {
      totalBookings: 0,
      totalRevenue: 0,
      availableRooms: 0,
      occupiedRooms: 0,
      totalVisitors: 0
    },
    historical: {
      totalBookings: 0,
      totalRevenue: 0,
      totalVisitors: 0,
      monthlyBookings: {
        labels: [],
        data: []
      },
      roomTypes: {
        labels: [],
        data: []
      },
      recentBookings: [],
      totalRegisteredVisitors: 0,
      bookingStatus: {
        confirmed: 0,
        pending: 0,
        cancelled: 0
      }
    }
  });
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate.toISOString());
      if (endDate) params.append('endDate', endDate.toISOString());

      const response = await axios.get(`/api/hotel-dashboard/stats?${params.toString()}`);
      setBookingData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [startDate, endDate]);

  const monthlyBookingsData = {
    labels: bookingData.historical.monthlyBookings.labels,
    datasets: [{
      label: 'Monthly Bookings',
      data: bookingData.historical.monthlyBookings.data,
      backgroundColor: '#3B82F6',
    }]
  };

  const roomTypesData = {
    labels: bookingData.historical.roomTypes.labels,
    datasets: [{
      data: bookingData.historical.roomTypes.data,
      backgroundColor: [
        '#3B82F6',
        '#10B981',
        '#F59E0B',
        '#6366F1'
      ],
    }]
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <DefaultLayoutAdmin>
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DefaultLayoutAdmin>
    );
  }

  return (
    <DefaultLayoutAdmin>
      <BreadcrumbAdmin pageName='Booking Dashboard' backButton={false} />

      {/* Date Filter */}
      <div className="mb-4 flex items-center gap-4 bg-white p-4 rounded-sm border border-stroke dark:border-strokedark dark:bg-boxdark">
        <FaFilter className="text-primary" />
        <div className="flex items-center gap-2">
          <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
            className="rounded border border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          <span>to</span>
          <DatePicker
            selected={endDate}
            onChange={date => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            placeholderText="End Date"
            className="rounded border border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          <button
            className="ml-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition-colors"
            onClick={() => { setStartDate(null); setEndDate(null); }}
            type="button"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Today's Overview */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-black dark:text-white mb-4">Today's Overview</h2>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-5 2xl:gap-7.5'>
          {/* Today's Bookings Card */}
          <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <FaCalendarCheck className="fill-primary dark:fill-white" />
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  {bookingData.today.totalBookings}
                </h4>
                <span className="text-sm font-medium">Today's Bookings</span>
              </div>
            </div>
          </div>

          {/* Today's Revenue Card */}
          <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <FaMoneyBillWave className="fill-primary dark:fill-white" />
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  ₹{bookingData.today.totalRevenue}
                </h4>
                <span className="text-sm font-medium">Today's Revenue</span>
              </div>
            </div>
          </div>

          {/* Available Rooms Card */}
          <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <FaBed className="fill-success" />
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  {bookingData.today.availableRooms}
                </h4>
                <span className="text-sm font-medium">Available Rooms</span>
              </div>
            </div>
          </div>

          {/* Occupied Rooms Card */}
          <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <FaUsers className="fill-warning" />
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  {bookingData.today.occupiedRooms}
                </h4>
                <span className="text-sm font-medium">Occupied Rooms</span>
              </div>
            </div>
          </div>

          {/* Today's Visitors Card */}
          <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <FaUsers className="fill-primary dark:fill-white" />
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  {bookingData.today.totalVisitors}
                </h4>
                <span className="text-sm font-medium">Today's Visitors</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Data */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-black dark:text-white mb-4">Historical Data</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-5 2xl:gap-7.5">
          {/* Total Registered Visitors Card */}
          <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <FaUsers className="fill-primary dark:fill-white" />
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  {bookingData.historical.totalRegisteredVisitors}
                </h4>
                <span className="text-sm font-medium">Total Registered Visitors</span>
              </div>
            </div>
          </div>

          {/* Overall Revenue Card */}
          <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <FaMoneyBillWave className="fill-primary dark:fill-white" />
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  ₹{bookingData.historical.totalRevenue}
                </h4>
                <span className="text-sm font-medium">Overall Revenue</span>
              </div>
            </div>
          </div>

          {/* Confirmed Bookings Card */}
          <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-success/10">
              <FaCalendarCheck className="fill-success" />
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  {bookingData.historical.bookingStatus.confirmed}
                </h4>
                <span className="text-sm font-medium">Confirmed Bookings</span>
              </div>
            </div>
          </div>

          {/* Pending Bookings Card */}
          <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-warning/10">
              <FaCalendarCheck className="fill-warning" />
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  {bookingData.historical.bookingStatus.pending}
                </h4>
                <span className="text-sm font-medium">Pending Bookings</span>
              </div>
            </div>
          </div>

          {/* Cancelled Bookings Card */}
          <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-danger/10">
              <FaCalendarCheck className="fill-danger" />
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  {bookingData.historical.bookingStatus.cancelled}
                </h4>
                <span className="text-sm font-medium">Cancelled Bookings</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        {/* Monthly Bookings Chart */}
        <div className="col-span-12 xl:col-span-8">
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
              Monthly Bookings
            </h4>
            <Bar data={monthlyBookingsData} options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false
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

        {/* Room Types Distribution Chart */}
        <div className="col-span-12 xl:col-span-4">
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
              Room Types Distribution
            </h4>
            <Pie data={roomTypesData} options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    usePointStyle: true,
                    padding: 20
                  }
                }
              }
            }} />
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-7">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
              Recent Bookings
            </h4>
            <div className="flex flex-col gap-4">
              {bookingData.historical.recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between border-b border-stroke pb-4 dark:border-strokedark">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center ${booking.status === 'confirmed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                      <FaCalendarCheck />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black dark:text-white">
                        {booking.guestName} - {booking.roomType}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(booking.checkIn)} to {formatDate(booking.checkOut)}
                      </p>
                      <p className="text-xs text-gray-400">
                        Booked on: {formatDate(booking.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${booking.status === 'confirmed' ? 'text-success' : 'text-warning'}`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DefaultLayoutAdmin>
  );
};

export default BookingDashboard; 