import Transaction from "../models/Transaction.js";
import Loan from "../models/Loan.js";
import User from "../models/User.js";
import { Op } from "sequelize";
import db from "../config/Database.js";

export const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            include: [
                {
                    model: Loan,
                    attributes: ['loan_amount', 'remaining_balance', 'status']
                },
                {
                    model: User,
                    as: 'customer',
                    attributes: ['username', 'email']
                },
                {
                    model: User,
                    as: 'admin',
                    attributes: ['username']
                }
            ]
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            where: {
                transaction_id: req.params.id
            },
            include: [
                {
                    model: Loan,
                    attributes: ['loan_amount', 'remaining_balance', 'status']
                },
                {
                    model: User,
                    as: 'customer',
                    attributes: ['username', 'email']
                },
                {
                    model: User,
                    as: 'admin',
                    attributes: ['username']
                }
            ]
        });
        if (!transaction) return res.status(404).json({ msg: "Transaction not found" });
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createTransaction = async (req, res) => {
    const t = await db.transaction();
    
    try {
        const { loan_id, customer_id, amount, transaction_type } = req.body;
        
        // Verify if loan exists and is active
        const loan = await Loan.findOne({
            where: {
                loan_id: loan_id,
                status: 'active'
            }
        });
        
        if (!loan) {
            return res.status(404).json({ msg: "Active loan not found" });
        }

        // Create transaction
        const transaction = await Transaction.create({
            loan_id,
            customer_id,
            admin_id: req.userId, // from auth middleware
            amount,
            transaction_type
        }, { transaction: t });

        // Update loan remaining balance
        const balanceChange = transaction_type === 'credit' ? -amount : amount;
        const newBalance = parseFloat(loan.remaining_balance) + parseFloat(balanceChange);
        
        if (newBalance < 0) {
            await t.rollback();
            return res.status(400).json({ msg: "Payment amount exceeds remaining balance" });
        }

        await Loan.update({
            remaining_balance: newBalance,
            status: newBalance === 0 ? 'closed' : 'active'
        }, {
            where: { loan_id },
            transaction: t
        });

        await t.commit();

        res.status(201).json({
            msg: "Transaction created successfully",
            transaction: transaction
        });
    } catch (error) {
        await t.rollback();
        res.status(400).json({ msg: error.message });
    }
};

export const updateTransaction = async (req, res) => {
    const t = await db.transaction();
    
    try {
        const transaction = await Transaction.findOne({
            where: {
                transaction_id: req.params.id,
                created_at: {
                    [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) // Within last 24 hours
                }
            }
        });

        if (!transaction) {
            return res.status(404).json({ 
                msg: "Transaction not found or cannot be modified after 24 hours" 
            });
        }

        const { amount, transaction_type } = req.body;
        
        // Reverse old transaction effect on loan balance
        const loan = await Loan.findByPk(transaction.loan_id);
        const oldBalanceChange = transaction.transaction_type === 'credit' ? 
            transaction.amount : -transaction.amount;
        let newBalance = parseFloat(loan.remaining_balance) - parseFloat(oldBalanceChange);
        
        // Apply new transaction effect
        const newBalanceChange = transaction_type === 'credit' ? -amount : amount;
        newBalance += parseFloat(newBalanceChange);

        if (newBalance < 0) {
            await t.rollback();
            return res.status(400).json({ msg: "Update would cause negative balance" });
        }

        await Transaction.update({
            amount,
            transaction_type
        }, {
            where: { transaction_id: req.params.id },
            transaction: t
        });

        await Loan.update({
            remaining_balance: newBalance,
            status: newBalance === 0 ? 'closed' : 'active'
        }, {
            where: { loan_id: transaction.loan_id },
            transaction: t
        });

        await t.commit();

        res.json({
            msg: "Transaction updated successfully",
            transaction: await Transaction.findByPk(req.params.id)
        });
    } catch (error) {
        await t.rollback();
        res.status(400).json({ msg: error.message });
    }
};

export const deleteTransaction = async (req, res) => {
    const t = await db.transaction();
    
    try {
        const transaction = await Transaction.findOne({
            where: {
                transaction_id: req.params.id,
                created_at: {
                    [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) // Within last 24 hours
                }
            }
        });

        if (!transaction) {
            return res.status(404).json({ 
                msg: "Transaction not found or cannot be deleted after 24 hours" 
            });
        }

        // Reverse transaction effect on loan balance
        const loan = await Loan.findByPk(transaction.loan_id);
        const balanceChange = transaction.transaction_type === 'credit' ? 
            transaction.amount : -transaction.amount;
        const newBalance = parseFloat(loan.remaining_balance) - parseFloat(balanceChange);

        await Loan.update({
            remaining_balance: newBalance,
            status: newBalance === 0 ? 'closed' : 'active'
        }, {
            where: { loan_id: transaction.loan_id },
            transaction: t
        });

        await Transaction.destroy({
            where: { transaction_id: req.params.id },
            transaction: t
        });

        await t.commit();

        res.json({ msg: "Transaction deleted successfully" });
    } catch (error) {
        await t.rollback();
        res.status(400).json({ msg: error.message });
    }
};

// Additional utility functions
export const getTransactionsByLoan = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            where: { loan_id: req.params.loanId },
            include: [
                {
                    model: User,
                    as: 'customer',
                    attributes: ['username', 'email']
                },
                {
                    model: User,
                    as: 'admin',
                    attributes: ['username']
                }
            ]
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};