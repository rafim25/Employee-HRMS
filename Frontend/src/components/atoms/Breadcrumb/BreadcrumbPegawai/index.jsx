import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const BreadcrumbPegawai = ({
  pageName,
  icon: Icon,
  backButton = true,
  backUrl = -1
}) => {
  const navigate = useNavigate();

  return (
    <div className='mb-6 flex items-center justify-between bg-white dark:bg-boxdark px-6 py-4 rounded-sm border border-stroke dark:border-strokedark'>
      <div className='flex items-center gap-6'>
        {/* Back Button */}
        {backButton && (
          <button
            onClick={() => navigate(backUrl)}
            className="flex items-center justify-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <FaArrowLeft className="h-5 w-5" />
          </button>
        )}

        {/* Page Title with Icon */}
        <div className="flex items-center gap-3">
          {Icon && <Icon className="text-xl text-primary" />}
          <h2 className='text-title-md2 font-semibold text-black dark:text-white'>
            {pageName}
          </h2>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <nav>
        <ol className='flex items-center gap-2 text-sm'>
          <li>
            <Link to='/pegawai/dashboard' className='text-black dark:text-white hover:text-primary'>
              Dashboard
            </Link>
          </li>
          <li className='text-black/50 dark:text-white/50'>/</li>
          <li className='text-primary'>{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default BreadcrumbPegawai;

