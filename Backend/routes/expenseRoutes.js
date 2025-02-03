import express from "express";
import { verify_User, admin_Only } from "../middleware/AuthUser.js";
import path from "path";
import { fileURLToPath } from "url";
import Expense from "../models/Expense.js";
import User from "../models/User.js";

const router = express.Router();

// Get all expenses
router.get("/expenses", verify_User, admin_Only, async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      include: [
        {
          model: User,
          attributes: ["username", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Get single expense
router.get("/expenses/:id", verify_User, admin_Only, async (req, res) => {
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
      return res.status(404).json({ msg: "Expense not found" });
    }
    res.json(expense);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Create new expense
router.post("/expenses", verify_User, admin_Only, async (req, res) => {
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
        return res.status(422).json({ msg: "Invalid image type" });
      }
      if (fileSize > 5000000) {
        return res.status(422).json({ msg: "Image must be less than 5MB" });
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
      userId: req.userId,
      expenseImage: expenseImage,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

// Update expense
router.put("/expenses/:id", verify_User, admin_Only, async (req, res) => {
  try {
    const expense = await Expense.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!expense) {
      return res.status(404).json({ msg: "Expense not found" });
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
        return res.status(422).json({ msg: "Invalid image type" });
      }
      if (fileSize > 5000000) {
        return res.status(422).json({ msg: "Image must be less than 5MB" });
      }

      // Generate unique filename
      const fileName = file.md5 + ext;
      const url = `uploads/expenses/${fileName}`;

      // Move file to uploads directory
      await file.mv(`./public/uploads/expenses/${fileName}`);
      updates.expenseImage = url;
    }

    await expense.update(updates);
    res.json(expense);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

// Delete expense
router.delete("/expenses/:id", verify_User, admin_Only, async (req, res) => {
  try {
    const expense = await Expense.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!expense) {
      return res.status(404).json({ msg: "Expense not found" });
    }

    await expense.destroy();
    res.json({ msg: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export default router;
