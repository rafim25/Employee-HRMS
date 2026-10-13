import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FaDownload, FaUpload } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { api } from '../../../services/api';
import { downloadBulkTemplate } from '../../../Utils/excelTemplates';
import { useAuth } from '../../../context/AuthContext';
import BulkUploadResultsModal from '../Modal/BulkUploadResultsModal';

const convertExcelToJson = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: 'binary' });
        const sheetName =
          workbook.SheetNames.find((name) => name.toLowerCase() !== 'instructions') ||
          workbook.SheetNames[0];
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        resolve(
          rows.filter((row) =>
            Object.entries(row).some(([key, value]) => {
              if (['created_by_id', 'created_by'].includes(String(key).toLowerCase())) return false;
              return value !== '' && value != null;
            })
          )
        );
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsBinaryString(file);
  });
};

const BulkExcelUploadPanel = ({
  title,
  description,
  templateType,
  endpoint,
  payloadKey,
  extraPayload = {},
  onComplete,
}) => {
  const { state } = useAuth();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleDownloadTemplate = async () => {
    try {
      if (!state?.user?.user_id) {
        toast.error('Please sign in again so creator ID can be added to the template');
        return;
      }
      await downloadBulkTemplate(templateType, state.user);
      toast.success(`Template downloaded with creator ID ${state.user.user_id}`);
    } catch (error) {
      toast.error('Failed to download template');
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.type.includes('spreadsheet') || file.type.includes('excel') || file.name.match(/\.(xlsx|xls)$/i)) {
      setSelectedFile(file);
    } else {
      toast.error('Please upload only Excel files (.xlsx, .xls)');
      event.target.value = '';
    }
  };

  const handleBulkUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      toast.error('Please select an Excel file');
      return;
    }

    setUploading(true);
    const loadingToast = toast.loading('Processing upload...');
    try {
      const excelData = await convertExcelToJson(selectedFile);
      if (!excelData || excelData.length === 0) {
        toast.error('No data found in the Excel file', { id: loadingToast });
        setUploading(false);
        return;
      }

      const response = await api.post(endpoint, {
        [payloadKey]: excelData,
        ...extraPayload,
      });

      toast.success(response.data.message || 'Upload processed', { id: loadingToast });
      setResults(response.data.results || { success: [], duplicates: [], errors: [] });
      setShowResults(true);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (onComplete) onComplete(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.msg || 'Upload failed', {
        id: loadingToast,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6.5">
      <div className="mb-6">
        <h4 className="text-xl font-semibold mb-4 text-black dark:text-white">{title}</h4>
        <div className="flex items-center gap-4 mb-6">
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="btn-navy"
          >
            <FaDownload /> Download Template
          </button>
          <p className="text-sm text-gray-500">{description}</p>
        </div>

        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Excel file
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx,.xls"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
            />
            <p className="mt-1 text-sm text-gray-500">
              Upload .xlsx or .xls. Invalid rows are reported individually and valid rows still save.
            </p>
          </div>
          <button
            type="button"
            onClick={handleBulkUpload}
            disabled={!selectedFile || uploading}
            className={`btn-gold ${
              !selectedFile || uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FaUpload className="mr-2" />
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>

      <BulkUploadResultsModal
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        results={results || { success: [], duplicates: [], errors: [] }}
      />
    </div>
  );
};

export default BulkExcelUploadPanel;
