import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { FaFileInvoiceDollar, FaRegEdit } from 'react-icons/fa';
import DefaultLayoutAdmin from '../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin, Pagination } from '../../../components';
import { api } from '../../../services/api';
import { HR } from '../../../constants/hrEndpoints';
import { computeSalaryBreakdown, formatMoney } from '../../../Utils/salaryBreakdown';
import { PAGE_SIZE, emptyPagination, normalizePagination, paginateClient } from '../../../constants/pagination';
import { SectionTitle, cardClass, inputClass } from './shared';

const emptyForm = {
  user_id: '',
  effective_from: '',
  basic_salary: '',
  component_id: '',
  amount: '',
};

const SalaryBreakdownTable = ({ breakdown }) => {
  const rows = Math.max(breakdown.earnings.length, breakdown.deductions.length, 1);
  return (
    <div className="overflow-x-auto rounded-xl border border-[rgba(11,29,54,0.12)]">
      <table className="w-full table-auto text-sm">
        <thead>
          <tr className="bg-[#0b1d36]/5">
            <th className="px-3 py-2 text-left">Earnings</th>
            <th className="px-3 py-2 text-right">Amount</th>
            <th className="px-3 py-2 text-left">Deductions</th>
            <th className="px-3 py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => {
            const e = breakdown.earnings[i];
            const d = breakdown.deductions[i];
            return (
              <tr key={i} className="border-t border-[rgba(11,29,54,0.08)]">
                <td className="px-3 py-2">{e?.name || ''}</td>
                <td className="px-3 py-2 text-right">{e ? formatMoney(e.amount) : ''}</td>
                <td className="px-3 py-2">{d?.name || ''}</td>
                <td className="px-3 py-2 text-right">{d ? formatMoney(d.amount) : ''}</td>
              </tr>
            );
          })}
          <tr className="border-t border-[rgba(11,29,54,0.12)] bg-[#0b1d36]/[0.03] font-semibold">
            <td className="px-3 py-2 text-right">Gross Salary</td>
            <td className="px-3 py-2 text-right">{formatMoney(breakdown.gross_earnings)}</td>
            <td className="px-3 py-2 text-right">Total Deductions</td>
            <td className="px-3 py-2 text-right">{formatMoney(breakdown.total_deductions)}</td>
          </tr>
          <tr className="border-t border-[rgba(11,29,54,0.12)] font-semibold text-[#0b1d36]">
            <td className="px-3 py-2" colSpan={2} />
            <td className="px-3 py-2 text-right">Net Salary</td>
            <td className="px-3 py-2 text-right">{formatMoney(breakdown.net_pay)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const SalaryStructures = () => {
  const [structures, setStructures] = useState([]);
  const [components, setComponents] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(emptyPagination());

  const load = async () => {
    try {
      const [s, c, u] = await Promise.all([
        api.get(`${HR.SALARY_STRUCTURES}?page=${page}&limit=${PAGE_SIZE}`),
        api.get(HR.SALARY_COMPONENTS),
        api.get('/api/users'),
      ]);
      const payload = Array.isArray(s.data) ? { data: s.data } : s.data;
      const list = payload?.data || [];
      if (payload?.pagination) {
        setStructures(list);
        setPagination(normalizePagination(payload.pagination, page, PAGE_SIZE));
      } else {
        const client = paginateClient(list, page, PAGE_SIZE);
        setStructures(client.data);
        setPagination(client.pagination);
      }
      setComponents(c.data || []);
      const userList = Array.isArray(u.data) ? u.data : u.data?.data || [];
      setUsers(userList.filter((x) => String(x.role || '').toLowerCase() !== 'admin'));
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to load');
    }
  };

  useEffect(() => { load(); }, [page]);

  const liveBreakdown = useMemo(
    () => computeSalaryBreakdown(form.basic_salary, selectedComponents, components),
    [form.basic_salary, selectedComponents, components]
  );

  const addComponent = () => {
    if (!form.component_id) return;
    setSelectedComponents((prev) => [
      ...prev.filter((p) => String(p.component_id) !== String(form.component_id)),
      { component_id: Number(form.component_id), amount: Number(form.amount || 0) },
    ]);
    setForm((f) => ({ ...f, component_id: '', amount: '' }));
  };

  const removeComponent = (componentId) => {
    setSelectedComponents((prev) => prev.filter((p) => String(p.component_id) !== String(componentId)));
  };

  const openEdit = (structure) => {
    setEditingId(structure.id);
    setShowForm(true);
    setForm({
      user_id: structure.user_id,
      effective_from: structure.effective_from,
      basic_salary: String(structure.basic_salary ?? ''),
      component_id: '',
      amount: '',
    });
    setSelectedComponents(
      (structure.components || []).map((c) => ({
        component_id: c.component_id,
        amount: Number(c.amount) || 0,
        component: c.component,
      }))
    );
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setSelectedComponents([]);
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      await api.post(HR.SALARY_STRUCTURES, {
        user_id: form.user_id,
        effective_from: form.effective_from,
        basic_salary: Number(form.basic_salary || 0),
        components: selectedComponents.map((c) => ({
          component_id: c.component_id,
          amount: c.amount,
        })),
      });
      toast.success(editingId ? 'Structure updated (new version saved)' : 'Structure saved');
      resetForm();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
  };

  return (
    <DefaultLayoutAdmin>
      <BreadcrumbAdmin pageName="Salary Structures" icon={FaFileInvoiceDollar} backButton={false} />

      {showForm && (
        <div className={cardClass}>
          <SectionTitle
            title={editingId ? 'Edit salary structure' : 'Assign salary structure'}
            action={
              editingId ? (
                <button type="button" className="btn-outline" onClick={resetForm}>Cancel edit</button>
              ) : null
            }
          />
          <form onSubmit={save} className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <select className={inputClass} value={form.user_id} onChange={(e) => setForm({ ...form, user_id: e.target.value })} required>
              <option value="">Select employee</option>
              {users.map((u) => <option key={u.user_id} value={u.user_id}>{u.name} ({u.user_id})-{u.username}</option>)}
            </select>
            <input className={inputClass} type="date" value={form.effective_from} onChange={(e) => setForm({ ...form, effective_from: e.target.value })} required />
            <input className={inputClass} placeholder="Basic salary" value={form.basic_salary} onChange={(e) => setForm({ ...form, basic_salary: e.target.value })} required />
            <select className={inputClass} value={form.component_id} onChange={(e) => setForm({ ...form, component_id: e.target.value })}>
              <option value="">Add allowance / deduction</option>
              {components.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name} ({c.type}{c.is_percentage ? ', %' : ''})
                </option>
              ))}
            </select>
            <input className={inputClass} placeholder="Amount / %" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            <button type="button" className="btn-outline" onClick={addComponent}>Add to breakdown</button>

            {selectedComponents.length > 0 && (
              <div className="md:col-span-3 flex flex-wrap gap-2">
                {selectedComponents.map((c) => {
                  const meta = components.find((x) => String(x.id) === String(c.component_id));
                  return (
                    <button
                      key={c.component_id}
                      type="button"
                      onClick={() => removeComponent(c.component_id)}
                      className="rounded-full bg-[#0b1d36]/5 px-3 py-1 text-sm text-[#0b1d36]"
                      title="Click to remove"
                    >
                      {meta?.code || c.component_id}: {c.amount}{meta?.is_percentage ? '%' : ''} ×
                    </button>
                  );
                })}
              </div>
            )}

            <div className="md:col-span-3">
              <p className="mb-2 text-sm font-semibold text-[#0b1d36]">Live salary breakdown</p>
              <SalaryBreakdownTable breakdown={liveBreakdown} />
            </div>

            <button type="submit" className="btn-gold md:col-span-3">
              {editingId ? 'Save updated structure' : 'Save structure'}
            </button>
          </form>
        </div>
      )}

      <div className={cardClass}>
        <SectionTitle title="Structures" />
        <div className="space-y-4">
          {structures.length === 0 ? (
            <p className="py-6 text-center text-[#0b1d36]/60">No structures yet</p>
          ) : (
            structures.map((s) => {
              const breakdown = computeSalaryBreakdown(
                s.basic_salary,
                (s.components || []).map((c) => ({
                  component_id: c.component_id,
                  amount: c.amount,
                  component: c.component,
                })),
                components
              );
              return (
                <div key={s.id} className="rounded-xl border border-[rgba(11,29,54,0.1)] p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-[#0b1d36]">{s.employee?.name || s.user_id}</p>
                      <p className="text-sm text-[#0b1d36]/60">
                        Effective {s.effective_from} · Basic {formatMoney(s.basic_salary)} · Net {formatMoney(breakdown.net_pay)}
                      </p>
                    </div>
                    <button type="button" className="btn-outline !flex !items-center !gap-2 !px-3 !py-2 text-sm" onClick={() => openEdit(s)}>
                      <FaRegEdit /> Edit
                    </button>
                  </div>
                  <SalaryBreakdownTable breakdown={breakdown} />
                </div>
              );
            })
          )}
        </div>
        <Pagination
          currentPage={pagination.page || page}
          totalItems={pagination.totalRecords}
          totalPages={pagination.totalPages}
          itemsPerPage={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>
    </DefaultLayoutAdmin>
  );
};

export default SalaryStructures;
