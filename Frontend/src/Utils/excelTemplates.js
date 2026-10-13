import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx-js-style';

const headerStyle = {
  font: { bold: true, color: { rgb: 'FFFFFFFF' } },
  fill: { fgColor: { rgb: 'FF0B1D36' } },
  alignment: { wrapText: true, vertical: 'center' },
};

const requiredHeaderStyle = {
  font: { bold: true, color: { rgb: 'FF0B1D36' } },
  fill: { fgColor: { rgb: 'FFD4AF37' } },
  alignment: { wrapText: true, vertical: 'center' },
};

const sampleStyle = {
  font: { color: { rgb: 'FF333333' } },
  fill: { fgColor: { rgb: 'FFF7F8FB' } },
};

const getCreator = (currentUser = {}) => ({
  id: currentUser.user_id || currentUser.id || '',
  name: currentUser.username || currentUser.name || '',
});

const TEMPLATE_DEFINITIONS = {
  candidates: {
    sheetName: 'Candidates',
    fileName: 'candidate-upload-template',
    columns: [
      { key: 'name', header: 'name', required: true, example: 'John Doe', note: 'Full name', width: 22 },
      { key: 'email', header: 'email', required: true, example: 'john.doe@email.com', note: 'Must be unique', width: 28 },
      { key: 'phone', header: 'phone', required: true, example: '9876543210', note: 'Must be unique', width: 16 },
      { key: 'job_id', header: 'job_id', required: false, example: '', note: 'Optional. Numeric jobs.id from Job Management (the ID column, not the title). Leave blank to create without a job. If provided, the job must already exist. Invalid IDs fail this row only. UUID is also accepted.', width: 14 },
      { key: 'experience', header: 'experience', required: false, example: '4.5', note: 'Years, decimal allowed', width: 14 },
      { key: 'current_company', header: 'current_company', required: false, example: 'Infosys', note: '', width: 18 },
      { key: 'current_ctc', header: 'current_ctc', required: false, example: '900000', note: 'Annual CTC number', width: 14 },
      { key: 'expected_ctc', header: 'expected_ctc', required: false, example: '1300000', note: 'Annual CTC number', width: 14 },
      { key: 'notice_period', header: 'notice_period', required: false, example: '30', note: 'Days', width: 14 },
      { key: 'current_location', header: 'current_location', required: false, example: 'Bengaluru', note: '', width: 18 },
      { key: 'preferred_location', header: 'preferred_location', required: false, example: 'Bengaluru', note: '', width: 18 },
      { key: 'source', header: 'source', required: false, example: 'Direct', note: 'Direct, LinkedIn, Naukri, Referral, Indeed', width: 14 },
      { key: 'referred_by', header: 'referred_by', required: false, example: '', note: '', width: 16 },
      { key: 'notes', header: 'notes', required: false, example: '', note: 'Optional comments', width: 24 },
      { key: 'created_by_id', header: 'created_by_id', required: true, example: '', note: 'Must exist in users.user_id. Auto-filled for the downloader.', width: 18 },
      { key: 'created_by', header: 'created_by', required: false, example: '', note: 'Username of creator. Auto-filled.', width: 16 },
    ],
  },
  jobs: {
    sheetName: 'Jobs',
    fileName: 'job-upload-template',
    columns: [
      { key: 'title', header: 'title', required: true, example: 'Senior React Developer', note: 'Job title', width: 28 },
      { key: 'type', header: 'type', required: true, example: 'Full-Time', note: 'Full-Time, Part-Time, Contract, Internship', width: 14 },
      { key: 'description', header: 'description', required: false, example: 'Build React applications', note: '', width: 30 },
      { key: 'state', header: 'state', required: false, example: 'Karnataka', note: '', width: 16 },
      { key: 'city', header: 'city', required: false, example: 'Bengaluru', note: '', width: 16 },
      { key: 'minSalary', header: 'minSalary', required: false, example: '1200000', note: 'Number, must be <= maxSalary', width: 14 },
      { key: 'maxSalary', header: 'maxSalary', required: false, example: '1800000', note: 'Number, must be >= minSalary', width: 14 },
      { key: 'status', header: 'status', required: false, example: 'draft', note: 'active, draft, closed, archived, expired', width: 12 },
      { key: 'openings', header: 'openings', required: false, example: '2', note: 'Whole number >= 1. Defaults to 1', width: 12 },
      { key: 'deadline', header: 'deadline', required: false, example: '2026-12-31', note: 'YYYY-MM-DD', width: 14 },
      { key: 'experience_min', header: 'experience_min', required: false, example: '3', note: 'Years', width: 16 },
      { key: 'experience_max', header: 'experience_max', required: false, example: '6', note: 'Must be >= experience_min', width: 16 },
      { key: 'interviewRounds', header: 'interviewRounds', required: false, example: 'Technical,HR', note: 'Comma-separated', width: 20 },
      { key: 'skills', header: 'skills', required: false, example: 'React,JavaScript', note: 'Comma-separated', width: 20 },
      { key: 'clientName', header: 'clientName', required: false, example: 'Internal', note: '', width: 16 },
      { key: 'clientEmail', header: 'clientEmail', required: false, example: 'hr@example.com', note: 'Valid email if provided', width: 22 },
      { key: 'clientLocation', header: 'clientLocation', required: false, example: 'Bengaluru', note: '', width: 16 },
      { key: 'editable_by', header: 'editable_by', required: false, example: '', note: 'Comma-separated users.user_id values', width: 18 },
      { key: 'created_by_id', header: 'created_by_id', required: true, example: '', note: 'Must exist in users.user_id. Auto-filled for the downloader.', width: 18 },
      { key: 'created_by', header: 'created_by', required: false, example: '', note: 'Username of creator. Auto-filled.', width: 16 },
    ],
  },
  users: {
    sheetName: 'Users',
    fileName: 'user-upload-template',
    columns: [
      { key: 'user_id', header: 'user_id', required: false, example: 'USR2001', note: 'Unique. Auto-generated if empty', width: 12 },
      { key: 'name', header: 'name', required: true, example: 'Sample User', note: 'Full name', width: 20 },
      { key: 'username', header: 'username', required: true, example: 'sampleuser', note: 'Must be unique', width: 16 },
      { key: 'email', header: 'email', required: true, example: 'sample.user@example.com', note: 'Must be unique', width: 28 },
      { key: 'password', header: 'password', required: true, example: 'Password@123', note: 'Min 6 characters. Hashed on upload', width: 16 },
      { key: 'gender', header: 'gender', required: true, example: 'female', note: 'male, female, other', width: 12 },
      { key: 'role', header: 'role', required: true, example: 'User', note: 'Admin or User', width: 12 },
      { key: 'department', header: 'department', required: false, example: 'HR', note: '', width: 14 },
      { key: 'designation', header: 'designation', required: false, example: 'Recruiter', note: '', width: 16 },
      { key: 'mobile_number', header: 'mobile_number', required: false, example: '9876500011', note: '', width: 16 },
      { key: 'alt_mobile_number', header: 'alt_mobile_number', required: false, example: '', note: '', width: 18 },
      { key: 'pan_number', header: 'pan_number', required: false, example: 'ABCDE1234F', note: 'Format ABCDE1234F', width: 14 },
      { key: 'aadhar_number', header: 'aadhar_number', required: false, example: '123456789012', note: 'Exactly 12 digits', width: 16 },
      { key: 'address', header: 'address', required: false, example: 'Bengaluru', note: '', width: 20 },
      { key: 'status', header: 'status', required: false, example: 'active', note: 'active or inactive', width: 12 },
      { key: 'permissions', header: 'permissions', required: false, example: '', note: 'Comma-separated permission keys', width: 18 },
      { key: 'created_by_id', header: 'created_by_id', required: true, example: '', note: 'Must exist in users.user_id. Auto-filled for the downloader.', width: 18 },
    ],
  },
  skills: {
    sheetName: 'Skills',
    fileName: 'skill-upload-template',
    columns: [
      { key: 'name', header: 'name', required: true, example: 'React', note: 'Skill name. Must be unique.', width: 22 },
      { key: 'description', header: 'description', required: false, example: 'Frontend library for building UIs', note: 'Optional details', width: 40 },
      { key: 'status', header: 'status', required: false, example: 'active', note: 'active or inactive. Defaults to active.', width: 14 },
      { key: 'created_by_id', header: 'created_by_id', required: true, example: '', note: 'Must exist in users.user_id. Auto-filled for the downloader. Not stored on skills.', width: 18 },
    ],
  },
};

