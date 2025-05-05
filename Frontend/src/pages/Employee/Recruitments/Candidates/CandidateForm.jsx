import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultLayoutEmployee from '../../../../layout/DefaultLayoutPegawai';
import { BreadcrumbPegawai } from '../../../../components';
import {
  FaArrowLeft, FaRupeeSign, FaFileUpload, FaBuilding,
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaUser,
  FaBriefcase, FaClock, FaComments, FaUserFriends,
  FaDownload, FaUpload, FaTimes
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../../../../context/AuthContext';
import { Tab } from '@headlessui/react';
import { downloadCandidateTemplate } from '../../../../utils/excelTemplates';
import * as XLSX from 'xlsx';
import BulkUploadResultsModal from '../../../../components/molecules/Modal/BulkUploadResultsModal';
import axiosInstance from '../../../../services/api';

const CandidateForm = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const [loading, setLoading] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [statesLoading, setStatesLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [currentDistricts, setCurrentDistricts] = useState([]);
  const [preferredDistricts, setPreferredDistricts] = useState([]);
  const [currentDistrictsLoading, setCurrentDistrictsLoading] = useState(false);
  const [preferredDistrictsLoading, setPreferredDistrictsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    currentCompany: '',
    currentCTC: '',
    expectedCTC: '',
    noticePeriod: '',
    currentLocation: {
      state: '',
      district: '',
      districtName: ''
    },
    preferredLocation: {
      state: '',
      district: '',
      districtName: ''
    },
    jobId: '',
    resumeUrl: '',
    notes: '',
    source: 'Direct',
    referred_by: '',
    created_by: state?.user?.username || '',
    created_by_id: state?.user?.user_id || null,
    answers: {},
    job_answers: {},
    rejection_reason: '',
    rejection_details: {
      reason: '',
      stage: '',
      rejected_by: '',
      rejected_at: null,
      comments: ''
    }
  });
  const [selectedTab, setSelectedTab] = useState('single');
  const [bulkFile, setBulkFile] = useState(null);
  const [resume, setResume] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeZipFile, setResumeZipFile] = useState(null);
  const fileInputRef = useRef(null);
  const resumeZipInputRef = useRef(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [uploadResults, setUploadResults] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({
    candidates: { total: 0, success: 0, failed: 0 },
    resumes: { total: 0, success: 0, notFound: 0, failed: 0 },
    currentResume: '',
    isUploading: false,
    missingResumes: [],
    candidateStatus: []
  });

  const sourceOptions = [
    'Naukri',
    'Direct',
    'LinkedIn',
    'Indeed',
    'Referral',
    'Agency',
    'Other'
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setJobsLoading(true);
        const response = await axiosInstance.get('/api/jobs', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast.error('Failed to load jobs');
      } finally {
        setJobsLoading(false);
      }
    };

    const fetchStates = async () => {
      try {
        setStatesLoading(true);
        const response = await axiosInstance.get('/api/locations/states', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setStates(response.data);
      } catch (error) {
        console.error('Error fetching states:', error);
        toast.error('Failed to load states');
      } finally {
        setStatesLoading(false);
      }
    };

    fetchJobs();
    fetchStates();
  }, []);

  const fetchDistricts = async (stateCode, type) => {
    if (type === 'current') {
      setCurrentDistrictsLoading(true);
    } else {
      setPreferredDistrictsLoading(true);
    }

    try {
      const response = await axiosInstance.get(`/api/locations/states/${stateCode}/districts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (type === 'current') {
        setCurrentDistricts(response.data);
        setCurrentDistrictsLoading(false);
      } else {
        setPreferredDistricts(response.data);
        setPreferredDistrictsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
      toast.error('Failed to load districts');
      if (type === 'current') {
        setCurrentDistrictsLoading(false);
      } else {
        setPreferredDistrictsLoading(false);
      }
    }
  };

  const handleLocationChange = (type, field, value) => {
    console.log('handleLocationChange:', { type, field, value });

    if (type === 'current') {
      if (field === 'state') {
        fetchDistricts(value, 'current');
        setFormData(prev => {
          const newData = {
            ...prev,
            currentLocation: {
              state: value,
              district: '',
              districtName: ''
            }
          };
          console.log('Updated currentLocation state:', newData.currentLocation);
          return newData;
        });
      } else {
        const selectedDistrict = currentDistricts.find(d => d.id.toString() === value.toString());
        setFormData(prev => {
          const newData = {
            ...prev,
            currentLocation: {
              ...prev.currentLocation,
              district: value,
              districtName: selectedDistrict?.name || ''
            }
          };
          console.log('Updated currentLocation district:', newData.currentLocation);
          return newData;
        });
      }
    } else {
      if (field === 'state') {
        fetchDistricts(value, 'preferred');
        setFormData(prev => {
          const newData = {
            ...prev,
            preferredLocation: {
              state: value,
              district: '',
              districtName: ''
            }
          };
          console.log('Updated preferredLocation state:', newData.preferredLocation);
          return newData;
        });
      } else {
        const selectedDistrict = preferredDistricts.find(d => d.id.toString() === value.toString());
        setFormData(prev => {
          const newData = {
            ...prev,
            preferredLocation: {
              ...prev.preferredLocation,
              district: value,
              districtName: selectedDistrict?.name || ''
            }
          };
          console.log('Updated preferredLocation district:', newData.preferredLocation);
          return newData;
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Debug location data before processing
      console.log('Form Data before processing:', {
        currentLocation: formData.currentLocation,
        preferredLocation: formData.preferredLocation,
        states,
        currentDistricts,
        preferredDistricts
      });

      // Get selected state names
      const currentState = states.find(s => s.iso2 === formData.currentLocation.state)?.name || '';
      const preferredState = states.find(s => s.iso2 === formData.preferredLocation.state)?.name || '';

      console.log('Location data after processing:', {
        currentState,
        currentDistrict: formData.currentLocation.districtName,
        preferredState,
        preferredDistrict: formData.preferredLocation.districtName
      });

      // Check for duplicate candidate
      const checkDuplicateResponse = await axiosInstance.post('/api/candidates/check-duplicate', {
        email: formData.email,
        phone: formData.phone,
        name: formData.name
      });

      if (checkDuplicateResponse.data.isDuplicate) {
        toast.error(checkDuplicateResponse.data.message || 'Candidate already exists');
        setLoading(false);
        return;
      }

      // Handle resume upload if present
      let resumeUrl = '';
      if (resume) {
        const formData = new FormData();
        formData.append('file', resume);

        const uploadResponse = await axiosInstance.post('/api/upload/resume', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        resumeUrl = uploadResponse.data.url;
      }

      // Prepare candidate data
      const candidateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        experience: formData.experience,
        current_company: formData.currentCompany,
        current_ctc: formData.currentCTC,
        expected_ctc: formData.expectedCTC,
        notice_period: formData.noticePeriod,
        current_location: formData.currentLocation.districtName ?
          `${currentState}, ${formData.currentLocation.districtName}` :
          currentState,
        preferred_location: formData.preferredLocation.districtName ?
          `${preferredState}, ${formData.preferredLocation.districtName}` :
          preferredState,
        job_id: parseInt(formData.jobId),
        job_answers: formData.job_answers,
        rejection_reason: formData.rejection_reason,
        rejection_details: formData.rejection_details,
        notes: formData.notes,
        source: formData.source,
        referred_by: formData.referred_by,
        resume_url: resumeUrl || formData.resumeUrl,
        created_by: state?.user?.username || '',
        created_by_id: state?.user?.user_id || null,
      };

      console.log('Final candidate data:', candidateData);

      // Create candidate
      await axiosInstance.post('/api/candidates', candidateData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      toast.success('Candidate added successfully');
      navigate('/employee/recruitments/candidates');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to save candidate');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'jobId') {
      const job = jobs.find(j => j.id === parseInt(value));
      setSelectedJob(job);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        answers: {}
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const data = [
        {
          name: 'MOHAMMAD',
          email: 'yuyunybb8y7n5yy87777hyybun@grmail.com',
          phone: '75776753378709',
          experience: '45',
          current_location: 'Bangalore',
          preferred_location: 'Bangalore',
          current_ctc: '200000',
          expected_ctc: '300000',
          current_company: 'TCS',
          notice_period: '20',
          source: 'Indeed',
          referred_by: '',
          notes: 'dsdaf',
          resume_url: '',
          job_id: 2,
          created_by: 'admin',
          created_by_id: 'a123',
          rejection_reason: '',
          rejection_details: {
            reason: '',
            stage: '',
            rejected_by: 'admin',
            rejected_at: null,
            comments: ''
          },
          job_answers: {
            'How Many experiebce injave': '10 yesr'
          }
        }
      ];

      const success = await downloadCandidateTemplate({ data1: data, fileName: "candidate-upload-template" });

      if (success) {
        toast.success('Template downloaded successfully');
      } else {
        toast.error('Failed to download template');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Error downloading template');
    }
  };

  const convertExcelToJson = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.includes('spreadsheet') || file.type.includes('excel')) {
        setSelectedFile(file);
      } else {
        toast.error('Please upload only Excel files (.xlsx, .xls)');
        event.target.value = '';
      }
    }
  };

  const handleResumeZipChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/zip' || file.type === 'application/x-zip-compressed') {
        setResumeZipFile(file);
      } else {
        toast.error('Please upload only ZIP files');
        event.target.value = '';
      }
    }
  };

  const handleBulkUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile || !resumeZipFile) {
      toast.error('Please upload both Excel and ZIP files');
      return;
    }

    setUploadStatus(prev => ({
      ...prev,
      isUploading: true,
      candidates: { total: 0, success: 0, failed: 0 },
      resumes: { total: 0, success: 0, notFound: 0, failed: 0 },
      currentResume: '',
      missingResumes: [],
      candidateStatus: []
    }));

    const loadingToast = toast.loading('Processing candidates...');

    try {
      // Convert Excel to JSON
      const excelData = await convertExcelToJson(selectedFile);

      if (!excelData || excelData.length === 0) {
        toast.error('No data found in the Excel file');
        setUploadStatus(prev => ({ ...prev, isUploading: false }));
        return;
      }

      // Process and validate the data
      const processedCandidates = excelData.map(row => ({
        name: row.Name || row.name,
        email: (row.Email || row.email)?.toString().toLowerCase().trim(),
        phone: (row.Phone || row.phone)?.toString().trim(),
        experience: parseFloat(row.Experience || row.experience) || 0,
        current_company: row.Current_Company || row.current_company,
        current_ctc: parseFloat(row.Current_CTC || row.current_ctc) || 0,
        expected_ctc: parseFloat(row.Expected_CTC || row.expected_ctc) || 0,
        notice_period: parseInt(row.Notice_Period || row.notice_period) || 0,
        current_location: row.Current_Location || row.current_location,
        preferred_location: row.Preferred_Location || row.preferred_location,
        status: (row.Status || row.status || 'applied').toLowerCase(),
        source: row.Source || row.source || 'Direct',
        referred_by: row.Referred_By || row.referred_by,
        job_id: row.Job_ID || row.job_id
      }));

      // Validate required fields
      const validCandidates = processedCandidates.filter(candidate =>
        candidate.name &&
        candidate.email &&
        candidate.phone
      );

      if (validCandidates.length === 0) {
        toast.error('No valid candidates found in the file');
        setUploadStatus(prev => ({ ...prev, isUploading: false }));
        return;
      }

      // Initialize candidate status
      setUploadStatus(prev => ({
        ...prev,
        candidates: { ...prev.candidates, total: validCandidates.length },
        candidateStatus: validCandidates.map(candidate => ({
          name: candidate.name,
          status: 'pending',
          file: null,
          message: 'Waiting to process...'
        }))
      }));

      // Send to backend
      const response = await axiosInstance.post('/api/candidates/bulk-upload', {
        candidates: validCandidates,
        created_by: state?.user?.username,
        created_by_id: state?.user?.user_id
      });

      toast.dismiss(loadingToast);

      if (response.data.success) {
        // Update candidate upload status
        setUploadStatus(prev => ({
          ...prev,
          candidates: {
            ...prev.candidates,
            success: response.data.results.success.length,
            failed: response.data.results.errors.length
          }
        }));

        // Process resumes from zip file
        if (resumeZipFile && response.data.results.success.length > 0) {
          toast.loading('Processing resumes from zip file...', { id: loadingToast });
          try {
            const JSZip = (await import('jszip')).default;
            const zip = await JSZip.loadAsync(resumeZipFile);

            // Update total resumes to process
            setUploadStatus(prev => ({
              ...prev,
              resumes: { ...prev.resumes, total: response.data.results.success.length }
            }));

            // Process resumes one by one
            for (const candidate of response.data.results.success) {
              const candidateName = candidate.name.toLowerCase().split(' ')[0];
              const candidateFullName = candidate.name.toLowerCase().replace(/\s+/g, '_');

              // Update candidate status to processing
              setUploadStatus(prev => {
                const newStatus = prev.candidateStatus.map(status =>
                  status.name === candidate.name
                    ? { ...status, status: 'processing', message: 'Looking for matching resume...' }
                    : status
                );
                return {
                  ...prev,
                  candidateStatus: newStatus
                };
              });

              // Find matching file
              const matchingFile = Object.keys(zip.files).find(filename => {
                const fileName = filename.toLowerCase().split('/').pop().replace(/\.[^/.]+$/, '');
                const cleanFileName = fileName.replace(/[^a-z]/g, '');
                const cleanCandidateName = candidateName.replace(/[^a-z]/g, '');
                const cleanCandidateFullName = candidateFullName.replace(/[^a-z]/g, '');

                return !zip.files[filename].dir && (
                  fileName === candidateName ||
                  fileName === candidateFullName ||
                  cleanFileName === cleanCandidateName ||
                  cleanFileName === cleanCandidateFullName ||
                  cleanFileName.includes(cleanCandidateName) ||
                  cleanCandidateName.includes(cleanFileName) ||
                  cleanFileName.startsWith(cleanCandidateName) ||
                  cleanCandidateName.startsWith(cleanFileName)
                );
              });

              if (matchingFile) {
                // Update status to uploading
                setUploadStatus(prev => {
                  const newStatus = prev.candidateStatus.map(status =>
                    status.name === candidate.name
                      ? { ...status, status: 'uploading', file: matchingFile, message: 'Uploading resume...' }
                      : status
                  );
                  return {
                    ...prev,
                    candidateStatus: newStatus
                  };
                });

                try {
                  const file = zip.files[matchingFile];
                  const arrayBuffer = await file.async('arraybuffer');
                  const resumeFile = new File([arrayBuffer], matchingFile.split('/').pop(), {
                    type: 'application/pdf'
                  });

                  const formData = new FormData();
                  formData.append('file', resumeFile);

                  const uploadResponse = await axiosInstance.post('/api/upload/resume', formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                  });

                  await axiosInstance.patch(`/api/candidates/${candidate.id}`, {
                    resume_url: uploadResponse.data.url
                  });

                  setUploadStatus(prev => {
                    const newStatus = prev.candidateStatus.map(status =>
                      status.name === candidate.name
                        ? { ...status, status: 'success', message: 'Resume uploaded successfully' }
                        : status
                    );
                    return {
                      ...prev,
                      resumes: {
                        ...prev.resumes,
                        success: prev.resumes.success + 1
                      },
                      candidateStatus: newStatus
                    };
                  });
                } catch (error) {
                  console.error('Error uploading resume:', error);
                  setUploadStatus(prev => {
                    const newStatus = prev.candidateStatus.map(status =>
                      status.name === candidate.name
                        ? { ...status, status: 'failed', message: 'Error uploading resume' }
                        : status
                    );
                    return {
                      ...prev,
                      resumes: {
                        ...prev.resumes,
                        failed: prev.resumes.failed + 1
                      },
                      candidateStatus: newStatus
                    };
                  });
                }
              } else {
                setUploadStatus(prev => {
                  const newStatus = prev.candidateStatus.map(status =>
                    status.name === candidate.name
                      ? {
                        ...status,
                        status: 'not-found',
                        message: 'No matching resume found',
                        file: 'Not found'
                      }
                      : status
                  );
                  return {
                    ...prev,
                    resumes: {
                      ...prev.resumes,
                      notFound: prev.resumes.notFound + 1
                    },
                    candidateStatus: newStatus,
                    missingResumes: [
                      ...prev.missingResumes,
                      {
                        candidateName: candidate.name,
                        expectedPattern: `${candidateName}.pdf or ${candidateFullName}.pdf`,
                        availableFiles: Object.keys(zip.files)
                          .filter(f => !zip.files[f].dir)
                          .map(f => f.split('/').pop())
                      }
                    ]
                  };
                });
              }
            }
          } catch (error) {
            console.error('Error processing zip file:', error);
            toast.error('Failed to process some resumes from zip file');
          }
        }

        toast.dismiss(loadingToast);
        toast.success('Bulk upload completed successfully');

        // Store results and show modal
        setUploadResults(response.data.results);
        setShowResultsModal(true);

        // Clear file inputs
        setSelectedFile(null);
        setResumeZipFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        if (resumeZipInputRef.current) {
          resumeZipInputRef.current.value = '';
        }

      } else {
        toast.error(response.data.message || 'Failed to upload candidates');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to process candidates. Please try again.');
    } finally {
      setUploadStatus(prev => ({ ...prev, isUploading: false }));
    }
  };

  const handleClearForm = () => {
    setSelectedFile(null);
    setResumeZipFile(null);
    setUploadStatus(prev => ({
      ...prev,
      isUploading: false,
      currentResume: '',
      missingResumes: [],
      candidateStatus: []
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (resumeZipInputRef.current) {
      resumeZipInputRef.current.value = '';
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload only PDF or Word documents');
        e.target.value = '';
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        e.target.value = '';
        return;
      }

      setResume(file);
      toast.success('Resume selected successfully');
    }
  };

  return (
    <>
      <DefaultLayoutEmployee>
        <BreadcrumbPegawai pageName="Add Candidate" />

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <Tab.Group>
            <Tab.List className="flex border-b border-stroke dark:border-strokedark">
              <Tab
                className={({ selected }) =>
                  `w-full py-4 text-sm font-medium outline-none ${selected
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-600 hover:text-primary'
                  }`
                }
              >
                Single Upload
              </Tab>
              <Tab
                className={({ selected }) =>
                  `w-full py-4 text-sm font-medium outline-none ${selected
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-600 hover:text-primary'
                  }`
                }
              >
                Bulk Upload
              </Tab>
            </Tab.List>

            <Tab.Panels>
              <Tab.Panel>
                <form onSubmit={handleSubmit} className="p-6.5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="mb-2.5 block text-black dark:text-white">
                        <FaUser className="inline mr-2" />
                        Full Name <span className="text-meta-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter full name"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="mb-2.5 block text-black dark:text-white">
                        <FaEnvelope className="inline mr-2" />
                        Email <span className="text-meta-1">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter email"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="mb-2.5 block text-black dark:text-white">
                        <FaPhoneAlt className="inline mr-2" />
                        Phone <span className="text-meta-1">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="Enter phone number"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="mb-2.5 block text-black dark:text-white">
                        <FaBriefcase className="inline mr-2" />
                        Experience (years) <span className="text-meta-1">*</span>
                      </label>
                      <input
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        required
                        step="0.1"
                        min="0"
                        placeholder="Enter years of experience"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="mb-2.5 block text-black dark:text-white">
                        <FaBuilding className="inline mr-2" />
                        Current Company
                      </label>
                      <input
                        type="text"
                        name="currentCompany"
                        value={formData.currentCompany}
                        onChange={handleChange}
                        placeholder="Enter current company"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="mb-2.5 block text-black dark:text-white">
                        <FaRupeeSign className="inline mr-2" />
                        Current CTC (LPA)
                      </label>
                      <div className="relative">
                        <FaRupeeSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                          type="number"
                          name="currentCTC"
                          value={formData.currentCTC}
                          onChange={handleChange}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 pl-10 pr-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2.5 block text-black dark:text-white">
                        <FaRupeeSign className="inline mr-2" />
                        Expected CTC (LPA)
                      </label>
                      <div className="relative">
                        <FaRupeeSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                          type="number"
                          name="expectedCTC"
                          value={formData.expectedCTC}
                          onChange={handleChange}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 pl-10 pr-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2.5 block text-black dark:text-white">
                        <FaClock className="inline mr-2" />
                        Notice Period (days)
                      </label>
                      <input
                        type="number"
                        name="noticePeriod"
                        value={formData.noticePeriod}
                        onChange={handleChange}
                        min="0"
                        placeholder="Enter notice period"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <h3 className="text-lg text-black mb-4 flex items-center">
                        <FaMapMarkerAlt className="mr-2" />
                        Current Location
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="mb-2.5 block text-black dark:text-white">
                            State
                          </label>
                          <select
                            value={formData.currentLocation.state}
                            onChange={(e) => handleLocationChange('current', 'state', e.target.value)}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary"
                          >
                            <option value="">Select State</option>
                            {states.map(state => (
                              <option key={state.iso2} value={state.iso2}>
                                {state.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="mb-2.5 block text-black dark:text-white">
                            District
                          </label>
                          <div className="relative">
                            <select
                              value={formData.currentLocation.district}
                              onChange={(e) => handleLocationChange('current', 'district', e.target.value)}
                              disabled={!formData.currentLocation.state || currentDistrictsLoading}
                              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary"
                            >
                              <option value="">Select District</option>
                              {currentDistricts.map(district => (
                                <option key={district.id} value={district.id}>
                                  {district.name}
                                </option>
                              ))}
                            </select>
                            {currentDistrictsLoading && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <h3 className="text-lg text-black mb-4 flex items-center">
                        <FaMapMarkerAlt className="mr-2" />
                        Preferred Location
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="mb-2.5 block text-black dark:text-white">
                            State
                          </label>
                          <select
                            value={formData.preferredLocation.state}
                            onChange={(e) => handleLocationChange('preferred', 'state', e.target.value)}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary"
                          >
                            <option value="">Select State</option>
                            {states.map(state => (
                              <option key={state.iso2} value={state.iso2}>
                                {state.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="mb-2.5 block text-black dark:text-white">
                            District
                          </label>
                          <div className="relative">
                            <select
                              value={formData.preferredLocation.district}
                              onChange={(e) => handleLocationChange('preferred', 'district', e.target.value)}
                              disabled={!formData.preferredLocation.state || preferredDistrictsLoading}
                              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary"
                            >
                              <option value="">Select District</option>
                              {preferredDistricts.map(district => (
                                <option key={district.id} value={district.id}>
                                  {district.name}
                                </option>
                              ))}
                            </select>
                            {preferredDistrictsLoading && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2.5 block text-black dark:text-white text-sm">
                        <FaBriefcase className="inline mr-2" />
                        Job Position <span className="text-meta-1">*</span>
                      </label>
                      <select
                        name="jobId"
                        value={formData.jobId}
                        onChange={handleChange}
                        required
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      >
                        <option value="">Select Job Position</option>
                        {jobs.map(job => (
                          <option key={job.id} value={job.id}>
                            {job.title} - {job.type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedJob && (
                      <div className="md:col-span-2 mt-4 border-t border-stroke pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="font-semibold mb-2">Required Skills:</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedJob.skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Experience Range:</h4>
                            <p className="text-gray-600">
                              {selectedJob.experienceRange[0]} - {selectedJob.experienceRange[1]} years
                            </p>
                          </div>
                        </div>

                        {selectedJob.questions && selectedJob.questions.length > 0 && (
                          <div className="md:col-span-2 mt-4 border-t border-stroke pt-4">
                            <h4 className="font-semibold mb-4">Job-Specific Questions:</h4>
                            <div className="space-y-4">
                              {selectedJob.questions.map((question, index) => (
                                <div key={index} className="border border-stroke rounded-lg p-4 bg-white dark:bg-boxdark">
                                  <label className="block text-black dark:text-white mb-2">
                                    {question} <span className="text-meta-1">*</span>
                                  </label>
                                  <textarea
                                    name={`job_answer_${index}`}
                                    value={formData.job_answers[question] || ''}
                                    onChange={(e) => {
                                      setFormData(prev => ({
                                        ...prev,
                                        job_answers: {
                                          ...prev.job_answers,
                                          [question]: e.target.value
                                        }
                                      }));
                                    }}
                                    required
                                    placeholder="Enter your answer..."
                                    rows="3"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="mb-2.5 block text-black dark:text-white">
                        <FaFileUpload className="inline mr-2" />
                        Resume Upload
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeUpload}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                      {resume && (
                        <p className="mt-2 text-sm text-success">
                          Selected file: {resume.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2.5 block text-black dark:text-white text-sm">
                        <FaUserFriends className="inline mr-2" />
                        Source
                      </label>
                      <select
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      >
                        {sourceOptions.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    {formData.source === 'Referral' && (
                      <div>
                        <label className="mb-2.5 block text-black dark:text-white text-sm">
                          <FaUserFriends className="inline mr-2" />
                          Referred By
                        </label>
                        <input
                          type="text"
                          name="referred_by"
                          value={formData.referred_by}
                          onChange={handleChange}
                          placeholder="Enter referrer name"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                      </div>
                    )}

                    <div className="md:col-span-2">
                      <label className="mb-2.5 block text-black dark:text-white text-sm">
                        <FaComments className="inline mr-2" />
                        Notes
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Add any notes about the candidate..."
                        rows="3"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4.5 mt-6">
                    <button
                      type="button"
                      onClick={() => navigate('/employee/recruitments/candidates')}
                      className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-95 disabled:bg-opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              </Tab.Panel>

              <Tab.Panel>
                <div className="p-6.5">
                  <div className="mb-6">
                    <h4 className="text-xl font-semibold mb-4">Bulk Upload Candidates</h4>
                    <div className="flex items-center gap-4 mb-6">
                      <button
                        onClick={handleDownloadTemplate}
                        className="flex items-center gap-2 text-primary hover:text-primary/80"
                      >
                        <FaDownload /> Download Template
                      </button>
                      <p className="text-sm text-gray-500">
                        Download the template file, fill in the candidate details, and upload it back
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <label className="mb-2.5 block font-medium text-black dark:text-white">
                            Bulk Upload Candidates
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              accept=".xlsx,.xls"
                              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            />
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            Upload Excel file (.xlsx, .xls) with candidate details
                          </p>
                        </div>

                        <div className="flex-1">
                          <label className="mb-2.5 block font-medium text-black dark:text-white">
                            Upload Resumes (ZIP)
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              ref={resumeZipInputRef}
                              onChange={handleResumeZipChange}
                              accept=".zip"
                              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            />
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            Upload ZIP file containing resumes. Resumes should be named with candidate's first name.
                          </p>
                        </div>

                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={handleBulkUpload}
                            disabled={!selectedFile || !resumeZipFile || uploadStatus.isUploading || uploadStatus.candidates.total > 0}
                            className={`inline-flex items-center justify-center rounded-md bg-primary py-3 px-6 text-center font-medium text-white hover:bg-opacity-90 ${(!selectedFile || !resumeZipFile || uploadStatus.isUploading || uploadStatus.candidates.total > 0)
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                              }`}
                          >
                            <FaUpload className="mr-2" />
                            {uploadStatus.isUploading ? 'Uploading...' : 'Upload'}
                          </button>
                          {uploadStatus.candidates.total > 0 && (
                            <button
                              type="button"
                              onClick={handleClearForm}
                              className="ml-4 inline-flex items-center justify-center rounded-md bg-gray-500 py-3 px-6 text-center font-medium text-white hover:bg-opacity-90"
                            >
                              <FaTimes className="mr-2" />
                              Clear Results
                            </button>
                          )}
                        </div>
                      </div>

                      {(uploadStatus.candidates.total > 0 || uploadStatus.isUploading) && (
                        <div className="mt-6">
                          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <div className="py-6 px-4 md:px-6 xl:px-7.5">
                              <h4 className="text-xl font-semibold text-black dark:text-white">
                                Resume Upload Status
                              </h4>
                            </div>

                            <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                              <div className="col-span-2 flex items-center">
                                <p className="font-medium">Candidate Name</p>
                              </div>
                              <div className="col-span-2 flex items-center">
                                <p className="font-medium">Status</p>
                              </div>
                              <div className="col-span-2 flex items-center">
                                <p className="font-medium">File</p>
                              </div>
                              <div className="col-span-2 flex items-center">
                                <p className="font-medium">Message</p>
                              </div>
                            </div>

                            {uploadStatus.candidateStatus.map((status, index) => (
                              <div key={index} className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                                <div className="col-span-2 flex items-center">
                                  <p className="text-sm text-black dark:text-white">{status.name}</p>
                                </div>
                                <div className="col-span-2 flex items-center">
                                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${status.status === 'success' ? 'bg-success/10 text-success' :
                                    status.status === 'failed' ? 'bg-danger/10 text-danger' :
                                      status.status === 'not-found' ? 'bg-warning/10 text-warning' :
                                        status.status === 'processing' || status.status === 'uploading' ? 'bg-primary/10 text-primary' :
                                          'bg-gray-100 text-gray-600'
                                    }`}>
                                    {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                                  </span>
                                </div>
                                <div className="col-span-2 flex items-center">
                                  <p className="text-sm text-gray-500">{status.file || '-'}</p>
                                </div>
                                <div className="col-span-2 flex items-center">
                                  <p className="text-sm text-gray-500">{status.message}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </DefaultLayoutEmployee>

      <BulkUploadResultsModal
        isOpen={showResultsModal}
        onClose={() => setShowResultsModal(false)}
        results={uploadResults || { success: [], duplicates: [], errors: [] }}
      />

      {uploadStatus.missingResumes.length > 0 && (
        <div className="mt-6">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="py-6 px-4 md:px-6 xl:px-7.5">
              <h4 className="text-xl font-semibold text-black dark:text-white">
                Missing Resumes
              </h4>
              <p className="text-sm text-gray-500 mt-2">
                The following candidates' resumes were not found in the ZIP file:
              </p>
            </div>

            <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
              <div className="col-span-2 flex items-center">
                <p className="font-medium">Candidate Name</p>
              </div>
              <div className="col-span-2 flex items-center">
                <p className="font-medium">Expected Filename</p>
              </div>
              <div className="col-span-2 flex items-center">
                <p className="font-medium">Available Files</p>
              </div>
            </div>

            {uploadStatus.missingResumes.map((item, index) => (
              <div key={index} className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                <div className="col-span-2 flex items-center">
                  <p className="text-sm text-black dark:text-white">{item.candidateName}</p>
                </div>
                <div className="col-span-2 flex items-center">
                  <p className="text-sm text-meta-1">{item.expectedPattern}</p>
                </div>
                <div className="col-span-2 flex items-center">
                  <p className="text-sm text-gray-500">
                    {item.availableFiles.join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default CandidateForm; 