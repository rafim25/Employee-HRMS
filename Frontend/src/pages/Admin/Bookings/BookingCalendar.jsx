import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import DefaultLayoutAdmin from '../../../layout/DefaultLayoutAdmin';

const BookingCalendar = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const getEventColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return '#10B981'; // green-500
      case 'pending':
        return '#F59E0B'; // yellow-500
      case 'cancelled':
        return '#EF4444'; // red-500
      default:
        return '#6B7280'; // gray-500
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/bookings');

      if (!Array.isArray(response.data)) {
        toast.error('Invalid data format received from server');
        setLoading(false);
        return;
      }

      const formattedBookings = response.data.map(booking => ({
        ...booking,
        backgroundColor: getEventColor(booking.extendedProps.status),
        borderColor: getEventColor(booking.status),
        textColor: '#ffffff',
        status: booking.status?.toLowerCase()
      }));

      setBookings(formattedBookings);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
      setLoading(false);
    }
  };

  const handleEventClick = (clickInfo) => {
    const booking = clickInfo.event;
    toast.info(
      <div>
        <p><strong>Room:</strong> {booking.extendedProps.roomNumber}</p>
        <p><strong>Guest:</strong> {booking.extendedProps.guestName}</p>
        <p><strong>Guests:</strong> {booking.extendedProps.numberOfGuests}</p>
        <p><strong>Status:</strong> {booking.extendedProps.status}</p>
        {booking.extendedProps.specialRequests && (
          <p><strong>Special Requests:</strong> {booking.extendedProps.specialRequests}</p>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <DefaultLayoutAdmin>
        <div className="mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-black">Booking Calendar</h1>
          </div>
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
          <h1 className="text-2xl font-semibold text-black">Booking Calendar</h1>
          <button
            onClick={fetchBookings}
            className="inline-flex items-center gap-2.5 rounded-md bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
          >
            Refresh
          </button>
        </div>

        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          {/* Status Legend */}
          <div className="mb-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-[#10B981]"></div>
              <span className="text-sm font-medium text-black">Confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-[#F59E0B]"></div>
              <span className="text-sm font-medium text-black">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-[#EF4444]"></div>
              <span className="text-sm font-medium text-black">Cancelled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-[#6B7280]"></div>
              <span className="text-sm font-medium text-black">Other</span>
            </div>
          </div>

          <div className="mt-4">
            <style>
              {`
                .fc {
                  color: black;
                }
                .fc .fc-toolbar-title {
                  color: black;
                }
                .fc .fc-col-header-cell-cushion {
                  color: black;
                }
                .fc .fc-daygrid-day-number {
                  color: black;
                }
                .fc .fc-timegrid-slot-label-cushion {
                  color: black;
                }
                .fc .fc-list-day-cushion {
                  color: black;
                }
                .fc .fc-list-event-time {
                  color: black;
                }
                .fc .fc-list-event-title {
                  color: black;
                }
              `}
            </style>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
              }}
              events={bookings}
              eventClick={handleEventClick}
              height="auto"
              eventDisplay="block"
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false
              }}
              slotMinTime="00:00:00"
              slotMaxTime="24:00:00"
              allDaySlot={true}
              nowIndicator={true}
              editable={false}
              selectable={false}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              firstDay={1}
              businessHours={{
                daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
                startTime: '00:00',
                endTime: '24:00',
              }}
              themeSystem="standard"
              eventTextColor="#ffffff"
              eventBackgroundColor={getEventColor}
              eventBorderColor={getEventColor}
            />
          </div>
        </div>
      </div>
    </DefaultLayoutAdmin>
  );
};

export default BookingCalendar; 