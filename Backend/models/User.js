import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import { v4 as uuidv4 } from 'uuid';

const { DataTypes } = Sequelize;

const User = db.define(
  "users",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "User",
    },
    date_joined: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    mobile_number: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "active",
    },
    photo: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
    },
    permissions: {
      type: DataTypes.JSON,
      allowNull: true
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    alt_mobile_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pan_number: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      },
    },
    aadhar_number: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^[0-9]{12}$/,
      },
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

// Force sync the model with the database
(async () => {
  try {
    await User.sync({ alter: true });
    console.log("✅ Users table synchronized");
  } catch (error) {
    console.error("❌ Error synchronizing Users table:", error);
  }
})();

export default User;
