import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaClock } from 'react-icons/fa';
import DefaultLayoutAdmin from '../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin, AppTable } from '../../../components';
import { api } from '../../../services/api';
import { HR } from '../../../constants/hrEndpoints';
import { PAGE_SIZE, emptyPagination, normalizePagination } from '../../../constants/pagination';
import { SectionTitle, cardClass } from './shared';

const Attendance = ({ Layout = DefaultLayoutAdmin, Breadcrumb = BreadcrumbAdmin }) => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({ totalHours: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(emptyPagination());
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `${HR.ATTENDANCE}?month=${month}&year=${year}&page=${page}&limit=${PAGE_SIZE}`
      );
      setData(res.data?.data || []);
      setSummary(res.data?.summary || { totalHours: 0 });
      setPagination(normalizePagination(res.data?.pagination, page, PAGE_SIZE));
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [month, year]);

  useEffect(() => {
    load();
  }, [month, year, page]);

  const columns = [
    {
      key: 'employee',
      header: 'Employee',
      render: (row) => row.employee?.name || row.user_id,
    },
    { key: 'work_date', header: 'Date' },
    {
      key: 'check_in',
      header: 'Check in',
      render: (row) =>
        row.check_in_at ? new Date(row.check_in_at).toLocaleString() : '—',
    },
    {
      key: 'check_out',
      header: 'Check out',
      render: (row) =>
        row.check_out_at ? new Date(row.check_out_at).toLocaleString() : '—',
    },
    {
      key: 'working_hours',
      header: 'Hours',
      render: (row) => row.working_hours ?? '—',
    },
    {
      key: 'location',
      header: 'Location',
      render: (row) => row.location?.name || '—',
    },
  ];

  return (
    <Layout>
      <Breadcrumb pageName="Attendance" icon={FaClock} backButton={false} />
      <div className={cardClass}>
        <SectionTitle
          title="Check-in / check-out records"
          action={
            <div className="flex flex-wrap gap-2">
              <select
                className="rounded-xl border border-[rgba(11,29,54,0.12)] px-3 py-2 text-sm"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <input
                className="w-24 rounded-xl border border-[rgba(11,29,54,0.12)] px-3 py-2 text-sm"
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              />
            </div>
          }
        />
        <p className="mb-4 text-sm text-[#5b6b7c]">
          Period hours:{' '}
          <span className="font-semibold text-[#0b1d36]">{summary.totalHours}</span>
        </p>
        <AppTable
          columns={columns}
          data={data}
          loading={loading}
          emptyText="No attendance records"
          currentPage={pagination.page || page}
          totalItems={pagination.totalRecords}
          totalPages={pagination.totalPages}
          itemsPerPage={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>
    </Layout>
  );
};

export default Attendance;
