import HotelRoom from "../models/HotelRoom.js";
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import Booking from "../models/Booking.js";
import RoomPricing from "../models/RoomPricing.js";

// Create a new hotel room
export const createRoom = async (req, res) => {
  try {
    const {
      room_number,
      room_type,
      description,
      floor,
      capacity,
      price_per_night,
      discount_percentage,
      amenities,
      images,
      view_type,
      bed_type,
      room_size,
      is_featured
    } = req.body;

    // Check if room number already exists
    const existingRoom = await HotelRoom.findOne({
      where: { room_number }
    });

    if (existingRoom) {
      return res.status(400).json({ msg: "Room number already exists" });
    }

    // Create new room
    const room = await HotelRoom.create({
      room_id: `ROOM-${uuidv4().substring(0, 8)}`,
      room_number,
      room_type,
      description,
      floor,
      capacity,
      price_per_night,
      discount_percentage,
      amenities,
      images,
      view_type,
      bed_type,
      room_size,
      is_featured,
      status: 'available'
    });

    res.status(201).json({
      msg: "Room created successfully",
      room
    });
  } catch (error) {
    console.error("Create room error:", error);
    res.status(500).json({ msg: "Failed to create room", error: error.message });
  }
};

// Get all rooms
export const getAllRooms = async (req, res) => {
  try {
    const { status, room_type, min_price, max_price, is_featured } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (status) filter.status = status;
    if (room_type) filter.room_type = room_type;
    if (is_featured) filter.is_featured = is_featured === 'true';
    
    // Add price range filter if provided
    if (min_price || max_price) {
      filter.price_per_night = {};
      if (min_price) filter.price_per_night[Op.gte] = parseFloat(min_price);
      if (max_price) filter.price_per_night[Op.lte] = parseFloat(max_price);
    }
    
    // Get rooms with filters
    const rooms = await HotelRoom.findAll({
      where: filter,
      order: [['room_number', 'ASC']]
    });
    
    // Override status for locked/booked rooms
    const sanitizedRooms = rooms.map(room => {
      let status = room.status;
      if (status === 'locked' || status === 'booked') {
        status = 'available';
      }
      return { ...room.toJSON(), status };
    });
    
    res.status(200).json(sanitizedRooms);
  } catch (error) {
    console.error("Get all rooms error:", error);
    res.status(500).json({ msg: "Failed to retrieve rooms", error: error.message });
  }
};

// Get room by ID
export const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await HotelRoom.findOne({
      where: { room_id: id }
    });

    if (!room) {
      return res.status(404).json({ msg: "Room not found" });
    }

    res.status(200).json(room);
  } catch (error) {
    console.error("Get room by ID error:", error);
    res.status(500).json({ msg: "Failed to retrieve room", error: error.message });
  }
};

// Update room
export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      room_number,
      room_type,
      description,
      floor,
      capacity,
      price_per_night,
      discount_percentage,
      amenities,
      images,
      view_type,
      bed_type,
      room_size,
      is_featured,
      status
    } = req.body;

    const room = await HotelRoom.findOne({
      where: { room_id: id }
    });

    if (!room) {
      return res.status(404).json({ msg: "Room not found" });
    }

    // Check if room number already exists (if changing room number)
    if (room_number && room_number !== room.room_number) {
      const existingRoom = await HotelRoom.findOne({
        where: { room_number }
      });

      if (existingRoom) {
        return res.status(400).json({ msg: "Room number already exists" });
      }
    }

    // Update room
    await room.update({
      room_number: room_number || room.room_number,
      room_type: room_type || room.room_type,
      description: description || room.description,
      floor: floor || room.floor,
      capacity: capacity || room.capacity,
      price_per_night: price_per_night || room.price_per_night,
      discount_percentage: discount_percentage !== undefined ? discount_percentage : room.discount_percentage,
      amenities: amenities || room.amenities,
      images: images || room.images,
      view_type: view_type || room.view_type,
      bed_type: bed_type || room.bed_type,
      room_size: room_size || room.room_size,
      is_featured: is_featured !== undefined ? is_featured : room.is_featured,
      status: status || room.status
    });

    res.status(200).json({
      msg: "Room updated successfully",
      room
    });
  } catch (error) {
    console.error("Update room error:", error);
    res.status(500).json({ msg: "Failed to update room", error: error.message });
  }
};

// Delete room
export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await HotelRoom.findOne({
      where: { room_id: id }
    });

    if (!room) {
      return res.status(404).json({ msg: "Room not found" });
    }

    await room.destroy();

    res.status(200).json({ msg: "Room deleted successfully" });
  } catch (error) {
    console.error("Delete room error:", error);
    res.status(500).json({ msg: "Failed to delete room", error: error.message });
  }
};

