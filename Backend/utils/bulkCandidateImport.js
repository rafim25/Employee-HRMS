/**
 * Server-side bulk candidate import helpers:
 * Excel parse, recursive ZIP listing, multi-signal resume matching.
 */
import AdmZip from "adm-zip";
import * as XLSX from "xlsx";
import { Op } from "sequelize";
import Candidate from "../models/Candidate.js";
import Job from "../models/Job.js";
import User from "../models/User.js";

export const RESUME_EXTENSIONS = new Set([
  ".pdf",
  ".doc",
  ".docx",
  ".rtf",
  ".txt",
]);

const JUNK_PATH_RE = /(^|\/)(__macosx|\.ds_store|thumbs\.db)(\/|$)/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const pickField = (row, keys) => {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return typeof value === "string" ? value.trim() : value;
    }
  }
  // Case-insensitive header fallback
  const entries = Object.entries(row || {});
  for (const want of keys) {
    const wantNorm = String(want).toLowerCase().replace(/[\s_]+/g, "");
    for (const [k, v] of entries) {
      if (String(k).toLowerCase().replace(/[\s_]+/g, "") === wantNorm) {
        if (v !== undefined && v !== null && String(v).trim() !== "") {
          return typeof v === "string" ? v.trim() : v;
        }
      }
    }
  }
  return undefined;
};

const getExtension = (filename = "") => {
  const match = String(filename).toLowerCase().match(/(\.[a-z0-9]+)$/);
  return match ? match[1] : "";
};

const basename = (path = "") =>
  String(path).split("/").filter(Boolean).pop() || path;

const folderOf = (path = "") => {
  const parts = String(path).split("/").filter(Boolean);
  if (parts.length <= 1) return "(ZIP root)";
  return parts.slice(0, -1).join("/");
};

const depthOf = (path = "") =>
  Math.max(0, String(path).split("/").filter(Boolean).length - 1);

const normalizeToken = (value = "") =>
  String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");

const digitsOnly = (value = "") => String(value).replace(/\D+/g, "");

const mimeFromFileName = (fileName = "") => {
  const ext = getExtension(fileName);
  if (ext === ".pdf") return "application/pdf";
  if (ext === ".doc") return "application/msword";
  if (ext === ".docx") {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }
  if (ext === ".rtf") return "application/rtf";
  if (ext === ".txt") return "text/plain";
  return "application/octet-stream";
};

/**
 * Parse Excel buffer into candidate row objects (flexible headers).
 */
export const parseExcelBuffer = (buffer, sessionUser = {}) => {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName =
    workbook.SheetNames.find((name) => name.toLowerCase() !== "instructions") ||
    workbook.SheetNames[0];
  const rawRows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
    defval: "",
  });

  return rawRows
    .filter((row) =>
      Object.entries(row).some(([key, value]) => {
        if (["created_by_id", "created_by"].includes(String(key).toLowerCase())) {
          return false;
        }
        return value !== "" && value != null;
      })
    )
    .map((row, index) => {
      const email = pickField(row, ["email", "Email"]);
      const phone = pickField(row, ["phone", "Phone"]);
      const experience = pickField(row, ["experience", "Experience"]);
      const currentCtc = pickField(row, ["current_ctc", "Current_CTC", "Current CTC"]);
      const expectedCtc = pickField(row, ["expected_ctc", "Expected_CTC", "Expected CTC"]);
      const noticePeriod = pickField(row, ["notice_period", "Notice_Period", "Notice Period"]);

      return {
        rowNumber: index + 2,
        name: pickField(row, ["name", "Name"]),
        email: email ? String(email).toLowerCase().trim() : "",
        phone: phone ? String(phone).trim().replace(/\s+/g, "") : "",
        experience:
          experience !== undefined && experience !== ""
            ? parseFloat(experience) || 0
            : 0,
        current_company: pickField(row, ["current_company", "Current_Company", "Current Company"]),
        current_ctc:
          currentCtc !== undefined && currentCtc !== ""
            ? parseFloat(currentCtc) || 0
            : 0,
        expected_ctc:
          expectedCtc !== undefined && expectedCtc !== ""
            ? parseFloat(expectedCtc) || 0
            : 0,
        notice_period:
          noticePeriod !== undefined && noticePeriod !== ""
            ? parseInt(noticePeriod, 10) || 0
            : 0,
        current_location: pickField(row, [
          "current_location",
          "Current_Location",
          "Current Location",
        ]),
        preferred_location: pickField(row, [
          "preferred_location",
          "Preferred_Location",
          "Preferred Location",
        ]),
        source: pickField(row, ["source", "Source"]) || "Direct",
        referred_by: pickField(row, ["referred_by", "Referred_By", "Referred By"]),
        notes: pickField(row, ["notes", "Notes"]),
        job_id: pickField(row, ["job_id", "Job_ID", "jobId", "Job ID"]),
        resume_filename: pickField(row, [
          "resume_filename",
          "resume_file",
          "Resume_Filename",
          "Resume File",
          "resume",
        ]),
        created_by:
          pickField(row, ["created_by"]) ||
          sessionUser.username ||
          sessionUser.name ||
          undefined,
        created_by_id:
          pickField(row, ["created_by_id", "Creator_ID", "creator_id"]) ||
          sessionUser.user_id ||
          undefined,
      };
    });
};

