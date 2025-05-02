import RoomType from '../models/RoomType.js';

// Get all room types
export const getAllRoomTypes = async (req, res) => {
  try {
    const roomTypes = await RoomType.findAll({ order: [['id', 'ASC']] });
    res.status(200).json(roomTypes);
  } catch (error) {
    res.status(500).json({ msg: 'Failed to fetch room types', error: error.message });
  }
};

// Create a new room type
export const createRoomType = async (req, res) => {
  try {
    const { name, base_price, max_capacity, bed_type, room_size, description, amenities } = req.body;
    const roomType = await RoomType.create({
      name,
      base_price,
      max_capacity,
      bed_type,
      room_size,
      description,
      amenities
    });
    res.status(201).json(roomType);
  } catch (error) {
    res.status(500).json({ msg: 'Failed to create room type', error: error.message });
  }
}; 