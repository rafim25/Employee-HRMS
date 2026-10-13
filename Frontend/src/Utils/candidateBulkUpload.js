import * as XLSX from 'xlsx';
import axiosInstance from '../services/api';

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
  return candidates.map((candidate, index) => {
    const rowNumber = index + 2;
    const problems = [];

    if (!candidate.name) problems.push('Name is required');
    if (!candidate.email) problems.push('Email is required');
    else if (!EMAIL_PATTERN.test(String(candidate.email))) problems.push('Email is not valid');
    if (!candidate.phone) problems.push('Phone is required');
    if (!candidate.created_by_id) problems.push('Creator ID is required');

    if (!problems.length) return null;

    return {
      name: candidate.name || `Row ${rowNumber}`,
      email: candidate.email || '',
      error: `Row ${rowNumber}: ${problems.join('. ')}.`,
    };
  }).filter(Boolean);
};

export const countZipFiles = (zip) =>
  Object.keys(zip.files).filter((name) => !zip.files[name].dir).length;

export const validateResumeMatches = (candidates, zip) => {
  return candidates.map((candidate, index) => {
    const rowNumber = index + 2;
    if (!candidate.name) return null;
    if (findMatchingResumeInZip(zip, candidate.name)) return null;
    return {
      name: candidate.name,
      email: candidate.email || '',
      error: `Row ${rowNumber}: No resume in the ZIP matches "${candidate.name}". Name the file like firstname.pdf or full_name.pdf.`,
    };
  }).filter(Boolean);
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

export const findMatchingResumeInZip = (zip, candidateName = '') => {
  const candidateFirst = String(candidateName).toLowerCase().split(' ')[0];
  const candidateFullName = String(candidateName).toLowerCase().replace(/\s+/g, '_');

  return Object.keys(zip.files).find((filename) => {
    const fileName = filename.toLowerCase().split('/').pop().replace(/\.[^/.]+$/, '');
    const cleanFileName = fileName.replace(/[^a-z]/g, '');
    const cleanCandidateName = candidateFirst.replace(/[^a-z]/g, '');
    const cleanCandidateFullName = candidateFullName.replace(/[^a-z]/g, '');

    return (
      !zip.files[filename].dir &&
      (
        fileName === candidateFirst ||
        fileName === candidateFullName ||
        cleanFileName === cleanCandidateName ||
        cleanFileName === cleanCandidateFullName ||
        cleanFileName.includes(cleanCandidateName) ||
        cleanCandidateName.includes(cleanFileName) ||
        cleanFileName.startsWith(cleanCandidateName) ||
        cleanCandidateName.startsWith(cleanFileName)
      )
    );
  });
};

export const uploadResumeAndAttach = async (candidate, zipFileEntry, updateUrl) => {
  const arrayBuffer = await zipFileEntry.async('arraybuffer');
  const resumeFile = new File([arrayBuffer], zipFileEntry.name.split('/').pop(), {
    type: 'application/pdf',
  });

  const formData = new FormData();
  formData.append('file', resumeFile);

  const uploadResponse = await axiosInstance.post('/api/upload/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  await axiosInstance.put(updateUrl || `/api/candidates/${candidate.id}`, {
    resume_url: uploadResponse.data.url,
  });

  return zipFileEntry.name.split('/').pop();
};