/**
 * Recursively list resume files from a ZIP buffer (nested folders OK).
 */
export const analyzeZipBuffer = (buffer) => {
  const zip = new AdmZip(buffer);
  const entries = zip.getEntries();
  const folders = new Set();
  const resumeFiles = [];
  const otherFiles = [];
  let skippedJunk = 0;

  for (const entry of entries) {
    const path = String(entry.entryName || "").replace(/\\/g, "/");
    if (!path || JUNK_PATH_RE.test(path) || basename(path).startsWith(".")) {
      skippedJunk += 1;
      continue;
    }

    if (entry.isDirectory || path.endsWith("/")) {
      const clean = path.replace(/\/+$/, "");
      if (clean) folders.add(clean);
      continue;
    }

    const fileName = basename(path);
    const depth = depthOf(path);
    const folder = folderOf(path);
    if (depth > 0) folders.add(folder);

    if (RESUME_EXTENSIONS.has(getExtension(fileName))) {
      resumeFiles.push({
        path,
        fileName,
        folder,
        depth,
        entryName: entry.entryName,
      });
    } else {
      otherFiles.push({ path, fileName, folder, depth });
    }
  }

  const nestedFolders = [...folders]
    .filter((f) => f.includes("/"))
    .sort((a, b) => a.localeCompare(b));
  const topLevelFolders = [...folders]
    .filter((f) => !f.includes("/"))
    .sort((a, b) => a.localeCompare(b));
  const maxDepth = resumeFiles.reduce((max, f) => Math.max(max, f.depth), 0);

  return {
    zip,
    resumeFiles,
    otherFiles,
    folders: [...folders].sort(),
    nestedFolders,
    topLevelFolders,
    nestedFolderCount: nestedFolders.length + topLevelFolders.length,
    maxDepth,
    hasNestedStructure: maxDepth > 0 || folders.size > 0,
    skippedJunk,
    totalFiles: resumeFiles.length + otherFiles.length,
  };
};

const scoreNameMatch = (candidateName, fileNameWithoutExt) => {
  const candidate = String(candidateName || "").trim();
  if (!candidate || !fileNameWithoutExt) return 0;

  const first = candidate.toLowerCase().split(/\s+/)[0] || "";
  const cleanFile = normalizeToken(fileNameWithoutExt);
  const cleanFirst = normalizeToken(first);
  const cleanFull = normalizeToken(candidate);

  if (!cleanFile || !cleanFirst) return 0;
  if (cleanFile === cleanFull) return 100;
  if (cleanFile === cleanFirst) return 80;
  if (cleanFile.startsWith(cleanFull) || cleanFull.startsWith(cleanFile)) return 70;
  if (cleanFile.includes(cleanFull) || cleanFull.includes(cleanFile)) return 60;
  if (cleanFile.startsWith(cleanFirst) || cleanFirst.startsWith(cleanFile)) return 50;
  if (cleanFile.includes(cleanFirst)) return 40;
  return 0;
};

