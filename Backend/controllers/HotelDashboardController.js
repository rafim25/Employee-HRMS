import Booking from '../models/Booking.js';
import HotelRoom from '../models/HotelRoom.js';
import Visitor from '../models/Visitor.js';
import sequelize from '../config/Database.js';
import { Op } from 'sequelize';

export const getHotelDashboardStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's bookings count and revenue
    const todayBookings = await Booking.findAll({
      where: { 
        [Op.or]: [
          { check_in_date: { [Op.lte]: today } },
          { check_out_date: { [Op.gte]: today } }
        ],
        status: 'confirmed'
      },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('booking_id')), 'totalBookings'],
        [sequelize.fn('SUM', sequelize.col('total_price')), 'totalRevenue']
      ],
      raw: true
    });

    // Get today's active bookings with visitor info
    const todayActiveBookings = await Booking.findAll({
      where: { 
        [Op.or]: [
          { check_in_date: { [Op.lte]: today } },
          { check_out_date: { [Op.gte]: today } }
        ],
        status: 'confirmed'
      },
      include: [
        {
          model: Visitor,
          as: 'visitor',
          attributes: ['visitor_id']
        }
      ],
      raw: true
    });

    // Get today's room status
    const todayRooms = await HotelRoom.findAll({
      where: {
        status: {
          [Op.in]: ['available', 'booked']
        }
      },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('room_id')), 'totalRooms'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN status = "available" THEN 1 ELSE 0 END')), 'availableRooms'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN status = "booked" THEN 1 ELSE 0 END')), 'occupiedRooms']
      ],
      raw: true
    });

    // Get today's visitors (unique visitors from today's bookings)
    const todayVisitors = await Booking.findAll({
      where: { 
        [Op.or]: [
          { check_in_date: { [Op.lte]: today } },
          { check_out_date: { [Op.gte]: today } }
        ],
        status: 'confirmed'
      },
      attributes: [[sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('visitor_id'))), 'totalVisitors']],
      raw: true
    });

    // Get historical data with date filter
    const dateFilter = startDate && endDate ? {
      createdAt: {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      }
    } : {};

    // Get booking status breakdown
    const bookingStatusBreakdown = await Booking.findAll({
      where: dateFilter,
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('booking_id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // Get total registered visitors
    const totalRegisteredVisitors = await Visitor.count();

    // Get historical bookings and revenue
    const historicalBookings = await Booking.findAll({
      where: { 
        ...dateFilter,
        status: 'confirmed'
      },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('booking_id')), 'totalBookings'],
        [sequelize.fn('SUM', sequelize.col('total_price')), 'totalRevenue']
      ],
      raw: true
    });

    // Get historical visitors
    const historicalVisitors = await Booking.findAll({
      where: { 
        ...dateFilter,
        status: 'confirmed'
      },
      attributes: [[sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('visitor_id'))), 'totalVisitors']],
      raw: true
    });

    // Get monthly bookings data
    const monthlyBookings = await Booking.findAll({
      where: {
        ...dateFilter,
        createdAt: {
          [Op.gte]: sequelize.literal('DATE_SUB(NOW(), INTERVAL 6 MONTH)')
        }
      },
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%b'), 'month'],
        [sequelize.fn('COUNT', sequelize.col('booking_id')), 'count']
      ],
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%b')],
      order: [[sequelize.fn('MIN', sequelize.col('createdAt')), 'ASC']],
      raw: true
    });

    // Get room types distribution
    const roomTypes = await HotelRoom.findAll({
      attributes: [
        'room_type',
        [sequelize.fn('COUNT', sequelize.col('room_id')), 'count']
      ],
      group: ['room_type'],
      raw: true
    });

    // Get recent bookings
    const recentBookings = await Booking.findAll({
      where: dateFilter,
      include: [
        {
          model: Visitor,
          as: 'visitor',
          attributes: ['name']
        },
        {
          model: HotelRoom,
          as: 'room',
          attributes: ['room_type']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Format the response
    const response = {
      today: {
        totalBookings: todayBookings[0]?.totalBookings || 0,
        totalRevenue: todayBookings[0]?.totalRevenue || 0,
        availableRooms: todayRooms[0]?.availableRooms || 0,
        occupiedRooms: todayRooms[0]?.occupiedRooms || 0,
        totalVisitors: todayVisitors[0]?.totalVisitors || 0
      },
      historical: {
        totalBookings: historicalBookings[0]?.totalBookings || 0,
        totalRevenue: historicalBookings[0]?.totalRevenue || 0,
        totalVisitors: historicalVisitors[0]?.totalVisitors || 0,
        totalRegisteredVisitors: totalRegisteredVisitors,
        bookingStatus: {
          confirmed: bookingStatusBreakdown.find(b => b.status === 'confirmed')?.count || 0,
          pending: bookingStatusBreakdown.find(b => b.status === 'pending')?.count || 0,
          cancelled: bookingStatusBreakdown.find(b => b.status === 'cancelled')?.count || 0
        },
        monthlyBookings: {
          labels: monthlyBookings.map(item => item.month),
          data: monthlyBookings.map(item => item.count)
        },
        roomTypes: {
          labels: roomTypes.map(item => item.room_type),
          data: roomTypes.map(item => item.count)
        },
        recentBookings: recentBookings.map(booking => ({
          id: booking.booking_id,
          guestName: booking.visitor.name,
          roomType: booking.room.room_type,
          checkIn: booking.check_in_date,
          checkOut: booking.check_out_date,
          status: booking.status,
          createdAt: booking.createdAt
        }))
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching hotel dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching hotel dashboard statistics' });
  }
}; 