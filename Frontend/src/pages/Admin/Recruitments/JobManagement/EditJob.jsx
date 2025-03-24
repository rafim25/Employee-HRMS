import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { fetchJobById, updateJob } from '../../../../context/actions/jobActions';
import { toast } from 'react-hot-toast';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import Select from 'react-select';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaBriefcase, FaMapMarkerAlt, FaDollarSign, FaInfoCircle, FaUser, FaQuestionCircle, FaTrash } from 'react-icons/fa';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useAuth();
  const [loading, setLoading] = useState(true);
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
  });

  useEffect(() => {
    const loadJob = async () => {
      const loadingToast = toast.loading('Loading job details...');
      try {
        const jobDetails = await fetchJobById(dispatch, id);
        if (jobDetails) {
          setJobData({
            ...jobData,
            ...jobDetails,
            questions: jobDetails.questions || [],
            experienceRange: jobDetails.experienceRange || [0, 10],
            interviewRounds: jobDetails.interviewRounds || [],
            skills: jobDetails.skills || [],
          });
          toast.success('Job details loaded', { id: loadingToast });
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        toast.error('Failed to load job details', { id: loadingToast });
        navigate('/admin/recruitments/job-management');
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [id, dispatch, navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateJob(dispatch, id, jobData);
      toast.success('Job updated successfully');
      navigate('/admin/recruitments/job-management');
    } catch (error) {
      toast.error('Failed to update job');
    }
  };

  const handleCancel = () => {
    navigate('/admin/recruitments/job-management');
  };

  if (loading) {
    return (
      <DefaultLayoutAdmin>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DefaultLayoutAdmin>
    );
  }

  return (
    <DefaultLayoutAdmin>
      <div className='container mx-auto p-4'>
        <h2 className='text-2xl font-bold mb-4'>Edit Job</h2>
        <form onSubmit={(e) => handleSubmit(e, false)} className='space-y-4'>
          <div className='mb-4.5 p-4 bg-gray-100 rounded'>
            <h4 className='font-medium text-black dark:text-white mb-4 flex items-center'>
              <FaBriefcase className='mr-2' /> Job Details
            </h4>
            <div className='mb-4.5 flex flex-col xl:flex-row gap-6'>
              <div className='w-full xl:w-1/2'>
                <label className='mb-2.5 block text-black dark:text-white'>
                  Job Title <span className='text-meta-1'>*</span>
                </label>
                <input
                  type='text'
                  name='title'
                  value={jobData.title}
                  onChange={handleChange}
                  required
                  placeholder='Enter job title'
                  className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                />
              </div>

              <div className='w-full xl:w-1/2'>
                <label className='mb-2.5 block text-black dark:text-white'>
                  Job Type <span className='text-meta-1'>*</span>
                </label>
                <div className='relative z-20 bg-transparent dark:bg-form-input'>
                  <select
                    name='type'
                    value={jobData.type}
                    onChange={handleChange}
                    required
                    className='relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                  >
                    <option value=''>Select Job Type</option>
                    <option value='Full-Time'>Full-Time</option>
                    <option value='Part-Time'>Part-Time</option>
                    <option value='Contract'>Contract</option>
                  </select>
                  <span className='absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl'>
                    <MdOutlineKeyboardArrowDown />
                  </span>
                </div>
              </div>
            </div>

            <div className='mb-4.5'>
              <label className='mb-2.5 block text-black dark:text-white'>
                Description <span className='text-meta-1'>*</span>
              </label>
              <textarea
                name='description'
                value={jobData.description}
                onChange={handleChange}
                required
                placeholder='Enter job description'
                className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
              />
            </div>
          </div>

          <div className='mb-4.5 p-4 bg-gray-100 rounded'>
            <h4 className='font-medium text-black dark:text-white mb-4 flex items-center'>
              <FaMapMarkerAlt className='mr-2' /> Location and Salary
            </h4>
            <div className='mb-4.5 flex flex-col xl:flex-row gap-6'>
              <div className='w-full xl:w-1/2'>
                <label className='mb-2.5 block text-black dark:text-white'>
                  State <span className='text-meta-1'>*</span>
                </label>
                <input
                  type='text'
                  name='state'
                  value={jobData.state}
                  onChange={handleChange}
                  required
                  placeholder='Enter state'
                  className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                />
              </div>

              <div className='w-full xl:w-1/2'>
                <label className='mb-2.5 block text-black dark:text-white'>
                  City <span className='text-meta-1'>*</span>
                </label>
                <input
                  type='text'
                  name='city'
                  value={jobData.city}
                  onChange={handleChange}
                  required
                  placeholder='Enter city'
                  className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                />
              </div>
            </div>

            <div className='mb-4.5 flex flex-col xl:flex-row gap-6'>
              <div className='w-full xl:w-1/2'>
                <label className='mb-2.5 block text-black dark:text-white'>
                  Minimum Salary <span className='text-meta-1'>*</span>
                </label>
                <input
                  type='number'
                  name='minSalary'
                  value={jobData.minSalary}
                  onChange={handleChange}
                  required
                  placeholder='Enter minimum salary'
                  className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                />
              </div>

              <div className='w-full xl:w-1/2'>
                <label className='mb-2.5 block text-black dark:text-white'>
                  Maximum Salary <span className='text-meta-1'>*</span>
                </label>
                <input
                  type='number'
                  name='maxSalary'
                  value={jobData.maxSalary}
                  onChange={handleChange}
                  required
                  placeholder='Enter maximum salary'
                  className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                />
              </div>
            </div>

            <div className='mb-4.5'>
              <label className='mb-2.5 block text-black dark:text-white'>
                Deadline <span className='text-meta-1'>*</span>
              </label>
              <DatePicker
                selected={jobData.deadline}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                placeholderText='Select deadline'
              />
            </div>
          </div>

          <div className='mb-4.5 p-4 bg-gray-100 rounded'>
            <h4 className='font-medium text-black dark:text-white mb-4 flex items-center'>
              <FaInfoCircle className='mr-2' /> Additional Details
            </h4>
            <div className='mb-4.5'>
              <label className='mb-2.5 block text-black dark:text-white'>
                Experience Range (Years) <span className='text-meta-1'>*</span>
              </label>
              <Slider
                range
                min={0}
                max={20}
                defaultValue={[0, 10]}
                value={jobData.experienceRange}
                onChange={(values) => setJobData(prev => ({ ...prev, experienceRange: values }))}
                trackStyle={[{ backgroundColor: '#4CAF50' }]}
                handleStyle={[{ borderColor: '#4CAF50' }, { borderColor: '#4CAF50' }]}
              />
              <div className='text-center mt-2'>
                {jobData.experienceRange[0]} - {jobData.experienceRange[1]} Years
              </div>
            </div>

            <div className='mb-4.5 flex flex-col xl:flex-row gap-6'>
              <div className='w-full'>
                <label className='mb-2.5 block text-black dark:text-white'>
                  Interview Rounds <span className='text-meta-1'>*</span>
                </label>
                <Select
                  isMulti
                  options={[
                    { value: 'Shortlisting', label: 'Shortlisting' },
                    { value: 'Telephonic / Face-to-Face', label: 'Telephonic / Face-to-Face' },
                    { value: 'Technical Round 1', label: 'Technical Round 1' },
                    { value: 'Technical Round 2', label: 'Technical Round 2' },
                    { value: 'HR Round', label: 'HR Round' },
                    { value: 'Selected', label: 'Selected' },
                    { value: 'Rejected', label: 'Rejected' }
                  ]}
                  value={[
                    { value: 'Shortlisting', label: 'Shortlisting' },
                    { value: 'Telephonic / Face-to-Face', label: 'Telephonic / Face-to-Face' },
                    { value: 'Technical Round 1', label: 'Technical Round 1' },
                    { value: 'Technical Round 2', label: 'Technical Round 2' },
                    { value: 'HR Round', label: 'HR Round' },
                    { value: 'Selected', label: 'Selected' },
                    { value: 'Rejected', label: 'Rejected' }
                  ].filter(option => jobData.interviewRounds.includes(option.value))}
                  onChange={(selected) => setJobData(prev => ({ ...prev, interviewRounds: selected.map(option => option.value) }))}
                  className='basic-multi-select'
                  classNamePrefix='select'
                />
              </div>

              <div className='w-full'>
                <label className='mb-2.5 block text-black dark:text-white'>
                  Skills <span className='text-meta-1'>*</span>
                </label>
                <Select
                  isMulti
                  options={[
                    { value: 'JavaScript', label: 'JavaScript' },
                    { value: 'Python', label: 'Python' },
                    { value: 'Java', label: 'Java' },
                    { value: 'C++', label: 'C++' }
                  ]}
                  value={[
                    { value: 'JavaScript', label: 'JavaScript' },
                    { value: 'Python', label: 'Python' },
                    { value: 'Java', label: 'Java' },
                    { value: 'C++', label: 'C++' }
                  ].filter(option => jobData.skills.includes(option.value))}
                  onChange={(selected) => setJobData(prev => ({ ...prev, skills: selected.map(option => option.value) }))}
                  className='basic-multi-select'
                  classNamePrefix='select'
                />
              </div>
            </div>
          </div>

          <div className='mb-4.5 p-4 bg-gray-100 rounded'>
            <h4 className='font-medium text-black dark:text-white mb-4 flex items-center'>
              <FaQuestionCircle className='mr-2' /> Interview Questions
            </h4>
            <div className='space-y-3'>
              {jobData.questions.map((question, index) => (
                question && (
                  <div key={index} className='flex items-center gap-2'>
                    <span>{index + 1}.</span>
                    <input
                      type='text'
                      value={question}
                      onChange={(e) => {
                        const newQuestions = [...jobData.questions];
                        newQuestions[index] = e.target.value;
                        setJobData(prev => ({
                          ...prev,
                          questions: newQuestions
                        }));
                      }}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newQuestions = jobData.questions.filter((_, i) => i !== index);
                        setJobData(prev => ({
                          ...prev,
                          questions: newQuestions
                        }));
                      }}
                      className='text-danger hover:text-red-700'
                    >
                      <FaTrash />
                    </button>
                  </div>
                )
              ))}
              <button
                type="button"
                onClick={() => {
                  setJobData(prev => ({
                    ...prev,
                    questions: [...prev.questions, '']
                  }));
                }}
                className='inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-2.5 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10'
              >
                Add Question
              </button>
            </div>
          </div>

          <div className='mb-4.5 p-4 bg-gray-100 rounded'>
            <h4 className='font-medium text-black dark:text-white mb-4 flex items-center'>
              <FaUser className='mr-2' /> Client Details
            </h4>
            <div className='mb-4.5 flex flex-col xl:flex-row gap-6'>
              <div className='w-full xl:w-1/2'>
                <label className='mb-2.5 block text-black dark:text-white'>
                  Client Name <span className='text-meta-1'>*</span>
                </label>
                <input
                  type='text'
                  name='clientName'
                  value={jobData.clientName}
                  onChange={handleChange}
                  required
                  placeholder='Enter client name'
                  className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                />
              </div>

              <div className='w-full xl:w-1/2'>
                <label className='mb-2.5 block text-black dark:text-white'>
                  Client Email <span className='text-meta-1'>*</span>
                </label>
                <input
                  type='email'
                  name='clientEmail'
                  value={jobData.clientEmail}
                  onChange={handleChange}
                  required
                  placeholder='Enter client email'
                  className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                />
              </div>
            </div>

            <div className='mb-4.5'>
              <label className='mb-2.5 block text-black dark:text-white'>
                Client Location <span className='text-meta-1'>*</span>
              </label>
              <input
                type='text'
                name='clientLocation'
                value={jobData.clientLocation}
                onChange={handleChange}
                required
                placeholder='Enter client location'
                className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
              />
            </div>
          </div>

          <div className='flex flex-col md:flex-row w-full gap-3 text-center mt-7.5'>
            <button
              type="submit"
              disabled={loading}
              className='inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-2.5 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10'
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className='inline-flex items-center justify-center gap-2.5 rounded-md bg-danger py-2.5 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10'
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DefaultLayoutAdmin>
  );
};

export default EditJob;