import { Booking, HotelRoom, Visitor } from '../models/index.js';
import Payment from "../models/Payment.js";
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';

// Get all bookings with related room and visitor information
export const getAllBookings = async (req, res) => {
  try {
    console.log('Fetching all bookings...');
    const bookings = await Booking.findAll({
      include: [
        {
          model: HotelRoom,
          as: 'room',
          attributes: ['room_number', 'room_type']
        },
        {
          model: Visitor,
          as: 'visitor',
          attributes: ['name', 'email']
        }
      ],
      order: [['check_in_date', 'DESC']]
    });
    console.log(`Found ${bookings.length} bookings`);

    // Format bookings for FullCalendar
    const formattedBookings = bookings.map(booking => {
      console.log('Processing booking:', booking.toJSON());
      return {
        id: booking.booking_id,
        title: `Room ${booking.room.room_number} - ${booking.visitor.name}`,
        start: new Date(booking.check_in_date).toISOString(),
        end: new Date(booking.check_out_date).toISOString(),
        extendedProps: {
          ...booking.toJSON(),
          status: booking.status,
          roomNumber: booking.room.room_number,
          roomType: booking.room.room_type,
          guestName: booking.visitor.name,
          checkIn: booking.check_in_date,
          checkOut: booking.check_out_date,
          totalAmount: booking.total_price,
          numberOfGuests: booking.number_of_guests,
          paymentStatus: booking.payment_status
        }
      };
    });

    console.log('Formatted bookings:', formattedBookings);
    res.json(formattedBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const {
      room_id,
      visitor_id,
      check_in_date,
      check_out_date,
      number_of_guests,
      special_requests,
      total_amount,
      payment_method,
      payment_status
    } = req.body;

    // Check if room exists and is available
    const room = await HotelRoom.findByPk(room_id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Calculate total price and final price
    const total_price = parseFloat(total_amount);
    const final_price = total_price; // If there's no discount, final price equals total price

    // Create the booking
    const booking = await Booking.create({
      room_id,
      visitor_id,
      check_in_date,
      check_out_date,
      number_of_guests,
      special_requests,
      total_price,
      final_price,
      status: 'pending',
      payment_status: payment_status || 'pending'
    });

    // Update room status
    await room.update({ status: 'booked' });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

// Update a booking
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      check_in_date,
      check_out_date,
      number_of_guests,
      special_requests,
      status
    } = req.body;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.update({
      check_in_date,
      check_out_date,
      number_of_guests,
      special_requests,
      status
    });

    res.json(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Error updating booking' });
  }
};

// Delete a booking
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update room status back to available
    const room = await HotelRoom.findByPk(booking.room_id);
    if (room) {
      await room.update({ status: 'available' });
    }

    await booking.destroy();
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Error deleting booking' });
  }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching booking with ID:', id);

    const booking = await Booking.findByPk(id, {
      include: [
        {
          model: HotelRoom,
          as: 'room',
          attributes: ['room_number', 'room_type', 'floor']
        },
        {
          model: Visitor,
          as: 'visitor',
          attributes: ['name', 'email', 'phone']
        }
      ]
    });

    if (!booking) {
      console.log('Booking not found');
      return res.status(404).json({ message: 'Booking not found' });
    }

    console.log('Booking found:', booking.toJSON());
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
};

// Get all bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [{
        model: HotelRoom,
        as: 'room',
        attributes: ['room_number', 'room_type', 'price_per_night']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: { booking_id: req.params.id }
    });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.update({ 
      status: req.body.status,
      notes: req.body.notes || null
    });
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Process payment
export const processPayment = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const { transaction_id, payment_status } = req.body;

    const booking = await Booking.findOne({
      where: { booking_id },
      include: [{ model: Payment }]
    });

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    // Update payment record
    await Payment.update(
      {
        payment_status,
        transaction_id,
        payment_date: payment_status === 'completed' ? new Date() : null
      },
      { where: { booking_id } }
    );

    // Update booking payment status
    await booking.update({ payment_status });

    res.status(200).json({
      msg: "Payment processed successfully",
      booking
    });
  } catch (error) {
    console.error("Process payment error:", error);
    res.status(500).json({ msg: "Failed to process payment", error: error.message });
  }
};

// Get visitor's bookings
export const getVisitorBookings = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching bookings for visitor with ID: ${id}`);

    const bookings = await Booking.findAll({
      where: { visitor_id: id },
      include: [
        {
          model: HotelRoom,
          as: 'room',
          attributes: ['room_number', 'room_type', 'floor', 'images']
        },
        {
          model: Payment,
          attributes: ['payment_id', 'amount', 'currency', 'payment_method', 'payment_status', 'payment_date']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    console.log(`Found ${bookings.length} bookings for visitor ${id}`);
    console.log('Bookings:', JSON.stringify(bookings, null, 2));

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Get visitor bookings error:", error);
    res.status(500).json({ msg: "Failed to retrieve visitor bookings", error: error.message });
  }
}; 