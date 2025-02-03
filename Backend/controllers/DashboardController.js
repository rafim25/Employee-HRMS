import User from "../models/User.js";
import Loan from "../models/Loan.js";
import Transaction from "../models/Transaction.js";
import Expense from "../models/Expense.js";
import { Op } from "sequelize";

export const getDashboardStats = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const monthlyExpenses = Array(12).fill(0);
    const monthlyIncome = Array(12).fill(0);

    // Get users, admins, loans, transactions, and expenses in parallel
    const [users, admins, loans, transactions, expenses] = await Promise.all([
      User.findAll({ where: { role: "User" } }),
      User.findAll({ where: { role: "Admin" } }),
      Loan.findAll({
        where: {
          created_at: {
            [Op.between]: [
              new Date(currentYear, 0, 1),
              new Date(currentYear, 11, 31, 23, 59, 59),
            ],
          },
        },
        include: [
          {
            model: User,
            attributes: ["username", "email"],
            as: "user",
          },
        ],
      }),
      Transaction.findAll({
        where: {
          transaction_type: "credit",
          created_at: {
            [Op.between]: [
              new Date(currentYear, 0, 1),
              new Date(currentYear, 11, 31, 23, 59, 59),
            ],
          },
        },
        include: [
          {
            model: User,
            attributes: ["username", "email"],
            as: "customer",
          },
        ],
      }),
      Expense.findAll({
        where: {
          createdAt: {
            [Op.between]: [
              new Date(currentYear, 0, 1),
              new Date(currentYear, 11, 31, 23, 59, 59),
            ],
          },
        },
      }),
    ]);

    // Calculate total loan amount
    const totalLoanAmount = loans.reduce(
      (sum, loan) => sum + Number(loan.loan_amount),
      0
    );

    // Calculate total advance amount from loans
    const totalAdvanceAmount = loans.reduce(
      (sum, loan) => sum + Number(loan.advance_amount || 0),
      0
    );

    // Calculate total credit transactions
    const totalTransactionAmount = transactions.reduce(
      (sum, trans) => sum + Number(trans.amount),
      0
    );

    // Calculate total available funds (credit transactions + advance amounts)
    const totalAvailableFunds = totalTransactionAmount + totalAdvanceAmount;

    // Calculate total expenses separately
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    );

    // Aggregate expenses by month
    expenses.forEach((expense) => {
      const month = new Date(expense.createdAt).getMonth();
      monthlyExpenses[month] += Number(expense.amount);
    });

    // Aggregate income (advances + transactions) by month
    loans.forEach((loan) => {
      const month = new Date(loan.created_at).getMonth();
      monthlyIncome[month] += Number(loan.advance_amount || 0);
    });

    transactions.forEach((transaction) => {
      const month = new Date(transaction.created_at).getMonth();
      monthlyIncome[month] += Number(transaction.amount);
    });

    // Get recent data with correct column names and user information
    const recentLoans = await Loan.findAll({
      limit: 5,
      order: [["created_at", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["username", "email"],
          as: "user",
        },
      ],
      attributes: [
        "loan_id",
        "customer_id",
        "customer_name",
        "loan_amount",
        "advance_amount",
        "remaining_balance",
        "status",
        "created_at",
        "updated_at",
      ],
    });

    const recentTransactions = await Transaction.findAll({
      limit: 5,
      order: [["created_at", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["username", "email"],
          as: "customer",
        },
        {
          model: User,
          attributes: ["username"],
          as: "admin",
        },
      ],
      attributes: [
        "transaction_id",
        "loan_id",
        "customer_id",
        "admin_id",
        "amount",
        "transaction_type",
        "comments",
        "receipt",
        "receipt_url",
        "created_at",
      ],
    });

    // Format the response data
    const formattedRecentLoans = recentLoans.map((loan) => ({
      ...loan.toJSON(),
      customerName: loan.user?.username || loan.customer_name,
      customerEmail: loan.user?.email,
    }));

    const formattedRecentTransactions = recentTransactions.map(
      (transaction) => ({
        ...transaction.toJSON(),
        customerName: transaction.customer?.username || "Unknown",
        customerEmail: transaction.customer?.email,
        adminName: transaction.admin?.username,
      })
    );

    res.json({
      totalUsers: users.length,
      totalAdmins: admins.length,
      totalLoans: loans.length,
      totalTransactions: transactions.length,
      totalLoanAmount,
      totalAdvanceAmount,
      totalTransactionAmount,
      totalAvailableFunds,
      totalExpenses,
      monthlyExpenses,
      monthlyIncome,
      currentYear,
      recentLoans: formattedRecentLoans,
      recentTransactions: formattedRecentTransactions,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ msg: error.message });
  }
};

// Get monthly statistics
export const getMonthlyStats = async (req, res) => {
  try {
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    const [monthlyLoans, monthlyTransactions] = await Promise.all([
      Loan.findAll({
        where: {
          created_at: {
            [Op.gte]: startOfMonth,
          },
        },
      }),
      Transaction.findAll({
        where: {
          created_at: {
            [Op.gte]: startOfMonth,
          },
        },
      }),
    ]);

    res.json({
      monthlyLoans: monthlyLoans.length,
      monthlyTransactions: monthlyTransactions.length,
      monthlyLoanAmount: monthlyLoans.reduce(
        (sum, loan) => sum + Number(loan.loan_amount),
        0
      ),
      monthlyTransactionAmount: monthlyTransactions.reduce(
        (sum, trans) => sum + Number(trans.amount),
        0
      ),
    });
  } catch (error) {
    console.error("Monthly Stats Error:", error);
    res.status(500).json({ msg: error.message });
  }
};
