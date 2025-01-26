import React from 'react'
import { Link } from 'react-router-dom'
import { BiSearch } from 'react-icons/bi'
import { useAuth } from '../../../../context/AuthContext'
import LogoIcon from '../../../../Assets/images/logo/logo-icon.svg'
import { DropdownNotification, DropdownAdmin, DarkModeSwitcher } from '../../..'

const HeaderAdmin = (props) => {
  const { state } = useAuth();
  const user = state.user || {};

  return (
    <header className='sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none'>
      <div className='flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11'>
        <div className='flex items-center gap-2 sm:gap-4 lg:hidden'>
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls='sidebar'
            onClick={(e) => {
              e.stopPropagation()
              props.setSidebarOpen(!props.sidebarOpen)
            }}
            className='z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden'
          >
            <span className='relative block h-5.5 w-5.5 cursor-pointer'>
              <span className='du-block absolute right-0 h-full w-full'>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && '!w-full delay-300'}`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && 'delay-400 !w-full'}`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && '!w-full delay-500'}`}
                ></span>
              </span>
            </span>
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}

          <Link className='block flex-shrink-0 lg:hidden' to='/admin/dashboard'>
            <img src={LogoIcon} alt='Snipe Tech Pvt Ltd' />
          </Link>
        </div>

        <div className='hidden sm:block'>
          <form action='https://formbold.com/s/unique_form_id' method='POST'>
            <div className='relative'>
              <button className='absolute left-0 top-1/2 -translate-y-1/2'>
                <BiSearch className='fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary text-xl' />
              </button>

              <input
                type='text'
                placeholder='Type to search...'
                className='w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none xl:w-125'
              />
            </div>
          </form>
        </div>

        <div className='flex items-center gap-3 2xsm:gap-7'>
          <ul className='flex items-center gap-2 2xsm:gap-4'>
            {/* <!-- Dark Mode Toggler --> */}
            <DarkModeSwitcher />
            {/* <!-- Dark Mode Toggler --> */}

            {/* <!-- Notification Menu Area --> */}
            <DropdownNotification />
            {/* <!-- Notification Menu Area --> */}
          </ul>

          {/* User Menu */}
          <DropdownAdmin />
        </div>
      </div>
    </header>
  )
}

export default HeaderAdmin;
