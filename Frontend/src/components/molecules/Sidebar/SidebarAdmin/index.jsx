import React, { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import SidebarLinkGroup from '../SidebarLinkGroup'
import Logo from '../../../../Assets/images/logo/logo-dark.png'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import { RxDashboard } from 'react-icons/rx'
import { FiSettings } from 'react-icons/fi'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { FaBed, FaUsers, FaCalendarCheck, FaMoneyBillWave, FaKey, FaSignOutAlt, FaChartBar, FaPlus } from 'react-icons/fa'

const SidebarAdmin = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation()
  const { pathname } = location

  const trigger = useRef(null)
  const sidebar = useRef(null)

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded')
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  )

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return
      setSidebarOpen(false)
    }
    document.addEventListener('click', clickHandler)
    return () => document.removeEventListener('click', clickHandler)
  })

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return
      setSidebarOpen(false)
    }
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  })

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded)
    if (sidebarExpanded) {
      document.querySelector('body').classList.add('sidebar-expanded')
    } else {
      document.querySelector('body').classList.remove('sidebar-expanded')
    }
  }, [sidebarExpanded])

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className='flex items-center justify-center px-6 py-5.5 lg:py-6.5 lg:pb-0.5 object-cover'>
        <NavLink to='/admin/dashboard'>
          <img src={Logo} alt='Logo' width={220} />
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls='sidebar'
          aria-expanded={sidebarOpen}
          className='block lg:hidden'
        >
          <AiOutlineArrowLeft className="text-xl" />
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className='no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear'>
        <nav className='mt-4 px-4 lg:mt-9 lg:px-6'>
          <div>
            <ul className='mb-6 flex flex-col gap-1.5'>
              {/* <!--Dashboard Admin--> */}
              {/* <NavLink
                to='/admin/dashboard'
                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('dashboard') &&
                  'bg-graydark dark:bg-meta-4'
                  }`}
              >
                <RxDashboard />
                Dashboard
              </NavLink> */}

              {/* <!-- Booking Dashboard --> */}
              <NavLink
                to='/admin/booking-dashboard'
                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('booking-dashboard') &&
                  'bg-graydark dark:bg-meta-4'
                  }`}
              >
                <FaChartBar />
                Booking Dashboard
              </NavLink>

              {/* <!-- Rooms Management --> */}
              <SidebarLinkGroup
                activeCondition={pathname.includes('rooms')}
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to='#'
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('rooms') && 'bg-graydark dark:bg-meta-4'
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick();
                        }}
                      >
                        <FaBed />
                        Rooms
                        <MdKeyboardArrowDown className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current text-2xl ${open && 'rotate-180'
                          }`} />
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div className={`translate transform overflow-hidden ${!open && 'hidden'}`}>
                        <ul className='mt-4 mb-5.5 flex flex-col gap-2.5 pl-6'>
                          <li>
                            <NavLink
                              to='/admin/rooms/list'
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              <div className="flex items-center gap-2">
                                <FaBed className="w-4 h-4" />
                                Room List
                              </div>
                            </NavLink>
                          </li>
                          {/* <li>
                            <NavLink
                              to='/admin/rooms/types'
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              <div className="flex items-center gap-2">
                                <FaBed className="w-4 h-4" />
                                Room Types
                              </div>
                            </NavLink>
                          </li> */}
                          <li>
                            <NavLink
                              to='/admin/rooms/pricing'
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              <div className="flex items-center gap-2">
                                <FaMoneyBillWave className="w-4 h-4" />
                                Room Pricing
                              </div>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              {/* <!-- Bookings Management --> */}
              <SidebarLinkGroup
                activeCondition={pathname.includes('bookings')}
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to='#'
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('bookings') && 'bg-graydark dark:bg-meta-4'
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick();
                        }}
                      >
                        <FaCalendarCheck />
                        Bookings
                        <MdKeyboardArrowDown className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current text-2xl ${open && 'rotate-180'
                          }`} />
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div className={`translate transform overflow-hidden ${!open && 'hidden'}`}>
                        <ul className='mt-4 mb-5.5 flex flex-col gap-2.5 pl-6'>
                          <li>
                            <NavLink
                              to='/admin/bookings/list'
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              <div className="flex items-center gap-2">
                                <FaCalendarCheck className="w-4 h-4" />
                                Booking List
                              </div>
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to='/admin/bookings/add-booking'
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              <div className="flex items-center gap-2">
                                <FaPlus className="w-4 h-4" />
                                Add Booking
                              </div>
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to='/admin/bookings/calendar'
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              <div className="flex items-center gap-2">
                                <FaCalendarCheck className="w-4 h-4" />
                                Booking Calendar
                              </div>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              {/* <!-- Visitors Management --> */}
              <SidebarLinkGroup
                activeCondition={pathname.includes('visitors')}
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to='#'
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('visitors') && 'bg-graydark dark:bg-meta-4'
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick();
                        }}
                      >
                        <FaUsers />
                        Visitors
                        <MdKeyboardArrowDown className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current text-2xl ${open && 'rotate-180'
                          }`} />
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div className={`translate transform overflow-hidden ${!open && 'hidden'}`}>
                        <ul className='mt-4 mb-5.5 flex flex-col gap-2.5 pl-6'>
                          <li>
                            <NavLink
                              to='/admin/visitors/list'
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              <div className="flex items-center gap-2">
                                <FaUsers className="w-4 h-4" />
                                Visitor List
                              </div>
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to='/admin/visitors/check-in'
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              <div className="flex items-center gap-2">
                                <FaUsers className="w-4 h-4" />
                                Check-in/Check-out
                              </div>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              {/* <!-- Revenue Management --> */}
              <SidebarLinkGroup
                activeCondition={pathname.includes('revenue')}
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to='#'
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('revenue') && 'bg-graydark dark:bg-meta-4'
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick();
                        }}
                      >
                        <FaMoneyBillWave />
                        Revenue
                        <MdKeyboardArrowDown className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current text-2xl ${open && 'rotate-180'
                          }`} />
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div className={`translate transform overflow-hidden ${!open && 'hidden'}`}>
                        <ul className='mt-4 mb-5.5 flex flex-col gap-2.5 pl-6'>
                          <li>
                            <NavLink
                              to='/admin/revenue/transactions'
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              <div className="flex items-center gap-2">
                                <FaMoneyBillWave className="w-4 h-4" />
                                Transactions
                              </div>
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to='/admin/revenue/reports'
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              <div className="flex items-center gap-2">
                                <FaChartBar className="w-4 h-4" />
                                Reports
                              </div>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              {/* <!-- Settings Admin --> */}
              <SidebarLinkGroup
                activeCondition={pathname.includes('pengaturan')}
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to='#'
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('pengaturan') && 'bg-graydark dark:bg-meta-4'
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick();
                        }}
                      >
                        <FiSettings />
                        Settings
                        <MdKeyboardArrowDown className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current text-2xl ${open && 'rotate-180'
                          }`} />
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div className={`translate transform overflow-hidden ${!open && 'hidden'}`}>
                        <ul className='mt-4 mb-5.5 flex flex-col gap-2.5 pl-6'>
                          <li>
                            <NavLink
                              to='/admin/pengaturan/ubah-password'
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              <div className="flex items-center gap-2">
                                <FaKey className="w-4 h-4" />
                                Reset Password
                              </div>
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to='/'
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              <div className="flex items-center gap-2">
                                <FaSignOutAlt className="w-4 h-4" />
                                Logout
                              </div>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  )
}

export default SidebarAdmin;
