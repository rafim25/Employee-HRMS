import React, { useState, useEffect } from 'react';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { FaEye, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const BookingCalendar = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/bookings`);
      const formattedBookings = response.data.map(booking => ({
        id: booking.id,
        title: booking.title,
        start: booking.start,
        end: booking.end,
        extendedProps: {
          ...booking.extendedProps,
          status: booking.extendedProps.status,
          roomNumber: booking.extendedProps.roomNumber,
          roomType: booking.extendedProps.roomType,
          guestName: booking.extendedProps.guestName,
          checkIn: booking.extendedProps.checkIn,
          checkOut: booking.extendedProps.checkOut,
          totalAmount: booking.extendedProps.totalAmount,
          numberOfGuests: booking.extendedProps.numberOfGuests,
          paymentStatus: booking.extendedProps.paymentStatus
        }
      }));
      setBookings(formattedBookings);
      setError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to fetch bookings');
      toast.error('Failed to fetch bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (bookingId, action) => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}/${action}`);
      if (response.status === 200) {
        toast.success(`Booking ${action} successfully`);
        fetchBookings();
      }
    } catch (error) {
      toast.error(`Failed to ${action} booking`);
    }
  };

  const handleEventClick = (info) => {
    setSelectedBooking(info.event.extendedProps);
    setIsViewModalOpen(true);
  };

  const getEventColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500'; // Tailwind green-500
      case 'pending':
        return 'bg-yellow-500'; // Tailwind yellow-500
      case 'cancelled':
        return 'bg-red-500'; // Tailwind red-500
      default:
        return 'bg-gray-500'; // Tailwind gray-500
    }
  };

  if (loading) {
    return (
      <DefaultLayoutAdmin>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DefaultLayoutAdmin>
    );
  }

  if (error) {
    return (
      <DefaultLayoutAdmin>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-500">{error}</div>
        </div>
      </DefaultLayoutAdmin>
    );
  }

  return (
    <DefaultLayoutAdmin>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-6">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Booking Calendar22
          </h2>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={bookings}
            eventClick={handleEventClick}
            eventContent={(eventInfo) => ({
              html: `
                <div class="fc-event-main-frame p-1">
                  <div class="fc-event-title font-medium">${eventInfo.event.title}</div>
                  <div class="fc-event-time text-xs">${eventInfo.event.extendedProps.status}</div>
                </div>
              `
            })}
            eventDidMount={(info) => {
              const colorClass = getEventColor(info.event.extendedProps.status);
              info.el.classList.add(colorClass);
              info.el.classList.add('border-0');
            }}
            height="auto"
            aspectRatio={1.8}
            expandRows={true}
            stickyHeaderDates={true}
            dayMaxEvents={true}
            weekends={true}
            nowIndicator={true}
            editable={false}
            selectable={false}
            selectMirror={true}
            rerenderDelay={10}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: false
            }}
            slotMinTime="00:00:00"
            slotMaxTime="24:00:00"
            allDaySlot={true}
            allDayMaintainDuration={true}
            slotDuration="00:30:00"
            slotLabelInterval="01:00"
            snapDuration="00:15:00"
            snapGrid={true}
            businessHours={{
              daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
              startTime: '00:00',
              endTime: '24:00',
            }}
            eventDisplay="block"
            displayEventEnd={true}
            displayEventTime={true}
            eventMinHeight={25}
            eventMinWidth={30}
            eventShortHeight={30}
            eventTextColor="#ffffff"
            eventOverlap={true}
            eventConstraint={{
              startTime: '00:00',
              endTime: '24:00',
              dows: [0, 1, 2, 3, 4, 5, 6]
            }}
            eventAllow={function (dropInfo) {
              return true;
            }}
          />
        </div>
      </div>

      {/* View Booking Modal */}
      {isViewModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-boxdark">
            <h3 className="mb-4 text-xl font-semibold">Booking Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Guest Name
                </label>
                <p className="mt-1 text-black dark:text-white">
                  {selectedBooking.guestName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Room Number
                </label>
                <p className="mt-1 text-black dark:text-white">
                  {selectedBooking.roomNumber}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Check-in Date
                </label>
                <p className="mt-1 text-black dark:text-white">
                  {new Date(selectedBooking.checkIn).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Check-out Date
                </label>
                <p className="mt-1 text-black dark:text-white">
                  {new Date(selectedBooking.checkOut).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status
                </label>
                <p className="mt-1">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${selectedBooking.status === 'confirmed'
                      ? 'bg-green-500 text-white'
                      : selectedBooking.status === 'cancelled'
                        ? 'bg-red-500 text-white'
                        : 'bg-yellow-500 text-white'
                      }`}
                  >
                    {selectedBooking.status}
                  </span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Amount
                </label>
                <p className="mt-1 text-black dark:text-white">
                  ₹{selectedBooking.totalAmount}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              {selectedBooking.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleBookingAction(selectedBooking._id, 'confirm')}
                    className="rounded bg-green-500 py-2 px-4 text-white hover:bg-green-600"
                  >
                    <FaCheck className="inline-block mr-1" /> Confirm
                  </button>
                  <button
                    onClick={() => handleBookingAction(selectedBooking._id, 'reject')}
                    className="rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600"
                  >
                    <FaTimes className="inline-block mr-1" /> Reject
                  </button>
                </>
              )}
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="rounded bg-gray-500 py-2 px-4 text-white hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DefaultLayoutAdmin>
  );
};

export default BookingCalendar; 