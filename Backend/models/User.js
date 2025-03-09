import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const User = db.define(
  "users",
  {
    user_id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
      type: DataTypes.STRING,
      defaultValue: "limited",
    },
  },
  {
    freezeTableName: true,
    timestamps: false, // Set to false since we're not using Sequelize's default timestamp columns
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
