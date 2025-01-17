import express from "express";
import {
    getTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByLoan
} from "../controllers/TransactionController.js";
import { verify_User as verifyUser, admin_Only as adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

// Basic CRUD routes
router.get('/transactions', verifyUser, getTransactions);
router.get('/transactions/:id', verifyUser, getTransactionById);
router.post('/transactions', verifyUser, adminOnly, createTransaction);
router.patch('/transactions/:id', verifyUser, adminOnly, updateTransaction);
router.delete('/transactions/:id', verifyUser, adminOnly, deleteTransaction);

// Additional routes
router.get('/loan-transactions/:loanId', verifyUser, getTransactionsByLoan);

export default router;