import * as XLSX from 'xlsx';
import axiosInstance from '../services/api';

export const RESUME_EXTENSIONS = ['.pdf', '.doc', '.docx', '.rtf', '.txt'];

const JUNK_PATH_RE = /(^|\/)(__macosx|\.ds_store|thumbs\.db)(\/|$)/i;

export const pickField = (row, keys) => {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return typeof value === 'string' ? value.trim() : value;
    }
  }
  return undefined;
};

export const convertExcelToJson = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: 'binary' });
        const sheetName =
          workbook.SheetNames.find((name) => name.toLowerCase() !== 'instructions') ||
          workbook.SheetNames[0];
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        resolve(
          rows.filter((row) =>
            Object.entries(row).some(([key, value]) => {
              if (['created_by_id', 'created_by'].includes(String(key).toLowerCase())) return false;
              return value !== '' && value != null;
            })
          )
        );
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsBinaryString(file);
  });
};

export const REQUIRED_CANDIDATE_FIELDS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'created_by_id', label: 'Creator ID' },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateCandidateRows = (candidates) => {
  return candidates
    .map((candidate, index) => {
      const rowNumber = index + 2;
      const problems = [];

      if (!candidate.name) problems.push('Name is required');
      if (!candidate.email) problems.push('Email is required');
      else if (!EMAIL_PATTERN.test(String(candidate.email))) problems.push('Email is not valid');
      if (!candidate.phone) problems.push('Phone is required');
      if (!candidate.created_by_id) problems.push('Creator ID is required');

      if (!problems.length) return null;

      return {
        level: 'error',
        name: candidate.name || `Row ${rowNumber}`,
        email: candidate.email || '',
        error: `Row ${rowNumber}: ${problems.join('. ')}.`,
      };
    })
    .filter(Boolean);
};

const getExtension = (filename = '') => {
  const match = String(filename).toLowerCase().match(/(\.[a-z0-9]+)$/);
  return match ? match[1] : '';
};

const isResumeFileName = (filename = '') =>
  RESUME_EXTENSIONS.includes(getExtension(filename));

const isJunkPath = (path = '') => JUNK_PATH_RE.test(path) || path.split('/').pop()?.startsWith('.');

const basename = (path = '') => path.split('/').filter(Boolean).pop() || path;

const folderOf = (path = '') => {
  const parts = path.split('/').filter(Boolean);
  if (parts.length <= 1) return '(ZIP root)';
  return parts.slice(0, -1).join('/');
};

const depthOf = (path = '') => Math.max(0, path.split('/').filter(Boolean).length - 1);

const normalizeMatchToken = (value = '') =>
  String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '');

/**
 * Recursively inspect ZIP: nested folders, resume files, junk files.
 */
export const analyzeZipArchive = (zip) => {
  const allPaths = Object.keys(zip.files || {});
  const folders = new Set();
  const resumeFiles = [];
  const otherFiles = [];
  let skippedJunk = 0;

  for (const path of allPaths) {
    const entry = zip.files[path];
    if (!entry) continue;

    if (isJunkPath(path)) {
      skippedJunk += 1;
      continue;
    }

    if (entry.dir || path.endsWith('/')) {
      const clean = path.replace(/\/+$/, '');
      if (clean) folders.add(clean);
      continue;
    }

    const fileName = basename(path);
    const depth = depthOf(path);
    const folder = folderOf(path);

    if (depth > 0) {
      folders.add(folder);
    }

    if (isResumeFileName(fileName)) {
      resumeFiles.push({
        path,
        fileName,
        folder,
        depth,
        entry,
      });
    } else {
      otherFiles.push({ path, fileName, folder, depth });
    }
  }

  const nestedFolders = [...folders]
    .filter((f) => f.includes('/'))
    .sort((a, b) => a.localeCompare(b));

  const topLevelFolders = [...folders]
    .filter((f) => !f.includes('/'))
    .sort((a, b) => a.localeCompare(b));

  const maxDepth = resumeFiles.reduce((max, f) => Math.max(max, f.depth), 0);
  const hasNestedStructure = maxDepth > 0 || nestedFolders.length > 0 || topLevelFolders.length > 0;

  const structurePreview = [];
  if (topLevelFolders.length) {
    structurePreview.push(`Folders: ${topLevelFolders.slice(0, 8).join(', ')}${topLevelFolders.length > 8 ? '…' : ''}`);
  }
  if (nestedFolders.length) {
    structurePreview.push(
      `Nested paths: ${nestedFolders.slice(0, 6).join(', ')}${nestedFolders.length > 6 ? '…' : ''}`
    );
  }
  structurePreview.push(
    `Resume files found: ${resumeFiles.length} (${RESUME_EXTENSIONS.join(', ')})`
  );

  return {
    totalEntries: allPaths.length,
    totalFiles: resumeFiles.length + otherFiles.length,
    resumeFiles,
    otherFiles,
    folders: [...folders].sort(),
    topLevelFolders,
    nestedFolders,
    nestedFolderCount: nestedFolders.length + topLevelFolders.length,
    maxDepth,
    hasNestedStructure,
    skippedJunk,
    structurePreview,
  };
};

