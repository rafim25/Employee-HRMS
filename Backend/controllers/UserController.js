import User from "../models/User.js";
import argon2 from "argon2";
import path from "path";
import fs from "fs";
import { Op } from "sequelize";
import Loan from "../models/Loan.js";

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
        status: "active", // Only fetch active users
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
        status: "active", // Only fetch active users
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

    if (!user) {
      return res.status(404).json({ msg: "Active user not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createUser = async (req, res) => {
  const {
    user_id = "default_user_id",
    username,
    email,
    password,
    gender,
    role,
    mobile_number,
    address,
    permissions,
  } = req.body;

  // Handle file upload
  let fileName = "";
  let url = "";

  if (req.files && req.files.photo) {
    const file = req.files.photo;
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

    file.mv(`./public/images/${fileName}`, async (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });

    // Use production URL in production environment
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "http://172.105.59.206:3002"
        : `${req.protocol}://${req.get("host")}`;

    url = `${baseUrl}/images/${fileName}`;
  }

  try {
    const hashPassword = await argon2.hash(password);
    const newUser = await User.create({
      user_id: user_id,
      username,
      email,
      password: hashPassword,
      gender,
      role,
      mobile_number,
      address,
      permissions,
      photo: fileName,
      url: url,
    });
    res
      .status(201)
      .json({ msg: "User created successfully", user_id: newUser.user_id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        user_id: req.params.id,
        status: "active", // Only update active users
      },
    });

    if (!user) return res.status(404).json({ msg: "Active user not found" });

    let fileName = user.photo;
    let url = user.url;

    if (req.files && req.files.photo) {
      const file = req.files.photo;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      fileName = file.md5 + ext;

      if (fileSize > 5000000) {
        return res.status(422).json({ msg: "Image must be less than 5 MB" });
      }

      if (user.photo) {
        const filePath = `./public/images/${user.photo}`;
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (error) {
          console.error("Error deleting old photo:", error);
        }
      }

      file.mv(`./public/images/${fileName}`, (err) => {
        if (err) return res.status(500).json({ msg: err.message });
      });
      url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    }

    const {
      username,
      email,
      password,
      gender,
      role,
      mobile_number,
      address,
      permissions,
      status,
    } = req.body;

    // Prevent changing status to inactive through this endpoint
    if (status === "inactive") {
      return res.status(400).json({
        msg: "Cannot change user status to inactive through this endpoint. Please use the deactivate endpoint.",
      });
    }

    try {
      if (password) {
        const hashPassword = await argon2.hash(password);
        await User.update(
          {
            username,
            email,
            password: hashPassword,
            gender,
            role,
            mobile_number,
            address,
            permissions,
            status: "active", // Ensure status remains active
            photo: fileName,
            url: url,
            updated_at: new Date(),
          },
          {
            where: {
              user_id: req.params.id,
            },
          }
        );
      } else {
        await User.update(
          {
            username,
            email,
            gender,
            role,
            mobile_number,
            address,
            permissions,
            status: "active", // Ensure status remains active
            photo: fileName,
            url: url,
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
    const { currentPassword, newPassword } = req.body;
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

    // Trim any whitespace from the stored password hash
    const storedPassword = user.password.trim();
    console.log("Stored password (after trim):", storedPassword);

    try {
      // Compare the stored password with the provided current password
      const isPasswordValid = await argon2.verify(
        storedPassword,
        currentPassword
      );
      console.log("Password verification result:", isPasswordValid);

      if (!isPasswordValid) {
        return res.status(400).json({ msg: "Current password is incorrect" });
      }

      // If we get here, the current password is correct
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
    } catch (verifyError) {
      console.error("Password verification error:", verifyError);
      return res.status(400).json({ msg: "Error verifying current password" });
    }
  } catch (error) {
    console.error("Error in password update:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
