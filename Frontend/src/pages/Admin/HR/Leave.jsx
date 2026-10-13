import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaPlaneDeparture } from 'react-icons/fa';
import DefaultLayoutAdmin from '../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin, AppTable } from '../../../components';
import { api } from '../../../services/api';
import { HR } from '../../../constants/hrEndpoints';
import { PAGE_SIZE, emptyPagination, normalizePagination } from '../../../constants/pagination';
import { SectionTitle, cardClass, inputClass } from './shared';

const Leave = ({ Layout = DefaultLayoutAdmin, Breadcrumb = BreadcrumbAdmin, admin = true }) => {
  const [requests, setRequests] = useState([]);
  const [balances, setBalances] = useState([]);
  const [types, setTypes] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(emptyPagination());
  const [form, setForm] = useState({ leave_type_id: '', start_date: '', end_date: '', reason: '' });

  const load = async () => {
    try {
      const [reqRes, balRes, typeRes] = await Promise.all([
        api.get(`${HR.LEAVE_REQUESTS}?page=${page}&limit=${PAGE_SIZE}`),
        api.get(HR.LEAVE_BALANCES),
        api.get(HR.LEAVE_TYPES),
      ]);
      setRequests(reqRes.data?.data || []);
      setPagination(normalizePagination(reqRes.data?.pagination, page, PAGE_SIZE));
      setBalances(balRes.data || []);
      setTypes(typeRes.data || []);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to load leave data');
    }
  };

  useEffect(() => { load(); }, [page]);

  const apply = async (e) => {
    e.preventDefault();
    try {
      await api.post(HR.LEAVE_REQUESTS, form);
      toast.success('Leave applied');
      setForm({ leave_type_id: '', start_date: '', end_date: '', reason: '' });
      setPage(1);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Apply failed');
    }
  };

  const review = async (id, status) => {
    try {
      await api.post(`${HR.LEAVE_REQUESTS}/${id}/review`, { status });
      toast.success(`Leave ${status}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Review failed');
    }
  };

  const columns = [
    ...(admin
      ? [{
          key: 'employee',
          header: 'Employee',
          render: (r) => r.employee?.name || r.user_id,
        }]
      : []),
    {
      key: 'type',
      header: 'Type',
      render: (r) => r.leaveType?.name || '—',
    },
    {
      key: 'dates',
      header: 'Dates',
      render: (r) => `${r.start_date} → ${r.end_date}`,
    },
    { key: 'days', header: 'Days' },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <span className="capitalize font-medium">{r.status}</span>
      ),
    },
  ];

  return (
    <Layout>
      <Breadcrumb pageName="Leave" icon={FaPlaneDeparture} backButton={false} />

      <div className={cardClass}>
        <SectionTitle title="Leave balances" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {balances.map((b) => (
            <div key={b.id} className="rounded-xl border border-[rgba(11,29,54,0.1)] p-4">
              <p className="font-semibold text-[#0b1d36]">{b.leaveType?.name || b.leave_type_id}</p>
              <p className="text-sm text-[#5b6b7c]">
                Available {b.available} / Allocated {b.allocated} (Used {b.used}, Pending {b.pending})
              </p>
            </div>
          ))}
        </div>
      </div>

      {!admin && (
        <div className={cardClass}>
          <SectionTitle title="Apply for leave" />
          <form onSubmit={apply} className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <select className={inputClass} value={form.leave_type_id} onChange={(e) => setForm({ ...form, leave_type_id: e.target.value })} required>
              <option value="">Select leave type</option>
              {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <input className={inputClass} type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} required />
            <input className={inputClass} type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} required />
            <input className={inputClass} placeholder="Reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
            <button type="submit" className="btn-gold md:col-span-2">Submit request</button>
          </form>
        </div>
      )}

      <div className={cardClass}>
        <SectionTitle title={admin ? 'Leave approvals' : 'My requests'} />
        <AppTable
          columns={columns}
          data={requests}
          emptyText="No leave requests"
          currentPage={pagination.page || page}
          totalItems={pagination.totalRecords}
          totalPages={pagination.totalPages}
          itemsPerPage={PAGE_SIZE}
          onPageChange={setPage}
          actions={
            admin
              ? (r) =>
                  r.status === 'pending' ? (
                    <>
                      <button type="button" className="btn-gold !px-3 !py-1 text-sm" onClick={() => review(r.id, 'approved')}>
                        Approve
                      </button>
                      <button type="button" className="btn-outline !px-3 !py-1 text-sm" onClick={() => review(r.id, 'rejected')}>
                        Reject
                      </button>
                    </>
                  ) : null
              : undefined
          }
        />
      </div>
    </Layout>
  );
};

export default Leave;
