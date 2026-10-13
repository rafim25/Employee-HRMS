import { Notification, AuditLog } from "../../models/hr/index.js";
import { parsePagination } from "../pagination.js";

export const isAdmin = (req) => String(req.role || "").toLowerCase() === "admin";

export const assertSelfOrAdmin = (req, userId) => {
  if (isAdmin(req)) return true;
  if (String(req.userId) === String(userId)) return true;
  const err = new Error("Access forbidden");
  err.status = 403;
  throw err;
};

export const paginate = (query = {}) => parsePagination(query);

export const haversineMeters = (lat1, lon1, lat2, lon2) => {
  const toRad = (v) => (Number(v) * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
};

export const workingHoursBetween = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return null;
  const ms = new Date(checkOut) - new Date(checkIn);
  if (ms <= 0) return 0;
  return Math.round((ms / (1000 * 60 * 60)) * 100) / 100;
};

export const createNotification = async ({
  user_id,
  title,
  message,
  type = "info",
  entity_type = null,
  entity_id = null,
}) => {
  return Notification.create({
    user_id,
    title,
    message,
    type,
    entity_type,
    entity_id: entity_id != null ? String(entity_id) : null,
  });
};

export const writeAudit = async ({
  actor_id,
  action,
  entity_type,
  entity_id = null,
  meta = null,
}) => {
  return AuditLog.create({
    actor_id,
    action,
    entity_type,
    entity_id: entity_id != null ? String(entity_id) : null,
    meta,
  });
};

export const daysInclusive = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime()) || e < s) {
    return 0;
  }
  const diff = Math.floor((e - s) / (1000 * 60 * 60 * 24)) + 1;
  return diff;
};

export const todayDateOnly = () => new Date().toISOString().slice(0, 10);
