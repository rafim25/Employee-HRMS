import React from 'react';
import PropTypes from 'prop-types';

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage = 8,
  onPageChange,
  showingText = "Showing"
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const getPageNumbers = () => {
    if (totalPages <= 3) {
      // If 3 or fewer pages, show all
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage === 1) {
      // If on first page, show 1, 2
      return [1, 2];
    }

    if (currentPage === totalPages) {
      // If on last page, show lastPage-1, lastPage
      return [totalPages - 1, totalPages];
    }

    // In middle, show currentPage-1, currentPage, currentPage+1
    return [currentPage - 1, currentPage, currentPage + 1];
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
      {/* Showing X-Y of Z items text */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {showingText} {totalItems > 0 ? startIndex + 1 : 0}-{endIndex} of {totalItems} items
      </div>

      {/* Pagination buttons */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center rounded-lg border border-primary py-2 px-4 text-primary font-medium hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-primary"
        >
          Previous
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`py-2 px-4 rounded-lg border transition-colors
                ${pageNum === currentPage
                  ? 'bg-primary text-white border-primary'
                  : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center rounded-lg border border-primary py-2 px-4 text-primary font-medium hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-primary"
        >
          Next
        </button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
  showingText: PropTypes.string
};

export default Pagination; 