/**
 * Score a resume file against a candidate (higher = better).
 */
export const scoreResumeCandidate = (candidate, resumeFile) => {
  let score = 0;
  const reasons = [];
  const stem = resumeFile.fileName.replace(/\.[^/.]+$/, "");
  const cleanStem = normalizeToken(stem);
  const folderToken = normalizeToken(resumeFile.folder);

  // 1) Explicit resume_filename column
  if (candidate.resume_filename) {
    const want = String(candidate.resume_filename).toLowerCase();
    const wantBase = basename(want).toLowerCase();
    if (
      resumeFile.fileName.toLowerCase() === wantBase ||
      resumeFile.path.toLowerCase().endsWith(wantBase) ||
      resumeFile.path.toLowerCase() === want.replace(/\\/g, "/")
    ) {
      score += 200;
      reasons.push("explicit_filename");
    }
  }

  // 2) Email token in filename
  if (candidate.email) {
    const local = candidate.email.split("@")[0] || "";
    const emailToken = normalizeToken(local);
    const emailFull = normalizeToken(candidate.email);
    if (emailToken && (cleanStem === emailToken || cleanStem.includes(emailToken))) {
      score += 120;
      reasons.push("email");
    } else if (emailFull && cleanStem.includes(emailFull)) {
      score += 110;
      reasons.push("email_full");
    }
  }

  // 3) Phone digits in filename
  const phoneDigits = digitsOnly(candidate.phone);
  if (phoneDigits.length >= 7) {
    const fileDigits = digitsOnly(stem);
    if (fileDigits.includes(phoneDigits) || phoneDigits.includes(fileDigits)) {
      score += 100;
      reasons.push("phone");
    }
  }

  // 4) Name fuzzy match
  const nameScore = scoreNameMatch(candidate.name, stem);
  if (nameScore >= 40) {
    score += nameScore;
    reasons.push("name");
  }

  // 5) Folder name equals candidate name
  if (candidate.name && folderToken) {
    const nameToken = normalizeToken(candidate.name);
    const firstToken = normalizeToken(String(candidate.name).split(/\s+/)[0] || "");
    if (folderToken === nameToken || folderToken === firstToken) {
      score += 55;
      reasons.push("folder");
    }
  }

  return { score, reasons };
};

/**
 * Best resume match for a candidate among resume file list.
 * Returns { match, ambiguousAlternates, status }.
 */
export const matchResumeForCandidate = (candidate, resumeFiles) => {
  if (!resumeFiles.length) {
    return { match: null, ambiguousAlternates: [], status: "missing_resume", score: 0 };
  }

  const scored = resumeFiles
    .map((file) => {
      const { score, reasons } = scoreResumeCandidate(candidate, file);
      return { file, score, reasons };
    })
    .filter((s) => s.score >= 40)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) {
    return { match: null, ambiguousAlternates: [], status: "missing_resume", score: 0 };
  }

  const best = scored[0];
  const second = scored[1];
  if (second && second.score >= best.score - 5 && second.score >= 60) {
    return {
      match: best.file,
      ambiguousAlternates: scored.slice(0, 5).map((s) => ({
        path: s.file.path,
        fileName: s.file.fileName,
        score: s.score,
        reasons: s.reasons,
      })),
      status: "ambiguous",
      score: best.score,
      reasons: best.reasons,
    };
  }

  return {
    match: best.file,
    ambiguousAlternates: [],
    status: "matched",
    score: best.score,
    reasons: best.reasons,
  };
};

