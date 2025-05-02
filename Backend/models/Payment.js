import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import { v4 as uuidv4 } from 'uuid';

const { DataTypes } = Sequelize;

const Payment = db.define(
  "payments",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    payment_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => `PAY-${uuidv4().substring(0, 8)}`,
    },
    booking_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'bookings',
        key: 'booking_id'
      }
    },
    visitor_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'visitors',
        key: 'visitor_id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "INR",
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "credit_card",
      validate: {
        isIn: [['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet']]
      }
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
      validate: {
        isIn: [['pending', 'completed', 'failed', 'refunded']]
      }
    },
    transaction_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    refund_status: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: [['pending', 'completed', 'rejected']]
      }
    },
    refund_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    refund_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    payment_details: {
      type: DataTypes.JSON,
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

export default Payment; 