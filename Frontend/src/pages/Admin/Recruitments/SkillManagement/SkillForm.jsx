import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin } from '../../../../components';
import { useAuth } from '../../../../context/AuthContext';
import { createSkill } from '../../../../context/actions/skillActions';
import { FaTools } from 'react-icons/fa';

const SkillForm = () => {
    const navigate = useNavigate();
    const { dispatch } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [skillData, setSkillData] = useState({
        name: '',
        description: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSkillData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const loadingToast = toast.loading('Saving skill...');
        try {
            await createSkill(dispatch, skillData);
            toast.success('Skill saved successfully!', { id: loadingToast });
            navigate('/admin/recruitments/skill-management');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save skill', { id: loadingToast });
            setError(err.response?.data?.message || 'Failed to save skill');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DefaultLayoutAdmin>
            <BreadcrumbAdmin pageName='Add Skill' />
            <div className='sm:grid-cols-2'>
                <div className='flex flex-col gap-9'>
                    <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
                        <div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
                            <h3 className='font-medium text-black dark:text-white'>
                                Skill Form
                            </h3>
                        </div>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className='p-6.5'>
                                <div className='mb-4.5 p-4 bg-gray-100 rounded'>
                                    <h4 className='font-medium text-black dark:text-white mb-4 flex items-center'>
                                        <FaTools className='mr-2' /> Skill Details
                                    </h4>
                                    <div className='mb-4.5'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            Skill Name <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='text'
                                            name='name'
                                            value={skillData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder='Enter skill name'
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>

                                    <div className='mb-4.5'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            Description
                                        </label>
                                        <textarea
                                            name='description'
                                            value={skillData.description}
                                            onChange={handleChange}
                                            placeholder='Enter skill description'
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
                                        {loading ? 'Saving...' : 'Save'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => navigate('/admin/recruitments/skill-management')}
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

export default SkillForm; 