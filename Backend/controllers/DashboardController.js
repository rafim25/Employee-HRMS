import User from "../models/User.js";
import Loan from "../models/Loan.js";
import Transaction from "../models/Transaction.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Get users, admins, loans, and transactions in parallel
    const [users, admins, loans, transactions] = await Promise.all([
      User.findAll({ where: { role: "User" } }),
      User.findAll({ where: { role: "Admin" } }),
      Loan.findAll(),
      Transaction.findAll()
    ]);

    // Calculate total loan amount
    const totalLoanAmount = loans.reduce((sum, loan) => sum + Number(loan.loan_amount), 0);
    
    // Calculate total transactions amount
    const totalTransactionAmount = transactions.reduce((sum, trans) => {
      return sum + Number(trans.amount);
    }, 0);

    res.json({
      totalUsers: users.length,
      totalAdmins: admins.length,
      totalLoans: loans.length,
      totalTransactions: transactions.length,
      totalLoanAmount,
      totalTransactionAmount,
      recentLoans: loans.slice(-5), // Get last 5 loans
      recentTransactions: transactions.slice(-5) // Get last 5 transactions
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
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const [monthlyLoans, monthlyTransactions] = await Promise.all([
      Loan.findAll({
        where: {
          createdAt: {
            [Op.gte]: startOfMonth
          }
        }
      }),
      Transaction.findAll({
        where: {
          created_at: {
            [Op.gte]: startOfMonth
          }
        }
      })
    ]);

    res.json({
      monthlyLoans: monthlyLoans.length,
      monthlyTransactions: monthlyTransactions.length,
      monthlyLoanAmount: monthlyLoans.reduce((sum, loan) => sum + Number(loan.loan_amount), 0),
      monthlyTransactionAmount: monthlyTransactions.reduce((sum, trans) => sum + Number(trans.amount), 0)
    });
  } catch (error) {
    console.error("Monthly Stats Error:", error);
    res.status(500).json({ msg: error.message });
  }
};