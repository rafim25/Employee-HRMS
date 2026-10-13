import DefaultLayoutEmployee from '../../../../layout/DefaultLayoutPegawai';
import { BreadcrumbPegawai } from '../../../../components';
import BulkExcelUploadPanel from '../../../../components/molecules/BulkExcelUploadPanel';
import { JOB_ENDPOINTS } from '../../../../constants/apiEndpoints';
import { useAuth } from '../../../../context/AuthContext';
import { fetchJobs } from '../../../../context/actions/jobActions';

const EmployeeJobBulkUpload = () => {
  const { state, dispatch } = useAuth();

  return (
    <DefaultLayoutEmployee>
      <BreadcrumbPegawai
        pageName="Bulk Upload Jobs"
        backUrl="/employee/recruitments/job-management"
      />

      <div className="app-card">
        <div className="border-b border-[rgba(11,29,54,0.08)] px-6 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4af37]">Jobs</p>
          <h3 className="mt-1 font-semibold text-[#0b1d36]">Bulk Upload</h3>
          <p className="mt-1 text-sm text-[#0b1d36]/70">
            Required columns: title, type, and created_by_id. Gold headers in the template are required.
          </p>
        </div>
        <BulkExcelUploadPanel
          title="Upload job Excel"
          description="Download the template, fill the gold required columns, then upload. created_by_id is set to your user ID. Invalid rows fail individually."
          templateType="jobs"
          endpoint={JOB_ENDPOINTS.BULK_UPLOAD}
          payloadKey="jobs"
          extraPayload={{
            created_by: state?.user?.username,
            created_by_id: state?.user?.user_id,
          }}
          onComplete={() => {
            fetchJobs(dispatch);
          }}
        />
      </div>
    </DefaultLayoutEmployee>
  );
};

export default EmployeeJobBulkUpload;
