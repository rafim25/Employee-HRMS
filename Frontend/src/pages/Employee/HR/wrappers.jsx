import DefaultLayoutPegawai from '../../../layout/DefaultLayoutPegawai';
import { BreadcrumbPegawai } from '../../../components';
import Holidays from '../../Admin/HR/Holidays';
import Attendance from '../../Admin/HR/Attendance';
import Leave from '../../Admin/HR/Leave';
import Documents from '../../Admin/HR/Documents';
import Notifications from '../../Admin/HR/Notifications';
import Profiles from '../../Admin/HR/Profiles';

export const EmployeeHolidays = () => (
  <Holidays Layout={DefaultLayoutPegawai} Breadcrumb={BreadcrumbPegawai} admin={false} />
);

export const EmployeeAttendance = () => (
  <Attendance Layout={DefaultLayoutPegawai} Breadcrumb={BreadcrumbPegawai} />
);

export const EmployeeLeave = () => (
  <Leave Layout={DefaultLayoutPegawai} Breadcrumb={BreadcrumbPegawai} admin={false} />
);

export const EmployeeDocuments = () => (
  <Documents Layout={DefaultLayoutPegawai} Breadcrumb={BreadcrumbPegawai} admin={false} />
);

export const EmployeeNotifications = () => (
  <Notifications Layout={DefaultLayoutPegawai} Breadcrumb={BreadcrumbPegawai} />
);

export const EmployeeProfile = () => (
  <Profiles Layout={DefaultLayoutPegawai} Breadcrumb={BreadcrumbPegawai} selfOnly />
);
