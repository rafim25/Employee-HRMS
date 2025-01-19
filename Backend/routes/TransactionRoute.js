import express from "express";
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByLoan,
} from "../controllers/TransactionController.js";
import {
  verify_User as verifyUser,
  admin_Only as adminOnly,
} from "../middleware/AuthUser.js";

const router = express.Router();

// Basic CRUD routes
router.get("/api/transactions", verifyUser, getTransactions);
router.get("/api/transactions/:id", verifyUser, getTransactionById);
router.post("/api/transactions", verifyUser, adminOnly, createTransaction);
router.patch("/api/transactions/:id", verifyUser, adminOnly, updateTransaction);
router.delete(
  "/api/transactions/:id",
  verifyUser,
  adminOnly,
  deleteTransaction
);

// Additional routes
router.get("/api/loan-transactions/:id", verifyUser, getTransactionsByLoan);

export default router;
