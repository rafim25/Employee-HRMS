import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ContactUs from './pages/ContactUs/ContactUs';
import CompletedProjects from './pages/CompletedProjects';
import UpcomingProjects from './pages/UpcomingProjects';
import Gallery from './pages/Gallery';
import WhyUs from './pages/WhyUs';
import LoginAdmin from './pages/Admin/LoginAdmin';
import DashboardAdmin from './pages/Admin/DashboardAdmin';
import DefaultLayoutAdmin from './layout/DefaultLayoutAdmin';
import CustomerData from '../src/pages/Admin/MasterData/DataPegawai'

function App() {
  const [loading, setLoading] = useState(true)

  const preloader = document.getElementById('preloader')

  if (preloader) {
    setTimeout(() => {
      preloader.style.display = 'none'
      setLoading(false)
    }, 2000);
  }

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  return (
    !loading && (
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginAdmin />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/completed-projects" element={<CompletedProjects />} />
          <Route path="/upcoming-projects" element={<UpcomingProjects />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/why-us" element={<WhyUs />} />
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route path='/admin/master-data/data-pegawai' element={<CustomerData />} />

          <Route path="/admin" element={<DefaultLayoutAdmin />}>
            <Route path="dashboard" element={<DashboardAdmin />} />
          </Route>
        </Routes>
      </AuthProvider>
    )
  )
}

export default App;
