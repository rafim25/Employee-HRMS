import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin } from '../../../../components';
import { FaArrowLeft, FaRupeeSign, FaFileUpload, FaDownload, FaBuilding, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaUser, FaBriefcase, FaClock, FaComments, FaUserFriends, FaUpload } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../../../../context/AuthContext';
import { Tab } from '@headlessui/react';
import { downloadCandidateTemplate } from '../../../../utils/excelTemplates';
import { api } from '../../../../services/api';
import * as XLSX from 'xlsx';
import BulkUploadResultsModal from '../../../../components/molecules/Modal/BulkUploadResultsModal';

const CandidateForm = () => {
  const navigate = useNavigate();
  const { dispatch, state } = useAuth();
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    currentCompany: '',
    currentCTC: '',
    expectedCTC: '',
    noticePeriod: '',
    currentLocation: '',
    preferredLocation: '',
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
  const fileInputRef = useRef(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [uploadResults, setUploadResults] = useState(null);

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
        const response = await fetch('/api/jobs', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch jobs');
        const data = await response.json();
        console.log('Fetched jobs:', data); // Debug log
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast.error('Failed to load jobs');
      }
    };

    fetchJobs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First check if candidate already exists
      const checkDuplicateResponse = await fetch('/api/candidates/check-duplicate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          name: formData.name
        })
      });

      const duplicateData = await checkDuplicateResponse.json();

      if (duplicateData.isDuplicate) {
        toast.error(duplicateData.message || 'Candidate already exists');
        setLoading(false);
        return;
      }

      // If no duplicate, proceed with resume upload
      let resumeUrl = '';
      if (resume) {
        const formData = new FormData();
        formData.append('file', resume);

        const uploadResponse = await fetch('/api/upload/resume', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload resume');
        }

        const uploadResult = await uploadResponse.json();
        resumeUrl = uploadResult.url;
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
        current_location: formData.currentLocation,
        preferred_location: formData.preferredLocation,
        job_id: parseInt(formData.jobId),
        job_answers: formData.job_answers,
        rejection_reason: formData.rejection_reason,
        rejection_details: {
          ...formData.rejection_details,
          rejected_by: state?.user?.username || '',
          rejected_at: formData.rejection_reason ? new Date().toISOString() : null
        },
        notes: formData.notes,
        source: formData.source,
        referred_by: formData.referred_by,
        resume_url: resumeUrl,
        created_by: state?.user?.username || '',
        created_by_id: state?.user?.user_id || null,
      };

      // Create candidate
      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(candidateData)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to create candidate');
      }

      toast.success('Candidate added successfully');
      navigate('/admin/recruitments/candidates');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to save candidate');

      // If there was an error and we uploaded a resume, we should clean it up
      // You'll need to implement this endpoint
      if (resumeUrl) {
        try {
          await fetch(`/api/upload/resume/${encodeURIComponent(resumeUrl)}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
        } catch (cleanupError) {
          console.error('Failed to cleanup uploaded resume:', cleanupError);
        }
      }
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
    } else if (name.startsWith('question_')) {
      setFormData(prev => ({
        ...prev,
        answers: {
          ...prev.answers,
          [name.replace('question_', '')]: value
        }
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
          name: 'MOHAMMAD RAFEErrrr RAFEE',
          email: 'mrafee1910rr9rr@grmail.com',
          phone: '78990834334490',
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
        console.log("✅ Success message should print now!");
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

  const handleBulkUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    const loadingToast = toast.loading('Processing candidates...');

    try {
      // Convert Excel to JSON
      const excelData = await convertExcelToJson(selectedFile);

      if (!excelData || excelData.length === 0) {
        toast.error('No data found in the Excel file');
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
        return;
      }

      // Send to backend
      const response = await fetch('/api/candidates/bulk-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          candidates: validCandidates,
          created_by: state?.user?.username,
          created_by_id: state?.user?.user_id
        })
      });

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (data.success) {
        // Show success message
        toast.success(data.message);

        // Store results and show modal
        setUploadResults(data.results);
        setShowResultsModal(true);

        // Reset form
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        toast.error(data.message || 'Failed to upload candidates');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Upload error:', error);
      toast.error('Failed to process candidates. Please try again.');
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
      <DefaultLayoutAdmin>
        <BreadcrumbAdmin pageName="Add Candidate" icon={FaUser} />
        <div className="mx-auto max-w-screen-2xl  ">
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
                  <form onSubmit={handleSubmit} encType="multipart/form-data" className="p-6.5">
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

                      <div>
                        <label className="mb-2.5 block text-black dark:text-white">
                          <FaMapMarkerAlt className="inline mr-2" />
                          Current Location
                        </label>
                        <input
                          type="text"
                          name="currentLocation"
                          value={formData.currentLocation}
                          onChange={handleChange}
                          placeholder="Enter current location"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="mb-2.5 block text-black dark:text-white">
                          <FaMapMarkerAlt className="inline mr-2" />
                          Preferred Location
                        </label>
                        <input
                          type="text"
                          name="preferredLocation"
                          value={formData.preferredLocation}
                          onChange={handleChange}
                          placeholder="Enter preferred location"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
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

                      <div>
                        <label className="mb-2.5 block text-black dark:text-white text-sm">
                          <FaUser className="inline mr-2" />
                          Created By
                        </label>
                        <input
                          type="text"
                          name="created_by"
                          value={state?.user?.username || 'N/A'}
                          disabled
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 font-medium outline-none transition disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-form-strokedark dark:bg-form-input"
                        />
                      </div>

                      <div className="md:col-span-2 mt-4">
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

                    <div className="flex justify-end gap-4 mt-6">
                      <button
                        type="button"
                        onClick={() => navigate('/admin/recruitments/candidates')}
                        className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-70"
                      >
                        {loading ? 'Saving...' : 'Save Candidate'}
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

                      <div className="mb-4">
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
                          <button
                            type="button"
                            onClick={handleBulkUpload}
                            disabled={!selectedFile}
                            className={`inline-flex items-center justify-center rounded-md bg-primary py-3 px-6 text-center font-medium text-white hover:bg-opacity-90 ${!selectedFile ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <FaUpload className="mr-2" />
                            Upload
                          </button>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          Upload Excel file (.xlsx, .xls) with candidate details
                        </p>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </DefaultLayoutAdmin>

      <BulkUploadResultsModal
        isOpen={showResultsModal}
        onClose={() => setShowResultsModal(false)}
        results={uploadResults || { success: [], duplicates: [], errors: [] }}
      />
    </>
  );
};

export default CandidateForm;