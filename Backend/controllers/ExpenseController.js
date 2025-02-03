import Expense from "../models/Expense.js";
import User from "../models/User.js";
import path from "path";

// Get all expenses
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      include: [
        {
          model: User,
          attributes: ["username", "email"],
        },
      ],
      order: [["created_at", "DESC"]],
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single expense
export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      where: {
        uuid: req.params.id,
      },
      include: [
        {
          model: User,
          attributes: ["username", "email"],
        },
      ],
    });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new expense
export const createExpense = async (req, res) => {
  try {
    let expenseImage = null;

    // Handle file upload if exists
    if (req.files && req.files.expenseImage) {
      const file = req.files.expenseImage;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const allowedTypes = [".png", ".jpg", ".jpeg"];

      // Validate file
      if (!allowedTypes.includes(ext.toLowerCase())) {
        return res.status(422).json({ message: "Invalid image type" });
      }
      if (fileSize > 5000000) {
        return res.status(422).json({ message: "Image must be less than 5MB" });
      }

      // Generate unique filename
      const fileName = file.md5 + ext;
      const url = `uploads/expenses/${fileName}`;

      // Move file to uploads directory
      await file.mv(`./public/uploads/expenses/${fileName}`);
      expenseImage = url;
    }

    // Create expense record
    const expense = await Expense.create({
      ...req.body,
      user_id: req.userId,
      expense_image: expenseImage,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update expense
export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    let updates = { ...req.body };

    // Handle file upload if exists
    if (req.files && req.files.expenseImage) {
      const file = req.files.expenseImage;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const allowedTypes = [".png", ".jpg", ".jpeg"];

      // Validate file
      if (!allowedTypes.includes(ext.toLowerCase())) {
        return res.status(422).json({ message: "Invalid image type" });
      }
      if (fileSize > 5000000) {
        return res.status(422).json({ message: "Image must be less than 5MB" });
      }

      // Generate unique filename
      const fileName = file.md5 + ext;
      const url = `uploads/expenses/${fileName}`;

      // Move file to uploads directory
      await file.mv(`./public/uploads/expenses/${fileName}`);
      updates.expense_image = url;
    }

    await expense.update(updates);
    res.json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await expense.destroy();
    res.json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
