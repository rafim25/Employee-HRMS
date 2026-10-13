import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaDownload, FaEye, FaFilePdf } from 'react-icons/fa';
import DefaultLayoutPegawai from '../../../layout/DefaultLayoutPegawai';
import { BreadcrumbPegawai, AppTable } from '../../../components';
import DocumentViewerModal from '../../../components/molecules/DocumentViewerModal';
import { api } from '../../../services/api';
import { HR } from '../../../constants/hrEndpoints';
import { formatMoney, periodLabel } from '../../../Utils/salaryBreakdown';
import { PAGE_SIZE, emptyPagination, normalizePagination } from '../../../constants/pagination';
import { SectionTitle, cardClass } from '../../Admin/HR/shared';

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

const SalarySlips = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(emptyPagination());
  const [viewer, setViewer] = useState({ open: false, url: '', title: '' });

  useEffect(() => {
    api
      .get(`${HR.SALARY_SLIPS}?page=${page}&limit=${PAGE_SIZE}`)
      .then((res) => {
        setRows(res.data?.data || []);
        setPagination(normalizePagination(res.data?.pagination, page, PAGE_SIZE));
      })
      .catch((e) => toast.error(e.response?.data?.message || 'Failed to load slips'));
  }, [page]);

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
      setViewer({
        open: true,
        url: data.url,
        title: data.title || periodLabel(slip.period_month, slip.period_year),
      });
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
    <DefaultLayoutPegawai>
      <BreadcrumbPegawai pageName="Salary Slips" icon={FaFilePdf} />
      <div className={cardClass}>
        <SectionTitle title="My salary slips" />
        <p className="mb-4 text-sm text-[#5b6b7c]">
          Same standardized Seven Wings Technologies payslip format as Admin. Use View to preview in-app or Download the PDF.
        </p>
        <AppTable
          columns={[
            {
              key: 'period',
              header: 'Pay period',
              render: (s) => (
                <span className="font-medium">
                  {periodLabel(s.period_month, s.period_year)}
                </span>
              ),
            },
            {
              key: 'gross',
              header: 'Gross',
              render: (s) => formatMoney(s.gross_earnings),
            },
            {
              key: 'deductions',
              header: 'Deductions',
              render: (s) => formatMoney(s.total_deductions),
            },
            {
              key: 'net',
              header: 'Net',
              render: (s) => formatMoney(s.net_pay),
            },
          ]}
          data={rows}
          emptyText="No salary slips yet"
          currentPage={pagination.page || page}
          totalItems={pagination.totalRecords}
          totalPages={pagination.totalPages}
          itemsPerPage={PAGE_SIZE}
          onPageChange={setPage}
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
    </DefaultLayoutPegawai>
  );
};

export default SalarySlips;
