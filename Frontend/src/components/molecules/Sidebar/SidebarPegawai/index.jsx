import React, { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import SidebarLinkGroup from '../SidebarLinkGroup'
import Logo from '../../../../Assets/images/logo/logo-dark.png'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import { RxDashboard } from 'react-icons/rx'
import { FiSettings } from 'react-icons/fi'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { FaUserTie, FaBriefcase, FaToolbox, FaKey, FaSignOutAlt, FaClock, FaPlaneDeparture, FaCalendarAlt, FaFilePdf, FaFileAlt, FaBell, FaUser, FaSignInAlt } from 'react-icons/fa'
import { useAuth } from '../../../../context/AuthContext'
import { logoutUser } from '../../../../context/actions/authActions'

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { dispatch } = useAuth()
  const { pathname } = location

  const trigger = useRef(null)
  const sidebar = useRef(null)

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded')
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  )
  const [loggingOut, setLoggingOut] = useState(false)

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

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return
      setSidebarOpen(false)
    }
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  })

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString())
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded')
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded')
    }
  }, [sidebarExpanded])

  const handleLogout = async () => {
    if (loggingOut) return
    setLoggingOut(true)
    try {
      await logoutUser(dispatch)
      toast.success('You have been logged out')
      navigate('/', { replace: true })
    } catch (error) {
      toast.error('Logout failed. Please try again.')
      navigate('/', { replace: true })
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <aside
      ref={sidebar}
      className={`app-sidebar absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      <div className='flex flex-col items-center justify-center px-6 py-6 border-b border-white/10'>
        <NavLink to='/employee/dashboard' className="rounded-md bg-white px-3 py-2">
          <img src={Logo} alt='Seven Wings Technologies' width={180} />
        </NavLink>
        <span className="mt-3 rounded-full border border-[#d4af37]/60 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
          Employee
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

      <div className='no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear'>
        <nav className='mt-4 px-4 lg:mt-9 lg:px-6'>
          <div>
            <ul className='app-nav-stagger mb-6 flex flex-col gap-2'>
              <NavLink
                to='/employee/dashboard'
                className={`app-nav-link ${pathname.includes('dashboard') ? 'app-nav-link-active' : ''}`}
              >
                <RxDashboard />
                Dashboard
              </NavLink>

              <SidebarLinkGroup activeCondition={pathname.includes('recruitment')}>
                {(handleClick, open) => (
                  <React.Fragment>
                    <NavLink
                      to='#'
                      className={`app-nav-link ${pathname.includes('recruitment') ? 'app-nav-link-active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick();
                      }}
                    >
                      <FaBriefcase />
                      Recruitment
                      <MdKeyboardArrowDown className={`app-nav-chevron absolute right-4 top-1/2 -translate-y-1/2 text-2xl ${open ? 'rotate-180' : ''}`} />
                    </NavLink>
                    <div className={`app-submenu ${open ? 'is-open' : ''}`}>
                      <ul className='mt-2 mb-2 flex flex-col gap-1 pl-3'>
                        <li>
                          <NavLink
                            to='/employee/recruitments/job-management'
                            className={({ isActive }) => 'app-nav-sub ' + (isActive && 'text-gold')}
                          >
                            <div className="flex items-center gap-2">
                              <FaBriefcase className="w-4 h-4" />
                              Job Listings
                            </div>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to='/employee/recruitments/candidates'
                            className={({ isActive }) => 'app-nav-sub ' + (isActive && 'text-gold')}
                          >
                            <div className="flex items-center gap-2">
                              <FaUserTie className="w-4 h-4" />
                              My Candidates
                            </div>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to='/employee/recruitments/skill-management'
                            className={({ isActive }) => 'app-nav-sub ' + (isActive && 'text-gold')}
                          >
                            <div className="flex items-center gap-2">
                              <FaToolbox className="w-4 h-4" />
                              Skills Database
                            </div>
                          </NavLink>
                        </li>
                      </ul>
                    </div>
                  </React.Fragment>
                )}
              </SidebarLinkGroup>

              <SidebarLinkGroup activeCondition={pathname.includes('/employee/hr')}>
                {(handleClick, open) => (
                  <React.Fragment>
                    <NavLink
                      to='#'
                      className={`app-nav-link ${pathname.includes('/employee/hr') ? 'app-nav-link-active' : ''}`}
                      onClick={(e) => { e.preventDefault(); handleClick(); }}
                    >
                      <FaClock />
                      My HR
                      <MdKeyboardArrowDown className={`app-nav-chevron absolute right-4 top-1/2 -translate-y-1/2 text-2xl ${open ? 'rotate-180' : ''}`} />
                    </NavLink>
                    <div className={`app-submenu ${open ? 'is-open' : ''}`}>
                      <ul className='mt-2 mb-2 flex flex-col gap-1 pl-3'>
                        {[
                          { to: '/employee/hr/check-in', icon: FaSignInAlt, label: 'Check In / Out' },
                          { to: '/employee/hr/attendance', icon: FaClock, label: 'Attendance' },
                          { to: '/employee/hr/leave', icon: FaPlaneDeparture, label: 'Leave' },
                          { to: '/employee/hr/holidays', icon: FaCalendarAlt, label: 'Holidays' },
                          { to: '/employee/hr/salary-slips', icon: FaFilePdf, label: 'Salary Slips' },
                          { to: '/employee/hr/documents', icon: FaFileAlt, label: 'Documents' },
                          { to: '/employee/hr/profile', icon: FaUser, label: 'Profile' },
                          { to: '/employee/hr/notifications', icon: FaBell, label: 'Notifications' },
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

              <SidebarLinkGroup activeCondition={pathname.includes('/employee/settings') || pathname.includes('settings')}>
                {(handleClick, open) => (
                  <React.Fragment>
                    <NavLink
                      to='#'
                      className={`app-nav-link ${pathname.includes('settings') ? 'app-nav-link-active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick();
                      }}
                    >
                      <FiSettings />
                      Settings
                      <MdKeyboardArrowDown className={`app-nav-chevron absolute right-4 top-1/2 -translate-y-1/2 text-2xl ${open ? 'rotate-180' : ''}`} />
                    </NavLink>
                    <div className={`app-submenu ${open ? 'is-open' : ''}`}>
                      <ul className='mt-2 mb-2 flex flex-col gap-1 pl-3'>
                        <li>
                          <NavLink
                            to='/employee/settings/change-password'
                            className={({ isActive }) => 'app-nav-sub ' + (isActive && 'text-gold')}
                          >
                            <div className="flex items-center gap-2">
                              <FaKey className="w-4 h-4" />
                              Change Password
                            </div>
                          </NavLink>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="app-nav-sub w-full text-left disabled:opacity-60"
                          >
                            <div className="flex items-center gap-2">
                              <FaSignOutAlt className="w-4 h-4" />
                              {loggingOut ? 'Logging out...' : 'Logout'}
                            </div>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </React.Fragment>
                )}
              </SidebarLinkGroup>
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar;
