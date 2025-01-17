import express from "express";
import {
  getDataPegawai,
  getDataPegawaiByID,
  createDataPegawai,
  updateDataPegawai,
  deleteDataPegawai,
} from "../controllers/DataPegawai.js";

import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUsersByRole,
  updatePassword,
} from "../controllers/UserController.js";

import {
  admin_Only,
  verify_User,
  verifyUser,
  adminOnly,
} from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/data_pegawai", verifyUser, adminOnly, getDataPegawai);
router.get("/data_pegawai/:id", verifyUser, adminOnly, getDataPegawaiByID);
router.post("/data_pegawai", createDataPegawai);
router.patch("/data_pegawai/:id", verifyUser, adminOnly, updateDataPegawai);
router.delete("/data_pegawai/:id", verifyUser, adminOnly, deleteDataPegawai);

router.get("/users/filter", verifyUser, getUsersByRole); // New endpoint for filtering users

router.get("/users", verify_User, getUsers);
router.get("/users/:id", verify_User, getUserById);
router.post("/users", verify_User, admin_Only, createUser);
router.patch("/users/:id", verify_User, admin_Only, updateUser);
router.delete("/users/:id", verify_User, admin_Only, deleteUser);

router.patch("/users/:id/password", verifyUser, updatePassword);

export default router;
