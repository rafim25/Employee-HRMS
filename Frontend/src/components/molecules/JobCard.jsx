import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineBriefcase,
  HiOutlineLocationMarker,
  HiOutlineCash,
  HiOutlineUserGroup,
  HiOutlineClock,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineDotsVertical,
  HiOutlineCode,
} from 'react-icons/hi';
import { format, isValid, parseISO } from 'date-fns';

const statusStyles = {
  active: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  draft: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  closed: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
  archived: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  expired: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
};

const MetaRow = ({ icon: Icon, iconClass, children }) => (
  <div className="flex items-start gap-3 text-sm text-[#5b6b7c]">
    <span
      className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
    >
      <Icon className="h-4 w-4" />
    </span>
    <span className="min-w-0 flex-1 pt-1.5 leading-snug">{children}</span>
  </div>
);

const JobCard = ({ job, onEdit, onDelete, onStatusChange, onJobClick }) => {
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);
  const actionMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatSalary = (min, max) => {
    if (min == null && max == null) return 'CTC not specified';
    const fmt = (n) => {
      const num = Number(n);
      if (!Number.isFinite(num)) return n;
      return num.toLocaleString('en-IN');
    };
    return `CTC: ₹${fmt(min)} – ₹${fmt(max)}`;
  };

  const handleCardClick = () => {
    if (onJobClick) {
      onJobClick();
    } else {
      navigate(`/admin/recruitments/job-management/details/${job.id}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Invalid date';
    try {
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'closed', label: 'Closed' },
    { value: 'archived', label: 'Archived' },
    { value: 'expired', label: 'Expired' },
  ];

  const statusKey = String(job.status || '').toLowerCase();
  const statusClass =
    statusStyles[statusKey] || 'bg-slate-100 text-slate-600 ring-1 ring-slate-200';
  const statusLabel = job.status
    ? job.status.charAt(0).toUpperCase() + job.status.slice(1)
    : 'Unknown';

  const candidateCount = job.candidateCount || 0;
  const skills = Array.isArray(job.skills) ? job.skills : [];

  return (
    <div
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(11,29,54,0.1)] bg-white
                 shadow-[0_4px_14px_rgba(11,29,54,0.08),0_1px_3px_rgba(11,29,54,0.06)]
                 transition-all duration-300 ease-out
                 hover:-translate-y-1.5 hover:border-[rgba(212,175,55,0.45)]
                 hover:shadow-[0_18px_44px_rgba(11,29,54,0.14),0_4px_12px_rgba(11,29,54,0.08)]
                 dark:border-strokedark dark:bg-boxdark"
    >
      {/* Gold accent bar on hover */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#0b1d36] via-[#d4af37] to-[#0b1d36] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Action Menu */}
      <div className="absolute right-3 top-3 z-20" ref={actionMenuRef}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowActions(!showActions);
          }}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-[#5b6b7c]
                     transition hover:border-[rgba(11,29,54,0.1)] hover:bg-[#f7f8fb] hover:text-[#0b1d36]
                     dark:hover:bg-meta-4"
          aria-label="Job actions"
        >
          <HiOutlineDotsVertical className="h-5 w-5" />
        </button>

        {showActions && (
          <div
            className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-[rgba(11,29,54,0.1)]
                       bg-white shadow-[0_12px_32px_rgba(11,29,54,0.16)] dark:border-strokedark dark:bg-boxdark"
          >
            <div className="p-3">
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5b6b7c]">
                Update status
              </label>
              <select
                value={job.status}
                onChange={(e) => {
                  e.stopPropagation();
                  onStatusChange(job.id, e.target.value);
                }}
                className="w-full rounded-lg border border-[rgba(11,29,54,0.12)] bg-transparent px-2.5 py-2 text-sm outline-none focus:border-[#d4af37]"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(job.id);
                setShowActions(false);
              }}
              className="flex w-full items-center gap-2.5 border-t border-[rgba(11,29,54,0.08)] px-4 py-3 text-left text-sm font-medium text-[#0b1d36] transition hover:bg-[#f7f8fb] dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#0b1d36]/8 text-[#d4af37]">
                <HiOutlinePencil className="h-3.5 w-3.5" />
              </span>
              Edit Job
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(job.id);
                setShowActions(false);
              }}
              className="flex w-full items-center gap-2.5 border-t border-[rgba(11,29,54,0.08)] px-4 py-3 text-left text-sm font-medium text-danger transition hover:bg-rose-50 dark:border-strokedark dark:hover:bg-meta-4"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-danger">
                <HiOutlineTrash className="h-3.5 w-3.5" />
              </span>
              Delete Job
            </button>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div onClick={handleCardClick} className="flex flex-1 cursor-pointer flex-col p-5 pt-4">
        <div className="mb-4 pr-10">
          <h3 className="line-clamp-2 text-[1.05rem] font-semibold tracking-tight text-[#0b1d36] transition group-hover:text-[#0b1d36] dark:text-white">
            {job.title}
          </h3>
          <p className="mt-1.5 text-xs font-medium text-[#8a97a8]">
            Job ID · {job.id || job._id}
          </p>
        </div>

        <div className="mb-4 space-y-2.5">
          <MetaRow icon={HiOutlineBriefcase} iconClass="bg-[#0b1d36]/8 text-[#0b1d36]">
            <span className="font-medium text-[#0b1d36] dark:text-white">{job.type || '—'}</span>
          </MetaRow>
          <MetaRow icon={HiOutlineLocationMarker} iconClass="bg-sky-50 text-sky-700">
            {[job.city, job.state].filter(Boolean).join(', ') || 'Location not set'}
          </MetaRow>
          <MetaRow icon={HiOutlineCash} iconClass="bg-emerald-50 text-emerald-700">
            <span className="font-semibold text-emerald-700">
              {formatSalary(job.minSalary, job.maxSalary)}
            </span>
          </MetaRow>
          <MetaRow icon={HiOutlineUserGroup} iconClass="bg-indigo-50 text-indigo-700">
            <span className="font-medium text-indigo-700">
              {candidateCount} {candidateCount === 1 ? 'Candidate' : 'Candidates'} Applied
            </span>
          </MetaRow>
        </div>

        <div className="mb-4">
          <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8a97a8]">
            <HiOutlineCode className="h-3.5 w-3.5" />
            Skills
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills.length === 0 ? (
              <span className="rounded-lg bg-[#f7f8fb] px-2.5 py-1 text-xs text-[#8a97a8]">
                No skills listed
              </span>
            ) : (
              <>
                {skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-lg bg-[#0b1d36]/[0.06] px-2.5 py-1 text-xs font-medium text-[#0b1d36] ring-1 ring-[rgba(11,29,54,0.06)]"
                  >
                    {skill}
                  </span>
                ))}
                {skills.length > 3 && (
                  <span className="rounded-lg bg-[#d4af37]/15 px-2.5 py-1 text-xs font-semibold text-[#0b1d36]">
                    +{skills.length - 3}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass}`}
          >
            {statusLabel}
          </span>
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5b6b7c]">
            <HiOutlineClock className="h-4 w-4 text-[#d4af37]" />
            {formatDate(job?.deadline)}
          </div>
        </div>

        <div className="mt-4 border-t border-[rgba(11,29,54,0.08)] pt-3 dark:border-strokedark">
          <div className="flex items-center gap-2 text-xs text-[#5b6b7c]">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#0b1d36] text-[10px] font-semibold text-[#d4af37]">
              {(job.created_by || 'N').toString().charAt(0).toUpperCase()}
            </span>
            <span>
              Created by{' '}
              <span className="font-semibold text-[#0b1d36] dark:text-white">
                {job.created_by || 'N/A'}
              </span>
            </span>
          </div>
          {job.updated_by && (
            <div className="mt-1.5 flex items-center gap-1.5 pl-8 text-[11px] text-[#8a97a8]">
              <HiOutlinePencil className="h-3 w-3" />
              Updated by {job.updated_by} · {formatDate(job.updatedAt)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
