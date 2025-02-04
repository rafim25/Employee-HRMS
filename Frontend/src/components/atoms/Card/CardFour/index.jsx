import React from 'react';
import { BiRupee } from 'react-icons/bi'
import { useAuth } from '../../../../context/AuthContext';
import { formatCurrency } from '../../../../utils/formatCurrency';

const CardFour = () => {
  const { state } = useAuth();
  const { totalAvailableFunds = 0, error } = state.dashboard || {};

  return (
    <div className='rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark'>
      <div className='flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4'>
        <BiRupee className="fill-success dark:fill-success text-xl" />
      </div>

      <div className='mt-4 flex items-end justify-between'>
        <div>
          <h4 className='text-title-md font-bold text-success dark:text-success break-words'>
            {error ? (
              <span className="text-danger">Error loading data</span>
            ) : (
              formatCurrency(totalAvailableFunds)
            )}
          </h4>
          <span className='text-sm font-medium text-success'>Total Income</span>
        </div>
      </div>
    </div>
  )
}

export default CardFour;
