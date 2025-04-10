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
  Lending, EditUser, EditLoan, EditPurchaseDetails, EmployeeDashboard
} from '../../pages'
import AddExpense from '../../pages/Admin/Expense/AddExpense'
import EditExpense from '../../pages/Admin/Expense/EditExpense'
import ExpenseList from '../../pages/Admin/Expense/ExpenseList'
import Contact from '../../pages/Contact'
import WhyChooseUs from '../../pages/WhyChooseUs'
import Gallery from '../../pages/Gallery'
import ProjectDocuments from '../../pages/ProjectDocuments'
import TransactionReport from '../../pages/Admin/Reports/TransactionReport'
import ResetPassword from '../../pages/Admin/Settings/ResetPassword'
import JobList from '../../pages/Admin/Recruitments/JobManagement/JobList'
import JobForm from '../../pages/Admin/Recruitments/JobManagement/JobForm'
import SkillList from '../../pages/Admin/Recruitments/SkillManagement/SkillList'
import SkillForm from '../../pages/Admin/Recruitments/SkillManagement/SkillForm'
import EditJob from '../../pages/Admin/Recruitments/JobManagement/EditJob'
import EditSkill from '../../pages/Admin/Recruitments/SkillManagement/EditSkill'
import JobDetails from '../../pages/Admin/Recruitments/JobManagement/JobDetails'
import CandidateForm from '../../pages/Admin/Recruitments/Candidates/CandidateForm'
import CandidateList from '../../pages/Admin/Recruitments/Candidates/CandidateList'
import CandidateDetails from '../../pages/Admin/Recruitments/Candidates/CandidateDetails'
import PublicJobList from '../../pages/Public/Jobs/PublicJobList'
import PublicJobDetails from '../../pages/Public/Jobs/PublicJobDetails'
import PublicCandidateForm from '../../pages/Public/Jobs/PublicCandidateForm'
import CandidateEdit from '../../pages/Admin/Recruitments/Candidates/CandidateEdit'
import UserDetails from '../../pages/Admin/MasterData/DataPegawai/UserDetails'
import EmployeeCandidateList from '../../pages/Employee/Recruitments/Candidates'
import EmployeeCandidateForm from '../../pages/Employee/Recruitments/Candidates/CandidateForm'
import EmployeeCandidateDetails from '../../pages/Employee/Recruitments/Candidates/CandidateDetails'
import EmployeeJobList from '../../pages/Employee/Recruitments/JobManagement/JobList'
import EmployeeJobDetails from '../../pages/Employee/Recruitments/JobManagement/JobDetails'
import EmployeeJobForm from '../../pages/Employee/Recruitments/JobManagement/JobForm'

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
          <ResetPassword />
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
          {/* <DashboardPegawai /> */}
          <EmployeeDashboard />
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
      <Route path='/admin/expense/edit/:id' element={
        <ProtectedRoute allowedRoles={['admin']}>
          <EditExpense />
        </ProtectedRoute>
      } />
      <Route path='/admin/expense/list' element={
        <ProtectedRoute allowedRoles={['admin']}>
          <ExpenseList />
        </ProtectedRoute>
      } />

      {/* Reports Routes */}
      <Route path='/admin/reports/transactions' element={
        <ProtectedRoute allowedRoles={['admin']}>
          <TransactionReport />
        </ProtectedRoute>
      } />

      {/* Job Management Routes */}
      <Route path="/admin/recruitments/job-management" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <JobList />
        </ProtectedRoute>
      } />
      <Route path="/admin/recruitments/job-management/form-job" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <JobForm />
        </ProtectedRoute>
      } />
      <Route path="/admin/recruitments/job-management/edit/:id" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <EditJob />
        </ProtectedRoute>
      } />
      <Route path="/admin/recruitments/job-management/details/:id" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <JobDetails />
        </ProtectedRoute>
      } />
      <Route path="/admin/recruitments/job-management/apply/:jobId" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <CandidateForm />
        </ProtectedRoute>
      } />
      {/* Skill Management Routes */}
      <Route path="/admin/recruitments/skill-management" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <SkillList />
        </ProtectedRoute>
      } />
      <Route path="/admin/recruitments/skill-management/form-skill" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <SkillForm />
        </ProtectedRoute>
      } />
      <Route path="/admin/recruitments/skill-management/edit/:id" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <EditSkill />
        </ProtectedRoute>
      } />

      {/* Public Job Routes */}
      <Route path="/careers" element={<PublicJobList />} />
      <Route path="/careers/jobs/:id" element={<PublicJobDetails />} />
      <Route path="/careers/jobs/:jobId/apply" element={<PublicCandidateForm />} />

      {/* Candidate Management Routes */}
      <Route path="/admin/recruitments/candidates" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <CandidateList />
        </ProtectedRoute>
      } />
      <Route path="/admin/recruitments/candidates/:id" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <CandidateDetails />
        </ProtectedRoute>
      } />
      <Route path="/admin/recruitments/job-management/:jobId/candidates" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <CandidateList />
        </ProtectedRoute>
      } />
      <Route path="/admin/recruitments/job-management/:jobId/candidates/:candidateId" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <CandidateDetails />
        </ProtectedRoute>
      } />
      <Route path="/admin/recruitments/candidates/add" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <CandidateForm />
        </ProtectedRoute>
      } />
      <Route path="/admin/recruitments/candidates/edit/:id" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <CandidateEdit />
        </ProtectedRoute>
      } />

      {/* User Details Route */}
      <Route path='/admin/master-data/data-pegawai/view/:userId' element={
        <ProtectedRoute allowedRoles={['admin']}>
          <UserDetails />
        </ProtectedRoute>
      } />

      {/* Employee Candidate Management Routes */}
      <Route path="/employee/recruitments/candidates" element={
        <ProtectedRoute allowedRoles={['user']}>
          <EmployeeCandidateList />
        </ProtectedRoute>
      } />
      <Route path="/employee/recruitments/candidates/add" element={
        <ProtectedRoute allowedRoles={['user']}>
          <EmployeeCandidateForm />
        </ProtectedRoute>
      } />
      <Route path="/employee/recruitments/candidates/:id" element={
        <ProtectedRoute allowedRoles={['user']}>
          <EmployeeCandidateDetails />
        </ProtectedRoute>
      } />
      <Route path="/employee/recruitments/candidates/edit/:id" element={
        <ProtectedRoute allowedRoles={['user']}>
          <EmployeeCandidateForm />
        </ProtectedRoute>
      } />

      {/* Employee Job Management Routes */}
      <Route path="/employee/recruitments/job-management" element={
        <ProtectedRoute allowedRoles={['user']}>
          <EmployeeJobList />
        </ProtectedRoute>
      } />
      <Route path="/employee/recruitments/job-management/details/:id" element={
        <ProtectedRoute allowedRoles={['user']}>
          <EmployeeJobDetails />
        </ProtectedRoute>
      } />
      <Route path="/employee/recruitments/job-management/edit/:id" element={
        <ProtectedRoute allowedRoles={['user']}>
          <EmployeeJobForm />
        </ProtectedRoute>
      } />

      {/* Route Not Found/404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes;
