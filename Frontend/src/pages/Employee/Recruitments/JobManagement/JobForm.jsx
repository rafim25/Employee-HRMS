import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DefaultLayoutEmployee from '../../../../layout/DefaultLayoutPegawai';
import { BreadcrumbPegawai } from '../../../../components';
import { FaBriefcase, FaPlus, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../../../../context/AuthContext';

const JobForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [requirements, setRequirements] = useState(['']);
  const [questions, setQuestions] = useState(['']);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Full-time',
    description: '',
    city: '',
    state: '',
    experienceRange: [0, 2],
    skills: [],
    openings: 1,
    status: 'active',
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
        experienceRange: data.experienceRange || [0, 2]
      });
      setRequirements(data.requirements || ['']);
      setQuestions(data.questions || ['']);
    } catch (error) {
      toast.error('Failed to load job details');
      console.error(error);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/skills', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch skills');

      const data = await response.json();
      setSkills(data);
    } catch (error) {
      toast.error('Failed to load skills');
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const filteredRequirements = requirements.filter(req => req.trim() !== '');
      const filteredQuestions = questions.filter(q => q.trim() !== '');

      const jobData = {
        ...formData,
        requirements: filteredRequirements,
        questions: filteredQuestions,
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

  const handleSkillChange = (e) => {
    const selectedSkills = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      skills: selectedSkills
    }));
  };

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const addRequirement = () => {
    setRequirements([...requirements, '']);
  };

  const removeRequirement = (index) => {
    const newRequirements = requirements.filter((_, i) => i !== index);
    setRequirements(newRequirements);
  };

  const addQuestion = () => {
    setQuestions([...questions, '']);
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  return (
    <DefaultLayoutEmployee>
      <BreadcrumbPegawai pageName={id ? "Edit Job" : "Add New Job"} icon={FaBriefcase} />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form onSubmit={handleSubmit} className="p-6.5">
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Job Title <span className="text-meta-1">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter job title"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Job Type <span className="text-meta-1">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            >
              {jobTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Description <span className="text-meta-1">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Enter job description"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4.5">
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                City <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="Enter city"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                State <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                placeholder="Enter state"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Required Skills <span className="text-meta-1">*</span>
            </label>
            <select
              multiple
              value={formData.skills}
              onChange={handleSkillChange}
              required
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            >
              {skills.map(skill => (
                <option key={skill.id} value={skill.name}>
                  {skill.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Hold Ctrl (Windows) or Command (Mac) to select multiple skills
            </p>
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Experience Range (years) <span className="text-meta-1">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="experienceRange[0]"
                value={formData.experienceRange[0]}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  experienceRange: [Number(e.target.value), prev.experienceRange[1]]
                }))}
                min="0"
                required
                placeholder="Minimum"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <input
                type="number"
                name="experienceRange[1]"
                value={formData.experienceRange[1]}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  experienceRange: [prev.experienceRange[0], Number(e.target.value)]
                }))}
                min={formData.experienceRange[0]}
                required
                placeholder="Maximum"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Requirements
            </label>
            {requirements.map((requirement, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) => handleRequirementChange(index, e.target.value)}
                  placeholder="Enter requirement"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => removeRequirement(index)}
                  className="flex-shrink-0 p-2 text-meta-1 hover:text-meta-1/80"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addRequirement}
              className="mt-2 flex items-center gap-2 text-primary hover:text-primary/80"
            >
              <FaPlus /> Add Requirement
            </button>
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Screening Questions
            </label>
            {questions.map((question, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                  placeholder="Enter question"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="flex-shrink-0 p-2 text-meta-1 hover:text-meta-1/80"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addQuestion}
              className="mt-2 flex items-center gap-2 text-primary hover:text-primary/80"
            >
              <FaPlus /> Add Question
            </button>
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Number of Openings <span className="text-meta-1">*</span>
            </label>
            <input
              type="number"
              name="openings"
              value={formData.openings}
              onChange={handleChange}
              min="1"
              required
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            >
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="flex justify-end gap-4.5">
            <button
              type="button"
              onClick={() => navigate('/employee/recruitments/job-management')}
              className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-95 disabled:bg-opacity-50"
            >
              {loading ? 'Saving...' : (id ? 'Update Job' : 'Create Job')}
            </button>
          </div>
        </form>
      </div>
    </DefaultLayoutEmployee>
  );
};

export default JobForm; 