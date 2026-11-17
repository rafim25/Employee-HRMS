/**
 * Client helpers for server-side bulk candidate import (preview → commit).
 */
import axiosInstance from '../services/api';

export const REQUIRED_CANDIDATE_FIELDS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
];

export const OPTIONAL_HINTS = [
  'Job ID (optional)',
  'resume_filename (optional — improves matching)',
  'Creator ID auto-filled from your login',
];

/**
 * @param {File} excelFile
 * @param {File} zipFile
 */
export const previewBulkImport = async (excelFile, zipFile) => {
  const formData = new FormData();
  formData.append('excel', excelFile);
  formData.append('zip', zipFile);

  const response = await axiosInstance.post(
    '/api/candidates/bulk-import/preview',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000,
    }
  );
  return response.data;
};

/**
 * @param {File} excelFile
 * @param {File} zipFile
 * @param {'matched_only'|'include_ambiguous'} mode
 */
export const commitBulkImport = async (excelFile, zipFile, mode = 'matched_only') => {
  const formData = new FormData();
  formData.append('excel', excelFile);
  formData.append('zip', zipFile);
  formData.append('mode', mode);

  const response = await axiosInstance.post(
    '/api/candidates/bulk-import/commit',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000,
    }
  );
  return response.data;
};

export const downloadErrorCsv = (rows = []) => {
  const header = ['Row', 'Status', 'Name', 'Email', 'Phone', 'Message', 'Matched File'];
  const lines = [header.join(',')];
  for (const row of rows) {
    const cells = [
      row.rowNumber || '',
      row.status || '',
      row.name || '',
      row.email || '',
      row.phone || '',
      row.message || row.error || '',
      row.matchedFile || '',
    ].map((value) => `"${String(value).replace(/"/g, '""')}"`);
    lines.push(cells.join(','));
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `bulk-import-report-${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
