import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaSignInAlt } from 'react-icons/fa';
import DefaultLayoutPegawai from '../../../layout/DefaultLayoutPegawai';
import { BreadcrumbPegawai } from '../../../components';
import { api } from '../../../services/api';
import { HR } from '../../../constants/hrEndpoints';
import { cardClass, getGeo } from '../../Admin/HR/shared';

const CheckInOut = () => {
  const [today, setToday] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const [t, p] = await Promise.all([
        api.get(HR.ATTENDANCE_TODAY),
        api.get(HR.ATTENDANCE_POLICY_DEFAULT),
      ]);
      setToday(t.data || null);
      setPolicy(p.data || null);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to load status');
    }
  };

  useEffect(() => { load(); }, []);

  const doAction = async (type) => {
    setBusy(true);
    try {
      const geo = policy?.require_location ? await getGeo() : await getGeo();
      if (policy?.require_location && (geo.latitude == null || geo.longitude == null)) {
        toast.error('Location permission is required');
        return;
      }
      const endpoint = type === 'in' ? HR.CHECK_IN : HR.CHECK_OUT;
      await api.post(endpoint, geo);
      toast.success(type === 'in' ? 'Checked in' : 'Checked out');
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Action failed');
    } finally {
      setBusy(false);
    }
  };

  const checkedIn = Boolean(today?.check_in_at);
  const checkedOut = Boolean(today?.check_out_at);

  return (
    <DefaultLayoutPegawai>
      <BreadcrumbPegawai pageName="Check In / Out" icon={FaSignInAlt} />
      <div className={cardClass}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4af37]">Today</p>
        <h3 className="mb-4 text-2xl font-semibold text-[#0b1d36]">Track your working hours</h3>
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-[rgba(11,29,54,0.1)] p-4">
            <p className="text-sm text-[#0b1d36]/60">Check in</p>
            <p className="text-lg font-semibold text-[#0b1d36]">
              {today?.check_in_at ? new Date(today.check_in_at).toLocaleTimeString() : '—'}
            </p>
          </div>
          <div className="rounded-xl border border-[rgba(11,29,54,0.1)] p-4">
            <p className="text-sm text-[#0b1d36]/60">Check out</p>
            <p className="text-lg font-semibold text-[#0b1d36]">
              {today?.check_out_at ? new Date(today.check_out_at).toLocaleTimeString() : '—'}
            </p>
          </div>
          <div className="rounded-xl border border-[rgba(11,29,54,0.1)] p-4">
            <p className="text-sm text-[#0b1d36]/60">Hours</p>
            <p className="text-lg font-semibold text-[#0b1d36]">{today?.working_hours ?? '—'}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn-gold" disabled={busy || checkedIn} onClick={() => doAction('in')}>
            Check In
          </button>
          <button type="button" className="btn-outline" disabled={busy || !checkedIn || checkedOut} onClick={() => doAction('out')}>
            Check Out
          </button>
        </div>
        {policy?.require_location && (
          <p className="mt-4 text-sm text-[#0b1d36]/60">Location verification is required for check-in/out.</p>
        )}
      </div>
    </DefaultLayoutPegawai>
  );
};

export default CheckInOut;
