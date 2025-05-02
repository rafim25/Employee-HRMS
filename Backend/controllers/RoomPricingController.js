import { HotelRoom, RoomPricing } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

// Get pricing history for all rooms
export const getPricingHistory = async (req, res) => {
  try {
    console.log('Fetching room pricing history...');
    const pricingHistory = await RoomPricing.findAll({
      include: [{
        model: HotelRoom,
        as: 'room',
        attributes: ['room_number', 'room_type']
      }],
      order: [['createdAt', 'DESC']]
    });
    console.log(`Found ${pricingHistory.length} pricing records`);
    res.json(pricingHistory);
  } catch (error) {
    console.error('Error in getPricingHistory:', error);
    res.status(500).json({ message: 'Error fetching pricing history', error: error.message });
  }
};

// Set new room price
export const setRoomPrice = async (req, res) => {
  try {
    const {
      room_id,
      start_date,
      end_date,
      base_price,
      discount = 0,
      coupon_code = null
    } = req.body;

    console.log('Setting new room price with data:', req.body);

    // Validate room exists
    const room = await HotelRoom.findByPk(room_id);
    if (!room) {
      console.log(`Room with ID ${room_id} not found`);
      return res.status(404).json({ message: 'Room not found' });
    }

    // Create new pricing record
    const pricing = await RoomPricing.create({
      pricing_id: `PRC-${uuidv4().substring(0, 8)}`,
      room_id,
      start_date,
      end_date,
      base_price,
      discount,
      coupon_code,
      status: 'active'
    });

    console.log('Room price set successfully:', pricing.toJSON());
    res.status(201).json(pricing);
  } catch (error) {
    console.error('Error in setRoomPrice:', error);
    res.status(500).json({ message: 'Error setting room price', error: error.message });
  }
};

// Get current price for a room
export const getCurrentPrice = async (req, res) => {
  try {
    const { room_id } = req.params;
    const currentDate = new Date();

    console.log(`Fetching current price for room ${room_id}`);
    const pricing = await RoomPricing.findOne({
      where: {
        room_id,
        start_date: { [Op.lte]: currentDate },
        end_date: { [Op.gte]: currentDate },
        status: 'active'
      },
      include: [{
        model: HotelRoom,
        as: 'room',
        attributes: ['room_number', 'room_type']
      }],
      order: [['createdAt', 'DESC']]
    });

    if (!pricing) {
      console.log(`No active pricing found for room ${room_id}`);
      return res.status(404).json({ message: 'No active pricing found' });
    }

    console.log('Current price found:', pricing.toJSON());
    res.json(pricing);
  } catch (error) {
    console.error('Error in getCurrentPrice:', error);
    res.status(500).json({ message: 'Error fetching current price', error: error.message });
  }
};

// Update room price
export const updateRoomPrice = async (req, res) => {
  try {
    const { pricing_id } = req.params;
    const updateData = req.body;

    console.log(`Updating pricing with ID: ${pricing_id}`);
    console.log('Update data:', updateData);

    const pricing = await RoomPricing.findByPk(pricing_id);
    if (!pricing) {
      console.log(`Pricing with ID ${pricing_id} not found`);
      return res.status(404).json({ message: 'Pricing not found' });
    }

    await pricing.update(updateData);
    console.log('Pricing updated successfully:', pricing.toJSON());
    res.json(pricing);
  } catch (error) {
    console.error('Error in updateRoomPrice:', error);
    res.status(500).json({ message: 'Error updating room price', error: error.message });
  }
};

// Delete room price
export const deleteRoomPrice = async (req, res) => {
  try {
    const { pricing_id } = req.params;
    console.log(`Deleting pricing with ID: ${pricing_id}`);

    const pricing = await RoomPricing.findByPk(pricing_id);
    if (!pricing) {
      console.log(`Pricing with ID ${pricing_id} not found`);
      return res.status(404).json({ message: 'Pricing not found' });
    }

    await pricing.destroy();
    console.log(`Pricing with ID ${pricing_id} deleted successfully`);
    res.json({ message: 'Pricing deleted successfully' });
  } catch (error) {
    console.error('Error in deleteRoomPrice:', error);
    res.status(500).json({ message: 'Error deleting room price', error: error.message });
  }
}; 