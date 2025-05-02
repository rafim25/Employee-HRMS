import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import { v4 as uuidv4 } from 'uuid';

const { DataTypes } = Sequelize;

const Booking = db.define(
  "bookings",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    booking_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => `BK-${uuidv4().substring(0, 8)}`,
    },
    visitor_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'visitors',
        key: 'visitor_id'
      }
    },
    room_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'hotel_rooms',
        key: 'room_id'
      }
    },
    check_in_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    check_out_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    number_of_guests: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discount_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    final_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    special_requests: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending", // pending, confirmed, checked_in, checked_out, cancelled
    },
    payment_status: {
      type: DataTypes.STRING,
      defaultValue: "pending", // pending, paid, partially_paid, refunded
    },
    booking_source: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "website, mobile app, phone, walk-in, etc.",
    },
    cancellation_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cancellation_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    refund_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
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

export default Booking; 