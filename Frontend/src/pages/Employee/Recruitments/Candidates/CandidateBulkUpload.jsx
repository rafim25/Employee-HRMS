import DefaultLayoutEmployee from '../../../../layout/DefaultLayoutPegawai';
import { BreadcrumbPegawai } from '../../../../components';
import CandidateBulkUpload from '../../../Admin/Recruitments/Candidates/CandidateBulkUpload';

const EmployeeCandidateBulkUpload = () => (
  <CandidateBulkUpload
    Layout={DefaultLayoutEmployee}
    Breadcrumb={BreadcrumbPegawai}
    listPath="/employee/recruitments/candidates"
    resumeUpdatePath={(id) => `/api/employee/candidates/${id}`}
  />
);

export default EmployeeCandidateBulkUpload;
