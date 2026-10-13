import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import db from "../config/Database.js";
import "../models/index.js";
import {
  AttendancePolicy,
  WorkingDayConfig,
  AuthorizedLocation,
  LeaveType,
  LeavePolicy,
  SalaryComponent,
  Holiday,
} from "../models/hr/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const seed = async () => {
  await db.authenticate();
  await db.sync();

  const [policy] = await AttendancePolicy.findOrCreate({
    where: { name: "Default Office Policy" },
    defaults: {
      work_start: "09:00",
      work_end: "18:00",
      grace_minutes: 15,
      require_location: false,
      weekly_offs: [0, 6],
      is_default: true,
      status: "active",
    },
  });
  console.log("Attendance policy:", policy.id);

  await WorkingDayConfig.findOrCreate({
    where: { name: "Mon-Fri" },
    defaults: { days: [1, 2, 3, 4, 5], hours_per_day: 8, is_default: true },
  });

  await AuthorizedLocation.findOrCreate({
    where: { name: "Head Office" },
    defaults: {
      address: "Bengaluru",
      latitude: 12.9716,
      longitude: 77.5946,
      radius_meters: 500,
      status: "active",
    },
  });

  const leaveDefs = [
    { code: "CL", name: "Casual Leave", allocation: 12 },
    { code: "SL", name: "Sick Leave", allocation: 10 },
    { code: "EL", name: "Earned Leave", allocation: 15 },
  ];

  for (const def of leaveDefs) {
    const [type] = await LeaveType.findOrCreate({
      where: { code: def.code },
      defaults: { name: def.name, paid: true, status: "active" },
    });
    await LeavePolicy.findOrCreate({
      where: { leave_type_id: type.id, is_default: true },
      defaults: {
        leave_type_id: type.id,
        annual_allocation: def.allocation,
        carry_forward: def.code === "EL",
        requires_approval: true,
        is_default: true,
      },
    });
  }

  const components = [
    { code: "HRA", name: "House Rent Allowance", type: "earning", is_percentage: true, default_value: 40 },
    { code: "SA", name: "Special Allowance", type: "earning", is_percentage: false, default_value: 5000 },
    { code: "PF", name: "Provident Fund", type: "deduction", is_percentage: true, default_value: 12 },
    { code: "PT", name: "Professional Tax", type: "deduction", is_percentage: false, default_value: 200 },
  ];

  for (const c of components) {
    await SalaryComponent.findOrCreate({
      where: { code: c.code },
      defaults: { ...c, status: "active" },
    });
  }

  const year = new Date().getFullYear();
  await Holiday.findOrCreate({
    where: { name: "Republic Day", date: `${year}-01-26` },
    defaults: { type: "public", description: "National holiday" },
  });
  await Holiday.findOrCreate({
    where: { name: "Independence Day", date: `${year}-08-15` },
    defaults: { type: "public", description: "National holiday" },
  });

  console.log("✅ HR defaults seeded");
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
