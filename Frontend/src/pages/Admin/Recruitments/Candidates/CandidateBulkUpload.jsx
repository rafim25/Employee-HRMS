import { useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import {
  FaCheckCircle,
  FaDownload,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaFolderOpen,
  FaTimesCircle,
  FaUpload,
} from 'react-icons/fa';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin } from '../../../../components';
import { useAuth } from '../../../../context/AuthContext';
import { downloadBulkTemplate } from '../../../../Utils/excelTemplates';
import {
  REQUIRED_CANDIDATE_FIELDS,
  analyzeZipArchive,
  buildResumeMatchReport,
  convertExcelToJson,
  findMatchingResumeInZip,
  mapExcelRowToCandidate,
  uploadResumeAndAttach,
  validateCandidateRows,
  validateResumeMatches,
} from '../../../../Utils/candidateBulkUpload';
import { CANDIDATE_ENDPOINTS } from '../../../../constants/apiEndpoints';
import { api } from '../../../../services/api';

const emptyResults = { success: [], duplicates: [], errors: [] };

const Indicator = ({ type }) => {
  if (type === 'success') {
    return (
      <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700" title="Success">
        <span className="text-base leading-none">🟢</span> Success
      </span>
    );
  }
  if (type === 'warning') {
    return (
      <span className="inline-flex items-center gap-1.5 font-medium text-amber-700" title="Warning">
        <span className="text-base leading-none">🟡</span> Warning
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 font-medium text-rose-700" title="Error">
      <span className="text-base leading-none">🔴</span> Error
    </span>
  );
};

const SummaryTile = ({ icon: Icon, label, value, tone = 'navy' }) => {
  const tones = {
    navy: 'text-[#0b1d36]',
    success: 'text-emerald-700',
    warning: 'text-amber-700',
    danger: 'text-rose-700',
  };
  return (
    <div className="app-card p-4 text-center">
      {Icon ? <Icon className={`mx-auto mb-1 ${tones[tone]}`} /> : null}
      <p className="text-[11px] uppercase tracking-wide text-[#0b1d36]/50">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${tones[tone]}`}>{value}</p>
    </div>
  );
};

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
  const [resumeCounts, setResumeCounts] = useState({
    total: 0,
    success: 0,
    notFound: 0,
    failed: 0,
  });
  const [missingResumes, setMissingResumes] = useState([]);
  const [matchReport, setMatchReport] = useState([]);
  const [zipAnalysis, setZipAnalysis] = useState(null);
  const [zipWarnings, setZipWarnings] = useState([]);

  const canUpload = Boolean(excelFile && zipFile) && !uploading;

  const counts = useMemo(
    () => ({
      success: results.success.length,
      duplicates: results.duplicates.length,
      errors: results.errors.length,
      total: results.success.length + results.duplicates.length + results.errors.length,
    }),
    [results]
  );

  const matchStats = useMemo(() => {
    const success = matchReport.filter((r) => r.indicator === 'success').length;
    const warning = matchReport.filter((r) => r.indicator === 'warning').length;
    const error = matchReport.filter((r) => r.indicator === 'error').length;
    return { success, warning, error, total: matchReport.length };
  }, [matchReport]);

  const hasOutcome =
    phase !== 'idle' &&
    (counts.total > 0 ||
      resumeStatus.length > 0 ||
      matchReport.length > 0 ||
      zipAnalysis ||
      summaryMessage);

  const resetOutcome = () => {
    setResults(emptyResults);
    setResumeStatus([]);
    setResumeCounts({ total: 0, success: 0, notFound: 0, failed: 0 });
    setMissingResumes([]);
    setMatchReport([]);
    setZipAnalysis(null);
    setZipWarnings([]);
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
    const analysis = analyzeZipArchive(zip);
    const missing = [];

    setResumeCounts({ total: createdCandidates.length, success: 0, notFound: 0, failed: 0 });
    setResumeStatus(
      createdCandidates.map((candidate) => ({
        name: candidate.name,
        email: candidate.email,
        status: 'pending',
        indicator: 'pending',
        file: null,
        folder: null,
        message: 'Waiting to match resume...',
      }))
    );

    for (const candidate of createdCandidates) {
      setResumeStatus((prev) =>
        prev.map((row) =>
          row.name === candidate.name
            ? { ...row, status: 'processing', message: 'Scanning ZIP (including nested folders)...' }
            : row
        )
      );

      const matchingFile = findMatchingResumeInZip(zip, candidate.name);
      if (!matchingFile) {
        missing.push({
          candidateName: candidate.name,
          expectedPattern: 'firstname.pdf or full_name.pdf',
          availableFiles: analysis.resumeFiles.map((f) => f.path),
        });
        setResumeStatus((prev) =>
          prev.map((row) =>
            row.name === candidate.name
              ? {
                  ...row,
                  status: 'not-found',
                  indicator: 'error',
                  file: 'Not found',
                  message: 'No matching resume found in ZIP (checked nested folders too)',
                }
              : row
          )
        );
        setResumeCounts((prev) => ({ ...prev, notFound: prev.notFound + 1 }));
        continue;
      }

      const nested = matchingFile.includes('/');
      const folder = matchingFile.split('/').slice(0, -1).join('/') || '(ZIP root)';
      const shortName = matchingFile.split('/').pop();

      try {
        setResumeStatus((prev) =>
          prev.map((row) =>
            row.name === candidate.name
              ? {
                  ...row,
                  status: 'uploading',
                  indicator: nested ? 'warning' : 'success',
                  file: shortName,
                  folder,
                  message: nested
                    ? `Uploading from nested folder "${folder}"...`
                    : 'Uploading resume...',
                }
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
              ? {
                  ...row,
                  status: 'success',
                  indicator: nested ? 'warning' : 'success',
                  file: fileName,
                  folder,
                  message: nested
                    ? `Resume uploaded from nested folder "${folder}"`
                    : 'Resume uploaded successfully',
                }
              : row
          )
        );
        setResumeCounts((prev) => ({ ...prev, success: prev.success + 1 }));
      } catch (error) {
        setResumeStatus((prev) =>
          prev.map((row) =>
            row.name === candidate.name
              ? {
                  ...row,
                  status: 'failed',
                  indicator: 'error',
                  file: shortName,
                  folder,
                  message: error.message || 'Error uploading resume',
                }
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
    const loadingToast = toast.loading('Checking Excel + ZIP (including nested folders)...');

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
      const analysis = analyzeZipArchive(zip);
      setZipAnalysis(analysis);

      const { rows: reportRows } = buildResumeMatchReport(candidates, zip);
      setMatchReport(reportRows);

      const warnings = [];
      if (analysis.hasNestedStructure) {
        warnings.push(
          `Nested folders detected (max depth ${analysis.maxDepth}). Resumes inside subfolders are scanned automatically.`
        );
      }
      if (analysis.nestedFolderCount > 0) {
        warnings.push(
          `${analysis.nestedFolderCount} folder(s) found in the archive${
            analysis.topLevelFolders.length
              ? `: ${analysis.topLevelFolders.slice(0, 5).join(', ')}${analysis.topLevelFolders.length > 5 ? '…' : ''}`
              : ''
          }.`
        );
      }
      if (analysis.skippedJunk > 0) {
        warnings.push(`Skipped ${analysis.skippedJunk} system/junk file(s) (e.g. __MACOSX).`);
      }
      if (analysis.otherFiles.length > 0) {
        warnings.push(
          `${analysis.otherFiles.length} non-resume file(s) ignored (only PDF/DOC/DOCX/RTF/TXT are used).`
        );
      }
      setZipWarnings(warnings);

      const resumeErrors = validateResumeMatches(candidates, zip);
      const blockingErrors = [...rowErrors, ...resumeErrors];

      if (blockingErrors.length) {
        setPhase('blocked');
        setResults({ success: [], duplicates: [], errors: blockingErrors });
        setSummaryMessage(
          `Upload did not start. Fix ${blockingErrors.length} issue${blockingErrors.length === 1 ? '' : 's'} and try again.`
        );
        toast.error('Required details or resumes are missing. Nothing was uploaded.', {
          id: loadingToast,
        });
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
        toast.loading('Uploading matched resumes from ZIP...', { id: loadingToast });
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
    validating: 'Checking Excel + ZIP',
    blocked: 'Stopped — fix issues below',
    uploading: 'Saving candidates',
    resumes: 'Uploading resumes',
    complete: 'Completed',
    failed: 'Failed',
  }[phase];

  const statusClass = (status) => {
    if (status === 'success') return 'bg-emerald-50 text-emerald-700';
    if (status === 'failed') return 'bg-rose-50 text-rose-700';
    if (status === 'not-found') return 'bg-rose-50 text-rose-700';
    if (status === 'processing' || status === 'uploading') return 'bg-sky-50 text-sky-700';
    return 'bg-[#0b1d36]/5 text-[#0b1d36]/70';
  };

  return (
    <Layout>
      <Breadcrumb pageName="Bulk Upload" backUrl={listPath} />

      <div className="app-card mb-6 p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4af37]">Candidates</p>
        <h3 className="mt-1 text-xl font-semibold text-[#0b1d36]">Excel template + resume ZIP</h3>
        <p className="mt-2 text-sm text-[#0b1d36]/70">
          Upload both files. Nested ZIP folders are supported (ZIP → folder → resume). Name resume
          files with the candidate first name or full_name (jane.pdf / jane_doe.pdf). Supported:
          PDF, DOC, DOCX, RTF, TXT.
        </p>

        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-[#0b1d36]">Required</p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-sm font-medium text-[#0b1d36]">
              Excel file
            </span>
            <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-sm font-medium text-[#0b1d36]">
              Resume ZIP
            </span>
            {REQUIRED_CANDIDATE_FIELDS.map((field) => (
              <span
                key={field.key}
                className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-sm font-medium text-[#0b1d36]"
              >
                {field.label}
              </span>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-[#0b1d36]/70">
            <span>🟢 Matched resume</span>
            <span>🟡 Nested folder / caution</span>
            <span>🔴 Missing or failed</span>
          </div>
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
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
            <SummaryTile label="Status" value={statusLabel} />
            <SummaryTile
              icon={FaFolderOpen}
              label="ZIP resumes"
              value={zipAnalysis?.resumeFiles?.length ?? 0}
              tone="navy"
            />
            <SummaryTile
              icon={FaExclamationTriangle}
              label="Nested folders"
              value={zipAnalysis?.nestedFolderCount ?? 0}
              tone="warning"
            />
            <SummaryTile
              icon={FaCheckCircle}
              label="Matched"
              value={matchStats.success + matchStats.warning}
              tone="success"
            />
            <SummaryTile
              icon={FaCheckCircle}
              label="Uploaded"
              value={counts.success}
              tone="success"
            />
            <SummaryTile
              icon={FaExclamationCircle}
              label="Duplicates"
              value={counts.duplicates}
              tone="warning"
            />
            <SummaryTile
              icon={FaTimesCircle}
              label={phase === 'blocked' ? 'Blocked' : 'Failed'}
              value={counts.errors || matchStats.error}
              tone="danger"
            />
          </div>

          {resumeStatus.length > 0 && (
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              <SummaryTile label="Resume total" value={resumeCounts.total} />
              <SummaryTile label="Resumes OK" value={resumeCounts.success} tone="success" />
              <SummaryTile label="Missing resumes" value={resumeCounts.notFound} tone="danger" />
              <SummaryTile label="Upload failed" value={resumeCounts.failed} tone="danger" />
            </div>
          )}

          {summaryMessage && (
            <div
              className={`app-card mb-6 p-4 text-sm font-medium ${
                phase === 'blocked'
                  ? 'border-rose-300 text-rose-700'
                  : 'border-[rgba(212,175,55,0.35)] text-[#0b1d36]'
              }`}
            >
              {summaryMessage}
            </div>
          )}

          {zipWarnings.length > 0 && (
            <div className="app-card mb-6 border-amber-300 bg-amber-50/60 p-4">
              <h4 className="mb-2 flex items-center gap-2 text-base font-semibold text-amber-800">
                <span>🟡</span> Archive structure
              </h4>
              <ul className="list-disc space-y-1 pl-5 text-sm text-amber-900">
                {zipWarnings.map((w, i) => (
                  <li key={`zw-${i}`}>{w}</li>
                ))}
              </ul>
              {zipAnalysis?.structurePreview?.length > 0 && (
                <div className="mt-3 rounded-xl bg-white/70 p-3 text-xs text-[#0b1d36]/80">
                  {zipAnalysis.structurePreview.map((line, i) => (
                    <p key={`sp-${i}`}>{line}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {matchReport.length > 0 && (
        <div className="app-card mb-6 overflow-hidden">
          <h4 className="px-5 py-4 text-lg font-semibold text-[#0b1d36]">
            Resume match results
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Candidate</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Matched file</th>
                  <th className="px-4 py-3 text-left">Folder</th>
                  <th className="px-4 py-3 text-left">Message</th>
                </tr>
              </thead>
              <tbody>
                {matchReport.map((row, index) => (
                  <tr key={`match-${index}`} className="border-t border-[rgba(11,29,54,0.08)]">
                    <td className="px-4 py-3">
                      <Indicator type={row.indicator} />
                    </td>
                    <td className="px-4 py-3 font-medium text-[#0b1d36]">{row.name}</td>
                    <td className="px-4 py-3">{row.email || '-'}</td>
                    <td className="px-4 py-3">{row.matchedFile || '—'}</td>
                    <td className="px-4 py-3 text-sm text-[#0b1d36]/70">
                      {row.folder || '—'}
                      {row.nested ? ' (nested)' : ''}
                    </td>
                    <td className="px-4 py-3 text-sm">{row.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {results.success.length > 0 && (
        <div className="app-card mb-6 overflow-hidden">
          <h4 className="px-5 py-4 text-lg font-semibold text-[#0b1d36]">
            🟢 Successfully uploaded candidates
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Resume</th>
                  <th className="px-4 py-3 text-left">Message</th>
                </tr>
              </thead>
              <tbody>
                {results.success.map((row, index) => {
                  const resumeRow = resumeStatus.find((r) => r.name === row.name);
                  return (
                    <tr key={`ok-${index}`} className="border-t border-[rgba(11,29,54,0.08)]">
                      <td className="px-4 py-3">{row.name}</td>
                      <td className="px-4 py-3">{row.email}</td>
                      <td className="px-4 py-3">{row.id}</td>
                      <td className="px-4 py-3">
                        {resumeRow ? (
                          <Indicator
                            type={
                              resumeRow.indicator === 'warning'
                                ? 'warning'
                                : resumeRow.status === 'success'
                                  ? 'success'
                                  : 'error'
                            }
                          />
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-4 py-3 text-emerald-700">
                        {resumeRow?.message || row.message || 'Created successfully'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {results.duplicates.length > 0 && (
        <div className="app-card mb-6 overflow-hidden">
          <h4 className="px-5 py-4 text-lg font-semibold text-[#0b1d36]">🟡 Duplicates</h4>
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
                    <td className="px-4 py-3 text-amber-700">{row.error}</td>
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
            🔴 {phase === 'blocked' ? 'Blocked — fix these issues' : 'Failed records'}
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Message</th>
                </tr>
              </thead>
              <tbody>
                {results.errors.map((row, index) => (
                  <tr key={`err-${index}`} className="border-t border-[rgba(11,29,54,0.08)]">
                    <td className="px-4 py-3">
                      <Indicator type="error" />
                    </td>
                    <td className="px-4 py-3">{row.name || '-'}</td>
                    <td className="px-4 py-3">{row.email || '-'}</td>
                    <td className="px-4 py-3 text-rose-700">{row.error}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {resumeStatus.length > 0 && (
        <div className="app-card mb-6 overflow-hidden">
          <h4 className="px-5 py-4 text-lg font-semibold text-[#0b1d36]">Resume processing</h4>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Candidate</th>
                  <th className="px-4 py-3 text-left">File</th>
                  <th className="px-4 py-3 text-left">Folder</th>
                  <th className="px-4 py-3 text-left">Message</th>
                </tr>
              </thead>
              <tbody>
                {resumeStatus.map((row, index) => (
                  <tr key={`resume-${index}`} className="border-t border-[rgba(11,29,54,0.08)]">
                    <td className="px-4 py-3">
                      <Indicator
                        type={
                          row.indicator === 'warning'
                            ? 'warning'
                            : row.status === 'success'
                              ? 'success'
                              : row.status === 'pending' ||
                                  row.status === 'processing' ||
                                  row.status === 'uploading'
                                ? 'warning'
                                : 'error'
                        }
                      />
                    </td>
                    <td className="px-4 py-3">{row.name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusClass(row.status)}`}>
                        {row.file || row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#0b1d36]/70">{row.folder || '—'}</td>
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
          <h4 className="px-5 py-4 text-lg font-semibold text-[#0b1d36]">🔴 Missing resumes</h4>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left">Candidate</th>
                  <th className="px-4 py-3 text-left">Expected filename</th>
                  <th className="px-4 py-3 text-left">Files found in ZIP</th>
                </tr>
              </thead>
              <tbody>
                {missingResumes.map((row, index) => (
                  <tr key={`missing-${index}`} className="border-t border-[rgba(11,29,54,0.08)]">
                    <td className="px-4 py-3">{row.candidateName}</td>
                    <td className="px-4 py-3 text-rose-700">{row.expectedPattern}</td>
                    <td className="px-4 py-3 text-sm text-[#0b1d36]/70">
                      {row.availableFiles.slice(0, 12).join(', ') || 'None'}
                      {row.availableFiles.length > 12 ? '…' : ''}
                    </td>
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
