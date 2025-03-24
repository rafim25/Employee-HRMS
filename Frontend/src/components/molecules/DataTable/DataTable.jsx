import React from 'react';
import { format } from 'date-fns';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FaDownload, FaRegEdit, FaEye } from 'react-icons/fa';
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
    applied: 'bg-warning/10 text-warning',
    screening: 'bg-info/10 text-info',
    shortlisted: 'bg-success/10 text-success',
    interviewed: 'bg-primary/10 text-primary',
    selected: 'bg-success/10 text-success',
    rejected: 'bg-danger/10 text-danger',
    ...statusColors
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
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${defaultStatusColors[item[column.key]]}`}>
          {item[column.key].toUpperCase()}
        </span>
      );
    }

    return item[column.key];
  };

  const ActionMenu = ({ item }) => (
    <Menu as="div" className="relative pt-2">
      <Menu.Button className="hover:text-black">
        <BsThreeDotsVertical className="text-black dark:text-white text-xl hover:text-primary dark:hover:text-primary" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-lg bg-white dark:bg-boxdark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          {statusOptions && (
            <div className="py-1">
              {statusOptions.map((status) => (
                <Menu.Item key={status.value}>
                  {({ active }) => (
                    <button
                      onClick={() => onStatusChange(item.uuid, status.value)}
                      className={`
                        group flex w-full items-center px-4 py-2 text-sm
                        ${active ? 'bg-primary/10 text-primary' : 'text-gray-900 dark:text-white'}
                        ${item.status === status.value ? 'bg-success/10 text-success' : ''}
                        disabled:opacity-50
                      `}
                      disabled={item.status === status.value}
                    >
                      <span className={`
                        w-2 h-2 rounded-full mr-3
                        ${item.status === status.value ? 'bg-success' : 'bg-gray-400'}
                      `} />
                      {status.label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  );

  return (
    <div className="max-w-full overflow-x-auto">
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
        <tbody>
          {data.map((item, index) => (
            <tr key={item.uuid || index}>
              {columns.map((column) => (
                <td key={column.key} className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {renderCell(item, column)}
                </td>
              ))}
              {actions && (
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    {onDownload && item.resume_url && (
                      <button
                        onClick={() => onDownload(item)}
                        className="hover:text-black"
                        title="Download Resume"
                      >
                        <FaDownload className="text-primary text-xl hover:text-black dark:hover:text-white" />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="hover:text-black"
                      >
                        <FaRegEdit className="text-primary text-xl hover:text-black dark:hover:text-white" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="hover:text-black"
                      >
                        <BsTrash3 className="text-danger text-xl hover:text-black dark:hover:text-white" />
                      </button>
                    )}
                    {onView && (
                      <button
                        onClick={() => onView(item)}
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
  );
};

export default DataTable; 