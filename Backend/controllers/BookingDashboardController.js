import Visitor from '../models/Visitor.js';
import Booking from '../models/Booking.js';
import Room from '../models/Room.js';

export const getBookingDashboardData = async (req, res) => {
  try {
    // TODO: Replace with real DB queries
    const totalVisitors = 120;
    const totalBookings = 85;
    const totalRevenue = 250000;
    const totalAvailableRooms = 12;
    const bookingsPerMonth = [5, 8, 12, 15, 10, 7, 9, 11, 13, 14, 8, 6];
    const roomOccupancy = [
      { roomType: 'Suite', occupied: 8, available: 2 },
      { roomType: 'Family', occupied: 6, available: 4 },
      { roomType: 'Tent', occupied: 3, available: 1 }
    ];
    const rooms = [
      { id: 'S101', type: 'Suite', capacity: 4, price: 4000, status: 'Available' },
      { id: 'F201', type: 'Family', capacity: 6, price: 3000, status: 'Booked' },
      { id: 'T301', type: 'Tent', capacity: 2, price: 2000, status: 'Available' }
    ];
    const recentBookings = [
      { name: 'John Doe', room: 'Suite', date: '2024-06-01', status: 'Checked In' },
      { name: 'Jane Smith', room: 'Family', date: '2024-06-02', status: 'Booked' }
    ];
    res.json({
      totalVisitors,
      totalBookings,
      totalRevenue,
      totalAvailableRooms,
      bookingsPerMonth,
      roomOccupancy,
      rooms,
      recentBookings
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}; 