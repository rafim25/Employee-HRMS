import React, { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import SidebarLinkGroup from '../SidebarLinkGroup'
import Logo from '../../../../Assets/images/logo/logo-dark.png'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import { RxDashboard } from 'react-icons/rx'
import { FiDatabase, FiSettings } from 'react-icons/fi'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { FaRegMoneyBillAlt } from 'react-icons/fa'
import { TfiPrinter } from 'react-icons/tfi'
import { AiOutlineTransaction } from 'react-icons/ai'
import { BsArrowLeftShort } from 'react-icons/bs'
import { FaMoneyBillWave } from 'react-icons/fa'
import { TbReport } from 'react-icons/tb'
import { BiMoney } from 'react-icons/bi'
import { BsBuilding } from 'react-icons/bs'
import { FaUserTie, FaUsers, FaShoppingCart, FaFileInvoiceDollar, FaListAlt, FaMoneyCheckAlt, FaChartBar, FaCogs, FaKey, FaSignOutAlt, FaToolbox, FaBriefcase, FaMapMarkerAlt, FaClock, FaPlaneDeparture, FaCalendarAlt, FaFileAlt, FaBell, FaUser } from 'react-icons/fa'

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
      className={`app-sidebar absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className='flex flex-col items-center justify-center px-6 py-6 border-b border-white/10'>
        <NavLink to='/admin/dashboard' className="rounded-md bg-white px-3 py-2">
          <img src={Logo} alt='Seven Wings Technologies' width={180} />
        </NavLink>
        <span className="mt-3 rounded-full border border-[#d4af37]/60 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
          Admin
        </span>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls='sidebar'
          aria-expanded={sidebarOpen}
          className='block lg:hidden'
        >
          <AiOutlineArrowLeft className="text-xl text-white" />
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className='no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear'>
        <nav className='mt-4 px-4 lg:mt-9 lg:px-6'>
          <div>

            <ul className='app-nav-stagger mb-6 flex flex-col gap-2'>
              {/* <!--Dashboard Admin--> */}

              <NavLink
                to='/admin/dashboard'
                className={`app-nav-link ${pathname.includes('dashboard') ? 'app-nav-link-active' : ''}`}
              >
                <RxDashboard />
                Dashboard
              </NavLink>
              {/* <!-- Dashboard Admin --> */}

              {/* <!-- Master Data Admin --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname.includes('master-data')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to='#'
                        className={`app-nav-link ${pathname.includes('master-data') ? 'app-nav-link-active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick();
                        }}
                      >
                        <FiDatabase />
                        Employee Data
                        <MdKeyboardArrowDown className={`app-nav-chevron absolute right-4 top-1/2 -translate-y-1/2 text-2xl ${open ? 'rotate-180' : ''
                          }`} />
                      </NavLink>
                      <div className={`app-submenu ${open ? 'is-open' : ''}`}>
                        <ul className='mt-2 mb-2 flex flex-col gap-1 pl-3'>
                          <li>
                            <NavLink
                              to='/admin/master-data/data-pegawai'
                              className={({ isActive }) =>
                                'app-nav-sub ' +
                                (isActive && 'text-gold')
                              }
                            >
                              <div className="flex items-center gap-2">
                                <FaUsers className="w-4 h-4" />
                                Employee Details
                              </div>
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to='/admin/master-data/locations'
                              className={({ isActive }) =>
                                'app-nav-sub ' +
                                (isActive && 'text-gold')
                              }
                            >
                              <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="w-4 h-4" />
                                Locations
                              </div>
                            </NavLink>
                          </li>
                          {/* <li>
                            <NavLink
                              to='/admin/master-data/data-jabatan'
                              className={({ isActive }) =>
                                'app-nav-sub ' +
                                (isActive && 'text-gold')
                              }
                            >
                              <div className="flex items-center gap-2">
                                <FaShoppingCart className="w-4 h-4" />
                                Purchase Details
                              </div>
                            </NavLink>
                          </li> */}
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Master Data Admin --> */}

              {/* <!-- Expense Management --> */}
              {/* <SidebarLinkGroup
                activeCondition={
                  pathname.includes('expense')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to='#'
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('expense') && 'bg-graydark dark:bg-meta-4'
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick();
                        }}
                      >
                        <BiMoney />
                        Expense Management
                        <MdKeyboardArrowDown className={`app-nav-chevron absolute right-4 top-1/2 -translate-y-1/2 text-2xl ${open ? 'rotate-180' : ''
                          }`} />
                      </NavLink>
                      <div className={`app-submenu ${open ? 'is-open' : ''}`}>
                        <ul className='mt-2 mb-2 flex flex-col gap-1 pl-3'>
                          <li>
                            <NavLink
                              to='/admin/expense/add'
                              className={({ isActive }) =>
                                'app-nav-sub ' +
                                (isActive && 'text-gold')
                              }
                            >
                              <div className="flex items-center gap-2">
                                <FaFileInvoiceDollar className="w-4 h-4" />
                                Add Expense
                              </div>
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to='/admin/expense/list'
                              className={({ isActive }) =>
                                'app-nav-sub ' +
                                (isActive && 'text-gold')
                              }
                            >
                              <div className="flex items-center gap-2">
                                <FaListAlt className="w-4 h-4" />
                                Expense List
                              </div>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              <SidebarLinkGroup
                activeCondition={
                  pathname.includes('reports')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to='#'
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('reports') && 'bg-graydark dark:bg-meta-4'
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick();
                        }}
                      >
                        <TbReport />
                        Reports
                        <MdKeyboardArrowDown className={`app-nav-chevron absolute right-4 top-1/2 -translate-y-1/2 text-2xl ${open ? 'rotate-180' : ''
                          }`} />
                      </NavLink>
                      <div className={`app-submenu ${open ? 'is-open' : ''}`}>
                        <ul className='mt-2 mb-2 flex flex-col gap-1 pl-3'>
                          <li>
                            <NavLink
                              to='/admin/reports/transactions'
                              className={({ isActive }) =>
                                'app-nav-sub ' +
                                (isActive && 'text-gold')
                              }
                            >
                              <div className="flex items-center gap-2">
                                <FaChartBar className="w-4 h-4" />
                                Transaction Report
                              </div>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup> */}
              {/* <!-- Reports End --> */}

              {/* <!-- Recruitments --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname.includes('recruitments')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to='#'
                        className={`app-nav-link ${pathname.includes('recruitments') ? 'app-nav-link-active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick();
                        }}
                      >
                        <FiSettings />
                        Recruitments
                        <MdKeyboardArrowDown className={`app-nav-chevron absolute right-4 top-1/2 -translate-y-1/2 text-2xl ${open ? 'rotate-180' : ''
                          }`} />
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div className={`app-submenu ${open ? 'is-open' : ''}`}>
                        <ul className='mt-2 mb-2 flex flex-col gap-1 pl-3'>
                          <li>
                            <NavLink
                              to='/admin/recruitments/skill-management'
                              className={({ isActive }) =>
                                'app-nav-sub ' +
                                (isActive && 'text-gold')
                              }
                            >
                              <div className="flex items-center gap-2">
                                <FaToolbox className="w-4 h-4" />
                                Skill Management
                              </div>
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to='/admin/recruitments/job-management'
                              className={({ isActive }) =>
                                'app-nav-sub ' +
                                (isActive && 'text-gold')
                              }
                            >
                              <div className="flex items-center gap-2">
                                <FaBriefcase className="w-4 h-4" />
                                Job Management
                              </div>
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to='/admin/recruitments/candidates'
                              className={({ isActive }) =>
                                'app-nav-sub ' +
                                (isActive && 'text-gold')
                              }
                            >
                              <div className="flex items-center gap-2">
                                <FaUserTie className="w-4 h-4" />
                                Candidates
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
              {/* <!-- Recruitments End --> */}

              {/* <!-- HR --> */}
              <SidebarLinkGroup activeCondition={pathname.includes('/admin/hr')}>
                {(handleClick, open) => (
                  <React.Fragment>
                    <NavLink
                      to='#'
                      className={`app-nav-link ${pathname.includes('/admin/hr') ? 'app-nav-link-active' : ''}`}
                      onClick={(e) => { e.preventDefault(); handleClick(); }}
                    >
                      <FaUsers />
                      HR
                      <MdKeyboardArrowDown className={`app-nav-chevron absolute right-4 top-1/2 -translate-y-1/2 text-2xl ${open ? 'rotate-180' : ''}`} />
                    </NavLink>
                    <div className={`app-submenu ${open ? 'is-open' : ''}`}>
                      <ul className='mt-2 mb-2 flex flex-col gap-1 pl-3'>
                        {[
                          { to: '/admin/hr/profiles', icon: FaUser, label: 'Profiles' },
                          { to: '/admin/hr/attendance', icon: FaClock, label: 'Attendance' },
                          { to: '/admin/hr/leave', icon: FaPlaneDeparture, label: 'Leave' },
                          { to: '/admin/hr/holidays', icon: FaCalendarAlt, label: 'Holidays' },
                          { to: '/admin/hr/salary-structures', icon: FaFileInvoiceDollar, label: 'Salary Structures' },
                          { to: '/admin/hr/payroll', icon: FaMoneyCheckAlt, label: 'Payroll' },
                          { to: '/admin/hr/documents', icon: FaFileAlt, label: 'Documents' },
                          { to: '/admin/hr/org-settings', icon: FaCogs, label: 'Org Settings' },
                          { to: '/admin/hr/notifications', icon: FaBell, label: 'Notifications' },
                        ].map((item) => (
                          <li key={item.to}>
                            <NavLink
                              to={item.to}
                              className={({ isActive }) => 'app-nav-sub ' + (isActive && 'text-gold')}
                            >
                              <div className="flex items-center gap-2">
                                <item.icon className="w-4 h-4" />
                                {item.label}
                              </div>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </React.Fragment>
                )}
              </SidebarLinkGroup>

              {/* <!-- Settings Admin --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname.includes('pengaturan')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to='#'
                        className={`app-nav-link ${pathname.includes('pengaturan') ? 'app-nav-link-active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick();
                        }}
                      >
                        <FiSettings />
                        Settings
                        <MdKeyboardArrowDown className={`app-nav-chevron absolute right-4 top-1/2 -translate-y-1/2 text-2xl ${open ? 'rotate-180' : ''
                          }`} />
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div className={`app-submenu ${open ? 'is-open' : ''}`}>
                        <ul className='mt-2 mb-2 flex flex-col gap-1 pl-3'>
                          <li>
                            <NavLink
                              to='/admin/pengaturan/ubah-password'
                              className={({ isActive }) =>
                                'app-nav-sub ' +
                                (isActive && 'text-gold')
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
                                'app-nav-sub ' +
                                (isActive && 'text-gold')
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
              {/* <!-- Settings Admin --> */}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  )
}

export default SidebarAdmin;
