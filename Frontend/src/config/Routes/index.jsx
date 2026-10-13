import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
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
import JobBulkUpload from '../../pages/Admin/Recruitments/JobManagement/JobBulkUpload'
import SkillList from '../../pages/Admin/Recruitments/SkillManagement/SkillList'
import SkillForm from '../../pages/Admin/Recruitments/SkillManagement/SkillForm'
import EditJob from '../../pages/Admin/Recruitments/JobManagement/EditJob'
import EditSkill from '../../pages/Admin/Recruitments/SkillManagement/EditSkill'
import JobDetails from '../../pages/Admin/Recruitments/JobManagement/JobDetails'
import CandidateForm from '../../pages/Admin/Recruitments/Candidates/CandidateForm'
import CandidateBulkUpload from '../../pages/Admin/Recruitments/Candidates/CandidateBulkUpload'
import CandidateList from '../../pages/Admin/Recruitments/Candidates/CandidateList'
import CandidateDetails from '../../pages/Admin/Recruitments/Candidates/CandidateDetails'
import PublicJobList from '../../pages/Public/Jobs/PublicJobList'
import PublicJobDetails from '../../pages/Public/Jobs/PublicJobDetails'
import PublicCandidateForm from '../../pages/Public/Jobs/PublicCandidateForm'
import CandidateEdit from '../../pages/Admin/Recruitments/Candidates/CandidateEdit'
import UserDetails from '../../pages/Admin/MasterData/DataPegawai/UserDetails'
import Locations from '../../pages/Admin/MasterData/Locations'
import EmployeeCandidateList from '../../pages/Employee/Recruitments/Candidates'
import EmployeeCandidateForm from '../../pages/Employee/Recruitments/Candidates/CandidateForm'
import EmployeeCandidateEdit from '../../pages/Employee/Recruitments/Candidates/CandidateEdit'
import EmployeeCandidateBulkUpload from '../../pages/Employee/Recruitments/Candidates/CandidateBulkUpload'
import EmployeeCandidateDetails from '../../pages/Employee/Recruitments/Candidates/CandidateDetails'
import EmployeeJobList from '../../pages/Employee/Recruitments/JobManagement/JobList'
import EmployeeJobDetails from '../../pages/Employee/Recruitments/JobManagement/JobDetails'
import EmployeeJobForm from '../../pages/Employee/Recruitments/JobManagement/JobForm'
import EmployeeSkillList from '../../pages/Employee/Recruitments/SkillManagement/SkillList'
import EmployeeSkillForm from '../../pages/Employee/Recruitments/SkillManagement/SkillForm'
import EmployeeEditSkill from '../../pages/Employee/Recruitments/SkillManagement/EditSkill'
import OrgSettings from '../../pages/Admin/HR/OrgSettings'
import Holidays from '../../pages/Admin/HR/Holidays'
import Attendance from '../../pages/Admin/HR/Attendance'
import Leave from '../../pages/Admin/HR/Leave'
import Payroll from '../../pages/Admin/HR/Payroll'
import SalaryStructures from '../../pages/Admin/HR/SalaryStructures'
import Documents from '../../pages/Admin/HR/Documents'
import Notifications from '../../pages/Admin/HR/Notifications'
import Profiles from '../../pages/Admin/HR/Profiles'
import CheckInOut from '../../pages/Employee/HR/CheckInOut'
import SalarySlips from '../../pages/Employee/HR/SalarySlips'
import {
  EmployeeHolidays,
  EmployeeAttendance,
  EmployeeLeave,
  EmployeeDocuments,
  EmployeeNotifications,
  EmployeeProfile,
} from '../../pages/Employee/HR/wrappers'

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
      <Route exact path='/employee/login' element={<LoginPegawai />} />
      <Route exact path='/pegawai/login' element={<Navigate to="/employee/login" replace />} />

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
      <Route path='/admin/master-data/locations' element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Locations />
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

      {/* Protected Employee Routes (English paths) */}
      <Route exact path='/employee/dashboard' element={
        <ProtectedRoute allowedRoles={['user']}>
          <EmployeeDashboard />
        </ProtectedRoute>
      } />
      <Route exact path='/employee/salary' element={
        <ProtectedRoute allowedRoles={['user']}>
          <DataGajiPegawai />
        </ProtectedRoute>
      } />
      <Route exact path='/employee/settings/change-password' element={
        <ProtectedRoute allowedRoles={['user']}>
          <UbahPasswordPegawai />
        </ProtectedRoute>
      } />

      {/* Legacy Indonesian employee paths → English redirects */}
      <Route exact path='/pegawai/dashboard' element={<Navigate to="/employee/dashboard" replace />} />
      <Route exact path='/pegawai/data-gaji' element={<Navigate to="/employee/salary" replace />} />
      <Route exact path='/pegawai/pengaturan/ubah-password' element={<Navigate to="/employee/settings/change-password" replace />} />
      <Route exact path='/pegawai/settings/change-password' element={<Navigate to="/employee/settings/change-password" replace />} />

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
      <Route path="/admin/recruitments/job-management/bulk-upload" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <JobBulkUpload />
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
      <Route path="/admin/recruitments/candidates/add" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <CandidateForm />
        </ProtectedRoute>
      } />
      <Route path="/admin/recruitments/candidates/bulk-upload" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <CandidateBulkUpload />
        </ProtectedRoute>
      } />
      <Route path="/admin/recruitments/candidates/edit/:id" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <CandidateEdit />
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
      <Route path="/employee/recruitments/candidates/bulk-upload" element={
        <ProtectedRoute allowedRoles={['user']}>
          <EmployeeCandidateBulkUpload />
        </ProtectedRoute>
      } />
      <Route path="/employee/recruitments/candidates/edit/:id" element={
        <ProtectedRoute allowedRoles={['user']}>
          <EmployeeCandidateEdit />
        </ProtectedRoute>
      } />
      <Route path="/employee/recruitments/candidates/:id" element={
        <ProtectedRoute allowedRoles={['user']}>
          <EmployeeCandidateDetails />
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
      <Route path="/employee/recruitments/job-management/add" element={
        <ProtectedRoute allowedRoles={['user']}>
          <EmployeeJobForm />
        </ProtectedRoute>
      } />

      {/* Employee Skill Management Routes */}
      <Route path="/employee/recruitments/skill-management" element={
        <ProtectedRoute allowedRoles={['user']}>
          <EmployeeSkillList />
        </ProtectedRoute>
      } />
      <Route path="/employee/recruitments/skill-management/add" element={
        <ProtectedRoute allowedRoles={['user']}>
          <EmployeeSkillForm />
        </ProtectedRoute>
      } />
      <Route path="/employee/recruitments/skill-management/edit/:id" element={
        <ProtectedRoute allowedRoles={['user']}>
          <EmployeeEditSkill />
        </ProtectedRoute>
      } />

      {/* Admin HR */}
      <Route path="/admin/hr/org-settings" element={<ProtectedRoute allowedRoles={['admin']}><OrgSettings /></ProtectedRoute>} />
      <Route path="/admin/hr/holidays" element={<ProtectedRoute allowedRoles={['admin']}><Holidays /></ProtectedRoute>} />
      <Route path="/admin/hr/attendance" element={<ProtectedRoute allowedRoles={['admin']}><Attendance /></ProtectedRoute>} />
      <Route path="/admin/hr/leave" element={<ProtectedRoute allowedRoles={['admin']}><Leave /></ProtectedRoute>} />
      <Route path="/admin/hr/payroll" element={<ProtectedRoute allowedRoles={['admin']}><Payroll /></ProtectedRoute>} />
      <Route path="/admin/hr/salary-structures" element={<ProtectedRoute allowedRoles={['admin']}><SalaryStructures /></ProtectedRoute>} />
      <Route path="/admin/hr/documents" element={<ProtectedRoute allowedRoles={['admin']}><Documents /></ProtectedRoute>} />
      <Route path="/admin/hr/notifications" element={<ProtectedRoute allowedRoles={['admin']}><Notifications /></ProtectedRoute>} />
      <Route path="/admin/hr/profiles" element={<ProtectedRoute allowedRoles={['admin']}><Profiles /></ProtectedRoute>} />

      {/* Employee HR */}
      <Route path="/employee/hr/check-in" element={<ProtectedRoute allowedRoles={['user']}><CheckInOut /></ProtectedRoute>} />
      <Route path="/employee/hr/attendance" element={<ProtectedRoute allowedRoles={['user']}><EmployeeAttendance /></ProtectedRoute>} />
      <Route path="/employee/hr/leave" element={<ProtectedRoute allowedRoles={['user']}><EmployeeLeave /></ProtectedRoute>} />
      <Route path="/employee/hr/holidays" element={<ProtectedRoute allowedRoles={['user']}><EmployeeHolidays /></ProtectedRoute>} />
      <Route path="/employee/hr/salary-slips" element={<ProtectedRoute allowedRoles={['user']}><SalarySlips /></ProtectedRoute>} />
      <Route path="/employee/hr/documents" element={<ProtectedRoute allowedRoles={['user']}><EmployeeDocuments /></ProtectedRoute>} />
      <Route path="/employee/hr/notifications" element={<ProtectedRoute allowedRoles={['user']}><EmployeeNotifications /></ProtectedRoute>} />
      <Route path="/employee/hr/profile" element={<ProtectedRoute allowedRoles={['user']}><EmployeeProfile /></ProtectedRoute>} />

      {/* Route Not Found/404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes;