export const countZipFiles = (zip) => analyzeZipArchive(zip).resumeFiles.length;

const scoreNameMatch = (candidateName, fileNameWithoutExt) => {
  const candidate = String(candidateName || '').trim();
  if (!candidate || !fileNameWithoutExt) return 0;

  const first = candidate.toLowerCase().split(/\s+/)[0] || '';
  const fullSpaced = candidate.toLowerCase();
  const fullUnderscore = fullSpaced.replace(/\s+/g, '_');
  const fullDash = fullSpaced.replace(/\s+/g, '-');

  const cleanFile = normalizeMatchToken(fileNameWithoutExt);
  const cleanFirst = normalizeMatchToken(first);
  const cleanFull = normalizeMatchToken(candidate);

  if (!cleanFile || !cleanFirst) return 0;

  if (cleanFile === cleanFull) return 100;
  if (fileNameWithoutExt === fullUnderscore || fileNameWithoutExt === fullDash || fileNameWithoutExt === fullSpaced) {
    return 95;
  }
  if (cleanFile === cleanFirst) return 80;
  if (cleanFile.startsWith(cleanFull) || cleanFull.startsWith(cleanFile)) return 70;
  if (cleanFile.includes(cleanFull) || cleanFull.includes(cleanFile)) return 60;
  if (cleanFile.startsWith(cleanFirst) || cleanFirst.startsWith(cleanFile)) return 50;
  if (cleanFile.includes(cleanFirst) || cleanFirst.includes(cleanFile)) return 40;
  return 0;
};

/**
 * Find best matching resume anywhere in the ZIP (including nested folders).
 * Returns the full ZIP path, or null.
 */
export const findMatchingResumeInZip = (zip, candidateName = '') => {
  const analysis = analyzeZipArchive(zip);
  let best = null;
  let bestScore = 0;

  for (const file of analysis.resumeFiles) {
    const withoutExt = file.fileName.replace(/\.[^/.]+$/, '');
    const score = scoreNameMatch(candidateName, withoutExt);
    if (score > bestScore) {
      bestScore = score;
      best = file.path;
    }
  }

  // Require a meaningful match (avoid accidental single-letter hits)
  return bestScore >= 40 ? best : null;
};

/**
 * Per-candidate match report used by the pictorial UI.
 */
export const buildResumeMatchReport = (candidates, zip) => {
  const analysis = analyzeZipArchive(zip);

  const rows = candidates.map((candidate, index) => {
    const rowNumber = index + 2;
    const matchedPath = candidate.name ? findMatchingResumeInZip(zip, candidate.name) : null;

    if (!candidate.name) {
      return {
        level: 'error',
        indicator: 'error',
        rowNumber,
        name: `Row ${rowNumber}`,
        email: candidate.email || '',
        matchedPath: null,
        matchedFile: null,
        folder: null,
        nested: false,
        message: `Row ${rowNumber}: Candidate name is missing, so resume cannot be matched.`,
      };
    }

    if (matchedPath) {
      const depth = depthOf(matchedPath);
      return {
        level: depth > 0 ? 'warning' : 'success',
        indicator: depth > 0 ? 'warning' : 'success',
        rowNumber,
        name: candidate.name,
        email: candidate.email || '',
        matchedPath,
        matchedFile: basename(matchedPath),
        folder: folderOf(matchedPath),
        nested: depth > 0,
        message:
          depth > 0
            ? `Resume found in nested folder "${folderOf(matchedPath)}" → ${basename(matchedPath)}`
            : `Resume matched: ${basename(matchedPath)}`,
      };
    }

    return {
      level: 'error',
      indicator: 'error',
      rowNumber,
      name: candidate.name,
      email: candidate.email || '',
      matchedPath: null,
      matchedFile: null,
      folder: null,
      nested: false,
      message: `Row ${rowNumber}: No resume in the ZIP matches "${candidate.name}". Name the file like firstname.pdf or full_name.pdf (nested folders are OK).`,
    };
  });

  return { analysis, rows };
};

