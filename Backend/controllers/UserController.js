import User from "../models/User.js";
import argon2 from "argon2";
import path from "path";
import fs from "fs";
import { Op } from "sequelize";

export const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.query;

    const whereClause = role
      ? {
          role: {
            [Op.like]: `%${role}%`,
          },
        }
      : {};

    const users = await User.findAll({
      where: whereClause,
      attributes: [
        "id",
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
      order: [["createdAt", "DESC"]], // Changed from created_at to createdAt to match your model
    });

    if (users.length === 0) {
      return res.status(404).json({
        msg: `No users found${role ? ` with role '${role}'` : ""}`,
      });
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
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
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        user_id: req.params.id,
      },
      attributes: [
        "id",
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
    });
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createUser = async (req, res) => {
  const {
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
    url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  }

  try {
    const hashPassword = await argon2.hash(password);
    await User.create({
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
    res.status(201).json({ msg: "User created successfully" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      user_id: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "User not found" });

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
      fs.unlinkSync(filePath);
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
          status,
          photo: fileName,
          url: url,
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
          status,
          photo: fileName,
          url: url,
        },
        {
          where: {
            user_id: req.params.id,
          },
        }
      );
    }
    res.json({ msg: "User updated successfully" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      user_id: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "User not found" });

  try {
    if (user.photo) {
      const filePath = `./public/images/${user.photo}`;
      fs.unlinkSync(filePath);
    }
    await User.destroy({
      where: {
        user_id: req.params.id,
      },
    });
    res.json({ msg: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Add this function to your UserController.js
export const updatePassword = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        user_id: req.params.id,
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await argon2.hash(req.body.password);

    await User.update(
      {
        password: hashedPassword,
      },
      {
        where: {
          user_id: req.params.id,
        },
      }
    );

    res.json({ msg: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
};
