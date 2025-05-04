import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DefaultLayoutEmployee from '../../../../layout/DefaultLayoutPegawai';
import { BreadcrumbPegawai } from '../../../../components';
import { FaBriefcase, FaPlus, FaTimes, FaMapMarkerAlt, FaDollarSign, FaInfoCircle, FaUser, FaQuestionCircle, FaSave } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../../../../context/AuthContext';
import Select from 'react-select';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const JobForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const [loading, setLoading] = useState(false);
  const [skillOptions, setSkillOptions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Full-time',
    description: '',
    city: '',
    state: '',
    minSalary: '',
    maxSalary: '',
    deadline: null,
    experienceRange: [0, 2],
    skills: [],
    openings: 1,
    status: 'active',
    questions: [],
    clientName: '',
    clientEmail: '',
    clientLocation: '',
    created_by: authState?.user?.username || '',
    created_by_id: authState?.user?.user_id || null
  });

  const jobTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Internship',
    'Remote'
  ];

  useEffect(() => {
    if (id) {
      fetchJobDetails();
    }
    fetchSkills();
    fetchStates();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch job details');

      const data = await response.json();
      setFormData({
        ...data,
        experienceRange: data.experienceRange || [0, 2],
        deadline: data.deadline ? new Date(data.deadline) : null
      });
    } catch (error) {
      toast.error('Failed to load job details');
      console.error(error);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await axios.get('/api/skills', {
        withCredentials: true
      });

      const uniqueSkills = [...new Set(response.data.map(skill => skill.name))];
      const skillsList = uniqueSkills.map(skill => ({
        value: skill,
        label: skill
      })).sort((a, b) => a.label.localeCompare(b.label));

      setSkillOptions(skillsList);
    } catch (error) {
      toast.error('Failed to load skills');
      console.error(error);
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
      toast.error('Failed to load states');
      console.error(error);
    }
  };

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
      toast.error('Failed to load districts');
      console.error(error);
    }
  };

  const handleLocationChange = (field, value) => {
    if (field === 'state') {
      fetchDistricts(value);
      setFormData(prev => ({
        ...prev,
        state: value,
        city: '' // Reset city when state changes
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const jobData = {
        ...formData,
        created_by: authState?.user?.username,
        created_by_id: authState?.user?.user_id
      };

      const url = id ? `/api/jobs/${id}` : '/api/jobs';
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(jobData)
      });

      if (!response.ok) throw new Error('Failed to save job');

      toast.success(`Job ${id ? 'updated' : 'created'} successfully`);
      navigate('/employee/recruitments/job-management');
    } catch (error) {
      toast.error(error.message || 'Failed to save job');
      console.error(error);
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

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      deadline: date
    }));
  };

  const handleMultiSelectChange = (name, selectedOptions) => {
    if (!selectedOptions) {
      setFormData(prev => ({
        ...prev,
        [name]: []
      }));
      return;
    }

    const uniqueValues = Array.from(new Set(selectedOptions.map(option => option.value)));
    setFormData(prev => ({
      ...prev,
      [name]: uniqueValues
    }));
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = value;
    setFormData(prev => ({
      ...prev,
      questions: newQuestions
    }));
  };

  const handleDeleteQuestion = (index) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleAddQuestion = () => {
    if (currentQuestion.trim()) {
      setFormData(prev => ({
        ...prev,
        questions: [...prev.questions.filter(q => q.trim()), currentQuestion]
      }));
      setCurrentQuestion('');
    }
  };

  const handleExperienceChange = (values) => {
    setFormData(prev => ({
      ...prev,
      experienceRange: values
    }));
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <DefaultLayoutEmployee>
      <BreadcrumbPegawai pageName={id ? "Edit Job" : "Add New Job"} icon={FaBriefcase} />

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
                  value={formData.title}
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
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                >
                  {jobTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Description <span className="text-meta-1">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
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
                  value={formData.state}
                  onChange={(e) => handleLocationChange('state', e.target.value)}
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
                <select
                  name="city"
                  value={formData.city}
                  onChange={(e) => handleLocationChange('city', e.target.value)}
                  required
                  disabled={!formData.state}
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

              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Minimum Salary (LPA) <span className="text-meta-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="minSalary"
                    value={formData.minSalary}
                    onChange={handleChange}
                    required
                    placeholder="Enter minimum salary"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent pl-12 pr-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                </div>
                {formData.minSalary && (
                  <span className="text-sm text-gray-500 mt-1 block">
                    {formatCurrency(formData.minSalary)} LPA
                  </span>
                )}
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Maximum Salary (LPA) <span className="text-meta-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="maxSalary"
                    value={formData.maxSalary}
                    onChange={handleChange}
                    required
                    placeholder="Enter maximum salary"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent pl-12 pr-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                </div>
                {formData.maxSalary && (
                  <span className="text-sm text-gray-500 mt-1 block">
                    {formatCurrency(formData.maxSalary)} LPA
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
                value={formData.experienceRange}
                onChange={handleExperienceChange}
                trackStyle={[{ backgroundColor: '#4CAF50' }]}
                handleStyle={[{ borderColor: '#4CAF50' }, { borderColor: '#4CAF50' }]}
              />
              <div className="text-center mt-2">
                {formData.experienceRange[0]} - {formData.experienceRange[1]} Years
              </div>
            </div>

            <div className="mb-4.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Skills <span className="text-meta-1">*</span>
              </label>
              <Select
                isMulti
                options={skillOptions}
                value={skillOptions.filter(option =>
                  formData.skills.includes(option.value)
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

            <div className="mb-4.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Number of Openings <span className="text-meta-1">*</span>
              </label>
              <input
                type="number"
                name="openings"
                value={formData.openings}
                onChange={handleChange}
                min="1"
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div className="mb-4.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Application Deadline
              </label>
              <DatePicker
                selected={formData.deadline}
                onChange={handleDateChange}
                minDate={new Date()}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                placeholderText="Select deadline"
                dateFormat="MMMM d, yyyy"
              />
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
              {formData.questions.map((question, index) => (
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
                      <FaTimes size={16} />
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
                  value={formData.clientName}
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
                  value={formData.clientEmail}
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
                  value={formData.clientLocation}
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
              onClick={() => navigate('/employee/recruitments/job-management')}
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
              {loading ? 'Saving...' : (id ? 'Update Job' : 'Create Job')}
            </button>
          </div>
        </form>
      </div>
    </DefaultLayoutEmployee>
  );
};

export default JobForm; 