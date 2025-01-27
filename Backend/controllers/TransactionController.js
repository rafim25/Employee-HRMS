import Transaction from "../models/Transaction.js";
import Loan from "../models/Loan.js";
import User from "../models/User.js";
import { Op } from "sequelize";
import db from "../config/Database.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        {
          model: Loan,
          attributes: ["loan_amount", "remaining_balance", "status"],
        },
        {
          model: User,
          as: "customer",
          attributes: ["username", "email"],
        },
        {
          model: User,
          as: "admin",
          attributes: ["username"],
        },
      ],
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
        transaction_id: req.params.id,
      },
      include: [
        {
          model: Loan,
          attributes: ["loan_amount", "remaining_balance", "status"],
        },
        {
          model: User,
          as: "customer",
          attributes: ["username", "email"],
        },
        {
          model: User,
          as: "admin",
          attributes: ["username"],
        },
      ],
    });
    if (!transaction)
      return res.status(404).json({ msg: "Transaction not found" });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createTransaction = async (req, res) => {
  const t = await db.transaction();

  try {
    const { loan_id, amount, transaction_type, comments } = req.body;

    // First get the loan to get the customer_id
    const loan = await Loan.findOne({
      where: {
        loan_id: loan_id,
        status: "active",
      },
    });

    if (!loan) {
      return res.status(404).json({ msg: "Active loan not found" });
    }

    // Handle file upload
    let fileName = "";
    let url = "";

    if (req.files && req.files.receipt) {
      const file = req.files.receipt;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      fileName = file.md5 + ext;
      const allowedType = [".png", ".jpg", ".jpeg"];

      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "Invalid image format" });
      }
      if (fileSize > 5000000) {
        return res.status(422).json({ msg: "Image must be less than 5 MB" });
      }

      // Create directory path
      const uploadDir = path.join(__dirname, "..", "public", "receipts");

      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Use absolute path for file storage
      const uploadPath = path.join(uploadDir, fileName);

      try {
        await file.mv(uploadPath);
      } catch (err) {
        console.error("File upload error:", err);
        return res.status(500).json({ msg: err.message });
      }

      // Use production URL in production environment
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? "http://172.105.59.206:3002"
          : `${req.protocol}://${req.get("host")}`;

      url = `${baseUrl}/receipts/${fileName}`;
    }

    // Create transaction using the loan's customer_id
    const transaction = await Transaction.create(
      {
        loan_id,
        customer_id: loan.customer_id,
        admin_id: req.userId,
        amount,
        transaction_type,
        comments,
        receipt: fileName,
        receipt_url: url,
      },
      { transaction: t }
    );

    // Update loan remaining balance
    const balanceChange = transaction_type === "credit" ? -amount : amount;
    const newBalance =
      parseFloat(loan.remaining_balance) + parseFloat(balanceChange);

    if (newBalance < 0) {
      await t.rollback();
      return res
        .status(400)
        .json({ msg: "Payment amount exceeds remaining balance" });
    }

    await Loan.update(
      {
        remaining_balance: newBalance,
        status: newBalance === 0 ? "closed" : "active",
      },
      {
        where: { loan_id },
        transaction: t,
      }
    );

    await t.commit();

    res.status(201).json({
      msg: "Transaction created successfully",
      transaction: transaction,
    });
  } catch (error) {
    await t.rollback();
    console.error("Transaction error:", error);
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
          [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000), // Within last 24 hours
        },
      },
    });

    if (!transaction) {
      return res.status(404).json({
        msg: "Transaction not found or cannot be modified after 24 hours",
      });
    }

    const { amount, transaction_type } = req.body;

    // Reverse old transaction effect on loan balance
    const loan = await Loan.findByPk(transaction.loan_id);
    const oldBalanceChange =
      transaction.transaction_type === "credit"
        ? transaction.amount
        : -transaction.amount;
    let newBalance =
      parseFloat(loan.remaining_balance) - parseFloat(oldBalanceChange);

    // Apply new transaction effect
    const newBalanceChange = transaction_type === "credit" ? -amount : amount;
    newBalance += parseFloat(newBalanceChange);

    if (newBalance < 0) {
      await t.rollback();
      return res
        .status(400)
        .json({ msg: "Update would cause negative balance" });
    }

    await Transaction.update(
      {
        amount,
        transaction_type,
      },
      {
        where: { transaction_id: req.params.id },
        transaction: t,
      }
    );

    await Loan.update(
      {
        remaining_balance: newBalance,
        status: newBalance === 0 ? "closed" : "active",
      },
      {
        where: { loan_id: transaction.loan_id },
        transaction: t,
      }
    );

    await t.commit();

    res.json({
      msg: "Transaction updated successfully",
      transaction: await Transaction.findByPk(req.params.id),
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
          [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000), // Within last 24 hours
        },
      },
    });

    if (!transaction) {
      return res.status(404).json({
        msg: "Transaction not found or cannot be deleted after 24 hours",
      });
    }

    // Reverse transaction effect on loan balance
    const loan = await Loan.findByPk(transaction.loan_id);
    const balanceChange =
      transaction.transaction_type === "credit"
        ? transaction.amount
        : -transaction.amount;
    const newBalance =
      parseFloat(loan.remaining_balance) - parseFloat(balanceChange);

    await Loan.update(
      {
        remaining_balance: newBalance,
        status: newBalance === 0 ? "closed" : "active",
      },
      {
        where: { loan_id: transaction.loan_id },
        transaction: t,
      }
    );

    await Transaction.destroy({
      where: { transaction_id: req.params.id },
      transaction: t,
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
    const { id } = req.params;

    const transactions = await Transaction.findAll({
      where: {
        loan_id: id,
      },
      order: [["created_at", "DESC"]],
      include: [
        {
          model: User,
          as: "customer",
          attributes: ["username", "email"],
        },
        {
          model: User,
          as: "admin",
          attributes: ["username"],
        },
      ],
    });

    if (!transactions) {
      return res
        .status(404)
        .json({ msg: "No transactions found for this loan" });
    }

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching loan transactions:", error);
    res.status(500).json({ msg: error.message });
  }
};
