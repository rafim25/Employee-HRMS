import React, { useEffect, useMemo, useState } from 'react';
import {
  FaTimes,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaBriefcase,
  FaUser,
  FaFilter,
  FaCheck,
  FaUndo,
} from 'react-icons/fa';
import { MdSource, MdWorkHistory } from 'react-icons/md';
import { BiSearchAlt } from 'react-icons/bi';
import { HiOutlineSparkles } from 'react-icons/hi';

const EMPTY_RANGE = { min: '', max: '' };
const EMPTY_DATE = { start: '', end: '' };

const ensureRange = (value) => ({
  min: value?.min ?? '',
  max: value?.max ?? '',
});

const ensureDateRange = (value) => ({
  start: value?.start ?? '',
  end: value?.end ?? '',
});

const ensureMulti = (value) => (Array.isArray(value) ? value : []);

const normalizeFilters = (filters = {}, config = []) => {
  const next = { ...(filters || {}) };
  config.forEach((filter) => {
    if (!filter?.key) return;
    switch (filter.type) {
      case 'range':
        next[filter.key] = ensureRange(next[filter.key]);
        break;
      case 'dateRange':
        next[filter.key] = ensureDateRange(next[filter.key]);
        break;
      case 'multiSelect':
        next[filter.key] = ensureMulti(next[filter.key]);
        break;
      case 'select':
      case 'search':
      default:
        if (next[filter.key] == null) next[filter.key] = '';
        break;
    }
  });
  return next;
};

const getDefaultIcon = (type, label = '') => {
  const lower = label.toLowerCase();
  switch (type) {
    case 'dateRange':
      return <FaCalendarAlt />;
    case 'range':
      if (lower.includes('salary') || lower.includes('ctc')) return <FaMoneyBillWave />;
      if (lower.includes('experience')) return <MdWorkHistory />;
      return <HiOutlineSparkles />;
    case 'search':
      if (lower.includes('location')) return <FaMapMarkerAlt />;
      return <BiSearchAlt />;
    case 'select':
    case 'multiSelect':
      if (lower.includes('job')) return <FaBriefcase />;
      if (lower.includes('source')) return <MdSource />;
      if (lower.includes('created')) return <FaUser />;
      return <FaFilter />;
    default:
      return <FaFilter />;
  }
};

const countActiveFilters = (filters = {}, config = []) => {
  let count = 0;
  config.forEach((filter) => {
    const value = filters[filter.key];
    if (filter.type === 'range') {
      if (value?.min !== '' && value?.min != null) count += 1;
      if (value?.max !== '' && value?.max != null) count += 1;
      return;
    }
    if (filter.type === 'dateRange') {
      if (value?.start) count += 1;
      if (value?.end) count += 1;
      return;
    }
    if (filter.type === 'multiSelect') {
      if (Array.isArray(value) && value.length) count += 1;
      return;
    }
    if (value !== '' && value != null) count += 1;
  });
  return count;
};

