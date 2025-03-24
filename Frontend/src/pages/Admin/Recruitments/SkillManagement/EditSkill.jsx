import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin } from '../../../../components';
import { FaTools } from 'react-icons/fa';

const EditSkill = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [skillData, setSkillData] = useState({
        name: '',
        description: '',
        status: 'active'
    });

    useEffect(() => {
        const fetchSkill = async () => {
            try {
                setLoading(true);
                const loadingToast = toast.loading('Fetching skill details...');
                const response = await axios.get(`http://localhost:3002/api/skills/${id}`, {
                    withCredentials: true
                });

                setSkillData({
                    name: response.data.name,
                    description: response.data.description || '',
                    status: response.data.status || 'active'
                });
                toast.success('Skill details loaded', { id: loadingToast });
            } catch (error) {
                toast.error('Failed to fetch skill details');
                console.error('Error fetching skill:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchSkill();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSkillData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const loadingToast = toast.loading('Updating skill...');

            await axios.patch(`http://localhost:3002/api/skills/${id}`, skillData, {
                withCredentials: true
            });

            toast.success('Skill updated successfully!', { id: loadingToast });
            navigate('/admin/recruitments/skill-management');
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Failed to update skill');
            console.error('Error updating skill:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <DefaultLayoutAdmin>
            <BreadcrumbAdmin pageName='Edit Skill' />
            <div className='sm:grid-cols-2'>
                <div className='flex flex-col gap-9'>
                    <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
                        <div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
                            <h3 className='font-medium text-black dark:text-white'>
                                Edit Skill
                            </h3>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className='p-6.5'>
                                <div className='mb-4.5'>
                                    <label className='mb-2.5 block text-black dark:text-white'>
                                        Name <span className='text-meta-1'>*</span>
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
                                        placeholder='Enter description'
                                        className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        rows="4"
                                    />
                                </div>

                                <div className='mb-4.5'>
                                    <label className='mb-2.5 block text-black dark:text-white'>
                                        Status
                                    </label>
                                    <select
                                        name='status'
                                        value={skillData.status}
                                        onChange={handleChange}
                                        className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                                <div className='flex flex-col md:flex-row w-full gap-3 text-center'>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className='inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-2.5 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10'
                                    >
                                        {loading ? 'Updating...' : 'Update Skill'}
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

export default EditSkill; 