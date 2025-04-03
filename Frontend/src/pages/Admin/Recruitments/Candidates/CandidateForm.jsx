import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin } from '../../../../components';
import { FaArrowLeft, FaRupeeSign, FaFileUpload, FaDownload, FaBuilding, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaUser, FaBriefcase, FaClock, FaComments, FaUserFriends } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../../../../context/AuthContext';
import { Tab } from '@headlessui/react';
import { downloadCandidateTemplate } from '../../../../utils/excelTemplates';

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
  });
  const [selectedTab, setSelectedTab] = useState('single');
  const [bulkFile, setBulkFile] = useState(null);
  const [resume, setResume] = useState(null);

  const sourceOptions = [
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
      notes: formData.notes,
      source: formData.source,
      referred_by: formData.referred_by,
      resume_url: formData.resumeUrl
    };

    try {
      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(candidateData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || 'Failed to create candidate');
      }

      toast.success('Candidate added successfully');
      navigate('/admin/recruitments/candidates');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDownloadTemplate = async () => {
    try {
      const data = [
        { Code: 'CAND001', 'First Name': 'John', 'Last Name': 'Doe', Email: 'john.doe@email.com', Mobile: '1234567890', 'Job Title': 'Software Engineer', Experience: '5', State: 'Karnataka', City: 'Bangalore', 'Expected Salary': '10', 'Current Salary': '8', Resume: 'john_resume.pdf', Source: 'Direct', Status: 'Applied' }
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

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (!bulkFile) {
      toast.error('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', bulkFile);

    try {
      const response = await fetch('/api/candidates/bulk-upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Failed to upload candidates');
      toast.success('Candidates uploaded successfully');
      navigate('/admin/recruitments/candidates');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file);
      // You can also upload to cloud storage here and set the URL
      // For now, we'll just store the file object
    }
  };

  return (
    <DefaultLayoutAdmin>
      <div className="mx-auto max-w-screen-2xl  ">
        <div className="flex justify-between items-center mb-6">
          <BreadcrumbAdmin pageName="Add Candidate" />
          <button
            onClick={() => navigate('/admin/recruitments/candidates')}
            className="flex items-center gap-2 text-primary hover:text-primary/80"
          >
            <FaArrowLeft /> Back to Candidates
          </button>
        </div>

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

                    <div>
                      <label className="mb-2.5 block text-black dark:text-white">
                        <FaFileUpload className="inline mr-2" />
                        Resume Upload
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleResumeUpload}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                      </div>
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

                    <div className="border-2 border-dashed border-stroke p-6 text-center rounded-lg">
                      <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) => setBulkFile(e.target.files[0])}
                        className="hidden"
                        id="bulk-upload"
                      />
                      <label
                        htmlFor="bulk-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <FaFileUpload className="w-12 h-12 text-primary" />
                        <span className="text-sm text-gray-500">
                          Click to upload or drag and drop
                        </span>
                        <span className="text-xs text-gray-400">
                          Excel files only (*.xlsx, *.xls)
                        </span>
                      </label>
                      {bulkFile && (
                        <p className="mt-4 text-sm text-success">
                          Selected file: {bulkFile.name}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end mt-6">
                      <button
                        onClick={handleBulkUpload}
                        disabled={!bulkFile}
                        className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-70"
                      >
                        Upload Candidates
                      </button>
                    </div>
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </DefaultLayoutAdmin>
  );
};

export default CandidateForm;