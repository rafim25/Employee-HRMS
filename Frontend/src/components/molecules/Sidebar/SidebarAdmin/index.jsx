import React, { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import SidebarLinkGroup from '../SidebarLinkGroup'
import Logo from '../../../../Assets/images/logo.png'
import { RxDashboard } from 'react-icons/rx'
import { FiDatabase, FiSettings } from 'react-icons/fi'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { BsArrowLeftShort } from 'react-icons/bs'
import { useAuth } from '../../../../context/AuthContext'
import { logoutUser } from '../../../../context/actions/authActions'

const SidebarAdmin = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { pathname } = location
  const { state, dispatch } = useAuth()
  const username = state.user?.username || 'Admin'

  const trigger = useRef(null)
  const sidebar = useRef(null)

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded')
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  )

  const handleLogout = async () => {
    try {
      await logoutUser(dispatch);
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString())
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded')
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded')
    }
  }, [sidebarExpanded])

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/admin/dashboard">
          <img src={Logo} alt="Logo" className="h-12" />
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <BsArrowLeftShort className="text-xl" />
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- User Info --> */}
        {/* <div className="px-6 py-4 border-b border-gray-700">
          <p className="text-sm text-gray-300">Welcome,</p>
          <h3 className="text-lg font-semibold text-white">{username}</h3>
        </div>
         */}
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          <div>
            <ul className='mb-6 flex flex-col gap-1.5'>
              {/* Dashboard */}
              <NavLink
                to='/admin/dashboard'
                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                  pathname.includes('dashboard') && 'bg-graydark dark:bg-meta-4'
                }`}
              >
                <RxDashboard />
                Dashboard
              </NavLink>

              {/* Master Data */}
              <SidebarLinkGroup
                activeCondition={pathname.includes('master-data')}
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to='/admin/master-data'
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          pathname.includes('master-data') && 'bg-graydark dark:bg-meta-4'
                        }`}
                        onClick={(e) => {
                          e.preventDefault()
                          sidebarExpanded ? handleClick() : setSidebarExpanded(true)
                        }}
                      >
                        <FiDatabase />
                        Master Data
                        <MdKeyboardArrowDown className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current text-2xl ${
                          open && 'rotate-180'
                        }`} />
                      </NavLink>
                      <div className={`translate transform overflow-hidden ${!open && 'hidden'}`}>
                        <ul className='mt-4 mb-5.5 flex flex-col gap-2.5 pl-6'>
                          <li>
                            <NavLink
                              to='/admin/master-data/customers'
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Customer Details
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to='/admin/master-data/loans'
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Loan Details
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  )
                }}
              </SidebarLinkGroup>

              {/* Settings */}
              <SidebarLinkGroup
                activeCondition={pathname.includes('/admin/settings')}
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to='#'
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          pathname.includes('/admin/settings') && 'bg-graydark dark:bg-meta-4'
                        }`}
                        onClick={(e) => {
                          e.preventDefault()
                          sidebarExpanded ? handleClick() : setSidebarExpanded(true)
                        }}
                      >
                        <FiSettings />
                        Settings
                        <MdKeyboardArrowDown className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current text-2xl ${
                          open && 'rotate-180'
                        }`} />
                      </NavLink>
                      <div className={`translate transform overflow-hidden ${!open && 'hidden'}`}>
                        <ul className='mt-4 mb-5.5 flex flex-col gap-2.5 pl-6'>
                          <li>
                            <NavLink
                              to='/admin/settings/change-password'
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Change Password
                            </NavLink>
                          </li>
                          <li>
                            <button
                              onClick={handleLogout}
                              className="group relative flex w-full items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white"
                            >
                              Log Out
                            </button>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  )
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
