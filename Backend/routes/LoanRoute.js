import express from "express";
import {
  getLoans,
  getLoanById,
  createLoan,
  updateLoan,
  deleteLoan,
  getLoansByCustomer,
} from "../controllers/LoanController.js";
import {
  verify_User as verifyUser,
  admin_Only as adminOnly,
} from "../middleware/AuthUser.js";

const router = express.Router();

// Basic CRUD routes
router.get("/loans", verifyUser, getLoans);
router.get("/loans/:id", verifyUser, getLoanById);
router.post("/loans", verifyUser, adminOnly, createLoan);
router.patch("/loans/:id", verifyUser, adminOnly, updateLoan);
router.delete("/loans/:id", verifyUser, adminOnly, deleteLoan);

// Additional routes
router.get("/customer-loans/:customerId", verifyUser, getLoansByCustomer);

export default router;
