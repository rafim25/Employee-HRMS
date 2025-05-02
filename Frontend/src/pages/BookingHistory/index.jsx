import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  FaCalendar,
  FaHotel,
  FaUsers,
  FaRupeeSign,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaFilter,
  FaSort,
  FaDownload,
  FaTrash,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import TopNavigation from '../../components/molecules/TopNavigation/index';
import Footer from '../../components/molecules/Footer';
import { format } from 'date-fns';

const BookingHistory = () => {
  const { state, dispatch } = useAuth();
  const { user, isAuthenticated } = state;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    sortBy: 'newest'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/bookings/visitor/${user?.visitor_id}`);
        setBookings(response.data);
      } catch (err) {
        setError('Failed to fetch booking history');
        toast.error('Failed to load your booking history');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.visitor_id) {
      fetchBookings();
    }
  }, [isAuthenticated, user]);

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd MMM yyyy');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { color: 'bg-green-100 text-green-800', icon: <FaCheck /> },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <FaSpinner className="animate-spin" /> },
      cancelled: { color: 'bg-red-100 text-red-800', icon: <FaTimes /> }
    };

    const config = statusConfig[status.toLowerCase()] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.icon}
        <span className="ml-2 capitalize">{status}</span>
      </span>
    );
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await axios.put(`/api/bookings/${bookingId}/cancel`);
      toast.success('Booking cancelled successfully');
      setBookings(bookings.map(booking =>
        booking.booking_id === bookingId
          ? { ...booking, payment_status: 'cancelled' }
          : booking
      ));
    } catch (err) {
      toast.error('Failed to cancel booking');
    }
  };

  const handleDownloadReceipt = async (bookingId) => {
    try {
      const response = await axios.get(`/api/bookings/${bookingId}/receipt`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `booking-receipt-${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error('Failed to download receipt');
    }
  };

  const filteredBookings = bookings
    .filter(booking => {
      if (filters.status === 'all') return true;
      return booking.payment_status.toLowerCase() === filters.status;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'newest') {
        return new Date(b.check_in_date) - new Date(a.check_in_date);
      }
      return new Date(a.check_in_date) - new Date(b.check_in_date);
    });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNavigation />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Please Login to View Booking History</h1>
            <p className="text-gray-600 mb-8">You need to be logged in to view your booking history.</p>
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Login Now
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Booking History</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <FaFilter />
            <span>Filters</span>
            {showFilters ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-lg shadow-md p-4 mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="all">All Status</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-4xl text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No bookings found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredBookings.map((booking) => (
              <motion.div
                key={booking.booking_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {booking.room?.room_type || 'Room Booking'}
                      </h3>
                      <p className="text-gray-600">Booking ID: {booking.booking_id}</p>
                    </div>
                    {getStatusBadge(booking.payment_status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <FaCalendar className="mr-2 text-primary" />
                      <span>{formatDate(booking.check_in_date)} - {formatDate(booking.check_out_date)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaUsers className="mr-2 text-primary" />
                      <span>{booking.number_of_guests} Guests</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaRupeeSign className="mr-2 text-primary" />
                      <span>{booking.total_price}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-medium text-gray-900">Room Details</h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDownloadReceipt(booking.booking_id)}
                          className="p-2 text-gray-600 hover:text-primary transition-colors"
                          title="Download Receipt"
                        >
                          <FaDownload />
                        </button>
                        {booking.payment_status.toLowerCase() !== 'cancelled' && (
                          <button
                            onClick={() => handleCancelBooking(booking.booking_id)}
                            className="p-2 text-red-600 hover:text-red-700 transition-colors"
                            title="Cancel Booking"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Room Type:</span> {booking.room?.room_type}
                      </div>
                      <div>
                        <span className="font-medium">Room Number:</span> {booking.room?.room_number}
                      </div>
                      <div>
                        <span className="font-medium">Floor:</span> {booking.room?.floor}
                      </div>
                      <div>
                        <span className="font-medium">Capacity:</span> {booking.room?.capacity}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BookingHistory; 