import { Op } from "sequelize";
import Loan from "../models/Loan.js";
import User from "../models/User.js";

export const getLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll({
      where: {
        status: {
          [Op.in]: ["active", "closed"], // Corrected condition
        }, // Only fetch active loans
      },
      attributes: [
        "loan_id",
        "customer_id",
        "customer_name",
        "loan_amount",
        "advance_amount",
        "remaining_balance",
        "referred_by",
        "status",
        "created_at",
        "updated_at",
      ],
      include: [
        {
          model: User,
          attributes: ["username", "email"],
        },
      ],
      order: [["created_at", "DESC"]],
    });
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findOne({
      where: {
        loan_id: req.params.id,
        status: {
          [Op.in]: ["active", "closed"], // Corrected condition
        }, // Only fetch active loans
      },
      include: [
        {
          model: User,
          attributes: ["username", "email"],
        },
      ],
    });

    if (!loan) {
      return res.status(404).json({ msg: "Active loan not found" });
    }

    res.status(200).json(loan);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createLoan = async (req, res) => {
  const {
    loan_id,
    customer_id,
    customer_name,
    loan_amount,
    advance_amount,
    referred_by,
  } = req.body;

  try {
    // Verify if user exists
    const user = await User.findOne({
      where: {
        user_id: customer_id,
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "Customer not found" });
    }

    // Check if loan_id already exists
    const existingLoan = await Loan.findOne({
      where: {
        loan_id: loan_id,
      },
    });

    if (existingLoan) {
      return res.status(400).json({ msg: "Loan ID already exists" });
    }

    // Create new loan with advance amount
    const loan = await Loan.create({
      loan_id,
      customer_id,
      customer_name,
      loan_amount,
      advance_amount,
      referred_by,
      remaining_balance: loan_amount - advance_amount, // Calculate remaining balance
      status: "active",
    });

    res.status(201).json({
      msg: "Purchase created successfully",
      loan: loan,
    });
  } catch (error) {
    console.error("Error creating loan:", error);
    res.status(400).json({ msg: error.message });
  }
};

export const updateLoan = async (req, res) => {
  try {
    const loan = await Loan.findOne({
      where: {
        loan_id: req.params.id,
      },
    });

    if (!loan) return res.status(404).json({ msg: "Loan not found" });

    const { loan_amount, advance_amount, status } = req.body;

    // Calculate new remaining balance
    const remaining_balance = loan_amount - advance_amount;

    // Update loan with new values
    await Loan.update(
      {
        loan_amount,
        advance_amount,
        remaining_balance,
        status,
      },
      {
        where: {
          loan_id: req.params.id,
        },
      }
    );

    // Fetch the updated loan to return in response
    const updatedLoan = await Loan.findOne({
      where: {
        loan_id: req.params.id,
      },
      include: [
        {
          model: User,
          attributes: ["username", "email"],
        },
      ],
    });

    res.json({
      msg: "Loan updated successfully",
      loan: updatedLoan,
    });
  } catch (error) {
    console.error("Error updating loan:", error);
    res.status(400).json({ msg: error.message });
  }
};

export const deleteLoan = async (req, res) => {
  try {
    const loan = await Loan.findOne({
      where: {
        loan_id: req.params.id,
      },
    });

    if (!loan) {
      return res.status(404).json({ msg: "Purchase not found" });
    }

    // Check if loan can be marked as closed
    if (loan.status === "active" && loan.remaining_balance > 0) {
      return res.status(400).json({
        msg: "Cannot close active Purchase with remaining balance",
      });
    }

    // Update loan status to closed instead of inactive
    await Loan.update(
      {
        status: "inactive",
        updated_at: new Date(),
      },
      {
        where: {
          loan_id: req.params.id,
        },
      }
    );

    res.status(200).json({ msg: "Purchase deleted successfully" });
  } catch (error) {
    console.error("Error marking purchase as inactive:", error);
    res.status(500).json({ msg: error.message });
  }
};

// Additional utility function to get loans by customer
export const getLoansByCustomer = async (req, res) => {
  try {
    const loans = await Loan.findAll({
      where: {
        customer_id: req.params.customerId,
        status: "active", // Only fetch active loans
      },
      include: [
        {
          model: User,
          attributes: ["username", "email"],
        },
      ],
    });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