/**
 * Build full preview report (no DB writes except duplicate lookups).
 */
export const buildImportPreview = async (excelBuffer, zipBuffer, sessionUser = {}) => {
  const candidates = parseExcelBuffer(excelBuffer, sessionUser);
  const zipAnalysis = analyzeZipBuffer(zipBuffer);

  const emails = candidates.map((c) => c.email).filter(Boolean);
  const phones = candidates.map((c) => c.phone).filter(Boolean);

  const orClause = [
    emails.length ? { email: { [Op.in]: emails } } : null,
    phones.length ? { phone: { [Op.in]: phones } } : null,
  ].filter(Boolean);

  const existing = orClause.length
    ? await Candidate.findAll({
        where: { [Op.or]: orClause },
        attributes: ["id", "uuid", "name", "email", "phone"],
      })
    : [];

  const existingByEmail = new Map(
    existing.map((c) => [String(c.email).toLowerCase(), c])
  );
  const existingByPhone = new Map(existing.map((c) => [String(c.phone), c]));

  const usedResumePaths = new Set();
  const rows = [];

  for (const candidate of candidates) {
    const problems = [];
    if (!candidate.name) problems.push("Name is required");
    if (!candidate.email) problems.push("Email is required");
    else if (!EMAIL_PATTERN.test(candidate.email)) problems.push("Email is not valid");
    if (!candidate.phone) problems.push("Phone is required");

    if (problems.length) {
      rows.push({
        rowNumber: candidate.rowNumber,
        name: candidate.name || `Row ${candidate.rowNumber}`,
        email: candidate.email || "",
        phone: candidate.phone || "",
        status: "invalid_row",
        indicator: "error",
        message: `Row ${candidate.rowNumber}: ${problems.join(". ")}.`,
        matchedPath: null,
        matchedFile: null,
        folder: null,
        nested: false,
        candidate,
      });
      continue;
    }

    const dup =
      existingByEmail.get(candidate.email) || existingByPhone.get(candidate.phone);
    if (dup) {
      rows.push({
        rowNumber: candidate.rowNumber,
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        status: "duplicate",
        indicator: "warning",
        message: `Row ${candidate.rowNumber}: Candidate already exists (${dup.email}).`,
        matchedPath: null,
        matchedFile: null,
        folder: null,
        nested: false,
        candidate,
        existingId: dup.uuid,
      });
      continue;
    }

    const matchResult = matchResumeForCandidate(candidate, zipAnalysis.resumeFiles);

    if (matchResult.status === "missing_resume") {
      rows.push({
        rowNumber: candidate.rowNumber,
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        status: "missing_resume",
        indicator: "error",
        message: `Row ${candidate.rowNumber}: No resume matched "${candidate.name}". Nested folders are scanned; name file like firstname.pdf or include email in filename.`,
        matchedPath: null,
        matchedFile: null,
        folder: null,
        nested: false,
        candidate,
      });
      continue;
    }

    if (matchResult.status === "ambiguous") {
      rows.push({
        rowNumber: candidate.rowNumber,
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        status: "ambiguous",
        indicator: "warning",
        message: `Row ${candidate.rowNumber}: Multiple possible resumes. Best guess: ${matchResult.match.fileName}`,
        matchedPath: matchResult.match.path,
        matchedFile: matchResult.match.fileName,
        folder: matchResult.match.folder,
        nested: matchResult.match.depth > 0,
        ambiguousAlternates: matchResult.ambiguousAlternates,
        candidate,
        score: matchResult.score,
        reasons: matchResult.reasons,
      });
      usedResumePaths.add(matchResult.match.path);
      continue;
    }

    usedResumePaths.add(matchResult.match.path);
    rows.push({
      rowNumber: candidate.rowNumber,
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      status: "matched",
      indicator: matchResult.match.depth > 0 ? "warning" : "success",
      message:
        matchResult.match.depth > 0
          ? `Resume found in nested folder "${matchResult.match.folder}" → ${matchResult.match.fileName}`
          : `Resume matched: ${matchResult.match.fileName}`,
      matchedPath: matchResult.match.path,
      matchedFile: matchResult.match.fileName,
      folder: matchResult.match.folder,
      nested: matchResult.match.depth > 0,
      candidate,
      score: matchResult.score,
      reasons: matchResult.reasons,
    });
  }

  const unusedResumes = zipAnalysis.resumeFiles
    .filter((f) => !usedResumePaths.has(f.path))
    .map((f) => ({ path: f.path, fileName: f.fileName, folder: f.folder }));

  const summary = {
    totalRows: rows.length,
    matched: rows.filter((r) => r.status === "matched").length,
    ambiguous: rows.filter((r) => r.status === "ambiguous").length,
    missingResume: rows.filter((r) => r.status === "missing_resume").length,
    duplicates: rows.filter((r) => r.status === "duplicate").length,
    invalid: rows.filter((r) => r.status === "invalid_row").length,
    importable: rows.filter((r) => r.status === "matched" || r.status === "ambiguous")
      .length,
    zipResumes: zipAnalysis.resumeFiles.length,
    unusedResumes: unusedResumes.length,
    nestedFolders: zipAnalysis.nestedFolderCount,
    maxDepth: zipAnalysis.maxDepth,
    skippedJunk: zipAnalysis.skippedJunk,
    otherFiles: zipAnalysis.otherFiles.length,
  };

  const warnings = [];
  if (zipAnalysis.hasNestedStructure) {
    warnings.push(
      `Nested folders detected (max depth ${zipAnalysis.maxDepth}). Resumes inside subfolders are scanned automatically.`
    );
  }
  if (zipAnalysis.nestedFolderCount > 0) {
    warnings.push(
      `${zipAnalysis.nestedFolderCount} folder(s) found in the archive.`
    );
  }
  if (zipAnalysis.skippedJunk > 0) {
    warnings.push(`Skipped ${zipAnalysis.skippedJunk} system/junk file(s).`);
  }
  if (zipAnalysis.otherFiles.length > 0) {
    warnings.push(
      `${zipAnalysis.otherFiles.length} non-resume file(s) ignored (PDF/DOC/DOCX/RTF/TXT only).`
    );
  }
  if (unusedResumes.length > 0) {
    warnings.push(`${unusedResumes.length} resume file(s) were not matched to any row.`);
  }

  return {
    summary,
    warnings,
    rows,
    unusedResumes: unusedResumes.slice(0, 100),
    zipMeta: {
      resumeCount: zipAnalysis.resumeFiles.length,
      nestedFolderCount: zipAnalysis.nestedFolderCount,
      maxDepth: zipAnalysis.maxDepth,
      topLevelFolders: zipAnalysis.topLevelFolders.slice(0, 20),
    },
  };
};

