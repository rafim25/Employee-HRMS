import User from "../models/User.js";
import argon2 from "argon2";
import path from "path";
import fs from "fs";
import { Op } from "sequelize";
import Loan from "../models/Loan.js";
import { v4 as uuidv4 } from 'uuid';
import { sendUserCredentialsEmail } from "./EmailController.js";

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
    const { parsePagination, paginationMeta, wantsPagination } = await import(
      "../utils/pagination.js"
    );
    const { Op } = await import("sequelize");
    const usePaging = wantsPagination(req.query);
    const { page, limit, offset } = parsePagination(req.query);

    const where = { status: "active" };
    if (req.query.role) where.role = req.query.role;
    if (req.query.search) {
      const q = String(req.query.search).trim();
      where[Op.or] = [
        { username: { [Op.like]: `%${q}%` } },
        { email: { [Op.like]: `%${q}%` } },
        { name: { [Op.like]: `%${q}%` } },
        { department: { [Op.like]: `%${q}%` } },
        { designation: { [Op.like]: `%${q}%` } },
      ];
    }

    const attributes = [
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
      "name",
    ];

    if (usePaging) {
      const { rows, count } = await User.findAndCountAll({
        where,
        attributes,
        order: [["date_joined", "DESC"]],
        limit,
        offset,
      });
      return res.status(200).json({
        data: rows,
        pagination: paginationMeta(page, limit, count),
      });
    }

    const users = await User.findAll({
      where,
      attributes,
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

        let emailSent = false;
        let emailError = null;
        try {
            await sendUserCredentialsEmail({
                name,
                username,
                email,
                password,
                role,
            });
            emailSent = true;
        } catch (mailError) {
            emailError = mailError.message;
            console.error('Failed to send user credential email:', mailError);
        }

        res.status(201).json({
            msg: emailSent
                ? "User created successfully. Login credentials were sent by email."
                : `User created successfully. Credential email could not be sent${emailError ? `: ${emailError}` : ''}.`,
            user,
            emailSent
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
    const { newPassword, currentPassword } = req.body;
    const userId = req.params.id;
    const requesterId = req.userId;
    const isAdmin = String(req.role || "").toLowerCase() === "admin";

    if (!newPassword || String(newPassword).length < 6) {
      return res.status(400).json({ msg: "New password must be at least 6 characters" });
    }

    // Employees may only change their own password
    if (!isAdmin && String(requesterId) !== String(userId)) {
      return res.status(403).json({ msg: "Access forbidden" });
    }

    const user = await User.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Self-service change requires current password verification
    const changingOwnPassword = String(requesterId) === String(userId);
    if (changingOwnPassword) {
      if (!currentPassword) {
        return res.status(400).json({ msg: "Current password is required" });
      }
      const valid = await argon2.verify(user.password, currentPassword);
      if (!valid) {
        return res.status(400).json({ msg: "Current password is incorrect" });
      }
    }

    const hashedNewPassword = await argon2.hash(newPassword, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    await User.update(
      { password: hashedNewPassword },
      { where: { user_id: userId } }
    );

    res.json({ msg: "Password updated successfully" });
  } catch (error) {
    console.error("Error in password update:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const pickField = (row, keys) => {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return typeof value === 'string' ? value.trim() : value;
    }
  }
  return undefined;
};

const generateUserId = () => `USR${Math.floor(1000 + Math.random() * 9000)}`;

export const bulkUploadUsers = async (req, res) => {
  try {
    const { users } = req.body;
    if (!users || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid users data provided',
      });
    }

    const sessionUser = req.user || { user_id: req.userId };
    const results = { success: [], duplicates: [], errors: [] };
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const aadharRegex = /^[0-9]{12}$/;

    for (const [index, rawUser] of users.entries()) {
      const rowNumber = index + 2;
      const name = pickField(rawUser, ['name', 'Name']);
      const username = pickField(rawUser, ['username', 'Username']);
      const emailRaw = pickField(rawUser, ['email', 'Email']);
      try {
        const email = emailRaw ? String(emailRaw).toLowerCase().trim() : '';
        const password = pickField(rawUser, ['password', 'Password']);
        const gender = pickField(rawUser, ['gender', 'Gender']);
        const roleRaw = pickField(rawUser, ['role', 'Role']);

        if (!name) throw new Error('Name is required.');
        if (!username) throw new Error('Username is required.');
        if (!email) throw new Error('Email is required.');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          throw new Error(`Email "${email}" is not valid.`);
        }
        if (!password) throw new Error('Password is required.');
        if (String(password).length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        if (!gender) throw new Error('Gender is required.');
        if (!roleRaw) throw new Error('Role is required (Admin or User).');

        const roleNormalized = String(roleRaw).toLowerCase() === 'admin' ? 'Admin' : 'User';
        if (!['admin', 'user'].includes(String(roleRaw).toLowerCase())) {
          throw new Error(`Invalid role "${roleRaw}". Allowed: Admin, User.`);
        }

        const statusValue = pickField(rawUser, ['status', 'Status']) || 'active';
        const status = String(statusValue).toLowerCase();
        if (!['active', 'inactive'].includes(status)) {
          throw new Error(`Invalid status "${statusValue}". Allowed: active, inactive.`);
        }

        const pan_number = pickField(rawUser, ['pan_number', 'PAN', 'pan']);
        if (pan_number && !panRegex.test(String(pan_number).toUpperCase())) {
          throw new Error('PAN must match format ABCDE1234F.');
        }

        const aadhar_number = pickField(rawUser, ['aadhar_number', 'Aadhar', 'aadhar']);
        if (aadhar_number && !aadharRegex.test(String(aadhar_number))) {
          throw new Error('Aadhar must be exactly 12 digits.');
        }

        const creatorId = pickField(rawUser, ['created_by_id', 'Creator_ID', 'creator_id']) || sessionUser.user_id;
        if (!creatorId) {
          throw new Error('Creator ID is required. Sign in and use the template default, or provide created_by_id.');
        }
        const creator = await User.findOne({ where: { user_id: String(creatorId) } });
        if (!creator) {
          throw new Error(`Creator ID "${creatorId}" does not exist in the users table.`);
        }

        let user_id = pickField(rawUser, ['user_id', 'User_ID', 'User ID']) || generateUserId();
        const existingId = await User.findOne({ where: { user_id } });
        if (existingId) {
          results.duplicates.push({
            name,
            email,
            error: `Row ${rowNumber}: User ID "${user_id}" already exists.`,
          });
          continue;
        }

        const existingUsername = await User.findOne({ where: { username } });
        if (existingUsername) {
          results.duplicates.push({
            name,
            email,
            error: `Row ${rowNumber}: Username "${username}" already exists.`,
          });
          continue;
        }

        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
          results.duplicates.push({
            name,
            email,
            error: `Row ${rowNumber}: Email "${email}" already exists.`,
          });
          continue;
        }

        const permissions = pickField(rawUser, ['permissions', 'Permissions']);
        const created = await User.create({
          uuid: uuidv4(),
          user_id,
          name,
          username,
          email,
          password: await argon2.hash(String(password)),
          gender: String(gender).toLowerCase(),
          role: roleNormalized,
          department: pickField(rawUser, ['department', 'Department']) || null,
          designation: pickField(rawUser, ['designation', 'Designation']) || null,
          mobile_number: pickField(rawUser, ['mobile_number', 'Mobile', 'phone']) || null,
          alt_mobile_number: pickField(rawUser, ['alt_mobile_number', 'Alt Mobile']) || null,
          pan_number: pan_number ? String(pan_number).toUpperCase() : null,
          aadhar_number: aadhar_number ? String(aadhar_number) : null,
          address: pickField(rawUser, ['address', 'Address']) || null,
          status,
          permissions: permissions ? JSON.stringify(splitPermissions(permissions)) : '[]',
        });

        let emailMessage = 'Credential email could not be sent.';
        try {
          await sendUserCredentialsEmail({
            name,
            username,
            email,
            password,
            role: roleNormalized,
          });
          emailMessage = 'Login credentials were sent by email.';
        } catch (mailError) {
          console.error(`Failed to send credential email for ${email}:`, mailError);
          emailMessage = `User was created, but the credential email failed: ${mailError.message}`;
        }

        results.success.push({
          name,
          email,
          id: created.user_id,
          message: `Row ${rowNumber}: User created. Creator ID ${creator.user_id} was validated. ${emailMessage}`,
        });
      } catch (error) {
        results.errors.push({
          name: name || `Row ${rowNumber}`,
          email: emailRaw || '',
          error: `Row ${rowNumber}: ${error.message}`,
        });
      }
    }

    const message = `Processed ${users.length} users: ${results.success.length} successful, ${results.duplicates.length} duplicates, ${results.errors.length} errors`;
    return res.status(200).json({
      success: true,
      message,
      results,
    });
  } catch (error) {
    console.error('Bulk user upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process users',
      error: error.message,
    });
  }
};

const splitPermissions = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : String(value).split(',').map((item) => item.trim()).filter(Boolean);
  } catch {
    return String(value).split(',').map((item) => item.trim()).filter(Boolean);
  }
};
