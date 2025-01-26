import React from 'react';
import { RiAdminFill } from 'react-icons/ri'
import { useAuth } from '../../../../context/AuthContext';

const CardTwo = () => {
  const { state } = useAuth();
  const { dashboard = {} } = state;
  const totalAdmins = dashboard.totalAdmins || 0;

  console.log("CardTwo - Dashboard State:", dashboard);
  console.log("CardTwo - Total Admins:", totalAdmins);

  return (
    <div className='rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark'>
      <div className='flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4'>
        <RiAdminFill className="fill-primary dark:fill-white text-xl" />
      </div>

      <div className='mt-4 flex items-end justify-between'>
        <div>
          <h4 className='text-title-md font-bold text-black dark:text-white'>
            {totalAdmins.toLocaleString()}
          </h4>
          <span className='text-sm font-medium'>Total Admins</span>
        </div>
      </div>
    </div>
  );
};

export default CardTwo;