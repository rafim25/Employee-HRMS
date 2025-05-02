import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import { v4 as uuidv4 } from 'uuid';

const { DataTypes } = Sequelize;

const HotelRoom = db.define(
  "hotel_rooms",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    room_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    room_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    room_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    floor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price_per_night: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discount_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      defaultValue: 0,
    },
    amenities: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    view_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bed_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    room_size: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Room size in square feet",
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM('available', 'booked', 'maintenance', 'cleaning', 'locked'),
      allowNull: false,
      defaultValue: 'available',
    },
    // New fields for room locking
    locked_by: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Visitor ID who locked the room",
    },
    lock_expiration: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "When the room lock expires",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

export default HotelRoom; 