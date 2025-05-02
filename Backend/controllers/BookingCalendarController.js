import Booking from "../models/Booking.js";
import HotelRoom from "../models/HotelRoom.js";
import { Op } from 'sequelize';
import database from '../config/Database.js';

// Get bookings for calendar view
export const getBookingsForCalendar = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const bookings = await Booking.findAll({
      where: {
        check_in_date: {
          [Op.between]: [startDate, endDate]
        }
      },
      include: [{
        model: HotelRoom,
        as: 'room',
        attributes: ['room_number', 'room_type']
      }],
      order: [['check_in_date', 'ASC']]
    });
    
    const calendarEvents = bookings.map(booking => ({
      id: booking.booking_id,
      title: `Room ${booking.room.room_number} - ${booking.room.room_type}`,
      start: booking.check_in_date,
      end: booking.check_out_date,
      status: booking.status,
      backgroundColor: getStatusColor(booking.status),
      borderColor: getStatusColor(booking.status),
      extendedProps: {
        bookingId: booking.booking_id,
        roomNumber: booking.room.room_number,
        roomType: booking.room.room_type,
        status: booking.status
      }
    }));
    
    res.json(calendarEvents);
  } catch (error) {
    console.error('Error fetching bookings for calendar:', error);
    res.status(500).json({ message: 'Error fetching bookings for calendar' });
  }
};

// Get booking statistics
export const getBookingStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Get total bookings
    const totalBookings = await Booking.count({
      where: {
        check_in_date: {
          [Op.between]: [startDate, endDate]
        }
      }
    });
    
    // Get bookings by status
    const bookingsByStatus = await Booking.findAll({
      attributes: [
        'status',
        [database.fn('COUNT', database.col('booking_id')), 'count']
      ],
      where: {
        check_in_date: {
          [Op.between]: [startDate, endDate]
        }
      },
      group: ['status']
    });
    
    // Get bookings by room type
    const bookingsByRoomType = await Booking.findAll({
      attributes: [
        [database.col('HotelRoom.room_type'), 'roomType'],
        [database.fn('COUNT', database.col('booking_id')), 'count']
      ],
      include: [{
        model: HotelRoom,
        attributes: []
      }],
      where: {
        check_in_date: {
          [Op.between]: [startDate, endDate]
        }
      },
      group: ['HotelRoom.room_type']
    });
    
    // Get revenue
    const revenue = await Booking.sum('final_price', {
      where: {
        check_in_date: {
          [Op.between]: [startDate, endDate]
        },
        status: 'confirmed'
      }
    });
    
    res.json({
      totalBookings,
      bookingsByStatus,
      bookingsByRoomType,
      revenue: revenue || 0
    });
  } catch (error) {
    console.error("Get booking stats error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Check room availability
export const checkRoomAvailability = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, roomType } = req.query;
    
    // Find all rooms of the specified type
    const rooms = await HotelRoom.findAll({
      where: {
        room_type: roomType,
        status: 'available'
      }
    });
    
    const roomIds = rooms.map(room => room.room_id);
    
    // Find bookings for these rooms in the specified date range
    const bookings = await Booking.findAll({
      where: {
        room_id: {
          [Op.in]: roomIds
        },
        status: {
          [Op.notIn]: ['cancelled', 'rejected']
        },
        [Op.or]: [
          {
            check_in_date: {
              [Op.between]: [checkInDate, checkOutDate]
            }
          },
          {
            check_out_date: {
              [Op.between]: [checkInDate, checkOutDate]
            }
          },
          {
            [Op.and]: [
              { check_in_date: { [Op.lte]: checkInDate } },
              { check_out_date: { [Op.gte]: checkOutDate } }
            ]
          }
        ]
      }
    });
    
    // Get booked room IDs
    const bookedRoomIds = bookings.map(booking => booking.room_id);
    
    // Filter out booked rooms
    const availableRooms = rooms.filter(room => !bookedRoomIds.includes(room.room_id));
    
    res.json({
      available: availableRooms.length > 0,
      availableRooms: availableRooms.map(room => ({
        room_id: room.room_id,
        room_number: room.room_number,
        room_type: room.room_type,
        price_per_night: room.price_per_night
      }))
    });
  } catch (error) {
    console.error("Check room availability error:", error);
    res.status(500).json({ message: error.message });
  }
}; 

export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;

    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    res.json({ message: 'Booking status updated successfully' });
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({ message: error.message });
  }
};  