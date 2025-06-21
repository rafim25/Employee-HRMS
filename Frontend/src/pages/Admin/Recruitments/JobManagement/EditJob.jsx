import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { fetchJobById, updateJob } from '../../../../context/actions/jobActions';
import { toast } from 'react-hot-toast';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin } from '../../../../components';
import Select from 'react-select';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  FaBriefcase, FaMapMarkerAlt, FaDollarSign, FaInfoCircle,
  FaUser, FaQuestionCircle, FaTrash, FaArrowLeft, FaSave,
  FaTimes, FaCalendarAlt, FaGraduationCap, FaBuilding, FaPlus,
  FaRupeeSign, FaFileUpload, FaPhoneAlt, FaEnvelope, FaUserFriends
} from 'react-icons/fa';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import axios from 'axios';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch, state } = useAuth();
  const [loading, setLoading] = useState(true);
  const [skillOptions, setSkillOptions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const initialLoadRef = useRef(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [jobData, setJobData] = useState({
    title: '',
    type: '',
    description: '',
    questions: [],
    state: '',
    city: '',
    minSalary: '',
    maxSalary: '',
    deadline: null,
    experienceRange: [0, 10],
    interviewRounds: [],
    clientName: '',
    clientEmail: '',
    clientLocation: '',
    skills: [],
    status: 'draft',
    editable_by: [],
  });

  // Fetch skills, states, and users on component mount
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get('/api/skills', {
          withCredentials: true
        });

        // Remove duplicates using Set and create unique skills list
        const uniqueSkills = [...new Set(response.data.map(skill => skill.name))];

        // Create options list with unique values
        const skillsList = uniqueSkills.map(skill => ({
          value: skill,
          label: skill
        })).sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically

        setSkillOptions(skillsList);
      } catch (error) {
        console.error('Error fetching skills:', error);
        toast.error('Failed to load skills');
      }
    };

    const fetchStates = async () => {
      try {
        const response = await fetch('/api/locations/states', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch states');
        const data = await response.json();
        setStates(data);
      } catch (error) {
        console.error('Error fetching states:', error);
        toast.error('Failed to load states');
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users', {
          withCredentials: true
        });
        const usersList = response.data.map(user => ({
          value: user.user_id,
          label: user.username
        })).sort((a, b) => a.label.localeCompare(b.label));
        setUserOptions(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      }
    };

    fetchSkills();
    fetchStates();
    fetchUsers();
  }, []);

  const fetchDistricts = async (stateCode) => {
    setLoadingDistricts(true);
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
      setDistricts([]); // Set empty array on error
    } finally {
      setLoadingDistricts(false);
    }
  };

  const handleLocationChange = (field, value) => {
    console.log('handleLocationChange called:', { field, value, currentState: jobData.state, currentCity: jobData.city });

    if (field === 'state') {
      // Only reset city if this is a genuine user change (not during initial load)
      if (!initialLoadRef.current && jobData.state !== value) {
        console.log('User manually changed state, resetting city');
        fetchDistricts(value);
        setJobData(prev => ({
          ...prev,
          state: value,
          city: ''
        }));
      } else {
        console.log('Not a user change, preserving city');
        setJobData(prev => ({
          ...prev,
          state: value
        }));
      }
    } else if (field === 'city') {
      setJobData(prev => ({
        ...prev,
        city: value
      }));
    } else {
      setJobData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Load job data
  useEffect(() => {
    const loadJob = async () => {
      const loadingToast = toast.loading('Loading job details...');
      try {
        const jobDetails = await fetchJobById(dispatch, id);
        if (jobDetails) {
          // Convert date string to Date object if it exists
          const deadline = jobDetails.deadline ? new Date(jobDetails.deadline) : null;

          // Set job data directly without triggering handleLocationChange
          setJobData({
            ...jobDetails,
            deadline,
            questions: jobDetails.questions || [],
            experienceRange: jobDetails.experienceRange || [0, 10],
            interviewRounds: jobDetails.interviewRounds || [],
            skills: jobDetails.skills || [],
            editable_by: jobDetails.editable_by || [],
          });

          // If job has a state, fetch districts for that state after setting data
          if (jobDetails.state) {
            setTimeout(() => {
              fetchDistricts(jobDetails.state);
            }, 100);
          }

          toast.success('Job details loaded', { id: loadingToast });
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        toast.error('Failed to load job details', { id: loadingToast });
        navigate('/admin/recruitments/job-management');
      } finally {
        setLoading(false);
        setIsInitialLoad(false); // Mark initial load as complete
        // Use timeout to ensure all state updates are complete
        setTimeout(() => {
          initialLoadRef.current = false;
          console.log('Initial load completed, user interactions now allowed');
        }, 500);
      }
    };
    loadJob();
  }, [id, dispatch, navigate]);

  // Debug useEffect to monitor jobData changes
  useEffect(() => {
    console.log('jobData changed:', { state: jobData.state, city: jobData.city, isInitialLoad: initialLoadRef.current });
  }, [jobData.state, jobData.city]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setJobData(prev => ({
      ...prev,
      deadline: date
    }));
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...jobData.questions];
    newQuestions[index] = value;
    setJobData(prev => ({
      ...prev,
      questions: newQuestions
    }));
  };

  const handleDeleteQuestion = (index) => {
    setJobData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleAddQuestion = () => {
    if (currentQuestion.trim()) {
      setJobData(prev => ({
        ...prev,
        questions: [...prev.questions.filter(q => q.trim()), currentQuestion]
      }));
      setCurrentQuestion('');
    }
  };

  const handleExperienceChange = (values) => {
    setJobData(prev => ({
      ...prev,
      experienceRange: values
    }));
  };

  const handleMultiSelectChange = (name, selectedOptions) => {
    // If no options are selected, set empty array
    if (!selectedOptions) {
      setJobData(prev => ({
        ...prev,
        [name]: []
      }));
      return;
    }

    // Create a Set to ensure uniqueness and convert back to array
    const uniqueValues = Array.from(new Set(selectedOptions.map(option => option.value)));

    setJobData(prev => ({
      ...prev,
      [name]: uniqueValues
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Updating job...');
    try {
      // Add updater information to jobData before submission
      const updatedJobData = {
        ...jobData,
        updated_by: state.user.name || state.user.username, // Use name or username from auth state
        updated_by_id: state.user.user_id // Use user_id from auth state
      };

      await updateJob(dispatch, id, updatedJobData);
      toast.success('Job updated successfully', { id: loadingToast });
      navigate('/admin/recruitments/job-management');
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error(error.response?.data?.message || 'Failed to update job', { id: loadingToast });
    }
  };

  const handleCancel = () => {
    navigate('/admin/recruitments/job-management');
  };

  const interviewOptions = [
    { value: 'Shortlisting', label: 'Shortlisting' },
    { value: 'Telephonic / Face-to-Face', label: 'Telephonic / Face-to-Face' },
    { value: 'Technical Round 1', label: 'Technical Round 1' },
    { value: 'Technical Round 2', label: 'Technical Round 2' },
    { value: 'HR Round', label: 'HR Round' },
    { value: 'Selected', label: 'Selected' },
    { value: 'Rejected', label: 'Rejected' }
  ];

  const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
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
      <BreadcrumbAdmin
        pageName="Edit Job"
        icon={FaBriefcase}
        backUrl="/admin/recruitments/job-management"
      />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form onSubmit={handleSubmit} className="p-6.5">
          {/* Job Basic Details */}
          <div className="mb-6 rounded-sm border border-stroke py-4 px-6.5 dark:border-strokedark">
            <div className="flex items-center gap-3 mb-4">
              <FaBriefcase className="text-xl text-primary" />
              <h3 className="font-medium text-black dark:text-white">
                Job Basic Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Job Title <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={jobData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter job title"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Job Type <span className="text-meta-1">*</span>
                </label>
                <select
                  name="type"
                  value={jobData.type}
                  onChange={handleChange}
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                >
                  <option value="">Select Job Type</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Description <span className="text-meta-1">*</span>
              </label>
              <textarea
                name="description"
                value={jobData.description}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Enter detailed job description"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>

          {/* Location and Salary */}
          <div className="mb-6 rounded-sm border border-stroke py-4 px-6.5 dark:border-strokedark">
            <div className="flex items-center gap-3 mb-4">
              <FaMapMarkerAlt className="text-xl text-primary" />
              <h3 className="font-medium text-black dark:text-white">
                Location & Compensation
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  State <span className="text-meta-1">*</span>
                </label>
                <select
                  name="state"
                  value={jobData.state}
                  onChange={(e) => {
                    // Only call handleLocationChange if not in initial load
                    if (!initialLoadRef.current) {
                      handleLocationChange('state', e.target.value);
                    } else {
                      // During initial load, just update the state without triggering location change logic
                      setJobData(prev => ({
                        ...prev,
                        state: e.target.value
                      }));
                    }
                  }}
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  City <span className="text-meta-1">*</span>
                </label>
                <div className="relative">
                  {loadingDistricts && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-boxdark/50 z-10">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  )}
                  <select
                    name="city"
                    value={jobData.city || ''}
                    onChange={(e) => handleLocationChange('city', e.target.value)}
                    required
                    disabled={!jobData.state || loadingDistricts}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="">Select City</option>
                    {districts.map(district => (
                      <option key={district.id} value={district.name}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Minimum CTC (LPA) <span className="text-meta-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="minSalary"
                    value={jobData.minSalary}
                    onChange={handleChange}
                    required
                    placeholder="Enter minimum CTC"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent pl-12 pr-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                </div>
                {jobData.minSalary && (
                  <span className="text-sm text-gray-500 mt-1 block">
                    {formatCurrency(jobData.minSalary)} LPA
                  </span>
                )}
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Maximum CTC (LPA) <span className="text-meta-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="maxSalary"
                    value={jobData.maxSalary}
                    onChange={handleChange}
                    required
                    placeholder="Enter maximum CTC"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent pl-12 pr-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                </div>
                {jobData.maxSalary && (
                  <span className="text-sm text-gray-500 mt-1 block">
                    {formatCurrency(jobData.maxSalary)} LPA
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Additional Details Section */}
          <div className="mb-6 rounded-sm border border-stroke py-4 px-6.5 dark:border-strokedark">
            <div className="flex items-center gap-3 mb-4">
              <FaInfoCircle className="text-xl text-primary" />
              <h3 className="font-medium text-black dark:text-white">
                Additional Details
              </h3>
            </div>

            <div className="mb-4.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Experience Range (Years) <span className="text-meta-1">*</span>
              </label>
              <Slider
                range
                min={0}
                max={20}
                value={jobData.experienceRange}
                onChange={handleExperienceChange}
                trackStyle={[{ backgroundColor: '#4CAF50' }]}
                handleStyle={[{ borderColor: '#4CAF50' }, { borderColor: '#4CAF50' }]}
              />
              <div className="text-center mt-2">
                {jobData.experienceRange[0]} - {jobData.experienceRange[1]} Years
              </div>
            </div>

            <div className="mb-4.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Users with Edit Access
              </label>
              <Select
                isMulti
                options={userOptions}
                value={userOptions.filter(option => jobData.editable_by.includes(option.value))}
                onChange={(selected) => handleMultiSelectChange('editable_by', selected)}
                className="basic-multi-select"
                classNamePrefix="select"
                isClearable={true}
                isSearchable={true}
                placeholder="Select users who can edit this job..."
                noOptionsMessage={() => "No users available"}
                closeMenuOnSelect={false}
                hideSelectedOptions={true}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Interview Rounds <span className="text-meta-1">*</span>
                </label>
                <Select
                  isMulti
                  options={interviewOptions}
                  value={interviewOptions.filter(option => jobData.interviewRounds.includes(option.value))}
                  onChange={(selected) => handleMultiSelectChange('interviewRounds', selected)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  isClearable={true}
                  isSearchable={true}
                  placeholder="Select interview rounds..."
                  noOptionsMessage={() => "No options available"}
                  closeMenuOnSelect={false}
                  hideSelectedOptions={true}
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Skills <span className="text-meta-1">*</span>
                </label>
                <Select
                  isMulti
                  options={skillOptions}
                  value={skillOptions.filter(option =>
                    jobData.skills.includes(option.value)
                  )}
                  onChange={(selected) => handleMultiSelectChange('skills', selected)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  isClearable={true}
                  isSearchable={true}
                  placeholder="Select skills..."
                  noOptionsMessage={() => "No skills available"}
                  closeMenuOnSelect={false}
                  hideSelectedOptions={true}
                />
              </div>
            </div>
          </div>

          {/* Interview Questions Section */}
          <div className="mb-6 rounded-sm border border-stroke py-4 px-6.5 dark:border-strokedark">
            <div className="flex items-center gap-3 mb-4">
              <FaQuestionCircle className="text-xl text-primary" />
              <h3 className="font-medium text-black dark:text-white">
                Interview Questions
              </h3>
            </div>

            <div className="space-y-3">
              {jobData.questions.map((question, index) => (
                question.trim() && (
                  <div key={index} className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
                    <span className="text-primary font-medium min-w-[30px]">Q{index + 1}.</span>
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => handleQuestionChange(index, e.target.value)}
                      placeholder="Enter question"
                      className="flex-1 border-0 focus:ring-0 bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(index)}
                      className="text-danger hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                )
              )).filter(Boolean)}

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={currentQuestion}
                  onChange={(e) => setCurrentQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddQuestion()}
                  placeholder="Type new question"
                  className="flex-1 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  disabled={!currentQuestion.trim()}
                  className={`p-3 rounded-full transition-colors ${currentQuestion.trim()
                    ? 'bg-primary text-white hover:bg-opacity-90'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  <FaPlus size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Client Details Section */}
          <div className="mb-6 rounded-sm border border-stroke py-4 px-6.5 dark:border-strokedark">
            <div className="flex items-center gap-3 mb-4">
              <FaUser className="text-xl text-primary" />
              <h3 className="font-medium text-black dark:text-white">
                Client Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Client Name <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={jobData.clientName}
                  onChange={handleChange}
                  required
                  placeholder="Enter client name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Client Email <span className="text-meta-1">*</span>
                </label>
                <input
                  type="email"
                  name="clientEmail"
                  value={jobData.clientEmail}
                  onChange={handleChange}
                  required
                  placeholder="Enter client email"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Client Location <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  name="clientLocation"
                  value={jobData.clientLocation}
                  onChange={handleChange}
                  required
                  placeholder="Enter client location"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center justify-center gap-2 rounded-lg border border-danger py-2 px-6 text-danger hover:bg-danger hover:text-white"
            >
              <FaTimes />
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-lg bg-primary py-2 px-6 text-white hover:bg-opacity-90"
            >
              <FaSave />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </DefaultLayoutAdmin>
  );
};

export default EditJob;