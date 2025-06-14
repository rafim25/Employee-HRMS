import User from "../models/User.js";
import argon2 from "argon2";
import path from "path";
import fs from "fs";
import { Op } from "sequelize";
import Loan from "../models/Loan.js";
import { v4 as uuidv4 } from 'uuid';

export const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.query;

    const whereClause = {
      status: "active", // Only fetch active users
      ...(role && {
        role: {
          [Op.like]: `%${role}%`,
        },
      }),
    };

    const users = await User.findAll({
      where: whereClause,
      attributes: [
        "user_id",
        "username",
        "email",
        "gender",
        "role",
        "date_joined",
        "mobile_number",
        "address",
        "status",
        "photo",
        "url",
        "permissions",
      ],
      order: [["date_joined", "DESC"]],
    });

    if (users.length === 0) {
      return res.status(404).json({
        msg: `No active users found${role ? ` with role '${role}'` : ""}`,
      });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        status: "active",
      },
      attributes: [
        "user_id",
        "username",
        "email",
        "role",
        "gender",
        "date_joined",
        "department",
        "designation",
        "mobile_number",
        "alt_mobile_number",
        "pan_number",
        "aadhar_number",
        "address",
        "status",
        "photo",
        "url",
        "permissions",
      ],
      order: [["date_joined", "DESC"]],
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        user_id: req.params.id,
        status: "active",
      },
      attributes: [
        "user_id",
        "username",
        "email",
        "role",
        "gender",
        "date_joined",
        "department",
        "designation",
        "mobile_number",
        "alt_mobile_number",
        "pan_number",
        "aadhar_number",
        "address",
        "status",
        "photo",
        "url",
        "permissions",
      ],
    });

    if (!user) {
      return res.status(404).json({ msg: "Active user not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createUser = async (req, res) => {
    try {
        const {
            user_id,
            name,
            username,
            email,
            password,
            gender,
            role,
            department,
            designation,
            mobile_number,
            alt_mobile_number,
            pan_number,
            aadhar_number,
            address,
            permissions,
            url
        } = req.body;

        // Log the request body to debug
        console.log('Creating user with data:', req.body);

        // Validate required fields
        if (!username || !email || !password || !role) {
            return res.status(400).json({
                msg: "Required fields missing"
            });
        }

        // Check if username already exists
        const existingUser = await User.findOne({
            where: { username }
        });

        if (existingUser) {
            return res.status(400).json({
                msg: "Username already exists. Please choose a different username."
            });
        }

        const hashPassword = await argon2.hash(password);
        
        // Convert permissions to string if it's an array or object
        const stringifiedPermissions = permissions ? JSON.stringify(permissions) : '[]';

        const user = await User.create({
            uuid: uuidv4(),
            user_id,
            name,
            username,
            email,
            password: hashPassword,
            gender,
            role,
            department,
            designation,
            mobile_number,
            alt_mobile_number,
            pan_number,
            aadhar_number,
            address,
            permissions: stringifiedPermissions,
            url,
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        res.status(201).json({
            msg: "User created successfully",
            user
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            msg: "Failed to create user",
            error: error.message
        });
    }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        user_id: req.params.id,
        status: "active",
      },
    });

    if (!user) return res.status(404).json({ msg: "Active user not found" });

    const {
      username,
      email,
      password,
      role,
      gender,
      date_joined,
      department,
      designation,
      mobile_number,
      alt_mobile_number,
      pan_number,
      aadhar_number,
      address,
      permissions,
      status,
      url
    } = req.body;

    // Prevent changing status to inactive through this endpoint
    if (status === "inactive") {
      return res.status(400).json({
        msg: "Cannot change user status to inactive through this endpoint. Please use the deactivate endpoint.",
      });
    }

    try {
      // If password is provided, hash it and update with password
      if (password) {
        const hashPassword = await argon2.hash(password);
        await User.update(
          {
            username,
            email,
            password: hashPassword,
            role,
            gender,
            date_joined,
            department,
            designation,
            mobile_number,
            alt_mobile_number,
            pan_number,
            aadhar_number,
            address,
            permissions,
            status: "active", // Ensure status remains active
            photo: null, // Set photo to null as per payload
            url, // Use the URL from the payload
            updated_at: new Date(),
          },
          {
            where: {
              user_id: req.params.id,
            },
          }
        );
      } else {
        // If no password provided, update without password field
        await User.update(
          {
            username,
            email,
            role,
            gender,
            date_joined,
            department,
            designation,
            mobile_number,
            alt_mobile_number,
            pan_number,
            aadhar_number,
            address,
            permissions,
            status: "active", // Ensure status remains active
            photo: null, // Set photo to null as per payload
            url, // Use the URL from the payload
            updated_at: new Date(),
          },
          {
            where: {
              user_id: req.params.id,
            },
          }
        );
      }

      res.status(200).json({ msg: "User updated successfully" });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        user_id: req.params.id,
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check for associated active loans
    const loans = await Loan.findAll({
      where: {
        customer_id: req.params.id,
        status: "active",
      },
    });

    if (loans.length > 0) {
      return res.status(400).json({
        msg: "Cannot deactivate user with active purchases. Please close or reassign all purchases first.",
      });
    }

    // Update user status to inactive instead of deleting
    await User.update(
      {
        status: "inactive",
        updated_at: new Date(),
      },
      {
        where: {
          user_id: req.params.id,
        },
      }
    );

    res.status(200).json({ msg: "User deactivated successfully" });
  } catch (error) {
    console.error("Error deactivating user:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const userId = req.params.id;

    console.log("Attempting password update for user:", userId);

    // Find user in Users collection
    const user = await User.findOne({
      where: {
        user_id: userId,
      },
    });

    if (!user) {
      console.log("User not found:", userId);
      return res.status(404).json({ msg: "User not found" });
    }

    console.log("Found user:", user.username);

    try {
      // Hash new password
      const hashedNewPassword = await argon2.hash(newPassword, {
        type: argon2.argon2id,
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 4,
      });

      // Update password
      await User.update(
        { password: hashedNewPassword },
        { where: { user_id: userId } }
      );

      res.json({ msg: "Password updated successfully" });
    } catch (error) {
      console.error("Password update error:", error);
      return res.status(400).json({ msg: "Error updating password" });
    }
  } catch (error) {
    console.error("Error in password update:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
