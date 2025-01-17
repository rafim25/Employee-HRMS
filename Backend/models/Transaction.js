import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Loan from "./Loan.js";
import User from "./User.js";

const { DataTypes } = Sequelize;

const Transaction = db.define('transactions', {
    transaction_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    loan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Loan,
            key: 'loan_id'
        }
    },
    customer_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    admin_id: {
        type: DataTypes.STRING,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    amount: {
        type: DataTypes.DECIMAL(12,2),
        allowNull: false
    },
    transaction_type: {
        type: DataTypes.ENUM('debit', 'credit'),
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

// Define relationships
Transaction.belongsTo(Loan, { foreignKey: 'loan_id' });
Transaction.belongsTo(User, { as: 'customer', foreignKey: 'customer_id' });
Transaction.belongsTo(User, { as: 'admin', foreignKey: 'admin_id' });

export default Transaction;