/**
 * Commit importable rows: create candidates + attach resumes from ZIP.
 * @param {'matched_only'|'include_ambiguous'} mode
 */
export const commitImport = async ({
  excelBuffer,
  zipBuffer,
  sessionUser,
  mode = "matched_only",
}) => {
  const { uploadToS3 } = await import("./s3Config.js");
  const preview = await buildImportPreview(excelBuffer, zipBuffer, sessionUser);
  const zipAnalysis = analyzeZipBuffer(zipBuffer);

  const entryByPath = new Map(
    zipAnalysis.resumeFiles.map((f) => [f.path, f])
  );

  const allowedStatuses =
    mode === "include_ambiguous"
      ? new Set(["matched", "ambiguous"])
      : new Set(["matched"]);

  const results = {
    success: [],
    duplicates: [],
    skipped: [],
    errors: [],
  };

  // Resolve creator once
  const creatorId = sessionUser.user_id;
  const creator = creatorId
    ? await User.findOne({ where: { user_id: String(creatorId) } })
    : null;

  for (const row of preview.rows) {
    if (!allowedStatuses.has(row.status)) {
      results.skipped.push({
        name: row.name,
        email: row.email,
        status: row.status,
        message: row.message,
      });
      continue;
    }

    try {
      if (!creator && !row.candidate.created_by_id) {
        throw new Error("Creator ID missing. Please sign in again.");
      }

      const resolvedCreatorId = String(
        row.candidate.created_by_id || creator.user_id
      );
      const creatorRecord =
        creator && creator.user_id === resolvedCreatorId
          ? creator
          : await User.findOne({ where: { user_id: resolvedCreatorId } });
      if (!creatorRecord) {
        throw new Error(`Creator ID "${resolvedCreatorId}" does not exist.`);
      }

      let linkedJob = null;
      if (row.candidate.job_id) {
        const asNumber = Number(row.candidate.job_id);
        if (Number.isInteger(asNumber) && asNumber > 0) {
          linkedJob = await Job.findByPk(asNumber);
        }
        if (!linkedJob) {
          linkedJob = await Job.findOne({
            where: { uuid: String(row.candidate.job_id) },
          });
        }
        if (!linkedJob) {
          throw new Error(`Job ID "${row.candidate.job_id}" does not exist.`);
        }
      }

      // Re-check duplicate at commit time
      const existingCandidate = await Candidate.findOne({
        where: {
          [Op.or]: [
            { email: row.candidate.email },
            { phone: row.candidate.phone },
          ],
        },
      });
      if (existingCandidate) {
        results.duplicates.push({
          name: row.name,
          email: row.email,
          phone: row.phone,
          error: `Already exists (${existingCandidate.email})`,
        });
        continue;
      }

      let resumeUrl = null;
      if (row.matchedPath) {
        const resumeMeta = entryByPath.get(row.matchedPath);
        const zipEntry = zipAnalysis.zip.getEntry(resumeMeta?.entryName || row.matchedPath);
        if (zipEntry) {
          const buffer = zipEntry.getData();
          const fileName = resumeMeta?.fileName || basename(row.matchedPath);
          resumeUrl = await uploadToS3(
            {
              originalname: fileName,
              buffer,
              mimetype: mimeFromFileName(fileName),
            },
            "resumes"
          );
        }
      }

      const created = await Candidate.create({
        name: row.candidate.name,
        email: row.candidate.email,
        phone: row.candidate.phone,
        experience: row.candidate.experience || 0,
        current_company: row.candidate.current_company || null,
        current_ctc: row.candidate.current_ctc || 0,
        expected_ctc: row.candidate.expected_ctc || 0,
        notice_period: row.candidate.notice_period || 0,
        current_location: row.candidate.current_location || null,
        preferred_location: row.candidate.preferred_location || null,
        source: row.candidate.source || "Direct",
        referred_by: row.candidate.referred_by || null,
        notes: row.candidate.notes || null,
        job_id: linkedJob ? linkedJob.id : null,
        application_status: "applied",
        created_by: row.candidate.created_by || creatorRecord.username,
        created_by_id: String(creatorRecord.user_id),
        resume_url: resumeUrl,
      });

      results.success.push({
        name: row.name,
        email: row.email,
        id: created.uuid,
        resume: row.matchedFile || null,
        nested: row.nested,
        message: resumeUrl
          ? `Created with resume ${row.matchedFile}`
          : "Created without resume",
      });
    } catch (error) {
      results.errors.push({
        name: row.name,
        email: row.email,
        error: `Row ${row.rowNumber}: ${error.message}`,
      });
    }
  }

  const message =
    `Import complete: ${results.success.length} created, ` +
    `${results.duplicates.length} duplicates, ` +
    `${results.skipped.length} skipped, ` +
    `${results.errors.length} errors`;

  return {
    success: true,
    message,
    mode,
    summary: preview.summary,
    results,
  };
};
