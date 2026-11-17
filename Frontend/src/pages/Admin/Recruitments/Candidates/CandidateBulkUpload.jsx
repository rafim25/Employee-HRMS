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
  OPTIONAL_HINTS,
  REQUIRED_CANDIDATE_FIELDS,
  commitBulkImport,
  downloadErrorCsv,
  previewBulkImport,
} from '../../../../Utils/candidateBulkUpload';

const Indicator = ({ type }) => {
  if (type === 'success') {
    return (
      <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700">
        <span className="text-base leading-none">🟢</span> Success
      </span>
    );
  }
  if (type === 'warning') {
    return (
      <span className="inline-flex items-center gap-1.5 font-medium text-amber-700">
        <span className="text-base leading-none">🟡</span> Warning
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 font-medium text-rose-700">
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
}) => {
  const { state } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const zipInputRef = useRef(null);

  const [excelFile, setExcelFile] = useState(null);
  const [zipFile, setZipFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState('idle'); // idle | preview | importing | complete | failed
  const [preview, setPreview] = useState(null);
  const [commitResult, setCommitResult] = useState(null);

  const canPreview = Boolean(excelFile && zipFile) && !busy;
  const summary = preview?.summary;
  const rows = preview?.rows || [];
  const warnings = preview?.warnings || [];

  const importableCount = useMemo(() => {
    if (!summary) return 0;
    return summary.matched + summary.ambiguous;
  }, [summary]);

  const resetAll = () => {
    setPreview(null);
    setCommitResult(null);
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
    } catch {
      toast.error('Failed to download template');
    }
  };

  const handleExcelChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.type.includes('spreadsheet') || file.type.includes('excel') || file.name.match(/\.(xlsx|xls)$/i)) {
      setExcelFile(file);
      resetAll();
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
      resetAll();
    } else {
      toast.error('Please choose a ZIP file of resumes');
      event.target.value = '';
      setZipFile(null);
    }
  };

  const handlePreview = async () => {
    if (!excelFile || !zipFile) {
      toast.error('Please upload both the Excel template and the resume ZIP');
      return;
    }
    if (!state?.user?.user_id) {
      toast.error('Please sign in to preview the import.');
      return;
    }

    setBusy(true);
    setCommitResult(null);
    const loadingToast = toast.loading('Scanning Excel + ZIP on server...');

    try {
      const data = await previewBulkImport(excelFile, zipFile);
      if (!data?.success) {
        throw new Error(data?.message || 'Preview failed');
      }
      setPreview(data);
      setPhase('preview');
      toast.success(data.message || 'Preview ready', { id: loadingToast });
    } catch (error) {
      setPhase('failed');
      toast.error(
        error.response?.data?.message || error.message || 'Preview failed',
        { id: loadingToast }
      );
    } finally {
      setBusy(false);
    }
  };

  const handleCommit = async (mode) => {
    if (!excelFile || !zipFile) return;
    if (!importableCount && mode === 'matched_only') {
      toast.error('No matched rows to import. Fix missing resumes or use include-ambiguous.');
      return;
    }

    setBusy(true);
    setPhase('importing');
    const loadingToast = toast.loading(
      mode === 'include_ambiguous'
        ? 'Importing matched + ambiguous rows...'
        : 'Importing matched candidates...'
    );

    try {
      const data = await commitBulkImport(excelFile, zipFile, mode);
      if (!data?.success) {
        throw new Error(data?.message || 'Import failed');
      }
      setCommitResult(data);
      setPhase('complete');
      toast.success(data.message || 'Import complete', { id: loadingToast });
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    } catch (error) {
      setPhase('failed');
      toast.error(
        error.response?.data?.message || error.message || 'Import failed',
        { id: loadingToast }
      );
    } finally {
      setBusy(false);
    }
  };

  const statusLabel = {
    idle: 'Ready',
    preview: 'Preview ready — review then import',
    importing: 'Importing on server...',
    complete: 'Import completed',
    failed: 'Failed',
  }[phase];

  return (
    <Layout>
      <Breadcrumb pageName="Bulk Upload" backUrl={listPath} />

      <div className="app-card mb-6 p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
          Candidates
        </p>
        <h3 className="mt-1 text-xl font-semibold text-[#0b1d36]">
          Automated Excel + ZIP import
        </h3>
        <p className="mt-2 text-sm text-[#0b1d36]/70">
          Upload your spreadsheet and resume archive as-is. The server scans nested ZIP folders,
          matches resumes by email / phone / name / folder, detects duplicates, and only asks you
          to review ambiguous or missing rows.
        </p>

        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-[#0b1d36]">Required columns</p>
          <div className="flex flex-wrap gap-2">
            {REQUIRED_CANDIDATE_FIELDS.map((field) => (
              <span
                key={field.key}
                className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-sm font-medium text-[#0b1d36]"
              >
                {field.label}
              </span>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {OPTIONAL_HINTS.map((hint) => (
              <span
                key={hint}
                className="rounded-full bg-[#0b1d36]/5 px-3 py-1 text-xs font-medium text-[#0b1d36]/70"
              >
                {hint}
              </span>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-[#0b1d36]/70">
            <span>🟢 Matched</span>
            <span>🟡 Ambiguous / nested / duplicate</span>
            <span>🔴 Missing / invalid</span>
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
            onClick={handlePreview}
            disabled={!canPreview}
            className={`btn-gold ${!canPreview ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FaUpload />
            {busy && phase !== 'importing' ? 'Scanning...' : 'Preview match'}
          </button>
        </div>
      </div>

      {(preview || commitResult) && (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-8">
            <SummaryTile label="Status" value={statusLabel} />
            <SummaryTile
              icon={FaFolderOpen}
              label="ZIP resumes"
              value={summary?.zipResumes ?? 0}
            />
            <SummaryTile
              icon={FaExclamationTriangle}
              label="Nested folders"
              value={summary?.nestedFolders ?? 0}
              tone="warning"
            />
            <SummaryTile
              icon={FaCheckCircle}
              label="Matched"
              value={summary?.matched ?? 0}
              tone="success"
            />
            <SummaryTile
              icon={FaExclamationCircle}
              label="Ambiguous"
              value={summary?.ambiguous ?? 0}
              tone="warning"
            />
            <SummaryTile
              icon={FaTimesCircle}
              label="Missing"
              value={summary?.missingResume ?? 0}
              tone="danger"
            />
            <SummaryTile
              icon={FaExclamationCircle}
              label="Duplicates"
              value={summary?.duplicates ?? 0}
              tone="warning"
            />
            <SummaryTile
              icon={FaTimesCircle}
              label="Invalid"
              value={summary?.invalid ?? 0}
              tone="danger"
            />
          </div>

          {warnings.length > 0 && (
            <div className="app-card mb-6 border-amber-300 bg-amber-50/60 p-4">
              <h4 className="mb-2 flex items-center gap-2 text-base font-semibold text-amber-800">
                <span>🟡</span> Archive notes
              </h4>
              <ul className="list-disc space-y-1 pl-5 text-sm text-amber-900">
                {warnings.map((w, i) => (
                  <li key={`w-${i}`}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {phase === 'preview' && (
            <div className="app-card mb-6 flex flex-wrap items-center gap-3 p-4">
              <p className="mr-auto text-sm text-[#0b1d36]/80">
                <strong>{summary?.matched || 0}</strong> ready to import.
                {summary?.ambiguous
                  ? ` ${summary.ambiguous} ambiguous (optional).`
                  : ''}{' '}
                Missing / invalid rows will be skipped.
              </p>
              <button
                type="button"
                disabled={busy || !summary?.matched}
                onClick={() => handleCommit('matched_only')}
                className="btn-gold disabled:opacity-50"
              >
                Import matched only
              </button>
              <button
                type="button"
                disabled={busy || importableCount === 0}
                onClick={() => handleCommit('include_ambiguous')}
                className="btn-navy disabled:opacity-50"
              >
                Import matched + ambiguous
              </button>
              <button
                type="button"
                onClick={() => downloadErrorCsv(rows)}
                className="rounded-xl border border-[rgba(11,29,54,0.15)] px-4 py-2 text-sm font-medium text-[#0b1d36] hover:bg-[#0b1d36]/5"
              >
                Download report CSV
              </button>
            </div>
          )}

          {commitResult && (
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              <SummaryTile
                label="Created"
                value={commitResult.results?.success?.length || 0}
                tone="success"
              />
              <SummaryTile
                label="Duplicates"
                value={commitResult.results?.duplicates?.length || 0}
                tone="warning"
              />
              <SummaryTile
                label="Skipped"
                value={commitResult.results?.skipped?.length || 0}
                tone="warning"
              />
              <SummaryTile
                label="Errors"
                value={commitResult.results?.errors?.length || 0}
                tone="danger"
              />
            </div>
          )}

          {commitResult?.message && (
            <div className="app-card mb-6 border-[rgba(212,175,55,0.35)] p-4 text-sm font-medium text-[#0b1d36]">
              {commitResult.message}
            </div>
          )}
        </>
      )}

      {rows.length > 0 && (
        <div className="app-card mb-6 overflow-hidden">
          <h4 className="px-5 py-4 text-lg font-semibold text-[#0b1d36]">
            Match preview ({rows.length} rows)
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Row</th>
                  <th className="px-4 py-3 text-left">Candidate</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Resume</th>
                  <th className="px-4 py-3 text-left">Folder</th>
                  <th className="px-4 py-3 text-left">Message</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={`row-${index}`} className="border-t border-[rgba(11,29,54,0.08)]">
                    <td className="px-4 py-3">
                      <Indicator type={row.indicator || 'error'} />
                    </td>
                    <td className="px-4 py-3">{row.rowNumber}</td>
                    <td className="px-4 py-3 font-medium text-[#0b1d36]">{row.name}</td>
                    <td className="px-4 py-3">{row.email || '—'}</td>
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

      {preview?.unusedResumes?.length > 0 && (
        <div className="app-card mb-6 overflow-hidden">
          <h4 className="px-5 py-4 text-lg font-semibold text-[#0b1d36]">
            Unused resumes in ZIP ({preview.unusedResumes.length})
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left">File</th>
                  <th className="px-4 py-3 text-left">Folder</th>
                  <th className="px-4 py-3 text-left">Path</th>
                </tr>
              </thead>
              <tbody>
                {preview.unusedResumes.map((file, index) => (
                  <tr key={`unused-${index}`} className="border-t border-[rgba(11,29,54,0.08)]">
                    <td className="px-4 py-3">{file.fileName}</td>
                    <td className="px-4 py-3">{file.folder}</td>
                    <td className="px-4 py-3 text-sm text-[#0b1d36]/70">{file.path}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {commitResult?.results?.success?.length > 0 && (
        <div className="app-card mb-6 overflow-hidden">
          <h4 className="px-5 py-4 text-lg font-semibold text-[#0b1d36]">
            🟢 Created candidates
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
                {commitResult.results.success.map((row, index) => (
                  <tr key={`ok-${index}`} className="border-t border-[rgba(11,29,54,0.08)]">
                    <td className="px-4 py-3">{row.name}</td>
                    <td className="px-4 py-3">{row.email}</td>
                    <td className="px-4 py-3">{row.id}</td>
                    <td className="px-4 py-3">{row.resume || '—'}</td>
                    <td className="px-4 py-3 text-emerald-700">{row.message}</td>
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
