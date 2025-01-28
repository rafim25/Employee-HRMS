import User from "../models/User.js";
import Loan from "../models/Loan.js";
import Transaction from "../models/Transaction.js";

// Get employee profile
export const getEmployeeProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const employee = await User.findOne({
      where: {
        user_id: userId,
      },
      attributes: [
        "user_id",
        "username",
        "email",
        "role",
        "gender",
        "date_joined",
        "mobile_number",
        "address",
        "status",
        "photo",
        "url",
        "permissions",
      ],
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(200).json({
      name: employee.username,
      position: employee.role,
      joinDate: employee.date_joined,
      status: employee.status,
      email: employee.email,
      gender: employee.gender,
      mobile_number: employee.mobile_number,
      address: employee.address,
      photo: employee.photo,
      url: employee.url,
      permissions: employee.permissions,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get employee loan statistics
export const getEmployeeLoanStatistics = async (req, res) => {
  try {
    const userId = req.userId;

    // Get total loans
    const totalLoans = await Loan.count({
      where: { customer_id: userId },
    });

    // Get active loans
    const activeLoans = await Loan.count({
      where: {
        customer_id: userId,
        status: "active",
      },
    });

    // Calculate total amount paid
    const transactions = await Transaction.sum("amount", {
      where: {
        customer_id: userId,
        transaction_type: "credit",
      },
    });

    // Calculate advance paid
    const advancePaid = await Loan.sum("advance_amount", {
      where: { customer_id: userId },
    });

    res.status(200).json({
      totalLoans,
      totalAmountPaid: transactions || 0,
      totalAdvancePaid: advancePaid || 0,
      activeLoans,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get employee recent loans
export const getEmployeeRecentLoans = async (req, res) => {
  try {
    const userId = req.userId;
    const loans = await Loan.findAll({
      where: { customer_id: userId },
      attributes: [
        "loan_id",
        "loan_amount",
        "created_at",
        "status",
        "remaining_balance",
      ],
      order: [["created_at", "DESC"]],
      limit: 5,
    });

    const formattedLoans = loans.map((loan) => ({
      loanId: loan.loan_id,
      amount: loan.loan_amount,
      date: loan.created_at,
      status: loan.status,
      paidAmount: loan.loan_amount - loan.remaining_balance,
    }));

    res.status(200).json(formattedLoans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get employee recent activities
export const getEmployeeRecentActivities = async (req, res) => {
  try {
    const userId = req.userId;

    // Get recent loan applications and transactions
    const [loans, transactions] = await Promise.all([
      Loan.findAll({
        where: { customer_id: userId },
        order: [["created_at", "DESC"]],
        limit: 3,
        attributes: ["loan_id", "loan_amount", "status", "created_at"],
      }),
      Transaction.findAll({
        where: { customer_id: userId },
        order: [["created_at", "DESC"]],
        limit: 3,
        attributes: [
          "transaction_id",
          "amount",
          "created_at",
          "transaction_type",
        ],
      }),
    ]);

    // Combine and format activities
    const activities = [
      ...loans.map((loan) => ({
        description: `Purchase application ${loan.status.toLowerCase()} for ₹${
          loan.loan_amount
        }`,
        date: loan.created_at,
      })),
      ...transactions.map((transaction) => ({
        description: `${
          transaction.transaction_type === "credit" ? "Payment" : "Advance"
        } of ₹${transaction.amount} made`,
        date: transaction.created_at,
      })),
    ];

    // Sort by date and limit to 5 most recent activities
    activities.sort((a, b) => b.date - a.date);
    const recentActivities = activities.slice(0, 5);

    res.status(200).json(recentActivities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get transactions for a specific loan
export const getLoanTransactions = async (req, res) => {
  try {
    const userId = req.userId;
    const loanId = req.params.id;

    // First verify that the loan belongs to the user
    const loan = await Loan.findOne({
      where: {
        loan_id: loanId,
        customer_id: userId,
      },
    });

    if (!loan) {
      return res.status(404).json({ error: "Loan not found or unauthorized" });
    }

    // Get all transactions for this loan
    const transactions = await Transaction.findAll({
      where: { loan_id: loanId },
      attributes: [
        "transaction_id",
        "amount",
        "transaction_type",
        "comments",
        "status",
        "created_at",
      ],
      order: [["created_at", "DESC"]],
    });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