export const validateResumeMatches = (candidates, zip) => {
  const { analysis, rows } = buildResumeMatchReport(candidates, zip);

  if (analysis.resumeFiles.length === 0) {
    return [
      {
        level: 'error',
        name: '-',
        email: '',
        error:
          'The ZIP has no resume files. Add PDF/DOC/DOCX files (nested folders are supported).',
      },
    ];
  }

  return rows
    .filter((row) => row.indicator === 'error')
    .map((row) => ({
      level: 'error',
      name: row.name,
      email: row.email,
      error: row.message,
    }));
};

export const mapExcelRowToCandidate = (row, currentUser = {}) => {
  const email = pickField(row, ['email', 'Email']);
  const phone = pickField(row, ['phone', 'Phone']);
  const experience = pickField(row, ['experience', 'Experience']);
  const currentCtc = pickField(row, ['current_ctc', 'Current_CTC']);
  const expectedCtc = pickField(row, ['expected_ctc', 'Expected_CTC']);
  const noticePeriod = pickField(row, ['notice_period', 'Notice_Period']);

  return {
    name: pickField(row, ['name', 'Name']),
    email: email ? String(email).toLowerCase().trim() : undefined,
    phone: phone ? String(phone).trim() : undefined,
    experience: experience !== undefined ? parseFloat(experience) || 0 : 0,
    current_company: pickField(row, ['current_company', 'Current_Company']),
    current_ctc: currentCtc !== undefined ? parseFloat(currentCtc) || 0 : 0,
    expected_ctc: expectedCtc !== undefined ? parseFloat(expectedCtc) || 0 : 0,
    notice_period: noticePeriod !== undefined ? parseInt(noticePeriod, 10) || 0 : 0,
    current_location: pickField(row, ['current_location', 'Current_Location']),
    preferred_location: pickField(row, ['preferred_location', 'Preferred_Location']),
    source: pickField(row, ['source', 'Source']) || 'Direct',
    referred_by: pickField(row, ['referred_by', 'Referred_By']),
    notes: pickField(row, ['notes', 'Notes']),
    job_id: pickField(row, ['job_id', 'Job_ID', 'jobId', 'Job ID']),
    created_by: pickField(row, ['created_by']) || currentUser.username,
    created_by_id: pickField(row, ['created_by_id', 'Creator_ID', 'creator_id']) || currentUser.user_id,
  };
};

const mimeFromFileName = (fileName = '') => {
  const ext = getExtension(fileName);
  if (ext === '.pdf') return 'application/pdf';
  if (ext === '.doc') return 'application/msword';
  if (ext === '.docx') {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  if (ext === '.rtf') return 'application/rtf';
  if (ext === '.txt') return 'text/plain';
  return 'application/octet-stream';
};

export const uploadResumeAndAttach = async (candidate, zipFileEntry, updateUrl) => {
  const fileName = basename(zipFileEntry.name);
  const arrayBuffer = await zipFileEntry.async('arraybuffer');
  const resumeFile = new File([arrayBuffer], fileName, {
    type: mimeFromFileName(fileName),
  });

  const formData = new FormData();
  formData.append('file', resumeFile);

  const uploadResponse = await axiosInstance.post('/api/upload/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  await axiosInstance.put(updateUrl || `/api/candidates/${candidate.id}`, {
    resume_url: uploadResponse.data.url,
  });

  return fileName;
};
