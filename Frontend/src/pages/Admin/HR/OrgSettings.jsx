import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaCogs } from 'react-icons/fa';
import DefaultLayoutAdmin from '../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin } from '../../../components';
import { api } from '../../../services/api';
import { HR } from '../../../constants/hrEndpoints';
import { SectionTitle, cardClass, inputClass, EmptyRow } from './shared';

const OrgSettings = () => {
  const [tab, setTab] = useState('policies');
  const [policies, setPolicies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [components, setComponents] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const [p, l, c, lt] = await Promise.all([
        api.get(HR.ATTENDANCE_POLICIES),
        api.get(HR.LOCATIONS),
        api.get(HR.SALARY_COMPONENTS),
        api.get(HR.LEAVE_TYPES),
      ]);
      setPolicies(p.data || []);
      setLocations(l.data || []);
      setComponents(c.data || []);
      setLeaveTypes(lt.data || []);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const savePolicy = async (e) => {
    e.preventDefault();
    try {
      await api.post(HR.ATTENDANCE_POLICIES, {
        name: form.name || 'Policy',
        work_start: form.work_start || '09:00',
        work_end: form.work_end || '18:00',
        grace_minutes: Number(form.grace_minutes || 15),
        require_location: Boolean(form.require_location),
        weekly_offs: [0, 6],
        is_default: Boolean(form.is_default),
        status: 'active',
      });
      toast.success('Policy saved');
      setForm({});
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
  };

  const saveLocation = async (e) => {
    e.preventDefault();
    try {
      await api.post(HR.LOCATIONS, {
        name: form.name,
        address: form.address,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        radius_meters: Number(form.radius_meters || 200),
        status: 'active',
      });
      toast.success('Location saved');
      setForm({});
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
  };

  const saveComponent = async (e) => {
    e.preventDefault();
    try {
      await api.post(HR.SALARY_COMPONENTS, {
        code: form.code,
        name: form.name,
        type: form.type || 'earning',
        is_percentage: Boolean(form.is_percentage),
        default_value: Number(form.default_value || 0),
        status: 'active',
      });
      toast.success('Component saved');
      setForm({});
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
  };

  const saveLeaveType = async (e) => {
    e.preventDefault();
    try {
      const typeRes = await api.post(HR.LEAVE_TYPES, {
        code: form.code,
        name: form.name,
        paid: true,
        status: 'active',
      });
      await api.post(HR.LEAVE_POLICIES, {
        leave_type_id: typeRes.data.id,
        annual_allocation: Number(form.allocation || 12),
        requires_approval: true,
        is_default: true,
      });
      toast.success('Leave type saved');
      setForm({});
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
  };

  const tabs = [
    { id: 'policies', label: 'Attendance Policy' },
    { id: 'locations', label: 'Locations' },
    { id: 'components', label: 'Salary Components' },
    { id: 'leaveTypes', label: 'Leave Types' },
  ];

  return (
    <DefaultLayoutAdmin>
      <BreadcrumbAdmin pageName="HR Org Settings" icon={FaCogs} backButton={false} />

      <div className={`${cardClass} flex flex-wrap gap-2`}>
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => { setTab(t.id); setForm({}); }}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              tab === t.id ? 'bg-[#0b1d36] text-white' : 'bg-[#0b1d36]/5 text-[#0b1d36]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-[#0b1d36]" />
        </div>
      ) : (
        <>
          {tab === 'policies' && (
            <div className={cardClass}>
              <SectionTitle title="Attendance policies" />
              <form onSubmit={savePolicy} className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                <input className={inputClass} placeholder="Name" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <input className={inputClass} type="time" value={form.work_start || '09:00'} onChange={(e) => setForm({ ...form, work_start: e.target.value })} />
                <input className={inputClass} type="time" value={form.work_end || '18:00'} onChange={(e) => setForm({ ...form, work_end: e.target.value })} />
                <label className="flex items-center gap-2 text-sm text-[#0b1d36]">
                  <input type="checkbox" checked={!!form.require_location} onChange={(e) => setForm({ ...form, require_location: e.target.checked })} />
                  Require location
                </label>
                <label className="flex items-center gap-2 text-sm text-[#0b1d36]">
                  <input type="checkbox" checked={!!form.is_default} onChange={(e) => setForm({ ...form, is_default: e.target.checked })} />
                  Default policy
                </label>
                <button type="submit" className="btn-gold">Save policy</button>
              </form>
              <table className="w-full table-auto">
                <thead><tr><th className="px-3 py-2 text-left">Name</th><th className="px-3 py-2 text-left">Hours</th><th className="px-3 py-2 text-left">Location</th></tr></thead>
                <tbody>
                  {policies.length === 0 ? <EmptyRow cols={3} text="No policies" /> : policies.map((p) => (
                    <tr key={p.id} className="border-t border-[rgba(11,29,54,0.08)]">
                      <td className="px-3 py-2">{p.name}{p.is_default ? ' (default)' : ''}</td>
                      <td className="px-3 py-2">{p.work_start} - {p.work_end}</td>
                      <td className="px-3 py-2">{p.require_location ? 'Required' : 'Optional'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'locations' && (
            <div className={cardClass}>
              <SectionTitle title="Authorized locations" />
              <form onSubmit={saveLocation} className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                <input className={inputClass} placeholder="Name" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <input className={inputClass} placeholder="Address" value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                <input className={inputClass} placeholder="Latitude" value={form.latitude || ''} onChange={(e) => setForm({ ...form, latitude: e.target.value })} required />
                <input className={inputClass} placeholder="Longitude" value={form.longitude || ''} onChange={(e) => setForm({ ...form, longitude: e.target.value })} required />
                <input className={inputClass} placeholder="Radius (m)" value={form.radius_meters || '200'} onChange={(e) => setForm({ ...form, radius_meters: e.target.value })} />
                <button type="submit" className="btn-gold">Save location</button>
              </form>
              <table className="w-full table-auto">
                <thead><tr><th className="px-3 py-2 text-left">Name</th><th className="px-3 py-2 text-left">Coords</th><th className="px-3 py-2 text-left">Radius</th></tr></thead>
                <tbody>
                  {locations.length === 0 ? <EmptyRow cols={3} text="No locations" /> : locations.map((l) => (
                    <tr key={l.id} className="border-t border-[rgba(11,29,54,0.08)]">
                      <td className="px-3 py-2">{l.name}</td>
                      <td className="px-3 py-2">{l.latitude}, {l.longitude}</td>
                      <td className="px-3 py-2">{l.radius_meters}m</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'components' && (
            <div className={cardClass}>
              <SectionTitle title="Salary components" />
              <form onSubmit={saveComponent} className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                <input className={inputClass} placeholder="Code" value={form.code || ''} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
                <input className={inputClass} placeholder="Name" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <select className={inputClass} value={form.type || 'earning'} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="earning">Earning</option>
                  <option value="deduction">Deduction</option>
                </select>
                <input className={inputClass} placeholder="Default value" value={form.default_value || ''} onChange={(e) => setForm({ ...form, default_value: e.target.value })} />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.is_percentage} onChange={(e) => setForm({ ...form, is_percentage: e.target.checked })} /> Percentage of basic</label>
                <button type="submit" className="btn-gold">Save component</button>
              </form>
              <table className="w-full table-auto">
                <thead><tr><th className="px-3 py-2 text-left">Code</th><th className="px-3 py-2 text-left">Name</th><th className="px-3 py-2 text-left">Type</th></tr></thead>
                <tbody>
                  {components.map((c) => (
                    <tr key={c.id} className="border-t border-[rgba(11,29,54,0.08)]">
                      <td className="px-3 py-2">{c.code}</td>
                      <td className="px-3 py-2">{c.name}</td>
                      <td className="px-3 py-2">{c.type}{c.is_percentage ? ' %' : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'leaveTypes' && (
            <div className={cardClass}>
              <SectionTitle title="Leave types" />
              <form onSubmit={saveLeaveType} className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                <input className={inputClass} placeholder="Code (CL)" value={form.code || ''} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
                <input className={inputClass} placeholder="Name" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <input className={inputClass} placeholder="Annual allocation" value={form.allocation || '12'} onChange={(e) => setForm({ ...form, allocation: e.target.value })} />
                <button type="submit" className="btn-gold">Save leave type</button>
              </form>
              <table className="w-full table-auto">
                <thead><tr><th className="px-3 py-2 text-left">Code</th><th className="px-3 py-2 text-left">Name</th></tr></thead>
                <tbody>
                  {leaveTypes.map((t) => (
                    <tr key={t.id} className="border-t border-[rgba(11,29,54,0.08)]">
                      <td className="px-3 py-2">{t.code}</td>
                      <td className="px-3 py-2">{t.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </DefaultLayoutAdmin>
  );
};

export default OrgSettings;
