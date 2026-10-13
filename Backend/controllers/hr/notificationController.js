import { Notification, AuditLog } from "../../models/hr/index.js";
import { isAdmin, paginate } from "../../utils/hr/helpers.js";

export const listNotifications = async (req, res) => {
  try {
    const { page, limit, offset } = paginate(req.query);
    const where = { user_id: req.userId };
    if (req.query.unread === "true") where.is_read = false;

    const { rows, count } = await Notification.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const unreadCount = await Notification.count({
      where: { user_id: req.userId, is_read: false },
    });

    res.json({
      data: rows,
      unreadCount,
      pagination: {
        page,
        limit,
        totalRecords: count,
        totalPages: Math.ceil(count / limit) || 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const row = await Notification.findByPk(req.params.id);
    if (!row || String(row.user_id) !== String(req.userId)) {
      return res.status(404).json({ message: "Notification not found" });
    }
    await row.update({ is_read: true });
    res.json(row);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAllRead = async (req, res) => {
  try {
    await Notification.update(
      { is_read: true },
      { where: { user_id: req.userId, is_read: false } }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const listAuditLogs = async (req, res) => {
  try {
    if (!isAdmin(req)) return res.status(403).json({ message: "Access forbidden" });
    const { page, limit, offset } = paginate(req.query);
    const { rows, count } = await AuditLog.findAndCountAll({
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });
    res.json({
      data: rows,
      pagination: {
        page,
        limit,
        totalRecords: count,
        totalPages: Math.ceil(count / limit) || 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
