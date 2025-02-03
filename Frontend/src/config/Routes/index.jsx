import React from 'react'
import { Routes, Route } from 'react-router-dom'
import NotFound from '../../components/molecules/NotFound'
import FormDataPegawai from '../../components/molecules/Form/FormDataPegawai'
import FormDataJabatan from '../../components/molecules/Form/FormDataJabatan'
import FormSettingPotonganGaji from '../../components/molecules/Form/FormSettingPotonganGaji'
import { ProtectedRoute } from '../../components/ProtectedRoute'
import {
  LoginAdmin, DashboardAdmin, DataPegawai, DataJabatan, DataAbsensi, SettingPotonganGaji, DataGaji, LaporanGaji,
  LaporanAbsensi, SlipGaji, UbahPasswordAdmin, LoginPegawai, DashboardPegawai, DataGajiPegawai, UbahPasswordPegawai,
  Lending, EditUser, EditLoan, EditPurchaseDetails
} from '../../pages'
import AddExpense from '../../pages/Admin/Expense/AddExpense'
import ExpenseList from '../../pages/Admin/Expense/ExpenseList'
import Contact from '../../pages/Contact'
import WhyChooseUs from '../../pages/WhyChooseUs'
import Gallery from '../../pages/Gallery'
import ProjectDocuments from '../../pages/ProjectDocuments'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route exact path='/contact' element={<Contact />} />
      <Route exact path='/why-choose-us' element={<WhyChooseUs />} />
      <Route exact path='/gallery' element={<Gallery />} />
      <Route exact path='/project-documents' element={<ProjectDocuments />} />
      <Route exact path='/admin/login' element={<LoginAdmin />} />
      <Route exact path='/' element={<LoginAdmin />} />
      <Route exact path='/pegawai/login' element={<LoginPegawai />} />

      {/* Protected Admin Routes */}
      <Route exact path='/admin/dashboard' element={
        <ProtectedRoute allowedRoles={['admin']}>
          <DashboardAdmin />
        </ProtectedRoute>
      } />
      <Route path='/admin/master-data/data-pegawai' element={
        <ProtectedRoute allowedRoles={['admin']}>
          <DataPegawai />
        </ProtectedRoute>
      } />
      <Route path='/admin/master-data/data-pegawai/form-data-pegawai' element={
        <ProtectedRoute allowedRoles={['admin']}>
          <FormDataPegawai />
        </ProtectedRoute>
      } />
      <Route path='/admin/master-data/data-jabatan' element={
        <ProtectedRoute allowedRoles={['admin']}>
          <DataJabatan />
        </ProtectedRoute>
      } />
      <Route path='/admin/master-data/data-jabatan/form-data-jabatan' element={
        <ProtectedRoute allowedRoles={['admin']}>
          <FormDataJabatan />
        </ProtectedRoute>
      } />
      <Route path='/admin/transaksi/data-absensi' element={
        <ProtectedRoute allowedRoles={['admin']}>
          <DataAbsensi />
        </ProtectedRoute>
      } />
      <Route path='/admin/transaksi/setting-potongan-gaji' element={
        <ProtectedRoute allowedRoles={['admin']}>
          <SettingPotonganGaji />
        </ProtectedRoute>
      } />
      <Route path='/admin/transaksi/setting-potongan-gaji/form-setting-potongan-gaji' element={
        <ProtectedRoute allowedRoles={['admin']}>
          <FormSettingPotonganGaji />
        </ProtectedRoute>
      } />
      <Route path='/admin/transaksi/data-gaji' element={
        <ProtectedRoute allowedRoles={['admin']}>
          <DataGaji />
        </ProtectedRoute>
      } />
      <Route path='/admin/laporan/laporan-gaji' element={
        <ProtectedRoute allowedRoles={['admin']}>
          <LaporanGaji />
        </ProtectedRoute>
      } />
      <Route path='/admin/laporan/laporan-absensi' element={
        <ProtectedRoute allowedRoles={['admin']}>
          <LaporanAbsensi />
        </ProtectedRoute>
      } />
      <Route path='/admin/laporan/slip-gaji' element={
        <ProtectedRoute allowedRoles={['admin']}>
          <SlipGaji />
        </ProtectedRoute>
      } />
      <Route path='/admin/pengaturan/ubah-password' element={
        <ProtectedRoute allowedRoles={['admin']}>
          <UbahPasswordAdmin />
        </ProtectedRoute>
      } />
      <Route path='/admin/master-data/lending/add-lending' element={
        <ProtectedRoute allowedRoles={['admin']}>
          <FormDataJabatan />
        </ProtectedRoute>
      } />
      <Route path='/admin/lending/:loanId' element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Lending />
        </ProtectedRoute>
      } />
      <Route path='/admin/master-data/lending/edit/:loanId' element={
        <ProtectedRoute allowedRoles={['admin']}>
          <EditPurchaseDetails />
        </ProtectedRoute>
      } />
      <Route path='/admin/master-data/data-pegawai/edit/:userId' element={
        <ProtectedRoute allowedRoles={['admin']}>
          <EditUser />
        </ProtectedRoute>
      } />

      {/* Protected Employee Routes */}
      <Route exact path='/pegawai/dashboard' element={
        <ProtectedRoute allowedRoles={['user']}>
          <DashboardPegawai />
        </ProtectedRoute>
      } />
      <Route exact path='/pegawai/data-gaji' element={
        <ProtectedRoute allowedRoles={['user']}>
          <DataGajiPegawai />
        </ProtectedRoute>
      } />
      <Route exact path='/pegawai/pengaturan/ubah-password' element={
        <ProtectedRoute allowedRoles={['user']}>
          <UbahPasswordPegawai />
        </ProtectedRoute>
      } />

      {/* Expense Management Routes */}
      <Route path='/admin/expense/add' element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AddExpense />
        </ProtectedRoute>
      } />
      <Route path='/admin/expense/list' element={
        <ProtectedRoute allowedRoles={['admin']}>
          <ExpenseList />
        </ProtectedRoute>
      } />

      {/* Route Not Found/404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes;
