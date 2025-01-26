import React from 'react';
import { FaUsers } from 'react-icons/fa'
import { useAuth } from '../../../../context/AuthContext';

const CardOne = () => {
  const { state } = useAuth();
  const { dashboard = {} } = state;
  const totalUsers = dashboard.totalUsers || 0;

  console.log("CardOne - Dashboard State:", dashboard);
  console.log("CardOne - Total Users:", totalUsers);

  return (
    <div className='rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark'>
      <div className='flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4'>
        <FaUsers className="fill-primary dark:fill-white text-xl" />
      </div>

      <div className='mt-4 flex items-end justify-between'>
        <div>
          <h4 className='text-title-md font-bold text-black dark:text-white'>
            {totalUsers.toLocaleString()}
          </h4>
          <span className='text-sm font-medium'>Total Customers</span>  
        </div>
      </div>
    </div>
  );
};

export default CardOne;

