import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin } from '../../../../components';
import { useAuth } from '../../../../context/AuthContext';
import { createJob } from '../../../../context/actions/jobActions';
import Select from 'react-select';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaBriefcase, FaMapMarkerAlt, FaDollarSign, FaInfoCircle, FaUser, FaQuestionCircle, FaPlus, FaTrash } from 'react-icons/fa';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import axios from 'axios';

const JobForm = () => {
    const navigate = useNavigate();
    const { dispatch } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [jobData, setJobData] = useState({
        title: '',
        type: '',
        description: '',
        questions: [''],
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

    const [skillOptions, setSkillOptions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState('');

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await axios.get('/api/skills', {
                    withCredentials: true
                });
                const skillsList = response.data.map(skill => ({
                    value: skill.name,
                    label: skill.name
                }));
                setSkillOptions(skillsList);
            } catch (error) {
                console.error('Error fetching skills:', error);
                toast.error('Failed to load skills');
            }
        };

        fetchSkills();
    }, []);

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

    const handleSubmit = async (e, publish = false) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const loadingToast = toast.loading(publish ? 'Publishing job...' : 'Saving job...');
        try {
            const dataToSubmit = { ...jobData, status: publish ? 'active' : 'draft' };
            await createJob(dispatch, dataToSubmit);
            toast.success(publish ? 'Job published successfully!' : 'Job saved successfully!', { id: loadingToast });
            navigate('/admin/recruitments/job-management');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save job', { id: loadingToast });
            setError(err.response?.data?.message || 'Failed to save job');
        } finally {
            setLoading(false);
        }
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

    const handleDeleteQuestion = (index) => {
        setJobData(prev => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index)
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

    const handleExperienceChange = (values) => {
        setJobData(prev => ({
            ...prev,
            experienceRange: values
        }));
    };

    const handleMultiSelectChange = (name, selectedOptions) => {
        setJobData(prev => ({
            ...prev,
            [name]: selectedOptions ? selectedOptions.map(option => option.value) : []
        }));
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


    const jobTypeOptions = [
        { value: 'Full-Time', label: 'Full-Time' },
        { value: 'Part-Time', label: 'Part-Time' },
        { value: 'Contract', label: 'Contract' }
    ];

    return (
        <DefaultLayoutAdmin>
            <BreadcrumbAdmin pageName='Add Job' />
            <div className='sm:grid-cols-2'>
                <div className='flex flex-col gap-9'>
                    <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
                        <div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
                            <h3 className='font-medium text-black dark:text-white'>
                                Job Form
                            </h3>
                        </div>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4">
                                {error}
                            </div>
                        )}

                        <form>
                            <div className='p-6.5'>
                                {/* Job Details Section */}
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
                                                    {jobTypeOptions.map(option => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
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

                                {/* Location and Salary Section */}
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

                                {/* Additional Details Section */}
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
                                            onChange={handleExperienceChange}
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
                                                options={interviewOptions}
                                                value={interviewOptions.filter(option => jobData.interviewRounds.includes(option.value))}
                                                onChange={(selected) => handleMultiSelectChange('interviewRounds', selected)}
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
                                                options={skillOptions}
                                                value={skillOptions.filter(option => jobData.skills.includes(option.value))}
                                                onChange={(selected) => handleMultiSelectChange('skills', selected)}
                                                className='basic-multi-select'
                                                classNamePrefix='select'
                                                isClearable={true}
                                                placeholder="Select skills..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Questions Section */}
                                <div className='mb-4.5 p-4 bg-gray-100 rounded'>
                                    <h4 className='font-medium text-black dark:text-white mb-4 flex items-center'>
                                        <FaQuestionCircle className='mr-2' /> Interview Questions
                                    </h4>
                                    <div className='space-y-3'>
                                        {jobData.questions.map((question, index) => (
                                            question.trim() && (
                                                <div key={index} className='flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm'>
                                                    <span className="text-primary font-medium min-w-[30px]">Q{index + 1}.</span>
                                                    <input
                                                        type='text'
                                                        value={question}
                                                        onChange={(e) => handleQuestionChange(index, e.target.value)}
                                                        placeholder='Enter question'
                                                        className='flex-1 border-0 focus:ring-0 bg-transparent'
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteQuestion(index)}
                                                        className='text-danger hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors'
                                                    >
                                                        <FaTrash size={16} />
                                                    </button>
                                                </div>
                                            )
                                        )).filter(Boolean)}

                                        <div className='flex items-center gap-2'>
                                            <input
                                                type='text'
                                                value={currentQuestion}
                                                onChange={(e) => setCurrentQuestion(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleAddQuestion()}
                                                placeholder='Type new question'
                                                className='flex-1 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
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

                                {/* Form Buttons */}
                                <div className='flex flex-col md:flex-row w-full gap-3 text-center mt-7.5'>
                                    <button
                                        type="button"
                                        onClick={(e) => handleSubmit(e, false)}
                                        disabled={loading}
                                        className='inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-2.5 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10'
                                    >
                                        {loading ? 'Saving...' : 'Save and Continue Later'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={(e) => handleSubmit(e, true)}
                                        disabled={loading}
                                        className='inline-flex items-center justify-center gap-2.5 rounded-md bg-success py-2.5 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10'
                                    >
                                        {loading ? 'Publishing...' : 'Publish'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => navigate('/admin/recruitments/job-management')}
                                        className='inline-flex items-center justify-center gap-2.5 rounded-md bg-danger py-2.5 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10'
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DefaultLayoutAdmin>
    );
};

export default JobForm;