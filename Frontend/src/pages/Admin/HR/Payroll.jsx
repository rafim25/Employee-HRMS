import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaDownload, FaEye, FaMoneyCheckAlt } from 'react-icons/fa';
import DefaultLayoutAdmin from '../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin, AppTable } from '../../../components';
import DocumentViewerModal from '../../../components/molecules/DocumentViewerModal';
import { api } from '../../../services/api';
import { HR } from '../../../constants/hrEndpoints';
import { MONTH_NAMES, periodLabel, formatMoney } from '../../../Utils/salaryBreakdown';
import { PAGE_SIZE, emptyPagination, normalizePagination } from '../../../constants/pagination';
import { SectionTitle, cardClass, inputClass } from './shared';

const triggerDownload = (url, filename) => {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'payslip.pdf';
  a.target = '_blank';
  a.rel = 'noreferrer';
  document.body.appendChild(a);
  a.click();
  a.remove();
};

const Payroll = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [runs, setRuns] = useState([]);
  const [slips, setSlips] = useState([]);
  const [running, setRunning] = useState(false);
  const [viewer, setViewer] = useState({ open: false, url: '', title: '' });
  const [slipPage, setSlipPage] = useState(1);
  const [slipPagination, setSlipPagination] = useState(emptyPagination());
  const [runPage, setRunPage] = useState(1);
  const [runPagination, setRunPagination] = useState(emptyPagination());

  const load = async () => {
    try {
      const [r, s] = await Promise.all([
        api.get(`${HR.PAYROLL_RUNS}?page=${runPage}&limit=${PAGE_SIZE}`),
        api.get(`${HR.SALARY_SLIPS}?page=${slipPage}&limit=${PAGE_SIZE}`),
      ]);
      const runPayload = Array.isArray(r.data) ? { data: r.data } : r.data;
      setRuns(runPayload?.data || []);
      setRunPagination(
        normalizePagination(
          runPayload?.pagination || {
            page: runPage,
            limit: PAGE_SIZE,
            totalRecords: (runPayload?.data || []).length,
          },
          runPage,
          PAGE_SIZE
        )
      );
      setSlips(s.data?.data || []);
      setSlipPagination(normalizePagination(s.data?.pagination, slipPage, PAGE_SIZE));
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to load payroll');
    }
  };

  useEffect(() => { load(); }, [slipPage, runPage]);

  const runPayroll = async () => {
    setRunning(true);
    try {
      const res = await api.post(HR.PAYROLL_RUN, { year, month });
      toast.success(`Processed ${res.data?.slipsCount || 0} payslips for ${periodLabel(month, year)}`);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Payroll failed');
    } finally {
      setRunning(false);
    }
  };

  const fetchSlipFile = async (uuid) => {
    const res = await api.get(HR.salarySlipFile(uuid));
    return res.data;
  };

  const viewSlip = async (slip) => {
    try {
      const data = await fetchSlipFile(slip.uuid);
      if (!data?.url) {
        toast.error('Payslip file not available');
        return;
      }
      setViewer({ open: true, url: data.url, title: data.title || periodLabel(slip.period_month, slip.period_year) });
    } catch (e) {
      toast.error(e.response?.data?.message || 'Unable to open payslip');
    }
  };

  const downloadSlip = async (slip) => {
    try {
      const data = await fetchSlipFile(slip.uuid);
      if (!data?.url) {
        toast.error('Payslip file not available');
        return;
      }
      triggerDownload(
        data.url,
        `Payslip-${periodLabel(slip.period_month, slip.period_year).replace(/\s+/g, '-')}.pdf`
      );
    } catch (e) {
      toast.error(e.response?.data?.message || 'Download failed');
    }
  };

  return (
    <DefaultLayoutAdmin>
      <BreadcrumbAdmin pageName="Payroll" icon={FaMoneyCheckAlt} backButton={false} />
      <div className={cardClass}>
        <SectionTitle title="Run monthly payroll" />
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-sm">Month</label>
            <select className={inputClass} value={month} onChange={(e) => setMonth(Number(e.target.value))}>
              {MONTH_NAMES.map((name, i) => (
                <option key={name} value={i + 1}>{name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm">Year</label>
            <input className={`${inputClass} w-28`} type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
          </div>
          <button type="button" className="btn-gold" disabled={running} onClick={runPayroll}>
            {running ? 'Processing...' : `Generate ${periodLabel(month, year)} payslips`}
          </button>
        </div>
      </div>

      <div className={cardClass}>
        <SectionTitle title="Payroll runs" />
        <AppTable
          columns={[
            {
              key: 'period',
              header: 'Pay period',
              render: (r) => periodLabel(r.period_month, r.period_year),
            },
            {
              key: 'status',
              header: 'Status',
              render: (r) => <span className="capitalize">{r.status}</span>,
            },
            {
              key: 'processed',
              header: 'Processed',
              render: (r) =>
                r.processed_at ? new Date(r.processed_at).toLocaleString() : '—',
            },
          ]}
          data={runs}
          emptyText="No runs yet"
          currentPage={runPagination.page || runPage}
          totalItems={runPagination.totalRecords}
          totalPages={runPagination.totalPages}
          itemsPerPage={PAGE_SIZE}
          onPageChange={setRunPage}
        />
      </div>

      <div className={cardClass}>
        <SectionTitle title="Salary slips" />
        <AppTable
          columns={[
            {
              key: 'employee',
              header: 'Employee',
              render: (s) => s.employee?.name || s.user_id,
            },
            {
              key: 'period',
              header: 'Pay period',
              render: (s) => periodLabel(s.period_month, s.period_year),
            },
            {
              key: 'net',
              header: 'Net pay',
              render: (s) => formatMoney(s.net_pay),
            },
          ]}
          data={slips}
          emptyText="No slips"
          currentPage={slipPagination.page || slipPage}
          totalItems={slipPagination.totalRecords}
          totalPages={slipPagination.totalPages}
          itemsPerPage={PAGE_SIZE}
          onPageChange={setSlipPage}
          actions={(s) => (
            <>
              <button type="button" className="btn-outline !flex !items-center !gap-1 !px-3 !py-1 text-sm" onClick={() => viewSlip(s)}>
                <FaEye /> View
              </button>
              <button type="button" className="btn-gold !flex !items-center !gap-1 !px-3 !py-1 text-sm" onClick={() => downloadSlip(s)}>
                <FaDownload /> Download
              </button>
            </>
          )}
        />
      </div>

      <DocumentViewerModal
        isOpen={viewer.open}
        onClose={() => setViewer({ open: false, url: '', title: '' })}
        title={viewer.title}
        url={viewer.url}
        mimeType="application/pdf"
        onDownload={() => triggerDownload(viewer.url, `${viewer.title.replace(/\s+/g, '-')}.pdf`)}
      />
    </DefaultLayoutAdmin>
  );
};

export default Payroll;
