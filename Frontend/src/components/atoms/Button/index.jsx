import React from 'react';

export const ButtonOne = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg border border-primary bg-primary py-3 px-6 text-center font-medium text-white hover:bg-opacity-90 transition-all duration-200 ease-in-out ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const ButtonTwo = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg border border-stroke py-3 px-6 text-center font-medium hover:shadow-1 dark:border-strokedark dark:text-white ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const ButtonThree = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg border border-primary py-3 px-6 text-center font-medium text-primary hover:bg-primary hover:text-white transition-all duration-200 ease-in-out ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}; 