import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaCalendar, FaUser, FaHotel, FaMoneyBillWave, FaSpinner, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import axios from 'axios';
import toast from "react-hot-toast";
import TopNavigation from '../../components/molecules/TopNavigation/index';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MyBookings = () => {
  const { state } = useAuth();
  const { user, isAuthenticated } = state;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to view your bookings');
      navigate('/reservation');
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const authData = localStorage.getItem('auth');
        const visitorId = user?.visitor_id || (authData ? JSON.parse(authData).visitor_id : null);

        if (!visitorId) {
          toast.error('Visitor ID not found. Please login again.');
          navigate('/reservation');
          return;
        }

        const response = await axios.get(`/api/visitors/${visitorId}/bookings`);
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to fetch bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated, user?.visitor_id, navigate]);

  const fetchBookingDetails = async (bookingId) => {
    try {
      setLoadingDetails(true);
      const response = await axios.get(`/api/bookings/${bookingId}`);
      setBookingDetails(prev => ({
        ...prev,
        [bookingId]: response.data
      }));
    } catch (error) {
      console.error('Error fetching booking details:', error);
      toast.error('Failed to fetch booking details. Please try again later.');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleExpandBooking = async (bookingId) => {
    if (expandedBooking === bookingId) {
      setExpandedBooking(null);
    } else {
      setExpandedBooking(bookingId);
      if (!bookingDetails[bookingId]) {
        await fetchBookingDetails(bookingId);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    console.log(price);
    if (price === null || price === undefined) return "0.00";

    const cleaned = typeof price === 'string' ? price.trim() : price;
    const num = typeof cleaned === 'number' ? cleaned : parseFloat(cleaned);

    if (isNaN(num) || !isFinite(num)) return "0.00";

    return num.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="fixed top-0 left-0 right-0 z-50">
        <TopNavigation />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="max-w-7xl mx-auto">
            {/* Page Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12 mt-16"
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                My Bookings
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                View and manage your upcoming stays
              </p>
            </motion.div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-4xl text-primary" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 text-center">
                <p className="text-xl text-white">You haven't made any bookings yet.</p>
                <button
                  onClick={() => navigate('/reservation')}
                  className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Book Now
                </button>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <table className="w-full bg-white/10 backdrop-blur-md rounded-lg border border-[#CA8E46] border-opacity-50">
                    <thead>
                      <tr className="border-b-2 border-[#CA8E46] border-opacity-50">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Booking ID</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Room Type</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Check-in</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Check-out</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Guests</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Total Price</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Booking Status</th>
                        {/* <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Payment Status</th> */}
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#CA8E46] divide-opacity-50">
                      {bookings.map((booking) => (
                        <React.Fragment key={booking.booking_id}>
                          <tr className="hover:bg-[#CA8E46]/10 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{booking.booking_id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-white">{booking.room.room_type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-white">{formatDate(booking.check_in_date)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-white">{formatDate(booking.check_out_date)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-white">{booking.number_of_guests}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{formatPrice(booking.total_price)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center justify-center ${booking.status === 'confirmed'
                                ? 'bg-[#4CAF50]/20 text-[#4CAF50] border border-[#4CAF50]'
                                : booking.status === 'cancelled'
                                  ? 'bg-[#F44336]/20 text-[#F44336] border border-[#F44336]'
                                  : 'bg-[#FFA726]/20 text-[#FFA726] border border-[#FFA726]'
                                }`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </td>
                            {/* <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center justify-center ${booking.payment_status === 'paid'
                                ? 'bg-[#4CAF50]/20 text-[#4CAF50] border border-[#4CAF50]'
                                : booking.payment_status === 'pending_checkin'
                                  ? 'bg-[#FFA726]/20 text-[#FFA726] border border-[#FFA726]'
                                  : booking.payment_status === 'failed'
                                    ? 'bg-[#F44336]/20 text-[#F44336] border border-[#F44336]'
                                    : 'bg-[#9E9E9E]/20 text-[#9E9E9E] border border-[#9E9E9E]'
                                }`}>
                                {booking.payment_status.split('_').map(word =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ')}
                              </span>
                            </td> */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => handleExpandBooking(booking.booking_id)}
                                className="flex items-center gap-2 text-[#CA8E46] hover:text-[#CA8E46]/80 transition-colors px-3 py-1 rounded-md"
                              >
                                {expandedBooking === booking.booking_id ? (
                                  <>
                                    <span>Hide Details</span>
                                    <FaChevronUp />
                                  </>
                                ) : (
                                  <>
                                    <span>View Details</span>
                                    <FaChevronDown />
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                          {expandedBooking === booking.booking_id && (
                            <tr>
                              <td colSpan="9" className="px-6 py-4">
                                {loadingDetails ? (
                                  <div className="flex justify-center items-center py-4">
                                    <FaSpinner className="animate-spin text-2xl text-primary" />
                                  </div>
                                ) : bookingDetails[booking.booking_id] ? (
                                  <div className="bg-white/5 rounded-lg p-6">
                                    <h3 className="text-xl font-semibold text-white mb-4">Booking Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div className="space-y-4">
                                        <div>
                                          <h4 className="text-sm font-medium text-gray-400 text-[#CA8E46]">Room Details</h4>
                                          <p className="text-white">Type: {bookingDetails[booking.booking_id].room.room_type}</p>
                                          <p className="text-white">Capacity: {bookingDetails[booking.booking_id].room.capacity} guests</p>
                                          <p className="text-white">
                                            Price per night: {
                                              bookingDetails[booking.booking_id].room &&
                                                bookingDetails[booking.booking_id].final_price !== undefined
                                                ? formatPrice(bookingDetails[booking.booking_id].final_price)
                                                : "N/A"
                                            }
                                          </p>
                                        </div>
                                        <div>
                                          <h4 className="text-sm font-medium text-gray-400 text-[#CA8E46]">Booking Information</h4>
                                          <p className="text-white">Booking ID: {bookingDetails[booking.booking_id].booking_id}</p>
                                          <p className="text-white">Status: {bookingDetails[booking.booking_id].status}</p>
                                          <p className="text-white">Created at: {formatDate(bookingDetails[booking.booking_id].createdAt)}</p>
                                        </div>
                                      </div>
                                      <div className="space-y-4">
                                        <div>
                                          <h4 className="text-sm font-medium text-gray-400 text-[#CA8E46]">Payment Information</h4>
                                          <p className="text-white">Total Price: {formatPrice(bookingDetails[booking.booking_id].total_price)}</p>
                                          <p className="text-white">Final Price: {formatPrice(bookingDetails[booking.booking_id].final_price)}</p>
                                          <p className="text-white">Payment Status: {bookingDetails[booking.booking_id].payment_status}</p>
                                        </div>
                                        <div>
                                          <h4 className="text-sm font-medium text-gray-400 text-[#CA8E46]">Guest Information</h4>
                                          <p className="text-white">Number of Guests: {bookingDetails[booking.booking_id].number_of_guests}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center text-red-500">Failed to load booking details</div>
                                )}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookings; 