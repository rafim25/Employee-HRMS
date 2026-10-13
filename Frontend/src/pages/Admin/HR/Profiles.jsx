import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaUser } from 'react-icons/fa';
import DefaultLayoutAdmin from '../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin } from '../../../components';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../services/api';
import { HR } from '../../../constants/hrEndpoints';
import { SectionTitle, cardClass, inputClass } from './shared';

const Profiles = ({ Layout = DefaultLayoutAdmin, Breadcrumb = BreadcrumbAdmin, selfOnly = false }) => {
  const { state } = useAuth();
  const [list, setList] = useState([]);
  const [selectedId, setSelectedId] = useState(selfOnly ? state?.user?.user_id : '');
  const [form, setForm] = useState({});

  const loadList = async () => {
    if (selfOnly) {
      setSelectedId(state?.user?.user_id);
      return;
    }
    try {
      const res = await api.get(`${HR.PROFILES}?page=1&limit=100`);
      setList(res.data?.data || []);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to load profiles');
    }
  };

  const loadOne = async (userId) => {
    if (!userId) return;
    try {
      const res = await api.get(`${HR.PROFILES}/${userId}`);
      setForm({
        ...(res.data?.profile || {}),
        name: res.data?.user?.name,
        email: res.data?.user?.email,
        department: res.data?.user?.department,
        designation: res.data?.user?.designation,
      });
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to load profile');
    }
  };

  useEffect(() => { loadList(); }, []);
  useEffect(() => { if (selectedId) loadOne(selectedId); }, [selectedId]);

  const save = async (e) => {
    e.preventDefault();
    try {
      await api.put(`${HR.PROFILES}/${selectedId}`, {
        bank_name: form.bank_name,
        bank_account: form.bank_account,
        ifsc: form.ifsc,
        pan: form.pan,
        aadhaar: form.aadhaar,
        pf_number: form.pf_number,
        esi_number: form.esi_number,
        emergency_contact: form.emergency_contact,
        notes: form.notes,
      });
      toast.success('Profile saved');
      loadOne(selectedId);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
  };

  return (
    <Layout>
      <Breadcrumb pageName={selfOnly ? 'My Profile' : 'Employee Profiles'} icon={FaUser} backButton={false} />
      <div className={cardClass}>
        <SectionTitle title="Financial & ID details" />
        {!selfOnly && (
          <select className={`${inputClass} mb-4`} value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
            <option value="">Select employee</option>
            {list.map((u) => (
              <option key={u.user_id} value={u.user_id}>{u.name} ({u.user_id})</option>
            ))}
          </select>
        )}
        {selectedId && (
          <form onSubmit={save} className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input className={inputClass} disabled value={form.name || ''} placeholder="Name" />
            <input className={inputClass} disabled value={form.email || ''} placeholder="Email" />
            <input className={inputClass} placeholder="PAN" value={form.pan || ''} onChange={(e) => setForm({ ...form, pan: e.target.value })} />
            <input className={inputClass} placeholder="Aadhaar" value={form.aadhaar || ''} onChange={(e) => setForm({ ...form, aadhaar: e.target.value })} />
            <input className={inputClass} placeholder="Bank name" value={form.bank_name || ''} onChange={(e) => setForm({ ...form, bank_name: e.target.value })} />
            <input className={inputClass} placeholder="Bank account" value={form.bank_account || ''} onChange={(e) => setForm({ ...form, bank_account: e.target.value })} />
            <input className={inputClass} placeholder="IFSC" value={form.ifsc || ''} onChange={(e) => setForm({ ...form, ifsc: e.target.value })} />
            <input className={inputClass} placeholder="PF number" value={form.pf_number || ''} onChange={(e) => setForm({ ...form, pf_number: e.target.value })} />
            <input className={inputClass} placeholder="ESI number" value={form.esi_number || ''} onChange={(e) => setForm({ ...form, esi_number: e.target.value })} />
            <input className={inputClass} placeholder="Emergency contact" value={form.emergency_contact || ''} onChange={(e) => setForm({ ...form, emergency_contact: e.target.value })} />
            <textarea className={`${inputClass} md:col-span-2`} rows={3} placeholder="Notes" value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <button type="submit" className="btn-gold md:col-span-2">Save</button>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default Profiles;
