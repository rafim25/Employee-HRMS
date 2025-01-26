import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/molecules/Sidebar/SidebarAdmin'
import Header from '../../components/molecules/Header/HeaderAdmin'
import { useAuth } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'
// import Logo from '../../assets/images/logo/logo.png'

const DefaultLayoutAdmin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { state } = useAuth();

  // Check if user is authenticated
  if (!state.isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark min-h-screen">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen">
        {/* Sidebar - increased width */}
        <div className="w-[300px] flex-shrink-0">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>

        {/* Content Area */}
        <div className="relative flex flex-1 flex-col">
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-boxdark-2">
            <div className="mx-auto w-full max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <Outlet />
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  )
}

export default DefaultLayoutAdmin
