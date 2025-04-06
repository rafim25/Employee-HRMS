import React from 'react';

export const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-white dark:bg-boxdark">
      <div className="relative">
        {/* Primary circle */}
        <div className="h-16 w-16 rounded-full border-4 border-solid border-primary border-t-transparent animate-spin"></div>

        {/* Secondary loading text */}
        <div className="mt-4 text-center">
          <span className="text-sm font-medium text-body dark:text-bodydark">
            Loading...
          </span>
        </div>
      </div>
    </div>
  );
};

// Mini loader variant for inline use
export const MiniLoader = () => {
  return (
    <div className="flex items-center justify-center p-2">
      <div className="h-8 w-8 rounded-full border-3 border-solid border-primary border-t-transparent animate-spin"></div>
    </div>
  );
};

// Table loader variant
export const TableLoader = () => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="h-12 w-12 rounded-full border-4 border-solid border-primary border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
};

// Card loader variant
export const CardLoader = () => {
  return (
    <div className="bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark p-4 shadow-default">
      <div className="flex items-center justify-center min-h-[100px]">
        <div className="h-10 w-10 rounded-full border-3 border-solid border-primary border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
};

// Button loader variant
export const ButtonLoader = ({ color = "white" }) => {
  return (
    <div className="inline-flex items-center">
      <div className={`h-4 w-4 rounded-full border-2 border-solid border-${color} border-t-transparent animate-spin mr-2`}></div>
      Loading...
    </div>
  );
};


export default Loader;