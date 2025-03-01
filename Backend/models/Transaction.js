import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import User from "./User.js";
import Loan from "./Loan.js";

const { DataTypes } = Sequelize;

const Transaction = db.define(
  "transactions",
  {
    transaction_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    loan_id: {
      type: DataTypes.STRING,
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
    admin_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    transaction_type: {
      type: DataTypes.ENUM("credit", "debit"),
      allowNull: false,
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    receipt: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    receipt_url: {
      type: DataTypes.STRING,
      allowNull: true,
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

// Define relationships
Transaction.belongsTo(User, {
  foreignKey: "customer_id",
  targetKey: "user_id",
  as: "customer",
});

Transaction.belongsTo(User, {
  foreignKey: "admin_id",
  targetKey: "user_id",
  as: "admin",
});

Transaction.belongsTo(Loan, {
  foreignKey: "loan_id",
  targetKey: "loan_id",
});

// Force sync the model with the database
(async () => {
  try {
    await Transaction.sync({ alter: true });
    console.log("✅ Transactions table synchronized");
  } catch (error) {
    console.error("❌ Error synchronizing Transactions table:", error);
  }
})();

export default Transaction;
