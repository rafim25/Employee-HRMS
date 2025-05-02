import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";
import HotelRoom from "../models/HotelRoom.js";
import { v4 as uuidv4 } from 'uuid';

// Get payment QR code
export const getPaymentQR = async (req, res) => {
  try {
    const { booking_id } = req.params;

    // Validate booking_id
    if (!booking_id) {
      return res.status(400).json({ 
        msg: "Booking ID is required",
        error: "Missing booking_id parameter"
      });
    }

    // Find the booking with room details
    const booking = await Booking.findOne({
      where: { booking_id },
      include: [{
        model: HotelRoom,
        as: 'room',
        attributes: ['room_id', 'room_number', 'room_type', 'price_per_night']
      }]
    });

    if (!booking) {
      return res.status(404).json({ 
        msg: "Booking not found",
        error: `No booking found with ID: ${booking_id}`
      });
    }

    // Check if booking is already paid
    if (booking.payment_status === 'completed') {
      return res.status(400).json({ 
        msg: "Booking is already paid",
        error: "Payment already completed for this booking"
      });
    }

    // Create payment record if it doesn't exist
    let payment = await Payment.findOne({
      where: { booking_id }
    });

    if (!payment) {
      payment = await Payment.create({
        payment_id: `PAY-${uuidv4().substring(0, 8)}`,
        booking_id,
        visitor_id: booking.visitor_id,
        amount: booking.final_price,
        currency: 'INR',
        payment_method: 'qr',
        status: 'pending'
      });
    }

    // Return static QR code image URL and payment details
    res.status(200).json({
      msg: "Payment QR code retrieved successfully",
      payment_id: payment.payment_id,
      amount: booking.final_price,
      qr_code_url: '/QR/QR.jpeg',
      contact_number: process.env.HOTEL_CONTACT_NUMBER || '+91-1234567890',
      instructions: "Scan the QR code to make payment. After payment, please contact the hotel to confirm your booking."
    });
  } catch (error) {
    console.error("Get payment QR error:", error);
    res.status(500).json({ 
      msg: "Failed to get payment QR code", 
      error: error.message 
    });
  }
};

// Verify QR payment
export const verifyQRPayment = async (req, res) => {
  try {
    const { payment_id, transaction_id } = req.body;

    if (!payment_id || !transaction_id) {
      return res.status(400).json({ 
        msg: "Payment ID and transaction ID are required",
        error: "Missing required parameters"
      });
    }

    // Find payment record
    const payment = await Payment.findOne({
      where: { payment_id },
      include: [{
        model: Booking,
        as: 'payment_booking',
        include: [{
          model: HotelRoom,
          as: 'booking_room'
        }]
      }]
    });

    if (!payment) {
      return res.status(404).json({ 
        msg: "Payment not found",
        error: `No payment found with ID: ${payment_id}`
      });
    }

    // Update payment status
    await Payment.update(
      {
        status: 'completed',
        transaction_id,
        payment_date: new Date(),
        payment_details: {
          verification_method: 'qr',
          verified_by: req.userId || 'system'
        }
      },
      { where: { payment_id } }
    );

    // Update booking status
    await Booking.update(
      { 
        status: 'confirmed',
        payment_status: 'completed'
      },
      { where: { booking_id: payment.payment_booking.booking_id } }
    );

    // Update room status
    await HotelRoom.update(
      { status: 'booked' },
      { where: { room_id: payment.payment_booking.booking_room.room_id } }
    );

    res.status(200).json({
      msg: "Payment verified successfully",
      payment_id: payment.payment_id,
      booking_id: payment.payment_booking.booking_id,
      status: 'completed'
    });
  } catch (error) {
    console.error("Verify QR payment error:", error);
    res.status(500).json({ 
      msg: "Failed to verify payment", 
      error: error.message 
    });
  }
};

// Get payment status
export const getPaymentStatus = async (req, res) => {
  try {
    const { booking_id } = req.params;

    const payment = await Payment.findOne({
      where: { booking_id },
      order: [['createdAt', 'DESC']]
    });

    if (!payment) {
      return res.status(404).json({ msg: "Payment not found" });
    }

    res.status(200).json({
      payment_id: payment.payment_id,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      payment_method: payment.payment_method,
      payment_date: payment.payment_date
    });
  } catch (error) {
    console.error("Get payment status error:", error);
    res.status(500).json({ msg: "Failed to get payment status", error: error.message });
  }
}; 