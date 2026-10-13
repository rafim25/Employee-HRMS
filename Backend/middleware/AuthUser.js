import DataPegawai from "../models/DataPegawaiModel.js";
import User from "../models/User.js";

export const verifyUser = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Please log in to your account!" });
  }
  try {
    const pegawai = await DataPegawai.findOne({
      where: {
        id_pegawai: req.session.userId,
      },
    });
    if (!pegawai) return res.status(404).json({ msg: "User not found" });
    req.userId = pegawai.id;
    req.hak_akses = pegawai.hak_akses;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const adminOnly = async (req, res, next) => {
  try {
    const pegawai = await DataPegawai.findOne({
      where: {
        id_pegawai: req.session.userId,
      },
    });
    if (!pegawai)
      return res.status(404).json({ msg: "Employee not found" });
    if (pegawai.hak_akses !== "admin")
      return res.status(403).json({ msg: "Access forbidden" });
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const verify_User = async (req, res, next) => {
  console.log("req.session.userId", req.session.userId);
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Please login to your account!" });
  }

  console.log("req.session.userIdreq.session.userId", req.session.userId);
  const user = await User.findOne({
    where: {
      user_id: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User not found" });
  req.user = user;
  req.userId = user.user_id;
  req.role = user.role;
  req.name = user.name;
  next();
};

const isAdminRole = (role) => String(role || "").toLowerCase() === "admin";

export const admin_Only = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      user_id: req.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User not found" });
  if (!isAdminRole(user.role))
    return res.status(403).json({ msg: "Access forbidden" });
  next();
};
