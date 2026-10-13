import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { PAGE_SIZE } from '../../../constants/pagination';

const Pagination = ({
  currentPage = 1,
  totalItems,
  totalPages: totalPagesProp,
  itemsPerPage = PAGE_SIZE,
  onPageChange,
  showingText = 'Showing',
  className = '',
}) => {
  const totalPages = useMemo(() => {
    if (totalPagesProp != null && Number.isFinite(Number(totalPagesProp))) {
      return Math.max(0, Number(totalPagesProp));
    }
    const items = Number(totalItems) || 0;
    return items > 0 ? Math.ceil(items / itemsPerPage) : 0;
  }, [totalPagesProp, totalItems, itemsPerPage]);

  const safeTotalItems =
    totalItems != null
      ? Number(totalItems) || 0
      : totalPages * itemsPerPage;

  const page = Math.min(Math.max(1, currentPage || 1), Math.max(1, totalPages || 1));
  const startIndex = safeTotalItems === 0 ? 0 : (page - 1) * itemsPerPage + 1;
  const endIndex = Math.min(page * itemsPerPage, safeTotalItems);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 0) return [];
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (page <= 3) return [1, 2, 3, 4, '…', totalPages];
    if (page >= totalPages - 2) {
      return [1, '…', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '…', page - 1, page, page + 1, '…', totalPages];
  }, [page, totalPages]);

  if (totalPages <= 1 && safeTotalItems <= itemsPerPage) {
    return (
      <div
        className={`flex flex-col gap-2 border-t border-[rgba(11,29,54,0.08)] px-1 pt-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
      >
        <p className="text-sm text-[#5b6b7c]">
          {showingText}{' '}
          <span className="font-semibold text-[#0b1d36]">{safeTotalItems}</span> item
          {safeTotalItems === 1 ? '' : 's'}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col gap-3 border-t border-[rgba(11,29,54,0.08)] px-1 pt-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <p className="text-sm text-[#5b6b7c]">
        {showingText}{' '}
        <span className="font-semibold text-[#0b1d36]">
          {safeTotalItems > 0 ? `${startIndex}–${endIndex}` : '0'}
        </span>{' '}
        of <span className="font-semibold text-[#0b1d36]">{safeTotalItems}</span>
      </p>

      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          aria-label="Previous page"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[rgba(11,29,54,0.14)] bg-white px-3 text-sm font-medium text-[#0b1d36] transition hover:border-[#d4af37] hover:bg-[#0b1d36] hover:text-[#d4af37] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[rgba(11,29,54,0.14)] disabled:hover:bg-white disabled:hover:text-[#0b1d36]"
        >
          <FaChevronLeft className="text-[10px]" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        <div className="flex items-center gap-1">
          {pageNumbers.map((num, idx) =>
            num === '…' ? (
              <span
                key={`ellipsis-${idx}`}
                className="px-1.5 text-sm text-[#5b6b7c]"
              >
                …
              </span>
            ) : (
              <button
                key={num}
                type="button"
                onClick={() => onPageChange(num)}
                aria-current={num === page ? 'page' : undefined}
                className={`inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-xl border px-2.5 text-sm font-semibold transition ${
                  num === page
                    ? 'border-[#d4af37] bg-[#d4af37] text-[#0b1d36] shadow-sm'
                    : 'border-[rgba(11,29,54,0.12)] bg-white text-[#0b1d36] hover:border-[#d4af37]'
                }`}
              >
                {num}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          aria-label="Next page"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || totalPages === 0}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[rgba(11,29,54,0.14)] bg-white px-3 text-sm font-medium text-[#0b1d36] transition hover:border-[#d4af37] hover:bg-[#0b1d36] hover:text-[#d4af37] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[rgba(11,29,54,0.14)] disabled:hover:bg-white disabled:hover:text-[#0b1d36]"
        >
          <span className="hidden sm:inline">Next</span>
          <FaChevronRight className="text-[10px]" />
        </button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number,
  totalItems: PropTypes.number,
  totalPages: PropTypes.number,
  itemsPerPage: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
  showingText: PropTypes.string,
  className: PropTypes.string,
};

export default Pagination;
