import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaCalendarAlt } from 'react-icons/fa';
import DefaultLayoutAdmin from '../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin } from '../../../components';
import { api } from '../../../services/api';
import { HR } from '../../../constants/hrEndpoints';
import { SectionTitle, cardClass, inputClass, EmptyRow } from './shared';

const Holidays = ({ Layout = DefaultLayoutAdmin, Breadcrumb = BreadcrumbAdmin, admin = true }) => {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ name: '', date: '', type: 'public' });
  const year = new Date().getFullYear();

  const load = async () => {
    try {
      const res = await api.get(`${HR.HOLIDAYS}?year=${year}`);
      setRows(res.data || []);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to load holidays');
    }
  };

  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      await api.post(HR.HOLIDAYS, form);
      toast.success('Holiday added');
      setForm({ name: '', date: '', type: 'public' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`${HR.HOLIDAYS}/${id}`);
      toast.success('Deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <Layout>
      <Breadcrumb pageName="Holidays" icon={FaCalendarAlt} backButton={false} />
      <div className={cardClass}>
        <SectionTitle title={`${year} holiday calendar`} />
        {admin && (
          <form onSubmit={save} className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-4">
            <input className={inputClass} placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input className={inputClass} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            <select className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="public">Public</option>
              <option value="optional">Optional</option>
            </select>
            <button type="submit" className="btn-gold">Add holiday</button>
          </form>
        )}
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Type</th>
              {admin && <th className="px-3 py-2 text-left">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <EmptyRow cols={admin ? 4 : 3} text="No holidays" />
            ) : (
              rows.map((h) => (
                <tr key={h.id} className="border-t border-[rgba(11,29,54,0.08)]">
                  <td className="px-3 py-2">{h.date}</td>
                  <td className="px-3 py-2">{h.name}</td>
                  <td className="px-3 py-2">{h.type}</td>
                  {admin && (
                    <td className="px-3 py-2">
                      <button type="button" className="text-danger" onClick={() => remove(h.id)}>Delete</button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Holidays;
