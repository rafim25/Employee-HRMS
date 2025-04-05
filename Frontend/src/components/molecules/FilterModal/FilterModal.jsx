import React from 'react';
import { ButtonOne, ButtonTwo, ButtonThree } from '../../../components';
import { FaTimes, FaCalendarAlt, FaMoneyBillWave, FaMapMarkerAlt, FaBriefcase, FaUser } from 'react-icons/fa';
import { MdSource, MdWorkHistory } from 'react-icons/md';
import { BiSearchAlt } from 'react-icons/bi';

const FilterModal = ({
  isOpen,
  onClose,
  onApply,
  onReset,
  filters,
  setFilters,
  config
}) => {
  if (!isOpen) return null;

  // Add default icons for filter types
  const getDefaultIcon = (type, label) => {
    switch (type) {
      case 'dateRange':
        return <FaCalendarAlt className="text-lg" />;
      case 'range':
        if (label.toLowerCase().includes('salary') || label.toLowerCase().includes('ctc')) {
          return <FaMoneyBillWave className="text-lg" />;
        }
        if (label.toLowerCase().includes('experience')) {
          return <MdWorkHistory className="text-lg" />;
        }
        return null;
      case 'search':
        if (label.toLowerCase().includes('location')) {
          return <FaMapMarkerAlt className="text-lg" />;
        }
        return <BiSearchAlt className="text-lg" />;
      case 'select':
        if (label.toLowerCase().includes('job')) {
          return <FaBriefcase className="text-lg" />;
        }
        if (label.toLowerCase().includes('source')) {
          return <MdSource className="text-lg" />;
        }
        if (label.toLowerCase().includes('created by')) {
          return <FaUser className="text-lg" />;
        }
        return null;
      default:
        return null;
    }
  };

  const renderFilterInput = (filter) => {
    // Get icon from filter config or use default based on type
    const icon = filter.icon || getDefaultIcon(filter.type, filter.label);

    switch (filter.type) {
      case 'select':
        return (
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-black dark:text-white">
              {icon}
              <span>{filter.label}</span>
            </label>
            <select
              value={filters[filter.key]}
              onChange={(e) => setFilters({ ...filters, [filter.key]: e.target.value })}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 dark:border-form-strokedark dark:bg-form-input"
            >
              <option value="">{filter.placeholder || `All ${filter.label}`}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'dateRange':
        return (
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-black dark:text-white">
              {icon}
              <span>{filter.label}</span>
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">From</label>
                <input
                  type="date"
                  value={filters[filter.key].start}
                  onChange={(e) => setFilters({
                    ...filters,
                    [filter.key]: { ...filters[filter.key], start: e.target.value }
                  })}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 dark:border-form-strokedark dark:bg-form-input"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">To</label>
                <input
                  type="date"
                  value={filters[filter.key].end}
                  onChange={(e) => setFilters({
                    ...filters,
                    [filter.key]: { ...filters[filter.key], end: e.target.value }
                  })}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 dark:border-form-strokedark dark:bg-form-input"
                />
              </div>
            </div>
          </div>
        );

      case 'range':
        return (
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-black dark:text-white">
              {icon}
              <span>{filter.label}</span>
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Min</label>
                <input
                  type="number"
                  value={filters[filter.key].min}
                  onChange={(e) => setFilters({
                    ...filters,
                    [filter.key]: { ...filters[filter.key], min: e.target.value }
                  })}
                  placeholder="Min"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 dark:border-form-strokedark dark:bg-form-input"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Max</label>
                <input
                  type="number"
                  value={filters[filter.key].max}
                  onChange={(e) => setFilters({
                    ...filters,
                    [filter.key]: { ...filters[filter.key], max: e.target.value }
                  })}
                  placeholder="Max"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 dark:border-form-strokedark dark:bg-form-input"
                />
              </div>
            </div>
          </div>
        );

      case 'search':
        return (
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-black dark:text-white">
              {icon}
              <span>{filter.label}</span>
            </label>
            <input
              type="text"
              value={filters[filter.key]}
              onChange={(e) => setFilters({ ...filters, [filter.key]: e.target.value })}
              placeholder={filter.placeholder}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 dark:border-form-strokedark dark:bg-form-input"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-boxdark rounded-lg w-full max-w-xl mx-4">
        <div className="flex justify-between items-center px-6 py-4 border-b border-stroke dark:border-strokedark">
          <h3 className="text-xl font-semibold text-black dark:text-white">Filters</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FaTimes />
          </button>
        </div>

        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.map((filter) => (
              <div key={filter.key} className={`${filter.type === 'dateRange' ? 'col-span-2' : ''}`}>
                {renderFilterInput(filter)}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-stroke dark:border-strokedark">
          <ButtonThree onClick={onClose}>
            Cancel
          </ButtonThree>
          <ButtonTwo onClick={onReset}>
            Reset
          </ButtonTwo>
          <ButtonOne onClick={onApply}>
            Apply Filters
          </ButtonOne>
        </div>
      </div>
    </div>
  );
};

export default FilterModal; 