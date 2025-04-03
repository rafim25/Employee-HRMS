import React from 'react';
import { ButtonOne, ButtonTwo, ButtonThree } from '../../../components';
import { FaTimes } from 'react-icons/fa';

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

  const renderFilterInput = (filter) => {
    switch (filter.type) {
      case 'select':
        return (
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
        );

      case 'dateRange':
        return (
          <div className="flex gap-2">
            <input
              type="date"
              value={filters[filter.key].start}
              onChange={(e) => setFilters({
                ...filters,
                [filter.key]: { ...filters[filter.key], start: e.target.value }
              })}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 dark:border-form-strokedark dark:bg-form-input"
            />
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
        );

      case 'range':
        return (
          <div className="flex gap-2">
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
        );

      case 'search':
        return (
          <input
            type="text"
            value={filters[filter.key]}
            onChange={(e) => setFilters({ ...filters, [filter.key]: e.target.value })}
            placeholder={filter.placeholder}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 dark:border-form-strokedark dark:bg-form-input"
          />
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
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  {filter.label}
                </label>
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