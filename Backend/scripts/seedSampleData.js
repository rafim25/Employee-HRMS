import argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";
import db from "../config/Database.js";
import User from "../models/User.js";
import Skill from "../models/Skill.js";
import Job from "../models/Job.js";
import Candidate from "../models/Candidate.js";
import Expense from "../models/Expense.js";
import Loan from "../models/Loan.js";
import Transaction from "../models/Transaction.js";
import DataPegawai from "../models/DataPegawaiModel.js";
import DataJabatan from "../models/DataJabatanModel.js";
import DataKehadiran from "../models/DataKehadiranModel.js";
import PotonganGaji from "../models/PotonganGajiModel.js";

const passwordHash = () => argon2.hash("Password@123");

const upsertUser = async (data) => {
  const existing = await User.findOne({ where: { username: data.username } });
  if (existing) {
    await existing.update(data);
    return existing;
  }
  return User.create(data);
};

const seedSampleData = async () => {
  await db.authenticate();
  await db.sync();

  const adminPassword = await argon2.hash("Admin@123");
  const userPassword = await passwordHash();

  const admin = await upsertUser({
    uuid: uuidv4(),
    user_id: "ADM001",
    name: "Local Admin",
    username: "admin",
    email: "admin@localhost",
    password: adminPassword,
    gender: "other",
    role: "Admin",
    status: "active",
    department: "Management",
    designation: "Administrator",
    mobile_number: "9999999999",
    permissions: JSON.stringify([]),
  });

  const recruiter = await upsertUser({
    uuid: uuidv4(),
    user_id: "USR1001",
    name: "Riya Sharma",
    username: "riya",
    email: "riya@example.com",
    password: userPassword,
    gender: "female",
    role: "User",
    status: "active",
    department: "HR",
    designation: "Recruiter",
    mobile_number: "9876500001",
    pan_number: "ABCDE1234F",
    aadhar_number: "123456789012",
    address: "Bengaluru",
    permissions: JSON.stringify(["create_job", "create_candidate"]),
  });

  const accountant = await upsertUser({
    uuid: uuidv4(),
    user_id: "USR1002",
    name: "Amit Patel",
    username: "amit",
    email: "amit@example.com",
    password: userPassword,
    gender: "male",
    role: "User",
    status: "active",
    department: "Finance",
    designation: "Accountant",
    mobile_number: "9876500002",
    pan_number: "FGHIJ5678K",
    aadhar_number: "123456789013",
    address: "Mumbai",
    permissions: JSON.stringify([]),
  });

  const employee = await upsertUser({
    uuid: uuidv4(),
    user_id: "USR1003",
    name: "Neha Reddy",
    username: "neha",
    email: "neha@example.com",
    password: userPassword,
    gender: "female",
    role: "User",
    status: "active",
    department: "Engineering",
    designation: "Software Engineer",
    mobile_number: "9876500003",
    pan_number: "KLMNO9012P",
    aadhar_number: "123456789014",
    address: "Hyderabad",
    permissions: JSON.stringify([]),
  });

  const skills = [
    { name: "React", description: "Frontend library", status: "active" },
    { name: "Node.js", description: "Backend runtime", status: "active" },
    { name: "MySQL", description: "Relational database", status: "active" },
    { name: "Recruitment", description: "Hiring process", status: "active" },
  ];
  for (const skill of skills) {
    const found = await Skill.findOne({ where: { name: skill.name } });
    if (!found) {
      await Skill.create({ uuid: uuidv4(), ...skill });
    }
  }

  let reactJob = await Job.findOne({ where: { title: "Senior React Developer" } });
  if (!reactJob) {
    reactJob = await Job.create({
      uuid: uuidv4(),
      title: "Senior React Developer",
      type: "Full-time",
      description: "Build and maintain the HRMS frontend.",
      state: "Karnataka",
      city: "Bengaluru",
      minSalary: 1200000,
      maxSalary: 1800000,
      status: "active",
      clientName: "Seven Wings",
      clientEmail: "hr@example.com",
      clientLocation: "Bengaluru",
      skills: ["React", "JavaScript"],
      experienceRange: [3, 6],
      interviewRounds: ["Technical", "HR"],
      openings: 2,
      created_by_id: admin.user_id,
      created_by: admin.username,
      editable_by: [recruiter.user_id],
    });
  }

  let nodeJob = await Job.findOne({ where: { title: "Node.js Backend Engineer" } });
  if (!nodeJob) {
    nodeJob = await Job.create({
      uuid: uuidv4(),
      title: "Node.js Backend Engineer",
      type: "Full-time",
      description: "Own Express APIs and MySQL models.",
      state: "Maharashtra",
      city: "Mumbai",
      minSalary: 1000000,
      maxSalary: 1600000,
      status: "active",
      clientName: "Internal",
      clientEmail: "tech@example.com",
      clientLocation: "Mumbai",
      skills: ["Node.js", "MySQL"],
      experienceRange: [2, 5],
      interviewRounds: ["Technical", "Manager"],
      openings: 1,
      created_by_id: recruiter.user_id,
      created_by: recruiter.username,
      editable_by: [admin.user_id],
    });
  }

  const candidates = [
    {
      name: "Karan Mehta",
      email: "karan.mehta@example.com",
      phone: "9811100001",
      experience: 4.5,
      current_company: "Infosys",
      current_ctc: 900000,
      expected_ctc: 1300000,
      notice_period: 30,
      current_location: "Bengaluru",
      preferred_location: "Bengaluru",
      application_status: "shortlisted",
      source: "LinkedIn",
      job_id: reactJob.id,
    },
    {
      name: "Sana Khan",
      email: "sana.khan@example.com",
      phone: "9811100002",
      experience: 3,
      current_company: "TCS",
      current_ctc: 700000,
      expected_ctc: 1100000,
      notice_period: 60,
      current_location: "Mumbai",
      preferred_location: "Mumbai",
      application_status: "applied",
      source: "Naukri",
      job_id: nodeJob.id,
    },
    {
      name: "Vikram Iyer",
      email: "vikram.iyer@example.com",
      phone: "9811100003",
      experience: 6,
      current_company: "Wipro",
      current_ctc: 1400000,
      expected_ctc: 1800000,
      notice_period: 15,
      current_location: "Hyderabad",
      preferred_location: "Bengaluru",
      application_status: "interviewed",
      source: "Referral",
      referred_by: "Riya Sharma",
      job_id: reactJob.id,
    },
  ];

  for (const candidate of candidates) {
    const found = await Candidate.findOne({ where: { email: candidate.email } });
    if (!found) {
      await Candidate.create({
        uuid: uuidv4(),
        skills: ["JavaScript"],
        created_by: admin.username,
        created_by_id: admin.user_id,
        ...candidate,
      });
    }
  }

  const expenses = [
    {
      expenseName: "Office Rent",
      amount: 45000,
      expenseType: "Rent",
      comments: "September office rent",
      userId: admin.user_id,
    },
    {
      expenseName: "Recruitment Ads",
      amount: 8000,
      expenseType: "Marketing",
      comments: "LinkedIn job posts",
      userId: recruiter.user_id,
    },
  ];
  for (const expense of expenses) {
    const found = await Expense.findOne({ where: { expenseName: expense.expenseName } });
    if (!found) {
      await Expense.create({ uuid: uuidv4(), ...expense });
    }
  }

  let loan = await Loan.findOne({ where: { loan_id: "LN1001" } });
  if (!loan) {
    loan = await Loan.create({
      loan_id: "LN1001",
      customer_id: employee.user_id,
      customer_name: employee.name,
      loan_amount: 50000,
      advance_amount: 10000,
      remaining_balance: 40000,
      referred_by: accountant.username,
      status: "active",
    });
  }

  let loan2 = await Loan.findOne({ where: { loan_id: "LN1002" } });
  if (!loan2) {
    loan2 = await Loan.create({
      loan_id: "LN1002",
      customer_id: recruiter.user_id,
      customer_name: recruiter.name,
      loan_amount: 25000,
      advance_amount: 5000,
      remaining_balance: 20000,
      referred_by: admin.username,
      status: "active",
    });
  }

  const existingTxn = await Transaction.findOne({ where: { loan_id: "LN1001" } });
  if (!existingTxn) {
    await Transaction.create({
      loan_id: loan.loan_id,
      customer_id: employee.user_id,
      admin_id: admin.user_id,
      amount: 10000,
      transaction_type: "credit",
      comments: "Initial advance",
    });
    await Transaction.create({
      loan_id: loan2.loan_id,
      customer_id: recruiter.user_id,
      admin_id: admin.user_id,
      amount: 5000,
      transaction_type: "credit",
      comments: "Advance payment",
    });
  }

  let pegawaiAdmin = await DataPegawai.findOne({ where: { username: "aldi" } });
  if (!pegawaiAdmin) {
    pegawaiAdmin = await DataPegawai.create({
      id_pegawai: uuidv4(),
      nik: "223344556677",
      nama_pegawai: "Aldi",
      username: "aldi",
      password: "admin123",
      jenis_kelamin: "Laki-Laki",
      jabatan: "HRD",
      tanggal_masuk: "01-02-23",
      status: "karyawan tetap",
      photo: "default.jpg",
      url: "http://localhost:3002/images/default.jpg",
      hak_akses: "admin",
    });
  }

  let pegawaiStaff = await DataPegawai.findOne({ where: { username: "budi" } });
  if (!pegawaiStaff) {
    pegawaiStaff = await DataPegawai.create({
      id_pegawai: uuidv4(),
      nik: "334455667788",
      nama_pegawai: "Budi",
      username: "budi",
      password: "user123",
      jenis_kelamin: "Laki-Laki",
      jabatan: "Operator Produksi",
      tanggal_masuk: "01-03-23",
      status: "karyawan tetap",
      photo: "default.jpg",
      url: "http://localhost:3002/images/default.jpg",
      hak_akses: "pegawai",
    });
  }

  const hrd = await DataJabatan.findOne({ where: { nama_jabatan: "HRD" } });
  if (!hrd) {
    await DataJabatan.create({
      nama_jabatan: "HRD",
      gaji_pokok: 6000000,
      tj_transport: 400000,
      uang_makan: 300000,
      userId: pegawaiAdmin.id,
    });
  }
  const operator = await DataJabatan.findOne({ where: { nama_jabatan: "Operator Produksi" } });
  if (!operator) {
    await DataJabatan.create({
      nama_jabatan: "Operator Produksi",
      gaji_pokok: 3000000,
      tj_transport: 200000,
      uang_makan: 150000,
      userId: pegawaiAdmin.id,
    });
  }

  const attendance = await DataKehadiran.findOne({ where: { nik: "223344556677" } });
  if (!attendance) {
    await DataKehadiran.create({
      bulan: "September",
      nik: "223344556677",
      nama_pegawai: "Aldi",
      jenis_kelamin: "Laki-Laki",
      nama_jabatan: "HRD",
      hadir: 20,
      sakit: 1,
      alpha: 0,
    });
    await DataKehadiran.create({
      bulan: "September",
      nik: "334455667788",
      nama_pegawai: "Budi",
      jenis_kelamin: "Laki-Laki",
      nama_jabatan: "Operator Produksi",
      hadir: 18,
      sakit: 2,
      alpha: 1,
    });
  }

  const deduction = await PotonganGaji.findOne({ where: { potongan: "Alpha" } });
  if (!deduction) {
    await PotonganGaji.create({ potongan: "Alpha", jml_potongan: 100000 });
    await PotonganGaji.create({ potongan: "Sakit", jml_potongan: 50000 });
  }

  console.log("Sample data ready");
  console.log("Admin login: admin / Admin@123");
  console.log("Sample users: riya, amit, neha / Password@123");
  await db.close();
};

seedSampleData().catch((error) => {
  console.error("Failed to seed sample data:", error);
  process.exit(1);
});
