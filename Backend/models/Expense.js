import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import User from "./User.js";

const { DataTypes } = Sequelize;

const Expense = db.define(
  "expenses",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    expenseName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notEmpty: true,
        isDecimal: true,
        min: 0,
      },
      get() {
        const value = this.getDataValue("amount");
        return value === null ? null : parseFloat(value);
      },
    },
    expenseType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    expenseImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      references: {
        model: User,
        key: "user_id",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

User.hasMany(Expense);
Expense.belongsTo(User, { foreignKey: "userId", targetKey: "user_id" });

// Force sync the model with the database
(async () => {
  try {
    await Expense.sync({ alter: true });
    console.log("✅ Expenses table synchronized");
  } catch (error) {
    console.error("❌ Error synchronizing Expenses table:", error);
  }
})();

export default Expense;
