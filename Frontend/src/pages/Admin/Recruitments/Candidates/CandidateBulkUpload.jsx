import { useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { FaCheckCircle, FaDownload, FaExclamationCircle, FaTimesCircle, FaUpload } from 'react-icons/fa';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin } from '../../../../components';
import { useAuth } from '../../../../context/AuthContext';
import { downloadBulkTemplate } from '../../../../Utils/excelTemplates';
import {
  REQUIRED_CANDIDATE_FIELDS,
  convertExcelToJson,
  countZipFiles,
  findMatchingResumeInZip,
  mapExcelRowToCandidate,
  uploadResumeAndAttach,
  validateCandidateRows,
  validateResumeMatches,
} from '../../../../Utils/candidateBulkUpload';
import { CANDIDATE_ENDPOINTS } from '../../../../constants/apiEndpoints';
import { api } from '../../../../services/api';

const emptyResults = { success: [], duplicates: [], errors: [] };

const CandidateBulkUpload = ({
  Layout = DefaultLayoutAdmin,
  Breadcrumb = BreadcrumbAdmin,
  listPath = '/admin/recruitments/candidates',
  resumeUpdatePath,
}) => {
  const { state } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const zipInputRef = useRef(null);

  const [excelFile, setExcelFile] = useState(null);
  const [zipFile, setZipFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [phase, setPhase] = useState('idle');
  const [summaryMessage, setSummaryMessage] = useState('');
  const [results, setResults] = useState(emptyResults);
  const [resumeStatus, setResumeStatus] = useState([]);
  const [resumeCounts, setResumeCounts] = useState({ total: 0, success: 0, notFound: 0, failed: 0 });
  const [missingResumes, setMissingResumes] = useState([]);

  const canUpload = Boolean(excelFile && zipFile) && !uploading;

  const counts = useMemo(() => ({
    success: results.success.length,
    duplicates: results.duplicates.length,
    errors: results.errors.length,
    total: results.success.length + results.duplicates.length + results.errors.length,
  }), [results]);

  const hasOutcome = phase !== 'idle' && (counts.total > 0 || resumeStatus.length > 0 || summaryMessage);

  const resetOutcome = () => {
    setResults(emptyResults);
    setResumeStatus([]);
    setResumeCounts({ total: 0, success: 0, notFound: 0, failed: 0 });
    setMissingResumes([]);
    setSummaryMessage('');
    setPhase('idle');
  };

  const handleDownloadTemplate = async () => {
    try {
      if (!state?.user?.user_id) {
        toast.error('Please sign in again so Creator ID can be added to the template');
        return;
      }
      await downloadBulkTemplate('candidates', state.user);
      toast.success(`Template downloaded with Creator ID ${state.user.user_id}`);
    } catch (error) {
      toast.error('Failed to download template');
    }
  };

  const handleExcelChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.type.includes('spreadsheet') || file.type.includes('excel') || file.name.match(/\.(xlsx|xls)$/i)) {
      setExcelFile(file);
      resetOutcome();
    } else {
      toast.error('Please choose an Excel file (.xlsx or .xls)');
      event.target.value = '';
      setExcelFile(null);
    }
  };

  const handleZipChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (
      file.type === 'application/zip' ||
      file.type === 'application/x-zip-compressed' ||
      file.name.match(/\.zip$/i)
    ) {
      setZipFile(file);
      resetOutcome();
    } else {
      toast.error('Please choose a ZIP file of resumes');
      event.target.value = '';
      setZipFile(null);
    }
  };

  const processResumes = async (createdCandidates, zipBlob) => {
    const JSZip = (await import('jszip')).default;
    const zip = await JSZip.loadAsync(zipBlob);
    const missing = [];

    setResumeCounts({ total: createdCandidates.length, success: 0, notFound: 0, failed: 0 });
    setResumeStatus(
      createdCandidates.map((candidate) => ({
        name: candidate.name,
        email: candidate.email,
        status: 'pending',
        file: null,
        message: 'Waiting to match resume...',
      }))
    );

    for (const candidate of createdCandidates) {
      setResumeStatus((prev) =>
        prev.map((row) =>
          row.name === candidate.name
            ? { ...row, status: 'processing', message: 'Looking for matching resume...' }
            : row
        )
      );

      const matchingFile = findMatchingResumeInZip(zip, candidate.name);
      if (!matchingFile) {
        const firstName = String(candidate.name || '').toLowerCase().split(' ')[0];
        const fullName = String(candidate.name || '').toLowerCase().replace(/\s+/g, '_');
        missing.push({
          candidateName: candidate.name,
          expectedPattern: `${firstName}.pdf or ${fullName}.pdf`,
          availableFiles: Object.keys(zip.files)
            .filter((name) => !zip.files[name].dir)
            .map((name) => name.split('/').pop()),
        });
        setResumeStatus((prev) =>
          prev.map((row) =>
            row.name === candidate.name
              ? { ...row, status: 'not-found', file: 'Not found', message: 'No matching resume found' }
              : row
          )
        );
        setResumeCounts((prev) => ({ ...prev, notFound: prev.notFound + 1 }));
        continue;
      }

      try {
        setResumeStatus((prev) =>
          prev.map((row) =>
            row.name === candidate.name
              ? { ...row, status: 'uploading', file: matchingFile.split('/').pop(), message: 'Uploading resume...' }
              : row
          )
        );
        const fileName = await uploadResumeAndAttach(
          candidate,
          zip.files[matchingFile],
          resumeUpdatePath ? resumeUpdatePath(candidate.id) : undefined
        );
        setResumeStatus((prev) =>
          prev.map((row) =>
            row.name === candidate.name
              ? { ...row, status: 'success', file: fileName, message: 'Resume uploaded successfully' }
              : row
          )
        );
        setResumeCounts((prev) => ({ ...prev, success: prev.success + 1 }));
      } catch (error) {
        setResumeStatus((prev) =>
          prev.map((row) =>
            row.name === candidate.name
              ? { ...row, status: 'failed', file: matchingFile.split('/').pop(), message: error.message || 'Error uploading resume' }
              : row
          )
        );
        setResumeCounts((prev) => ({ ...prev, failed: prev.failed + 1 }));
      }
    }

    setMissingResumes(missing);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!excelFile || !zipFile) {
      toast.error('Please upload both the Excel template and the resume ZIP');
      return;
    }
    if (!state?.user?.user_id) {
      toast.error('Please sign in so Creator ID can be set on each row.');
      return;
    }

    resetOutcome();
    setUploading(true);
    setPhase('validating');
    const loadingToast = toast.loading('Checking required fields...');

    try {
      const excelData = await convertExcelToJson(excelFile);
      if (!excelData.length) {
        setPhase('blocked');
        setResults({
          success: [],
          duplicates: [],
          errors: [{ name: '-', email: '', error: 'The Excel file has no candidate rows to upload.' }],
        });
        setSummaryMessage('Upload did not start. The template has no data rows.');
        toast.error('The Excel file has no candidate rows to upload.', { id: loadingToast });
        return;
      }

      const candidates = excelData.map((row) => mapExcelRowToCandidate(row, state?.user || {}));
      const rowErrors = validateCandidateRows(candidates);
      const JSZip = (await import('jszip')).default;
      const zip = await JSZip.loadAsync(zipFile);
      const resumeErrors = countZipFiles(zip) === 0
        ? [{
            name: '-',
            email: '',
            error: 'The ZIP file is empty. Add one resume file per candidate, named with first name or full_name.',
          }]
        : validateResumeMatches(candidates, zip);

      const blockingErrors = [...rowErrors, ...resumeErrors];
      if (blockingErrors.length) {
        setPhase('blocked');
        setResults({ success: [], duplicates: [], errors: blockingErrors });
        setSummaryMessage(
          `Upload did not start. Fix ${blockingErrors.length} required-field ${blockingErrors.length === 1 ? 'issue' : 'issues'} and try again.`
        );
        toast.error('Required details are missing. Nothing was uploaded.', { id: loadingToast });
        return;
      }

      setPhase('uploading');
      toast.loading('Saving candidates...', { id: loadingToast });

      const response = await api.post(CANDIDATE_ENDPOINTS.BULK_UPLOAD, {
        candidates,
        created_by: state?.user?.username,
        created_by_id: state?.user?.user_id,
      });

      if (!response.data?.success) {
        toast.error(response.data?.message || 'Failed to upload candidates', { id: loadingToast });
        setPhase('failed');
        return;
      }

      const nextResults = response.data.results || emptyResults;
      setResults(nextResults);
      setSummaryMessage(response.data.message || 'Upload processed');

      if (nextResults.success.length > 0) {
        setPhase('resumes');
        toast.loading('Uploading matched resumes...', { id: loadingToast });
        await processResumes(nextResults.success, zipFile);
      }

      toast.success(response.data.message || 'Bulk upload completed', { id: loadingToast });
      setPhase('complete');
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    } catch (error) {
      setPhase('failed');
      toast.error(error.response?.data?.message || error.response?.data?.msg || 'Upload failed', {
        id: loadingToast,
      });
    } finally {
      setUploading(false);
    }
  };

  const statusLabel = {
    idle: 'Ready',
    validating: 'Checking required fields',
    blocked: 'Stopped — missing required details',
    uploading: 'Saving candidates',
    resumes: 'Uploading resumes',
    complete: 'Completed',
    failed: 'Failed',
  }[phase];

  const statusClass = (status) => {
    if (status === 'success') return 'bg-success/10 text-success';
    if (status === 'failed') return 'bg-danger/10 text-danger';
    if (status === 'not-found') return 'bg-warning/10 text-warning';
    if (status === 'processing' || status === 'uploading') return 'bg-primary/10 text-primary';
    return 'bg-[#0b1d36]/5 text-[#0b1d36]/70';
  };

  return (
    <Layout>
      <Breadcrumb pageName="Bulk Upload" backUrl={listPath} />

      <div className="app-card mb-6 p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4af37]">Candidates</p>
        <h3 className="mt-1 text-xl font-semibold text-[#0b1d36]">Excel template + resume ZIP</h3>
        <p className="mt-2 text-sm text-[#0b1d36]/70">
          Upload both files. Every row needs Name, Email, Phone, and Creator ID. Job ID is optional. The ZIP must include a matching resume. If anything required is missing, nothing is uploaded.
        </p>

        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-[#0b1d36]">Required</p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-sm font-medium text-[#0b1d36]">Excel file</span>
            <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-sm font-medium text-[#0b1d36]">Resume ZIP</span>
            {REQUIRED_CANDIDATE_FIELDS.map((field) => (
              <span
                key={field.key}
                className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-sm font-medium text-[#0b1d36]"
              >
                {field.label}
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm text-[#0b1d36]/70">
            Name resume files with the candidate first name or full_name, for example jane.pdf or jane_doe.pdf.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0b1d36]">
              Excel template <span className="text-danger">*</span>
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx,.xls"
              onChange={handleExcelChange}
              className="w-full rounded-xl border border-[rgba(11,29,54,0.12)] bg-white py-3 px-4 outline-none focus:border-[#d4af37]"
            />
            {excelFile && <p className="mt-2 text-sm text-[#0b1d36]/70">{excelFile.name}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0b1d36]">
              Resume ZIP <span className="text-danger">*</span>
            </label>
            <input
              type="file"
              ref={zipInputRef}
              accept=".zip"
              onChange={handleZipChange}
              className="w-full rounded-xl border border-[rgba(11,29,54,0.12)] bg-white py-3 px-4 outline-none focus:border-[#d4af37]"
            />
            {zipFile && <p className="mt-2 text-sm text-[#0b1d36]/70">{zipFile.name}</p>}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={handleDownloadTemplate} className="btn-navy">
            <FaDownload /> Download Template
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!canUpload}
            className={`btn-gold ${!canUpload ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FaUpload />
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>

      {hasOutcome && (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="app-card p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-[#0b1d36]/50">Status</p>
              <p className="mt-1 font-semibold text-[#0b1d36]">{statusLabel}</p>
            </div>
            <div className="app-card p-4 text-center">
              <FaCheckCircle className="mx-auto mb-1 text-success" />
              <p className="font-semibold text-[#0b1d36]">{counts.success} Successful</p>
            </div>
            <div className="app-card p-4 text-center">
              <FaExclamationCircle className="mx-auto mb-1 text-warning" />
              <p className="font-semibold text-[#0b1d36]">{counts.duplicates} Duplicates</p>
            </div>
            <div className="app-card p-4 text-center">
              <FaTimesCircle className="mx-auto mb-1 text-danger" />
              <p className="font-semibold text-[#0b1d36]">{counts.errors} {phase === 'blocked' ? 'Blocked' : 'Failed'}</p>
            </div>
          </div>

          {resumeStatus.length > 0 && (
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="app-card p-4 text-center">
                <p className="text-xs uppercase tracking-wide text-[#0b1d36]/50">Resumes matched</p>
                <p className="mt-1 font-semibold text-[#0b1d36]">{resumeCounts.success}/{resumeCounts.total || 0}</p>
              </div>
              <div className="app-card p-4 text-center">
                <p className="text-xs uppercase tracking-wide text-[#0b1d36]/50">Resume issues</p>
                <p className="mt-1 font-semibold text-[#0b1d36]">{resumeCounts.notFound + resumeCounts.failed}</p>
              </div>
            </div>
          )}

          {summaryMessage && (
            <div className={`app-card mb-6 p-4 text-sm font-medium ${phase === 'blocked' ? 'border-danger/40 text-danger' : 'border-[rgba(212,175,55,0.35)] text-[#0b1d36]'}`}>
              {summaryMessage}
            </div>
          )}
        </>
      )}

      {results.success.length > 0 && (
        <div className="app-card mb-6 overflow-hidden">
          <h4 className="px-5 py-4 text-lg font-semibold text-[#0b1d36]">Successfully uploaded</h4>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Message</th>
                </tr>
              </thead>
              <tbody>
                {results.success.map((row, index) => (
                  <tr key={`ok-${index}`} className="border-t border-[rgba(11,29,54,0.08)]">
                    <td className="px-4 py-3">{row.name}</td>
                    <td className="px-4 py-3">{row.email}</td>
                    <td className="px-4 py-3">{row.id}</td>
                    <td className="px-4 py-3 text-success">{row.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {results.duplicates.length > 0 && (
        <div className="app-card mb-6 overflow-hidden">
          <h4 className="px-5 py-4 text-lg font-semibold text-[#0b1d36]">Duplicates</h4>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Error</th>
                </tr>
              </thead>
              <tbody>
                {results.duplicates.map((row, index) => (
                  <tr key={`dup-${index}`} className="border-t border-[rgba(11,29,54,0.08)]">
                    <td className="px-4 py-3">{row.name}</td>
                    <td className="px-4 py-3">{row.email}</td>
                    <td className="px-4 py-3 text-warning">{row.error}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {results.errors.length > 0 && (
        <div className="app-card mb-6 overflow-hidden">
          <h4 className="px-5 py-4 text-lg font-semibold text-[#0b1d36]">
            {phase === 'blocked' ? 'Missing required details' : 'Failed records'}
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Message</th>
                </tr>
              </thead>
              <tbody>
                {results.errors.map((row, index) => (
                  <tr key={`err-${index}`} className="border-t border-[rgba(11,29,54,0.08)]">
                    <td className="px-4 py-3">{row.name || '-'}</td>
                    <td className="px-4 py-3">{row.email || '-'}</td>
                    <td className="px-4 py-3 text-danger">{row.error}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {resumeStatus.length > 0 && (
        <div className="app-card mb-6 overflow-hidden">
          <h4 className="px-5 py-4 text-lg font-semibold text-[#0b1d36]">Resume status</h4>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left">Candidate</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">File</th>
                  <th className="px-4 py-3 text-left">Message</th>
                </tr>
              </thead>
              <tbody>
                {resumeStatus.map((row, index) => (
                  <tr key={`resume-${index}`} className="border-t border-[rgba(11,29,54,0.08)]">
                    <td className="px-4 py-3">{row.name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusClass(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{row.file || '-'}</td>
                    <td className="px-4 py-3">{row.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {missingResumes.length > 0 && (
        <div className="app-card mb-6 overflow-hidden">
          <h4 className="px-5 py-4 text-lg font-semibold text-[#0b1d36]">Missing resumes</h4>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left">Candidate</th>
                  <th className="px-4 py-3 text-left">Expected filename</th>
                  <th className="px-4 py-3 text-left">Files in ZIP</th>
                </tr>
              </thead>
              <tbody>
                {missingResumes.map((row, index) => (
                  <tr key={`missing-${index}`} className="border-t border-[rgba(11,29,54,0.08)]">
                    <td className="px-4 py-3">{row.candidateName}</td>
                    <td className="px-4 py-3 text-danger">{row.expectedPattern}</td>
                    <td className="px-4 py-3 text-[#0b1d36]/70">{row.availableFiles.join(', ') || 'None'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CandidateBulkUpload;
