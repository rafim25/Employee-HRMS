import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin } from '../../../../components';
import { FaBriefcase } from 'react-icons/fa';
import { useAuth } from '../../../../context/AuthContext';
import BulkExcelUploadPanel from '../../../../components/molecules/BulkExcelUploadPanel';
import { JOB_ENDPOINTS } from '../../../../constants/apiEndpoints';
import { useNavigate } from 'react-router-dom';

const JobBulkUpload = () => {
  const { state } = useAuth();
  const navigate = useNavigate();

  return (
    <DefaultLayoutAdmin>
      <BreadcrumbAdmin
        pageName="Bulk Upload Jobs"
        icon={FaBriefcase}
        backUrl="/admin/recruitments/job-management"
      />

      <div className="app-card overflow-hidden">
        <div className="border-b border-[rgba(11,29,54,0.08)] px-6 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4af37]">Jobs</p>
          <h3 className="mt-1 text-xl font-semibold text-[#0b1d36]">Bulk Upload Jobs</h3>
          <p className="mt-2 text-sm text-[#0b1d36]/70">
            Download the Excel template, fill the gold required columns, then upload. created_by_id is set to your user ID.
          </p>
        </div>
        <BulkExcelUploadPanel
          title="Upload job Excel file"
          description="Keep row 1 headers. Invalid rows are reported individually and valid rows still save."
          templateType="jobs"
          endpoint={JOB_ENDPOINTS.BULK_UPLOAD}
          payloadKey="jobs"
          extraPayload={{
            created_by: state?.user?.username,
            created_by_id: state?.user?.user_id,
          }}
          onComplete={() => {
            navigate('/admin/recruitments/job-management');
          }}
        />
      </div>
    </DefaultLayoutAdmin>
  );
};

export default JobBulkUpload;
