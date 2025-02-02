import React from 'react';
import { Link } from "react-router-dom";
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin, ButtonOne } from '../../../../components';
import { TfiLock } from 'react-icons/tfi'

const UbahPasswordAdmin = () => {
    return (
        <DefaultLayoutAdmin>
            <BreadcrumbAdmin pageName='Change Password Form' />

            <div className='sm:grid-cols-2'>
                <div className='flex flex-col gap-9'>
                    <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
                        <div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
                            <h3 className='font-medium text-black dark:text-white'>
                                Change Password Form
                            </h3>
                        </div>
                        <form action='#'>
                            <div className='p-6.5'>
                                <div className='mb-4.5 '>
                                    <div className='w-full mb-4'>
                                        <label className='mb-4 block text-black dark:text-white'>
                                            New Password <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='password'
                                            placeholder='Enter new password'
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>
                                    <div className='w-full mb-4'>
                                        <label className='mb-4 block text-black dark:text-white'>
                                            Repeat New Password <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='password'
                                            placeholder='Re-enter new password'
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                        <TfiLock className="absolute right-4 top-4 text-xl" />
                                    </div>

                                </div>

                                <div className='flex flex-col md:flex-row w-full gap-3 text-center'>
                                    <Link to="" >
                                        <ButtonOne  >
                                            <span>Save</span>
                                        </ButtonOne>
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DefaultLayoutAdmin>
    )
}

export default UbahPasswordAdmin;
