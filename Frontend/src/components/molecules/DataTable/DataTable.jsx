import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FaDownload, FaRegEdit, FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { BsTrash3, BsThreeDotsVertical } from 'react-icons/bs';

const DataTable = ({
  data,
  columns,
  actions,
  statusOptions,
  onStatusChange,
  onDelete,
  onEdit,
  onView,
  onDownload,
  customRowRender,
  statusColors = {},
}) => {
  // Default status colors if not provided
  const defaultStatusColors = {
    applied: 'bg-status-warning-light text-status-warning',
    screening: 'bg-status-info-light text-status-info',
    shortlisted: 'bg-status-success-light text-status-success',
    interviewed: 'bg-status-primary-light text-status-primary',
    selected: 'bg-status-success-light text-status-success',
    rejected: 'bg-status-danger-light text-status-danger',
    hold: 'bg-status-gray-light text-status-gray',
    interested: 'bg-status-warning-light text-status-warning',
    ...statusColors
  };

  // Add this CSS class for hover effects
  const getStatusClass = (status) => {
    const baseClass = defaultStatusColors[status.toLowerCase()] || defaultStatusColors.applied;
    return `inline-block px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${baseClass}`;
  };

  const renderCell = (item, column) => {
    if (column.render) {
      return column.render(item);
    }

    if (column.type === 'date') {
      return format(new Date(item[column.key]), column.format || 'MMM dd, yyyy');
    }

    if (column.type === 'status') {
      return (
        <span className={getStatusClass(item[column.key])}>
          {item[column.key].toUpperCase()}
        </span>
      );
    }

    return item[column.key];
  };

  const ActionMenu = ({ item }) => {
    const [showActions, setShowActions] = useState(false);
    const actionMenuRef = useRef(null);
    const buttonRef = useRef(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, direction: 'down' });

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
          setShowActions(false);
        }
      };

      const updatePosition = () => {
        if (buttonRef.current && showActions) {
          const rect = buttonRef.current.getBoundingClientRect();
          const spaceBelow = window.innerHeight - rect.bottom;
          const spaceAbove = rect.top;
          const menuHeight = 180; // Approximate height of menu with all options

          // Determine if menu should appear above or below
          const direction = spaceBelow < menuHeight && spaceAbove > spaceBelow ? 'up' : 'down';

          setMenuPosition({
            top: direction === 'up' ? rect.top - menuHeight : rect.bottom + window.scrollY,
            left: Math.max(0, rect.right - 192), // Prevent menu from going off-screen left
            direction
          });
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);

      if (showActions) {
        updatePosition();
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }, [showActions]);

    // Add current status marker
    const getCurrentStatusMark = (statusValue) => {
      if (item.status === statusValue) {
        return (
          <span className="absolute right-4 text-success">
            ✓
          </span>
        );
      }
      return null;
    };

    return (
      <div className="relative" ref={actionMenuRef}>
        <button
          ref={buttonRef}
          onClick={(e) => {
            e.stopPropagation();
            setShowActions(!showActions);
          }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-meta-4 rounded-full transition-colors duration-200"
        >
          <BsThreeDotsVertical className="text-black dark:text-white text-xl hover:text-primary dark:hover:text-primary" />
        </button>

        {showActions && (
          <div
            className="fixed w-48 bg-white dark:bg-boxdark rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.15)] 
                       border border-stroke dark:border-strokedark overflow-hidden z-[999]"
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`
            }}
          >
            {statusOptions && (
              <div className="border-t border-stroke dark:border-strokedark">
                {statusOptions.map((status) => (
                  <button
                    key={status.value}
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange(item.uuid, status.value);
                      setShowActions(false);
                    }}
                    className={`
                      relative w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-meta-4 
                      transition-colors duration-200 flex items-center gap-2 text-sm font-medium
                      ${item.status === status.value
                        ? 'text-success bg-success/10'
                        : 'text-black dark:text-white'}
                    `}
                    disabled={item.status === status.value}
                  >
                    <span className={`
                      w-2 h-2 rounded-full
                      ${item.status === status.value ? 'bg-success' : 'bg-gray-400'}
                    `} />
                    {status.label}
                    {getCurrentStatusMark(status.value)}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`py-4 px-4 font-medium text-black dark:text-white ${column.className || ''}`}
                >
                  {column.header}
                </th>
              ))}
              {actions && <th className="w-[70px] py-4 px-4 font-medium text-black dark:text-white">Actions</th>}
            </tr>
          </thead>
          <tbody className="relative">
            {data.map((item, index) => (
              <tr key={item.uuid || index} className="border-b border-stroke dark:border-strokedark">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className={`py-5 px-4 ${column.className || ''}`}>
                    {renderCell(item, column)}
                  </td>
                ))}
                {actions && (
                  <td className="py-5 px-4 text-right">
                    <div className="flex items-center space-x-3.5">
                      {onDownload && item.resume_url && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDownload(item);
                          }}
                          className="hover:text-black"
                          title="Download Resume"
                        >
                          <FaDownload className="text-primary text-xl hover:text-black dark:hover:text-white" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(item);
                          }}
                          className="hover:text-black"
                        >
                          <FaRegEdit className="text-primary text-xl hover:text-black dark:hover:text-white" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item);
                          }}
                          className="hover:text-black"
                        >
                          <BsTrash3 className="text-danger text-xl hover:text-black dark:hover:text-white" />
                        </button>
                      )}
                      {onView && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onView(item);
                          }}
                          className="hover:text-black"
                        >
                          <FaEye className="text-success text-xl hover:text-black dark:hover:text-white" />
                        </button>
                      )}
                      {statusOptions && <ActionMenu item={item} />}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable; 