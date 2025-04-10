import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultLayoutEmployee from '../../../../layout/DefaultLayoutPegawai';
import { BreadcrumbPegawai } from '../../../../components';
import {
  FaArrowLeft, FaRupeeSign, FaFileUpload, FaBuilding,
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaUser,
  FaBriefcase, FaClock, FaComments, FaUserFriends
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../../../../context/AuthContext';

const CandidateForm = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
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
  const [resume, setResume] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

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
      // Check for duplicate candidate
      const checkDuplicateResponse = await fetch('/api/candidates/check-duplicate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

      // Handle resume upload if present
      let resumeUrl = '';
      if (resume) {
        const formData = new FormData();
        formData.append('file', resume);

        const uploadResponse = await fetch('/api/upload/resume', {
          method: 'POST',
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
        rejection_details: formData.rejection_details,
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
        },
        body: JSON.stringify(candidateData)
      });

      if (!response.ok) {
        throw new Error('Failed to create candidate');
      }

      toast.success('Candidate added successfully');
      navigate('/employee/recruitments/candidates');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to save candidate');
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
    <DefaultLayoutEmployee>
      <BreadcrumbPegawai pageName="Add Candidate" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
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

          {selectedJob && selectedJob.questions && selectedJob.questions.length > 0 && (
            <div className="mt-6 border-t border-stroke pt-6">
              <h4 className="font-semibold mb-4">Job-Specific Questions:</h4>
              <div className="space-y-4">
                {selectedJob.questions.map((question, index) => (
                  <div key={index} className="border border-stroke rounded-lg p-4">
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
      </div>
    </DefaultLayoutEmployee>
  );
};

export default CandidateForm; 