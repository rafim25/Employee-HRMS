import { Op } from "sequelize";
import User from "../../models/User.js";
import {
  AttendanceLog,
  AttendancePolicy,
  AuthorizedLocation,
} from "../../models/hr/index.js";
import {
  assertSelfOrAdmin,
  haversineMeters,
  isAdmin,
  paginate,
  todayDateOnly,
  workingHoursBetween,
  writeAudit,
} from "../../utils/hr/helpers.js";

const resolveLocation = async (lat, lng, requireLocation) => {
  if (lat == null || lng == null) {
    if (requireLocation) {
      const err = new Error("Location is required for check-in/out");
      err.status = 400;
      throw err;
    }
    return null;
  }

  const locations = await AuthorizedLocation.findAll({ where: { status: "active" } });
  if (!locations.length) return null;

  let nearest = null;
  let nearestDistance = Infinity;
  for (const loc of locations) {
    const d = haversineMeters(lat, lng, loc.latitude, loc.longitude);
    if (d < nearestDistance) {
      nearestDistance = d;
      nearest = loc;
    }
  }

  if (requireLocation && nearest && nearestDistance > nearest.radius_meters) {
    const err = new Error(
      `You are outside authorized locations (nearest: ${nearest.name}, ${Math.round(nearestDistance)}m)`
    );
    err.status = 400;
    throw err;
  }

  return nearestDistance <= (nearest?.radius_meters || Infinity) ? nearest : null;
};

const getPolicy = async () =>
  (await AttendancePolicy.findOne({ where: { is_default: true, status: "active" } })) ||
  (await AttendancePolicy.findOne({ where: { status: "active" }, order: [["id", "ASC"]] }));

export const checkIn = async (req, res) => {
  try {
    const userId = req.userId;
    const workDate = todayDateOnly();
    const lat = req.body.latitude != null ? Number(req.body.latitude) : null;
    const lng = req.body.longitude != null ? Number(req.body.longitude) : null;

    const existing = await AttendanceLog.findOne({ where: { user_id: userId, work_date: workDate } });
    if (existing?.check_in_at && !existing.check_out_at) {
      return res.status(400).json({ message: "Already checked in today" });
    }
    if (existing?.check_out_at) {
      return res.status(400).json({ message: "Attendance already closed for today" });
    }

    const policy = await getPolicy();
    const location = await resolveLocation(lat, lng, Boolean(policy?.require_location));

    const log = await AttendanceLog.create({
      user_id: userId,
      work_date: workDate,
      check_in_at: new Date(),
      check_in_lat: lat,
      check_in_lng: lng,
      location_id: location?.id || null,
      status: "open",
    });

    await writeAudit({
      actor_id: userId,
      action: "check_in",
      entity_type: "attendance_log",
      entity_id: log.id,
    });

    res.status(201).json(log);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const checkOut = async (req, res) => {
  try {
    const userId = req.userId;
    const workDate = todayDateOnly();
    const lat = req.body.latitude != null ? Number(req.body.latitude) : null;
    const lng = req.body.longitude != null ? Number(req.body.longitude) : null;

    const log = await AttendanceLog.findOne({ where: { user_id: userId, work_date: workDate } });
    if (!log?.check_in_at) {
      return res.status(400).json({ message: "Check in first" });
    }
    if (log.check_out_at) {
      return res.status(400).json({ message: "Already checked out today" });
    }

    const policy = await getPolicy();
    await resolveLocation(lat, lng, Boolean(policy?.require_location));

    const checkOutAt = new Date();
    const hours = workingHoursBetween(log.check_in_at, checkOutAt);
    await log.update({
      check_out_at: checkOutAt,
      check_out_lat: lat,
      check_out_lng: lng,
      working_hours: hours,
      status: "closed",
    });

    await writeAudit({
      actor_id: userId,
      action: "check_out",
      entity_type: "attendance_log",
      entity_id: log.id,
      meta: { working_hours: hours },
    });

    res.json(log);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const getTodayStatus = async (req, res) => {
  try {
    const userId = req.query.userId && isAdmin(req) ? req.query.userId : req.userId;
    assertSelfOrAdmin(req, userId);
    const log = await AttendanceLog.findOne({
      where: { user_id: userId, work_date: todayDateOnly() },
      include: [{ model: AuthorizedLocation, as: "location", required: false }],
    });
    res.json(log || null);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const listAttendance = async (req, res) => {
  try {
    const { page, limit, offset } = paginate(req.query);
    const where = {};

    if (isAdmin(req)) {
      if (req.query.userId) where.user_id = req.query.userId;
    } else {
      where.user_id = req.userId;
    }

    if (req.query.from || req.query.to) {
      where.work_date = {};
      if (req.query.from) where.work_date[Op.gte] = req.query.from;
      if (req.query.to) where.work_date[Op.lte] = req.query.to;
    }

    if (req.query.month && req.query.year) {
      const y = Number(req.query.year);
      const m = String(req.query.month).padStart(2, "0");
      const last = new Date(y, Number(req.query.month), 0).getDate();
      where.work_date = { [Op.between]: [`${y}-${m}-01`, `${y}-${m}-${last}`] };
    }

    const { rows, count } = await AttendanceLog.findAndCountAll({
      where,
      include: [
        { model: User, as: "employee", attributes: ["user_id", "name", "email", "username"] },
        { model: AuthorizedLocation, as: "location", attributes: ["id", "name"], required: false },
      ],
      order: [["work_date", "DESC"], ["id", "DESC"]],
      limit,
      offset,
    });

    const totalHours = rows.reduce((sum, r) => sum + Number(r.working_hours || 0), 0);

    res.json({
      data: rows,
      pagination: {
        page,
        limit,
        totalRecords: count,
        totalPages: Math.ceil(count / limit) || 1,
      },
      summary: { totalHours: Math.round(totalHours * 100) / 100 },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
