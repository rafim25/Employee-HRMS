import DataPegawai from "../models/DataPegawaiModel.js";
// import argon2 from "argon2";

import bcrypt from "bcrypt";

export const Login = async (req, res) => {
  try {
    const pegawai = await DataPegawai.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!pegawai)
      return res.status(404).json({ msg: "Data Pegawai tidak ditemukan" });

    console.log(
      "Database Password:",
      pegawai.password,
      "Input Password:",
      req.body.password
    );

    // const match = req.body.password, pegawai.password;

    if (req.body.password !== pegawai.password)
      return res.status(400).json({ msg: "Wrong Password" });

    req.session.userId = pegawai.id_pegawai;
    const { id_pegawai, nama_pegawai, username, hak_akses } = pegawai;
    res.status(200).json({ id_pegawai, nama_pegawai, username, hak_akses });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const Me = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Mohon login ke akun Anda!" });
  }
  const pegawai = await DataPegawai.findOne({
    attributes: ["id", "nama_pegawai", "username", "hak_akses"],
    where: {
      id_pegawai: req.session.userId,
    },
  });
  if (!pegawai) return res.status(404).json({ msg: "User tidak ditemukan" });
  res.status(200).json(pegawai);
};

export const LogOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: "Tidak dapat logout" });
    res.status(200).json({ msg: "Anda telah logout" });
  });
};
