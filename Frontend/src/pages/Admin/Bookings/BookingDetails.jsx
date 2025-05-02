import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DefaultLayoutAdmin from '../../../layout/DefaultLayoutAdmin';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/bookings/${id}`);
      setBooking(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      toast.error('Failed to fetch booking details');
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.put(`/api/admin/bookings/${id}/status`, { status: newStatus });
      toast.success(`Booking status updated to ${newStatus}`);
      fetchBookingDetails();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  const handleBack = () => {
    navigate('/admin/bookings/list');
  };

  if (loading) {
    return (
      <DefaultLayoutAdmin>
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
          <div className="flex justify-center items-center h-32">
            <p className="text-gray-500">Loading booking details...</p>
          </div>
        </div>
      </DefaultLayoutAdmin>
    );
  }

  if (!booking) {
    return (
      <DefaultLayoutAdmin>
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
          <div className="flex flex-col items-center justify-center h-32">
            <p className="text-gray-500 mb-4">Booking not found</p>
            <button
              onClick={handleBack}
              className="text-blue-600 hover:text-blue-800"
            >
              Back to Bookings
            </button>
          </div>
        </div>
      </DefaultLayoutAdmin>
    );
  }

  return (
    <DefaultLayoutAdmin>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Booking Details
          </h2>
          <button
            onClick={handleBack}
            className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
          >
            Back to List
          </button>
        </div>

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Booking Information
            </h3>
          </div>
          <div className="p-6.5">
            <div className="grid grid-cols-1 gap-5.5 sm:grid-cols-2">
              <div>
                <h4 className="mb-3 text-xl font-semibold text-black dark:text-white">
                  Basic Information
                </h4>
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Booking ID</p>
                    <p className="text-base font-medium text-black dark:text-white">{booking.booking_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Room Number</p>
                    <p className="text-base font-medium text-black dark:text-white">{booking.room?.room_number || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Guest Name</p>
                    <p className="text-base font-medium text-black dark:text-white">{booking.visitor?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Number of Guests</p>
                    <p className="text-base font-medium text-black dark:text-white">{booking.number_of_guests || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-xl font-semibold text-black dark:text-white">
                  Dates & Status
                </h4>
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Check-in Date</p>
                    <p className="text-base font-medium text-black dark:text-white">
                      {new Date(booking.check_in_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Check-out Date</p>
                    <p className="text-base font-medium text-black dark:text-white">
                      {new Date(booking.check_out_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${booking.status === 'confirmed' ? 'bg-success text-success' :
                      booking.status === 'pending' ? 'bg-warning text-warning' :
                        booking.status === 'cancelled' ? 'bg-danger text-danger' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {booking.special_requests && (
              <div className="mt-5.5">
                <h4 className="mb-3 text-xl font-semibold text-black dark:text-white">
                  Special Requests
                </h4>
                <p className="text-base text-black dark:text-white">
                  {booking.special_requests}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-6">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Visitor Information
            </h3>
          </div>
          <div className="p-6.5">
            <div className="grid grid-cols-1 gap-5.5 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-base font-medium text-black dark:text-white">{booking.visitor?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-base font-medium text-black dark:text-white">{booking.visitor?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-base font-medium text-black dark:text-white">{booking.visitor?.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Visitor ID</p>
                <p className="text-base font-medium text-black dark:text-white">{booking.visitor_id || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          {booking.status === 'pending' && (
            <>
              <button
                onClick={() => handleStatusChange('confirmed')}
                className="inline-flex items-center gap-2.5 rounded-md bg-green-600 py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
              >
                Confirm Booking
              </button>
              <button
                onClick={() => handleStatusChange('cancelled')}
                className="inline-flex items-center gap-2.5 rounded-md bg-red-600 py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
              >
                Cancel Booking
              </button>
            </>
          )}
          {booking.status === 'confirmed' && (
            <button
              onClick={() => handleStatusChange('cancelled')}
              className="inline-flex items-center gap-2.5 rounded-md bg-red-600 py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
            >
              Cancel Booking
            </button>
          )}
        </div>
      </div>
    </DefaultLayoutAdmin>
  );
};

export default BookingDetails; 