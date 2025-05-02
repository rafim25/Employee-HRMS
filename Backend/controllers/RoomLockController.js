import HotelRoom from "../models/HotelRoom.js";
import { Op } from "sequelize";

// Lock a room for a specified duration
export const lockRoom = async (req, res) => {
  try {
    const { room_id, lock_duration, visitor_id } = req.body;

    if (!room_id || !lock_duration || !visitor_id) {
      return res.status(400).json({ msg: "Room ID, lock duration, and visitor ID are required" });
    }

    // Find the room
    const room = await HotelRoom.findOne({
      where: { room_id }
    });

    if (!room) {
      return res.status(404).json({ msg: "Room not found" });
    }

    // Check if room is already locked
    if (room.status === 'locked') {
      return res.status(400).json({ msg: "Room is already locked" });
    }

    // Check if room is available
    if (room.status !== 'available') {
      return res.status(400).json({ msg: "Room is not available for booking" });
    }

    // Calculate lock expiration time
    const lockExpiration = new Date();
    lockExpiration.setSeconds(lockExpiration.getSeconds() + parseInt(lock_duration));

    // Update room status to locked
    await room.update({
      status: 'locked',
      locked_by: visitor_id,
      lock_expiration: lockExpiration
    });

    // Set a timeout to automatically unlock the room after the specified duration
    setTimeout(async () => {
      try {
        // Check if the room is still locked by the same visitor
        const currentRoom = await HotelRoom.findOne({
          where: { 
            room_id,
            status: 'locked',
            locked_by: visitor_id
          }
        });

        if (currentRoom) {
          // If the room is still locked by the same visitor, unlock it
          await currentRoom.update({
            status: 'available',
            locked_by: null,
            lock_expiration: null
          });
          console.log(`Room ${room_id} automatically unlocked after ${lock_duration} seconds`);
        }
      } catch (error) {
        console.error("Error in auto-unlock:", error);
      }
    }, parseInt(lock_duration) * 1000);

    res.status(200).json({
      msg: "Room locked successfully",
      room_id,
      lock_expiration: lockExpiration,
      status: 'locked'
    });
  } catch (error) {
    console.error("Lock room error:", error);
    res.status(500).json({ msg: "Failed to lock room", error: error.message });
  }
};

// Unlock a room
export const unlockRoom = async (req, res) => {
  try {
    const { room_id, visitor_id } = req.body;

    if (!room_id || !visitor_id) {
      return res.status(400).json({ msg: "Room ID and visitor ID are required" });
    }

    // Find the room
    const room = await HotelRoom.findOne({
      where: { 
        room_id,
        status: 'locked',
        locked_by: visitor_id
      }
    });

    if (!room) {
      return res.status(404).json({ msg: "Locked room not found or not locked by this visitor" });
    }

    // Update room status to available
    await room.update({
      status: 'available',
      locked_by: null,
      lock_expiration: null
    });

    res.status(200).json({
      msg: "Room unlocked successfully",
      room_id,
      status: 'available'
    });
  } catch (error) {
    console.error("Unlock room error:", error);
    res.status(500).json({ msg: "Failed to unlock room", error: error.message });
  }
};

// Check room lock status
export const checkRoomLock = async (req, res) => {
  try {
    const { room_id } = req.params;

    if (!room_id) {
      return res.status(400).json({ msg: "Room ID is required" });
    }

    // Find the room
    const room = await HotelRoom.findOne({
      where: { room_id }
    });

    if (!room) {
      return res.status(404).json({ msg: "Room not found" });
    }

    // Check if room is locked and if the lock has expired
    if (room.status === 'locked' && room.lock_expiration && new Date(room.lock_expiration) < new Date()) {
      // Lock has expired, update room status
      await room.update({
        status: 'available',
        locked_by: null,
        lock_expiration: null
      });
      
      return res.status(200).json({
        room_id,
        status: 'available',
        is_locked: false,
        lock_expiration: null
      });
    }

    res.status(200).json({
      room_id,
      status: room.status,
      is_locked: room.status === 'locked',
      lock_expiration: room.lock_expiration,
      locked_by: room.locked_by
    });
  } catch (error) {
    console.error("Check room lock error:", error);
    res.status(500).json({ msg: "Failed to check room lock status", error: error.message });
  }
}; 