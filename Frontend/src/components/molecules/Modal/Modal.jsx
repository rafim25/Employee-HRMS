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
      <div className="fixed inset-0 bg-[#0b1d36]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}></div>

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} transform transition-all border border-[rgba(212,175,55,0.35)]`}>
          <div className="flex items-center justify-between p-4 border-b border-[rgba(11,29,54,0.08)] bg-[#0b1d36] rounded-t-2xl">
            <h3 className="text-xl font-semibold text-white">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#d4af37] hover:text-[#0b1d36]"
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