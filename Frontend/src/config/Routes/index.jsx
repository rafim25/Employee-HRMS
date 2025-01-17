import React from 'react'
import { Routes, Route } from 'react-router-dom'
import NotFound from '../../components/molecules/NotFound'
import FormDataPegawai from '../../components/molecules/Form/FormDataPegawai'
import FormDataJabatan from '../../components/molecules/Form/FormDataJabatan'
import FormSettingPotonganGaji from '../../components/molecules/Form/FormSettingPotonganGaji'
import {
  LoginAdmin, DashboardAdmin, DataPegawai, DataJabatan, DataAbsensi, SettingPotonganGaji, DataGaji, LaporanGaji,
  LaporanAbsensi, SlipGaji, UbahPasswordAdmin, LoginPegawai, DashboardPegawai, DataGajiPegawai, UbahPasswordPegawai,
  Lending
} from '../../pages'

const AppRoutes = () => {

  return (
    <Routes>
      {/* Route Admin */}
      {/* Login Admin */}
      <Route exact path='/admin/login' element={<LoginAdmin />} />
      <Route exact path='/' element={<LoginAdmin />} />
      {/* Dashboard Admin */}
      <Route exact path='/admin/dashboard' element={<DashboardAdmin />} />
      {/* Master Data Admin */}
      <Route path='/admin/master-data/data-pegawai' element={<DataPegawai />} />
      <Route path='/admin/master-data/data-pegawai/form-data-pegawai' element={<FormDataPegawai />} />
      <Route path='/admin/master-data/data-jabatan' element={<DataJabatan />} />
      <Route path='/admin/master-data/data-jabatan/form-data-jabatan' element={<FormDataJabatan />} />
      {/* Transaction Admin */}
      <Route path='/admin/transaksi/data-absensi' element={<DataAbsensi />} />
      <Route path='/admin/transaksi/setting-potongan-gaji' element={<SettingPotonganGaji />} />
      <Route path='/admin/transaksi/setting-potongan-gaji/form-setting-potongan-gaji' element={<FormSettingPotonganGaji />} />
      <Route path='/admin/transaksi/data-gaji' element={<DataGaji />} />
      {/* Report Admin */}
      <Route path='/admin/laporan/laporan-gaji' element={<LaporanGaji />} />
      <Route path='/admin/laporan/laporan-absensi' element={<LaporanAbsensi />} />
      <Route path='/admin/laporan/slip-gaji' element={<SlipGaji />} />
      {/* Settings Admin */}
      <Route path='/admin/pengaturan/ubah-password' element={<UbahPasswordAdmin />} />

      {/* Route Employee */}
      {/* Login Employee */}
      <Route exact path='/pegawai/login' element={<LoginPegawai />} />
      {/* Dashboard Employee */}
      <Route exact path='/pegawai/dashboard' element={<DashboardPegawai />} />
      {/* Dashboard Salary Data  Employee */}
      <Route exact path='/pegawai/data-gaji' element={<DataGajiPegawai />} />
      <Route exact path='/pegawai/pengaturan/ubah-password' element={<UbahPasswordPegawai />} />
      {/* Route Not Found/404 */}
      <Route exact path="*" element={<NotFound />} />
          {/* Loan Management Routes */}
      <Route path='/admin/lending/:loanId' element={<Lending />} />
      <Route path='/admin/master-data/lending/add-lending' element={<FormDataJabatan />} />
      <Route path='/admin/master-data/lending/edit/:loanId' element={<FormDataJabatan />} />
    
    </Routes>
  )
}

export default AppRoutes;
