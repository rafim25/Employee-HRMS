import User from "../models/User.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export const LoginV2 = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    let isValidPassword = false;

    // First try direct comparison (for plain text passwords in DB)
    if (user.password === req.body.password) {
      isValidPassword = true;
    } else {
      // Try argon2 verification if direct comparison fails
      try {
        isValidPassword = await argon2.verify(user.password, req.body.password);
      } catch (error) {
        console.log("Password verification error:", error);
        isValidPassword = false;
      }
    }

    if (!isValidPassword) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.user_id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Set session for backward compatibility
    req.session.userId = user.user_id;

    // Return user data and token
    const { user_id, username, email, role, permissions } = user;
    res.status(200).json({
      user_id,
      username,
      email,
      role,
      permissions,
      token,
      msg: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const MeV2 = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ msg: "Please login to your account!" });
    }

    const user = await User.findOne({
      attributes: [
        "user_id",
        "username",
        "email",
        "role",
        "permissions",
        "status",
      ],
      where: {
        user_id: req.session.userId,
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Me error:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const LogOutV2 = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(400).json({ msg: "Unable to logout" });
    }
    res.status(200).json({ msg: "You have been logged out" });
  });
};

// Password reset request
export const RequestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Here you would typically:
    // 1. Generate a reset token
    // 2. Save it to the user record with an expiry
    // 3. Send an email with the reset link
    // For demo purposes, we'll just return a success message

    res.status(200).json({
      msg: "If an account exists with this email, you will receive a password reset link",
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Check session status
export const CheckSession = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        isLoggedIn: false,
        msg: "No active session",
      });
    }

    const user = await User.findOne({
      attributes: ["user_id", "username", "role"],
      where: {
        user_id: req.session.userId,
      },
    });

    if (!user) {
      return res.status(200).json({
        isLoggedIn: false,
        msg: "Session exists but user not found",
      });
    }

    res.status(200).json({
      isLoggedIn: true,
      user: {
        user_id: user.user_id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Check session error:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
