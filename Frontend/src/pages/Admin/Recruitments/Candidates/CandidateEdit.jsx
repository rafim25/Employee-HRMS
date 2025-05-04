import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin } from '../../../../components';
import { FaRupeeSign, FaFileUpload, FaBuilding, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaUser, FaBriefcase, FaClock, FaComments, FaUserFriends, FaSave, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../../../../context/AuthContext';

const CandidateEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useAuth();
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [statesLoading, setStatesLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    current_company: '',
    current_ctc: '',
    expected_ctc: '',
    notice_period: '',
    current_location: '',
    preferred_location: '',
    status: '',
    notes: '',
    job_id: '',
    source: '',
    referred_by: '',
    resume_url: '',
    created_by: '',
    created_by_id: '',
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
  const [currentLocation, setCurrentLocation] = useState({
    state: '',
    district: '',
    city: ''
  });
  const [preferredLocation, setPreferredLocation] = useState({
    state: '',
    district: '',
    city: ''
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
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch candidate details
        const candidateResponse = await fetch(`/api/candidates/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        // Fetch jobs for dropdown
        const jobsResponse = await fetch('/api/jobs', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        // Fetch states
        const statesResponse = await fetch('/api/locations/states', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!candidateResponse.ok || !jobsResponse.ok || !statesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const candidateData = await candidateResponse.json();
        const jobsData = await jobsResponse.json();
        const statesData = await statesResponse.json();

        // Set selected job for job-specific questions
        const selectedJobData = jobsData.find(job => job.id === parseInt(candidateData.job_id));
        setSelectedJob(selectedJobData);

        // Parse location data
        const [currentState, currentDistrict] = candidateData.current_location?.split(', ') || ['', ''];
        const [preferredState, preferredDistrict] = candidateData.preferred_location?.split(', ') || ['', ''];

        setCurrentLocation({
          state: currentState,
          district: currentDistrict,
          city: ''
        });

        setPreferredLocation({
          state: preferredState,
          district: preferredDistrict,
          city: ''
        });

        setFormData({
          ...candidateData,
          job_answers: candidateData.job_answers || {},
          rejection_details: candidateData.rejection_details || {
            reason: '',
            stage: '',
            rejected_by: '',
            rejected_at: null,
            comments: ''
          }
        });
        setJobs(jobsData);
        setStates(statesData);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
        setJobsLoading(false);
        setStatesLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const fetchDistricts = async (stateCode) => {
    try {
      const response = await fetch(`/api/locations/states/${stateCode}/districts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch districts');
      const data = await response.json();
      setDistricts(data);
    } catch (error) {
      console.error('Error fetching districts:', error);
      toast.error('Failed to load districts');
    }
  };

  const handleLocationChange = (type, field, value) => {
    if (type === 'current') {
      setCurrentLocation(prev => {
        const newLocation = { ...prev, [field]: value };
        if (field === 'state') {
          fetchDistricts(value);
          newLocation.district = '';
          newLocation.city = '';
        }
        return newLocation;
      });
    } else {
      setPreferredLocation(prev => {
        const newLocation = { ...prev, [field]: value };
        if (field === 'state') {
          fetchDistricts(value);
          newLocation.district = '';
          newLocation.city = '';
        }
        return newLocation;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let resumeUrl = formData.resume_url;

      // Upload resume if a new file is selected
      if (resume) {
        const formDataFile = new FormData();
        formDataFile.append('file', resume);

        const uploadResponse = await fetch('/api/upload/resume', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formDataFile
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload resume');
        }

        const uploadResult = await uploadResponse.json();
        resumeUrl = uploadResult.url;
      }

      // Get selected state and city names
      const currentState = states.find(s => s.iso2 === currentLocation.state)?.name || '';
      const currentDistrict = districts.find(d => d.id === currentLocation.district)?.name || '';
      const preferredState = states.find(s => s.iso2 === preferredLocation.state)?.name || '';
      const preferredDistrict = districts.find(d => d.id === preferredLocation.district)?.name || '';

      // Prepare data to send
      const dataToSend = {
        ...formData,
        job_id: parseInt(formData.job_id),
        created_by: state?.user?.username || formData.created_by,
        created_by_id: state?.user?.user_id || formData.created_by_id,
        job_answers: formData.job_answers || {},
        resume_url: resumeUrl,
        current_location: `${currentState}, ${currentDistrict}`,
        preferred_location: `${preferredState}, ${preferredDistrict}`
      };

      const response = await fetch(`/api/candidates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update candidate');
      }

      toast.success('Candidate updated successfully');
      navigate('/admin/recruitments/candidates');
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update candidate');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'job_id') {
      const job = jobs.find(j => j.id === parseInt(value));
      setSelectedJob(job);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        job_answers: {}
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

  if (loading || jobsLoading || statesLoading) {
    return (
      <DefaultLayoutAdmin>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DefaultLayoutAdmin>
    );
  }

  return (
    <DefaultLayoutAdmin>
      <BreadcrumbAdmin pageName="Edit Candidate" icon={FaUser} />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form onSubmit={handleSubmit} className="p-6.5">
          <div className="mb-4.5 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Full Name <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter candidate name"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Email <span className="text-meta-1">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Phone <span className="text-meta-1">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2.5 block text-black dark:text-white">
                <FaBriefcase className="inline mr-2" />
                Job Position <span className="text-meta-1">*</span>
              </label>
              <select
                name="job_id"
                value={formData.job_id}
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
                Experience (years)
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Enter years of experience"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Current Company
              </label>
              <input
                type="text"
                name="current_company"
                value={formData.current_company}
                onChange={handleChange}
                placeholder="Enter current company"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Current CTC
              </label>
              <input
                type="number"
                name="current_ctc"
                value={formData.current_ctc}
                onChange={handleChange}
                placeholder="Enter current CTC"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Expected CTC
              </label>
              <input
                type="number"
                name="expected_ctc"
                value={formData.expected_ctc}
                onChange={handleChange}
                placeholder="Enter expected CTC"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Notice Period (days)
              </label>
              <input
                type="number"
                name="notice_period"
                value={formData.notice_period}
                onChange={handleChange}
                placeholder="Enter notice period"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            <div className="md:col-span-2">
              <h3 className="text-lg text-black mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                Current Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    State
                  </label>
                  <select
                    value={currentLocation.state}
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
                  <select
                    value={currentLocation.district}
                    onChange={(e) => handleLocationChange('current', 'district', e.target.value)}
                    disabled={!currentLocation.state}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary"
                  >
                    <option value="">Select District</option>
                    {districts.map(district => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-lg text-black mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                Preferred Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    State
                  </label>
                  <select
                    value={preferredLocation.state}
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
                  <select
                    value={preferredLocation.district}
                    onChange={(e) => handleLocationChange('preferred', 'district', e.target.value)}
                    disabled={!preferredLocation.state}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary"
                  >
                    <option value="">Select District</option>
                    {districts.map(district => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Source
              </label>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              >
                <option value="">Select Source</option>
                {sourceOptions.map(source => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>

            {formData.source === 'Referral' && (
              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Referred By
                </label>
                <input
                  type="text"
                  name="referred_by"
                  value={formData.referred_by}
                  onChange={handleChange}
                  placeholder="Enter referrer name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
            )}

            {selectedJob && selectedJob.questions && selectedJob.questions.length > 0 && (
              <div className="md:col-span-2 mt-4 border-t border-stroke pt-4">
                <h4 className="font-semibold mb-4">Job-Specific Questions:</h4>
                <div className="space-y-4">
                  {selectedJob.questions.map((question, index) => (
                    <div key={index} className="border border-stroke rounded-lg p-4 bg-white dark:bg-boxdark">
                      <label className="block text-black dark:text-white mb-2">
                        {question} <span className="text-meta-1">*</span>
                      </label>
                      <textarea
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
                        rows="3"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="md:col-span-2">
              <label className="mb-2.5 block text-black dark:text-white">
                <FaFileUpload className="inline mr-2" />
                Resume
              </label>
              <div className="flex flex-col gap-4">
                {formData.resume_url && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Current Resume:</span>
                    <a
                      href={formData.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-2"
                      onClick={(e) => {
                        e.preventDefault();
                        if (formData.resume_url.startsWith('http')) {
                          window.open(formData.resume_url, '_blank');
                        } else {
                          toast.error('Invalid resume URL');
                        }
                      }}
                    >
                      <FaFileUpload /> View Current Resume
                    </a>
                  </div>
                )}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                {resume && (
                  <p className="mt-2 text-sm text-success">
                    Selected new file: {resume.name}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  Supported formats: PDF, DOC, DOCX (Max size: 5MB)
                </p>
              </div>
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                <FaUser className="inline mr-2" />
                Created By
              </label>
              <input
                type="text"
                value={formData.created_by || 'N/A'}
                disabled
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-form-strokedark dark:bg-form-input"
              />
            </div>

            {formData.status === 'rejected' && (
              <div className="md:col-span-2 border border-stroke rounded-lg p-4">
                <h4 className="font-semibold mb-4">Rejection Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2.5 block text-black dark:text-white">
                      Rejection Reason
                    </label>
                    <input
                      type="text"
                      value={formData.rejection_details.reason || ''}
                      disabled
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-form-strokedark dark:bg-form-input"
                    />
                  </div>
                  <div>
                    <label className="mb-2.5 block text-black dark:text-white">
                      Rejected At Stage
                    </label>
                    <input
                      type="text"
                      value={formData.rejection_details.stage || ''}
                      disabled
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-form-strokedark dark:bg-form-input"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Rejection Comments
                    </label>
                    <textarea
                      value={formData.rejection_details.comments || ''}
                      disabled
                      rows="3"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-form-strokedark dark:bg-form-input"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="mb-2.5 block text-black dark:text-white">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={6}
              placeholder="Enter any additional notes"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div className="flex gap-4 justify-end mt-6">
            <button
              type="button"
              onClick={() => navigate('/admin/recruitments/candidates')}
              className="flex items-center justify-center gap-2 rounded border border-stroke py-3 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            >
              <FaTimes /> Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded bg-primary py-3 px-6 font-medium text-white hover:bg-opacity-90"
            >
              <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </DefaultLayoutAdmin>
  );
};

export default CandidateEdit; 