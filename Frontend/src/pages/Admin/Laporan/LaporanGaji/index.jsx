import React from 'react';
import { Link } from "react-router-dom";
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin, ButtonOne } from '../../../../components';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
import { TfiPrinter } from 'react-icons/tfi'

const SalaryReport = () => {
    return (
        <DefaultLayoutAdmin>
            <BreadcrumbAdmin pageName='Employee Salary Report' />

            <div className='sm:grid-cols-2'>
                <div className='flex flex-col gap-9'>
                    <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
                        <div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
                            <h3 className='font-medium text-black dark:text-white'>
                              Filter Employee Salary Report
                            </h3>
                        </div>
                        <form action='#'>
                            <div className='p-6.5'>
                                <div className='mb-4.5 '>
                                    <div className='w-full mb-4'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            Month <span className='text-meta-1'>*</span>
                                        </label>
                                        <div className='relative z-20 bg-transparent dark:bg-form-input'>
                                            <select className='relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'>
                                                <option value=''>Select Month</option>
                                                <option value=''>January</option>
                                                <option value=''>February</option>
                                                <option value=''>March</option>
                                                <option value=''>April</option>
                                                <option value=''>May</option>
                                                <option value=''>June</option>
                                                <option value=''>July</option>
                                                <option value=''>August</option>
                                                <option value=''>September</option>
                                                <option value=''>October</option>
                                                <option value=''>November</option>
                                                <option value=''>December</option>
                                            </select>
                                            <span className='absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl'>
                                                <MdOutlineKeyboardArrowDown />
                                            </span>
                                        </div>
                                    </div>

                                    <div className='w-full mb-4'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            Year <span className='text-meta-1'>*</span>
                                        </label>
                                        <div className='relative z-20 bg-transparent dark:bg-form-input'>
                                            <select className='relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'>
                                                <option value=''>Select Year</option>
                                                <option value=''>2020</option>
                                                <option value=''>2021</option>
                                                <option value=''>2022</option>
                                                <option value=''>2023</option>
                                                <option value=''>2024</option>
                                                <option value=''>2025</option>
                                                <option value=''>2026</option>
                                                <option value=''>2027</option>
                                            </select>
                                            <span className='absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl'>
                                                <MdOutlineKeyboardArrowDown />
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-col md:flex-row w-full gap-3 text-center'>
                                    <Link to="" >
                                        <ButtonOne  >
                                            <span>Print Salary Report </span>
                                            <span>
                                                <TfiPrinter />
                                            </span>
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

export default SalaryReport;