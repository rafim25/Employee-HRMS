import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import User from "./User.js";
import Loan from "./Loan.js";

const Transaction = db.define(
  "transactions",
  {
    transaction_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    loan_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Loan,
        key: "loan_id",
      },
    },
    customer_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
    admin_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
    amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    transaction_type: {
      type: Sequelize.ENUM("credit", "debit"),
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

// Define relationships
Transaction.belongsTo(User, { foreignKey: "customer_id", as: "customer" });
Transaction.belongsTo(User, { foreignKey: "admin_id", as: "admin" });
Transaction.belongsTo(Loan, { foreignKey: "loan_id" });

export default Transaction;
