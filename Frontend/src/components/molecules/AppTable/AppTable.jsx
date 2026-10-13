import React from 'react';
import PropTypes from 'prop-types';
import Pagination from '../Pagination/Pagination';
import { PAGE_SIZE } from '../../../constants/pagination';

/**
 * Premium, consistent table shell used across Admin / Employee pages.
 *
 * columns: [{ key, header, className?, align?: 'left'|'center'|'right', render?(row) }]
 * Or pass children for fully custom <thead>/<tbody>.
 */
const AppTable = ({
  columns = [],
  data = [],
  rowKey = 'id',
  emptyText = 'No records found',
  loading = false,
  actions,
  className = '',
  compact = false,
  // Pagination (optional — pass totalItems or totalPages)
  currentPage,
  totalItems,
  totalPages,
  itemsPerPage = PAGE_SIZE,
  onPageChange,
  showPagination = true,
  children,
}) => {
  const cellPad = compact ? 'px-3 py-2.5' : 'px-4 py-3.5';
  const hasPager =
    showPagination &&
    typeof onPageChange === 'function' &&
    (totalItems != null || totalPages != null);

  const resolveKey = (row, index) => {
    if (typeof rowKey === 'function') return rowKey(row, index);
    return row?.[rowKey] ?? row?.uuid ?? row?.user_id ?? index;
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="overflow-hidden rounded-2xl border border-[rgba(11,29,54,0.1)] bg-white shadow-[0_1px_2px_rgba(11,29,54,0.04)]">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#0b1d36]/15 border-t-[#d4af37]" />
            </div>
          ) : children ? (
            <table className="app-table w-full min-w-[640px] table-auto border-collapse text-sm">
              {children}
            </table>
          ) : (
            <table className="app-table w-full min-w-[640px] table-auto border-collapse text-sm">
              <thead>
                <tr className="bg-[#0b1d36] text-left">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`${cellPad} text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90 ${
                        col.align === 'right'
                          ? 'text-right'
                          : col.align === 'center'
                            ? 'text-center'
                            : 'text-left'
                      } ${col.className || ''}`}
                    >
                      {col.header}
                    </th>
                  ))}
                  {actions ? (
                    <th
                      className={`${cellPad} text-right text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90`}
                    >
                      Actions
                    </th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {!data?.length ? (
                  <tr>
                    <td
                      colSpan={columns.length + (actions ? 1 : 0)}
                      className="px-4 py-12 text-center text-sm text-[#5b6b7c]"
                    >
                      {emptyText}
                    </td>
                  </tr>
                ) : (
                  data.map((row, index) => (
                    <tr
                      key={resolveKey(row, index)}
                      className="border-t border-[rgba(11,29,54,0.06)] transition-colors hover:bg-[#f8f4e8]/70"
                    >
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={`${cellPad} align-middle text-[#0b1d36] ${
                            col.align === 'right'
                              ? 'text-right'
                              : col.align === 'center'
                                ? 'text-center'
                                : 'text-left'
                          } ${col.className || ''}`}
                        >
                          {col.render
                            ? col.render(row, index)
                            : row?.[col.key] ?? '—'}
                        </td>
                      ))}
                      {actions ? (
                        <td className={`${cellPad} text-right align-middle`}>
                          <div className="inline-flex items-center justify-end gap-2">
                            {typeof actions === 'function'
                              ? actions(row, index)
                              : actions}
                          </div>
                        </td>
                      ) : null}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {hasPager && !loading && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

AppTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      header: PropTypes.node.isRequired,
      className: PropTypes.string,
      align: PropTypes.oneOf(['left', 'center', 'right']),
      render: PropTypes.func,
    })
  ),
  data: PropTypes.array,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  emptyText: PropTypes.string,
  loading: PropTypes.bool,
  actions: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  className: PropTypes.string,
  compact: PropTypes.bool,
  currentPage: PropTypes.number,
  totalItems: PropTypes.number,
  totalPages: PropTypes.number,
  itemsPerPage: PropTypes.number,
  onPageChange: PropTypes.func,
  showPagination: PropTypes.bool,
  children: PropTypes.node,
};

export default AppTable;
