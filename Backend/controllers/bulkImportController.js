import {
  buildImportPreview,
  commitImport,
} from "../utils/bulkCandidateImport.js";

const getMultipartBuffers = (req) => {
  const files = req.files || {};
  const excel =
    files.excel?.[0] || files.file?.[0] || files.spreadsheet?.[0] || null;
  const zip = files.zip?.[0] || files.archive?.[0] || null;

  if (!excel?.buffer) {
    const err = new Error('Excel file is required (form field name: "excel").');
    err.status = 400;
    throw err;
  }
  if (!zip?.buffer) {
    const err = new Error('ZIP file is required (form field name: "zip").');
    err.status = 400;
    throw err;
  }

  return { excel, zip };
};

const sessionUserFromReq = (req) => ({
  user_id: req.userId || req.user?.user_id,
  username: req.user?.username || req.name,
  name: req.user?.name,
  role: req.role || req.user?.role,
});

/**
 * POST /api/candidates/bulk-import/preview
 * multipart: excel + zip
 */
export const previewBulkImport = async (req, res) => {
  try {
    const { excel, zip } = getMultipartBuffers(req);
    const sessionUser = sessionUserFromReq(req);

    const preview = await buildImportPreview(
      excel.buffer,
      zip.buffer,
      sessionUser
    );

    return res.status(200).json({
      success: true,
      message: `Preview ready: ${preview.summary.importable} importable of ${preview.summary.totalRows} rows.`,
      ...preview,
    });
  } catch (error) {
    console.error("Bulk import preview error:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to preview bulk import",
    });
  }
};

/**
 * POST /api/candidates/bulk-import/commit
 * multipart: excel + zip
 * body fields: mode = matched_only | include_ambiguous
 */
export const commitBulkImport = async (req, res) => {
  try {
    const { excel, zip } = getMultipartBuffers(req);
    const sessionUser = sessionUserFromReq(req);
    const mode =
      req.body?.mode === "include_ambiguous"
        ? "include_ambiguous"
        : "matched_only";

    if (!sessionUser.user_id) {
      return res.status(401).json({
        success: false,
        message: "Please sign in to import candidates.",
      });
    }

    const result = await commitImport({
      excelBuffer: excel.buffer,
      zipBuffer: zip.buffer,
      sessionUser,
      mode,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Bulk import commit error:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to commit bulk import",
    });
  }
};
