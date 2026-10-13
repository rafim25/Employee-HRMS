import { EmployeeDocument } from "../../models/hr/index.js";
import User from "../../models/User.js";
import {
  assertSelfOrAdmin,
  isAdmin,
  paginate,
  writeAudit,
} from "../../utils/hr/helpers.js";
import { uploadToS3, getSignedUrl } from "../../utils/s3Config.js";

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const targetUserId = isAdmin(req) && req.body.user_id ? req.body.user_id : req.userId;
    assertSelfOrAdmin(req, targetUserId);

    const docType = req.body.doc_type || "other";
    const title = req.body.title || req.file.originalname;

    const url = await uploadToS3(req.file, "hr/documents");

    const doc = await EmployeeDocument.create({
      user_id: targetUserId,
      doc_type: docType,
      title,
      storage_key: url,
      file_url: url,
      mime_type: req.file.mimetype,
      status: "uploaded",
      uploaded_by: req.userId,
    });

    await writeAudit({
      actor_id: req.userId,
      action: "upload",
      entity_type: "employee_document",
      entity_id: doc.id,
      meta: { doc_type: docType },
    });

    res.status(201).json(doc);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const listDocuments = async (req, res) => {
  try {
    const { page, limit, offset } = paginate(req.query);
    const where = {};
    if (!isAdmin(req)) where.user_id = req.userId;
    else if (req.query.userId) where.user_id = req.query.userId;
    if (req.query.doc_type) where.doc_type = req.query.doc_type;

    const { rows, count } = await EmployeeDocument.findAndCountAll({
      where,
      include: [{ model: User, as: "employee", attributes: ["user_id", "name", "email"] }],
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

export const downloadDocument = async (req, res) => {
  try {
    const doc = await EmployeeDocument.findOne({ where: { uuid: req.params.uuid } });
    if (!doc) return res.status(404).json({ message: "Document not found" });
    assertSelfOrAdmin(req, doc.user_id);

    const url = doc.file_url || (await getSignedUrl(doc.storage_key));
    res.json({ url, title: doc.title, mime_type: doc.mime_type });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const doc = await EmployeeDocument.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });
    assertSelfOrAdmin(req, doc.user_id);
    await doc.destroy();
    await writeAudit({
      actor_id: req.userId,
      action: "delete",
      entity_type: "employee_document",
      entity_id: req.params.id,
    });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};