// Get available rooms for a date range
export const getAvailableRooms = async (req, res) => {
  try {
    const { check_in_date, check_out_date, guests } = req.query;
    
    if (!check_in_date || !check_out_date) {
      return res.status(400).json({ msg: "Check-in and check-out dates are required" });
    }
    
    // Convert dates to Date objects
    const checkIn = new Date(check_in_date);
    const checkOut = new Date(check_out_date);
    
    // Validate dates
    if (checkIn >= checkOut) {
      return res.status(400).json({ msg: "Check-out date must be after check-in date" });
    }
    
    if (checkIn < new Date()) {
      return res.status(400).json({ msg: "Check-in date cannot be in the past" });
    }

    console.log('Searching for rooms with params:', {
      checkIn,
      checkOut,
      guests: parseInt(guests) || 1
    });
    
    // Get rooms that match the capacity requirement
    const rooms = await HotelRoom.findAll({
      where: {
        capacity: {
          [Op.gte]: parseInt(guests) || 1
        }
      },
      include: [{
        model: RoomPricing,
        as: 'pricingHistory',
        where: {
          start_date: { [Op.lte]: checkIn },
          end_date: { [Op.gte]: checkIn },
          status: 'active'
        },
        required: false // Make it a LEFT JOIN
      }]
    });
    
    console.log('Rooms matching capacity:', rooms.length);
    
    // Get all bookings
    const overlappingBookings = await Booking.findAll({
      where: {
        status: {
          [Op.notIn]: ['cancelled', 'rejected']
        },
        [Op.or]: [
          {
            check_in_date: {
              [Op.between]: [checkIn, checkOut]
            }
          },
          {
            check_out_date: {
              [Op.between]: [checkIn, checkOut]
            }
          },
          {
            [Op.and]: [
              { check_in_date: { [Op.lte]: checkIn } },
              { check_out_date: { [Op.gte]: checkOut } }
            ]
          }
        ]
      },
      attributes: ['room_id']
    });
    
    // Get the room IDs that are already booked
    const bookedRoomIds = overlappingBookings.map(booking => booking.room_id);
    
    // Filter out the booked rooms and add pricing information
    const availableRooms = rooms
      .filter(room => !bookedRoomIds.includes(room.room_id))
      .map(room => {
        const roomData = room.toJSON();
        // If there's a pricing record, use its final_price, otherwise use the room's price_per_night
        roomData.current_price = room.pricingHistory && room.pricingHistory.length > 0 
          ? room.pricingHistory[0].final_price 
          : room.price_per_night;
        return roomData;
      });
    
    console.log('Available rooms after filtering:', availableRooms.length);
    
    res.status(200).json(availableRooms);
  } catch (error) {
    console.error("Get available rooms error:", error);
    res.status(500).json({ msg: "Failed to retrieve available rooms", error: error.message });
  }
};

// Add a new room (alias for createRoom)
export const addRoom = createRoom;

// Admin: Reset all room statuses to 'available'
export const resetAllRoomStatus = async (req, res) => {
  try {
    await HotelRoom.update({ status: 'available' }, { where: {} });
    res.status(200).json({ msg: 'All room statuses reset to available.' });
  } catch (error) {
    console.error('Reset all room status error:', error);
    res.status(500).json({ msg: 'Failed to reset room statuses', error: error.message });
  }
};

// Get detailed room information
export const getRoomDetails = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching room details for ID:', id);

    const room = await HotelRoom.findOne({
      where: { room_id: id },
      include: [
        {
          model: Booking,
          as: 'room_bookings',
          attributes: ['booking_id', 'check_in_date', 'check_out_date', 'status'],
          where: {
            status: {
              [Op.notIn]: ['cancelled', 'rejected']
            }
          },
          required: false
        }
      ]
    });

    if (!room) {
      console.log('Room not found');
      return res.status(404).json({ message: 'Room not found' });
    }

    // Get current date
    const currentDate = new Date();
    
    // Check if room is currently booked
    const isCurrentlyBooked = room.room_bookings.some(booking => {
      const checkIn = new Date(booking.check_in_date);
      const checkOut = new Date(booking.check_out_date);
      return currentDate >= checkIn && currentDate <= checkOut;
    });

    // Add availability status
    const roomDetails = {
      ...room.toJSON(),
      is_available: !isCurrentlyBooked && room.status === 'available',
      current_bookings: room.room_bookings
    };

    console.log('Room details found:', roomDetails);
    res.json(roomDetails);
  } catch (error) {
    console.error('Error fetching room details:', error);
    res.status(500).json({ message: 'Error fetching room details', error: error.message });
  }
}; 