const FilterModal = ({
  isOpen,
  onClose,
  onApply,
  onReset,
  filters = {},
  setFilters,
  config = [],
}) => {
  const [draft, setDraft] = useState(() => normalizeFilters(filters, config));
  const wasOpenRef = React.useRef(false);

  // Sync draft only when the modal opens (not on every parent re-render).
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      setDraft(normalizeFilters(filters, config));
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, filters, config]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const activeCount = useMemo(
    () => countActiveFilters(draft, config),
    [draft, config]
  );

  if (!isOpen) return null;

  const updateDraft = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    const normalized = normalizeFilters(draft, config);
    if (typeof setFilters === 'function') {
      setFilters(normalized);
    }
    if (typeof onApply === 'function') {
      onApply(normalized);
    }
    onClose?.();
  };

  const handleReset = () => {
    const empty = normalizeFilters({}, config);
    setDraft(empty);
    if (typeof setFilters === 'function') {
      setFilters(empty);
    }
    if (typeof onReset === 'function') {
      onReset(empty);
    }
  };

  const renderFilterInput = (filter) => {
    if (!filter?.key) return null;
    const icon = filter.icon || getDefaultIcon(filter.type, filter.label);
    const options = Array.isArray(filter.options) ? filter.options : [];

    switch (filter.type) {
      case 'select':
        return (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[#0b1d36]">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0b1d36]/8 text-[#d4af37]">
                {icon}
              </span>
              {filter.label}
            </label>
            <select
              value={draft[filter.key] ?? ''}
              onChange={(e) => updateDraft(filter.key, e.target.value)}
              className="w-full rounded-xl border border-[#dce3ec] bg-white px-3.5 py-2.5 text-sm text-[#0b1d36] outline-none transition focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/25"
            >
              <option value="">{filter.placeholder || `All ${filter.label}`}</option>
              {options.map((option) => {
                const value = typeof option === 'object' ? option.value : option;
                const label = typeof option === 'object' ? option.label : option;
                return (
                  <option key={String(value)} value={value}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>
        );

      case 'multiSelect': {
        const selected = ensureMulti(draft[filter.key]);
        const toggle = (value) => {
          const next = selected.includes(value)
            ? selected.filter((v) => v !== value)
            : [...selected, value];
          updateDraft(filter.key, next);
        };
        return (
          <div className="space-y-2 md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[#0b1d36]">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0b1d36]/8 text-[#d4af37]">
                {icon}
              </span>
              {filter.label}
              {selected.length > 0 && (
                <span className="rounded-full bg-[#d4af37]/15 px-2 py-0.5 text-xs font-semibold text-[#0b1d36]">
                  {selected.length}
                </span>
              )}
            </label>
            <div className="flex flex-wrap gap-2 rounded-xl border border-[#dce3ec] bg-[#f7f8fb] p-3">
              {options.length === 0 && (
                <span className="text-xs text-[#5b6b7c]">No options available</span>
              )}
              {options.map((option) => {
                const value = typeof option === 'object' ? option.value : option;
                const label = typeof option === 'object' ? option.label : option;
                const isSelected = selected.includes(value);
                return (
                  <button
                    key={String(value)}
                    type="button"
                    onClick={() => toggle(value)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      isSelected
                        ? 'border-[#d4af37] bg-[#0b1d36] text-white'
                        : 'border-[#dce3ec] bg-white text-[#0b1d36] hover:border-[#d4af37]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      }

      case 'dateRange': {
        const value = ensureDateRange(draft[filter.key]);
        return (
          <div className="space-y-2 md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[#0b1d36]">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0b1d36]/8 text-[#d4af37]">
                {icon}
              </span>
              {filter.label}
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <span className="mb-1 block text-xs text-[#5b6b7c]">From</span>
                <input
                  type="date"
                  value={value.start}
                  onChange={(e) =>
                    updateDraft(filter.key, { ...value, start: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#dce3ec] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/25"
                />
              </div>
              <div>
                <span className="mb-1 block text-xs text-[#5b6b7c]">To</span>
                <input
                  type="date"
                  value={value.end}
                  min={value.start || undefined}
                  onChange={(e) =>
                    updateDraft(filter.key, { ...value, end: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#dce3ec] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/25"
                />
              </div>
            </div>
          </div>
        );
      }

      case 'range': {
        const value = ensureRange(draft[filter.key]);
        return (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[#0b1d36]">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0b1d36]/8 text-[#d4af37]">
                {icon}
              </span>
              {filter.label}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="mb-1 block text-xs text-[#5b6b7c]">Min</span>
                <input
                  type="number"
                  value={value.min}
                  min={filter.min}
                  max={filter.max}
                  step={filter.step || 1}
                  placeholder="Min"
                  onChange={(e) =>
                    updateDraft(filter.key, { ...value, min: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#dce3ec] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/25"
                />
              </div>
              <div>
                <span className="mb-1 block text-xs text-[#5b6b7c]">Max</span>
                <input
                  type="number"
                  value={value.max}
                  min={filter.min}
                  max={filter.max}
                  step={filter.step || 1}
                  placeholder="Max"
                  onChange={(e) =>
                    updateDraft(filter.key, { ...value, max: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#dce3ec] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/25"
                />
              </div>
            </div>
          </div>
        );
      }

      case 'search':
        return (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[#0b1d36]">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0b1d36]/8 text-[#d4af37]">
                {icon}
              </span>
              {filter.label}
            </label>
            <div className="relative">
              <BiSearchAlt className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#5b6b7c]" />
              <input
                type="text"
                value={draft[filter.key] ?? ''}
                onChange={(e) => updateDraft(filter.key, e.target.value)}
                placeholder={filter.placeholder || `Search ${filter.label}`}
                className="w-full rounded-xl border border-[#dce3ec] bg-white py-2.5 pl-9 pr-3.5 text-sm outline-none transition focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/25"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close filters"
        className="absolute inset-0 bg-[#0b1d36]/55 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-modal-title"
        className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-[rgba(212,175,55,0.35)] bg-white shadow-2xl sm:mx-4 sm:rounded-3xl"
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0b1d36] via-[#16324f] to-[#0b1d36] px-5 py-5 sm:px-6">
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#d4af37]/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 left-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-start justify-between gap-3">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-[#d4af37]">
                <FaFilter className="text-[10px]" />
                Refine results
              </div>
              <h3
                id="filter-modal-title"
                className="text-xl font-semibold tracking-tight text-white"
              >
                Filters
              </h3>
              <p className="mt-1 text-sm text-white/70">
                {activeCount > 0
                  ? `${activeCount} active filter${activeCount === 1 ? '' : 's'}`
                  : 'Choose criteria to narrow the list'}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-[#d4af37] hover:text-[#0b1d36]"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {!config.length ? (
            <p className="text-sm text-[#5b6b7c]">No filters available.</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {config.map((filter) => {
                const fullWidth =
                  filter.type === 'dateRange' || filter.type === 'multiSelect';
                return (
                  <div
                    key={filter.key}
                    className={fullWidth ? 'md:col-span-2' : ''}
                  >
                    {renderFilterInput(filter)}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-[#dce3ec] bg-[#f7f8fb] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dce3ec] bg-white px-4 py-2.5 text-sm font-medium text-[#0b1d36] transition hover:border-[#d4af37]"
          >
            <FaUndo className="text-xs" />
            Reset
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-[#dce3ec] bg-white px-4 py-2.5 text-sm font-medium text-[#0b1d36] transition hover:bg-[#f7f8fb] sm:flex-none"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="btn-gold flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold sm:flex-none"
            >
              <FaCheck className="text-xs" />
              Apply filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
