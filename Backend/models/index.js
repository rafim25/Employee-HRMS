import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Job from './Job.js';
import Candidate from './Candidate.js';
import CandidateStatusHistory from "./CandidateStatusHistory.js";
import User from "./User.js";
import Visitor from "./Visitor.js";
import HotelRoom from "./HotelRoom.js";
import Booking from "./Booking.js";
import Payment from "./Payment.js";
import Activity from "./Activity.js";
import Gallery from "./Gallery.js";
import RoomPricing from "./RoomPricing.js";
// Remove any existing associations first
Job.associations = {};
Candidate.associations = {};
CandidateStatusHistory.associations = {};
Visitor.associations = {};
HotelRoom.associations = {};
Booking.associations = {};
Payment.associations = {};
Activity.associations = {};
Gallery.associations = {};
RoomPricing.associations = {};

// Define job-related associations only
Job.belongsTo(User, {
    foreignKey: 'created_by_id',
    as: 'creator'
});

User.hasMany(Job, {
    foreignKey: 'created_by_id',
    as: 'jobs'
});

Job.hasMany(Candidate, {
    foreignKey: 'job_id',
    as: 'candidates'
});

Candidate.belongsTo(User, {
    foreignKey: 'created_by_id',
    as: 'creator'
});

User.hasMany(Candidate, {
    foreignKey: 'created_by_id',
    as: 'candidates'
});

Candidate.hasMany(CandidateStatusHistory, {
    foreignKey: {
        name: 'candidate_id',
        allowNull: false
    },
    as: 'statusHistory',
    onDelete: 'CASCADE'
});

CandidateStatusHistory.belongsTo(Candidate, {
    foreignKey: {
        name: 'candidate_id',
        allowNull: false
    },
    as: 'candidate'
});

// Define associations
HotelRoom.hasMany(Booking, {
  foreignKey: 'room_id',
  as: 'bookings'
});

Booking.belongsTo(HotelRoom, {
  foreignKey: 'room_id',
  as: 'room'
});

// Define Visitor-Booking associations
Visitor.hasMany(Booking, {
  foreignKey: 'visitor_id',
  as: 'bookings'
});

Booking.belongsTo(Visitor, {
  foreignKey: 'visitor_id',
  as: 'visitor'
});

// Define RoomPricing associations
HotelRoom.hasMany(RoomPricing, {
  foreignKey: 'room_id',
  as: 'pricingHistory'
});

RoomPricing.belongsTo(HotelRoom, {
  foreignKey: 'room_id',
  as: 'room'
});

// Create sync function
const syncModels = async () => {
    try {
        await db.sync({ alter: true });
        console.log("✅ All tables synchronized");
    } catch (error) {
        console.error("❌ Error synchronizing tables:", error);
        throw error;
    }
};

export {
    Job,
    Candidate,
    CandidateStatusHistory,
    syncModels,
    User,
    Visitor,
    HotelRoom,
    Booking,
    Payment,
    Activity,
    Gallery,
    RoomPricing
};