const colLetter = (index) => {
  let letter = '';
  let n = index;
  while (n >= 0) {
    letter = String.fromCharCode((n % 26) + 65) + letter;
    n = Math.floor(n / 26) - 1;
  }
  return letter;
};

export const downloadBulkTemplate = async (type, currentUser = {}) => {
  const definition = TEMPLATE_DEFINITIONS[type];
  if (!definition) {
    throw new Error(`Unknown template type: ${type}`);
  }

  const creator = getCreator(currentUser);
  const workbook = XLSX.utils.book_new();

  const cellValue = (column, useExample) => {
    if (column.key === 'created_by_id') return creator.id;
    if (column.key === 'created_by') return creator.name;
    return useExample ? (column.example ?? '') : '';
  };

  const rows = [
    definition.columns.map((column) => column.header),
    definition.columns.map((column) => cellValue(column, true)),
    ...Array.from({ length: 4 }, () => definition.columns.map((column) => cellValue(column, false))),
  ];

  const dataSheet = XLSX.utils.aoa_to_sheet(rows);
  definition.columns.forEach((column, index) => {
    const headerCell = dataSheet[`${colLetter(index)}1`];
    if (headerCell) {
      headerCell.s = column.required ? requiredHeaderStyle : headerStyle;
    }
    for (let row = 2; row <= rows.length; row += 1) {
      const cell = dataSheet[`${colLetter(index)}${row}`];
      if (cell) cell.s = sampleStyle;
    }
  });
  dataSheet['!cols'] = definition.columns.map((column) => ({ wch: column.width || 16 }));
  dataSheet['!rows'] = [{ hpt: 24 }];
  dataSheet['!freeze'] = { xSplit: 0, ySplit: 1 };
  dataSheet['!autofilter'] = {
    ref: `A1:${colLetter(definition.columns.length - 1)}1`,
  };

  XLSX.utils.book_append_sheet(workbook, dataSheet, definition.sheetName);

  const instructionRows = [
    ['Field', 'Required', 'Sample / allowed values', 'Notes'],
    ...definition.columns.map((column) => [
      column.key,
      column.required ? 'Yes' : 'No',
      column.key === 'created_by_id' ? (creator.id || '(sign in to auto-fill)') : String(column.example ?? ''),
      column.note || '',
    ]),
    [],
    [
      'How to use',
      '',
      '',
      'Keep row 1 headers. Gold columns are required. created_by_id is filled with the logged-in user who downloaded this file. Upload the data sheet (not Instructions). Invalid rows are reported individually.',
    ],
  ];

  const instructionSheet = XLSX.utils.aoa_to_sheet(instructionRows);
  ['A1', 'B1', 'C1', 'D1'].forEach((ref) => {
    if (instructionSheet[ref]) instructionSheet[ref].s = headerStyle;
  });
  instructionSheet['!cols'] = [{ wch: 22 }, { wch: 12 }, { wch: 36 }, { wch: 70 }];
  XLSX.utils.book_append_sheet(workbook, instructionSheet, 'Instructions');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const suffix = creator.id ? `-${creator.id}` : '';
  saveAs(blob, `${definition.fileName}${suffix}.xlsx`);
  return true;
};

export const downloadCandidateTemplate = async ({ data1, fileName = 'candidate-upload-template', currentUser } = {}) => {
  if (currentUser || !data1) {
    return downloadBulkTemplate('candidates', currentUser);
  }
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data1);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Candidates');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `${fileName}.xlsx`);
  return true;
};

export const downloadJsonExcelTemplate = async ({ data, fileName = 'upload-template', type, currentUser } = {}) => {
  if (type) {
    return downloadBulkTemplate(type, currentUser);
  }
  return downloadCandidateTemplate({ data1: data, fileName });
};

export const candidateTemplate = TEMPLATE_DEFINITIONS.candidates;
export const jobTemplate = TEMPLATE_DEFINITIONS.jobs;
export const userTemplate = TEMPLATE_DEFINITIONS.users;
export const skillTemplate = TEMPLATE_DEFINITIONS.skills;
