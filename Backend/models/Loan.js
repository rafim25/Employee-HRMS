import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import User from "./User.js";

const { DataTypes } = Sequelize;

const Loan = db.define(
  "loans",
  {
    loan_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    customer_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
    customer_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    loan_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    advance_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    remaining_balance: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "closed"),
      allowNull: false,
      defaultValue: "active",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Define relationship
Loan.belongsTo(User, { foreignKey: "customer_id", targetKey: "user_id" });

export default Loan;
