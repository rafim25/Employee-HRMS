import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md' // sm, md, lg, xl
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}></div>

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className={`relative bg-white dark:bg-boxdark rounded-xl shadow-lg w-full ${sizeClasses[size]} transform transition-all`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-stroke dark:border-strokedark">
            <h3 className="text-xl font-semibold text-black dark:text-white">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal; 