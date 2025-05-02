import { Visitor, Booking, HotelRoom } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';
import argon2 from "argon2";

// Register a new visitor
export const registerVisitor = async (req, res) => {
  try {
    const { name, email, password, phone, address, country, city, postal_code } = req.body;

    // Check if visitor already exists
    const existingVisitor = await Visitor.findOne({
      where: { email }
    });

    if (existingVisitor) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await argon2.hash(password);

    // Create new visitor
    const visitor = await Visitor.create({
      visitor_id: `VIS-${uuidv4().substring(0, 8)}`,
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      country,
      city,
      postal_code,
      status: 'active',
      last_login: new Date()
    });

    // Set session
    req.session.visitorId = visitor.visitor_id;

    // Return visitor data without password
    const { password: _, ...visitorData } = visitor.toJSON();
    res.status(201).json({
      msg: "Registration successful",
      visitor: visitorData
    });
  } catch (error) {
    console.error("Visitor registration error:", error);
    res.status(500).json({ msg: "Registration failed", error: error.message });
  }
};

// Login visitor
export const loginVisitor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find visitor by email
    const visitor = await Visitor.findOne({
      where: { email }
    });

    if (!visitor) {
      return res.status(404).json({ msg: "Visitor not found" });
    }

    // Verify password
    const isValidPassword = await argon2.verify(visitor.password, password);
    if (!isValidPassword) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // Update last login
    await visitor.update({
      last_login: new Date()
    });

    // Set session
    req.session.visitorId = visitor.visitor_id;

    // Return visitor data without password
    const { password: _, ...visitorData } = visitor.toJSON();
    res.status(200).json({
      msg: "Login successful",
      visitor: visitorData
    });
  } catch (error) {
    console.error("Visitor login error:", error);
    res.status(500).json({ msg: "Login failed", error: error.message });
  }
};

// Get visitor profile
export const getVisitorProfile = async (req, res) => {
  try {
    const { visitor_id } = req.params;

    const visitor = await Visitor.findOne({
      where: { visitor_id },
      attributes: { exclude: ['password'] }
    });

    if (!visitor) {
      return res.status(404).json({ msg: "Visitor not found" });
    }

    res.status(200).json(visitor);
  } catch (error) {
    console.error("Get visitor profile error:", error);
    res.status(500).json({ msg: "Failed to retrieve visitor profile", error: error.message });
  }
};

// Update visitor profile
export const updateVisitorProfile = async (req, res) => {
  try {
    const { visitor_id } = req.params;
    const { name, phone, address, country, city, postal_code, preferences } = req.body;

    const visitor = await Visitor.findOne({
      where: { visitor_id }
    });

    if (!visitor) {
      return res.status(404).json({ msg: "Visitor not found" });
    }

    // Update visitor profile
    await visitor.update({
      name: name || visitor.name,
      phone: phone || visitor.phone,
      address: address || visitor.address,
      country: country || visitor.country,
      city: city || visitor.city,
      postal_code: postal_code || visitor.postal_code,
      preferences: preferences || visitor.preferences
    });

    // Return updated visitor data without password
    const { password: _, ...visitorData } = visitor.toJSON();
    res.status(200).json({
      msg: "Profile updated successfully",
      visitor: visitorData
    });
  } catch (error) {
    console.error("Update visitor profile error:", error);
    res.status(500).json({ msg: "Failed to update visitor profile", error: error.message });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { visitor_id } = req.params;
    const { currentPassword, newPassword } = req.body;

    const visitor = await Visitor.findOne({
      where: { visitor_id }
    });

    if (!visitor) {
      return res.status(404).json({ msg: "Visitor not found" });
    }

    // Verify current password
    const isValidPassword = await argon2.verify(visitor.password, currentPassword);
    if (!isValidPassword) {
      return res.status(400).json({ msg: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await argon2.hash(newPassword);

    // Update password
    await visitor.update({
      password: hashedPassword
    });

    res.status(200).json({ msg: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ msg: "Failed to change password", error: error.message });
  }
};

// Get all visitors
export const getAllVisitors = async (req, res) => {
  try {
    console.log('Fetching all visitors...');
    const visitors = await Visitor.findAll({
      include: [{
        model: Booking,
        as: 'bookings',
        attributes: ['booking_id', 'check_in_date', 'check_out_date', 'status', 'payment_status']
      }],
      order: [['createdAt', 'DESC']]
    });
    console.log(`Found ${visitors.length} visitors`);
    res.json(visitors);
  } catch (error) {
    console.error('Error in getAllVisitors:', error);
    res.status(500).json({ message: 'Error fetching visitors', error: error.message });
  }
};

// Get visitor by ID
export const getVisitorById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching visitor with ID: ${id}`);
    const visitor = await Visitor.findByPk(id, {
      include: [{
        model: Booking,
        as: 'bookings',
        attributes: ['booking_id', 'check_in_date', 'check_out_date', 'status', 'payment_status']
      }]
    });

    if (!visitor) {
      console.log(`Visitor with ID ${id} not found`);
      return res.status(404).json({ message: 'Visitor not found' });
    }

    console.log('Visitor found:', visitor.toJSON());
    res.json(visitor);
  } catch (error) {
    console.error('Error in getVisitorById:', error);
    res.status(500).json({ message: 'Error fetching visitor', error: error.message });
  }
};

// Create new visitor
export const createVisitor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      id_type,
      id_number,
      notes
    } = req.body;

    console.log('Creating new visitor with data:', req.body);
    const visitor = await Visitor.create({
      name,
      email,
      phone,
      address,
      id_type,
      id_number,
      notes,
      status: 'active'
    });

    console.log('Visitor created successfully:', visitor.toJSON());
    res.status(201).json(visitor);
  } catch (error) {
    console.error('Error in createVisitor:', error);
    res.status(500).json({ message: 'Error creating visitor', error: error.message });
  }
};

// Update visitor
export const updateVisitor = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log(`Updating visitor with ID: ${id}`);
    console.log('Update data:', updateData);

    const visitor = await Visitor.findByPk(id);
    if (!visitor) {
      console.log(`Visitor with ID ${id} not found`);
      return res.status(404).json({ message: 'Visitor not found' });
    }

    await visitor.update(updateData);
    console.log('Visitor updated successfully:', visitor.toJSON());
    res.json(visitor);
  } catch (error) {
    console.error('Error in updateVisitor:', error);
    res.status(500).json({ message: 'Error updating visitor', error: error.message });
  }
};

// Delete visitor
export const deleteVisitor = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting visitor with ID: ${id}`);

    const visitor = await Visitor.findByPk(id);
    if (!visitor) {
      console.log(`Visitor with ID ${id} not found`);
      return res.status(404).json({ message: 'Visitor not found' });
    }

    await visitor.destroy();
    console.log(`Visitor with ID ${id} deleted successfully`);
    res.json({ message: 'Visitor deleted successfully' });
  } catch (error) {
    console.error('Error in deleteVisitor:', error);
    res.status(500).json({ message: 'Error deleting visitor', error: error.message });
  }
};

// Get visitor's bookings
export const getVisitorBookings = async (req, res) => {
  try {
    const { id } = req.params;
    const bookings = await Booking.findAll({
      where: { visitor_id: id },
      include: [{
        model: HotelRoom,
        as: 'room',
        attributes: ['room_number', 'room_type', 'price_per_night']
      }],
      order: [['createdAt', 'DESC']]
    });

    console.log(`Found ${bookings.length} bookings for visitor ${id}`);
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching visitor bookings:', error);
    res.status(500).json({ message: 'Error fetching visitor bookings' });
  }
}; 