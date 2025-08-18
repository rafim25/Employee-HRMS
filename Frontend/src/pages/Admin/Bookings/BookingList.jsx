import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultLayoutAdmin from '../../../layout/DefaultLayoutAdmin';
import { toast } from 'react-hot-toast';
import { FaCheck, FaTimes, FaEllipsisV, FaEye } from 'react-icons/fa';
import Pagination from '../../../components/molecules/Pagination/Pagination';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [confirmationNotes, setConfirmationNotes] = useState('');
  const [cancellationNotes, setCancellationNotes] = useState('');
  const [showActionsDropdown, setShowActionsDropdown] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    bookingId: '',
    startDate: '',
    endDate: ''
  });
  const itemsPerPage = 8;
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowActionsDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bookings');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched bookings:', data);
      setBookings(data);
      setFilteredBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleViewBooking = (bookingId) => {
    navigate(`/admin/bookings/${bookingId}`);
  };

  const handleConfirmBooking = (booking) => {
    setSelectedBooking(booking);
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      const response = await fetch(`/api/bookings/${selectedBooking.booking_id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'confirmed',
          notes: confirmationNotes
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to confirm booking');
      }

      toast.success('Booking confirmed successfully');
      setShowConfirmModal(false);
      setConfirmationNotes('');
      fetchBookings(); // Refresh the bookings list
    } catch (error) {
      console.error('Error confirming booking:', error);
      toast.error('Failed to confirm booking');
    }
  };

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleCancelSubmit = async () => {
    try {
      const response = await fetch(`/api/bookings/${selectedBooking.booking_id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'cancelled',
          notes: cancellationNotes
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      toast.success('Booking cancelled successfully');
      setShowCancelModal(false);
      setCancellationNotes('');
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  // Filter bookings based on criteria
  const filterBookings = () => {
    let filtered = [...bookings];

    // Filter by booking ID
    if (filters.bookingId) {
      filtered = filtered.filter(booking =>
        booking.booking_id.toString().toLowerCase().includes(filters.bookingId.toLowerCase())
      );
    }

    // Filter by date range
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      filtered = filtered.filter(booking =>
        new Date(booking.check_in_date) >= startDate
      );
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59); // Set to end of day
      filtered = filtered.filter(booking =>
        new Date(booking.check_out_date) <= endDate
      );
    }

    setFilteredBookings(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Apply filters when filter values change
  useEffect(() => {
    filterBookings();
  }, [filters, bookings]);

  // Calculate paginated data
  const getPaginatedBookings = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredBookings.slice(startIndex, endIndex);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setShowActionsDropdown(null); // Close any open dropdowns
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      bookingId: '',
      startDate: '',
      endDate: ''
    });
  };

  if (loading) {
    return (
      <DefaultLayoutAdmin>
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white mb-6">Booking Management</h2>
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="flex justify-center items-center h-32">
              <p className="text-gray-500">Loading bookings...</p>
            </div>
          </div>
        </div>
      </DefaultLayoutAdmin>
    );
  }

  return (
    <DefaultLayoutAdmin>
      <div className="mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-black">Booking Management</h1>
          <button
            onClick={() => navigate('/admin/bookings/add-booking')}
            className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90"
          >
            Add New Booking
          </button>
        </div>

        {/* Filter Section */}
        <div className="mb-6 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Filter Bookings</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                Booking ID
              </label>
              <input
                type="text"
                value={filters.bookingId}
                onChange={(e) => handleFilterChange('bookingId', e.target.value)}
                placeholder="Enter booking ID"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full rounded border border-stroke py-2 px-4 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
              >
                Clear Filters
              </button>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </div>
        </div>
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto py-4">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="py-4 px-4 font-medium text-black dark:text-white">Booking ID</th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">Room Number</th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">Room Type</th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">Check-in</th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">Check-out</th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">Guests</th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">No bookings found</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                          Get started by creating your first booking.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  getPaginatedBookings().map((booking) => (
                    <tr key={booking.booking_id}>
                      <td className="border-b text-black border-[#eee] py-5 px-4 dark:border-strokedark">{booking.booking_id}</td>
                      <td className="border-b text-black border-[#eee] py-5 px-4 dark:border-strokedark">{booking.room?.room_number || 'N/A'}</td>
                      <td className="border-b text-black border-[#eee] py-5 px-4 dark:border-strokedark">{booking.room?.room_type || 'N/A'}</td>
                      <td className="border-b text-black border-[#eee] py-5 px-4 dark:border-strokedark">{new Date(booking.check_in_date).toLocaleDateString()}</td>
                      <td className="border-b text-black border-[#eee] py-5 px-4 dark:border-strokedark">{new Date(booking.check_out_date).toLocaleDateString()}</td>
                      <td className="border-b text-black border-[#eee] py-5 px-4 dark:border-strokedark">{booking.number_of_guests}</td>
                      <td className="border-b text-black border-[#eee] py-5 px-4 dark:border-strokedark">
                        <span className={`px-2 inline-flex text-md leading-5 rounded-full ${booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : booking.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center space-x-3.5">
                          <button onClick={() => handleViewBooking(booking.booking_id)}>
                            <FaEye className="text-success text-xl hover:text-black dark:hover:text-white" />
                          </button>
                          {booking.status === 'pending' && (
                            <>
                              <button onClick={() => handleConfirmBooking(booking)}>
                                <FaCheck className="text-primary text-xl hover:text-black dark:hover:text-white" />
                              </button>
                              <button onClick={() => handleCancelBooking(booking)}>
                                <FaTimes className="text-danger text-xl hover:text-black dark:hover:text-white" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {/* Pagination */}
            {filteredBookings.length > 0 && (
              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredBookings.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  showingText="Showing bookings"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Booking</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirmation Notes</label>
              <textarea
                value={confirmationNotes}
                onChange={(e) => setConfirmationNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Add any notes about the confirmation..."
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmationNotes('');
                }}
                className="px-4 py-2 "
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-md bg-green-700"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Cancel Booking</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Notes</label>
              <textarea
                value={cancellationNotes}
                onChange={(e) => setCancellationNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Add any notes about the cancellation..."
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancellationNotes('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCancelSubmit}
                className="px-4 py-2 bg-[#EF4444] text-white rounded-md hover:bg-[#DC2626]"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </DefaultLayoutAdmin>
  );
};

export default BookingList; 