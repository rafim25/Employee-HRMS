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

router.get("/api/data_pegawai", verifyUser, adminOnly, getDataPegawai);
router.get("/api/data_pegawai/:id", verifyUser, adminOnly, getDataPegawaiByID);
router.post("/api/data_pegawai", createDataPegawai);
router.patch("/api/data_pegawai/:id", verifyUser, adminOnly, updateDataPegawai);
router.delete(
  "/api/data_pegawai/:id",
  verifyUser,
  adminOnly,
  deleteDataPegawai
);

router.get("/api/users/filter", verifyUser, getUsersByRole);

router.get("/api/users", verify_User, getUsers);
router.get("/api/users/:id", verify_User, getUserById);
router.post("/api/users", verify_User, admin_Only, createUser);
router.patch("/api/users/:id", verify_User, admin_Only, updateUser);
router.delete("/api/users/:id", verify_User, admin_Only, deleteUser);

router.patch("/api/users/:id/password", verifyUser, updatePassword);

export default router;
