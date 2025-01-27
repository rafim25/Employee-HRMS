import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { fetchUserById, updateUser, deleteUser } from '../../../../context/actions/userActions';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin } from '../../../../components';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { api } from '../../../../services/api';
import { USER_ENDPOINTS } from '../../../../constants/apiEndpoints';

const EditUser = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { dispatch } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        mobile_number: '',
        status: '',
        role: '',
        gender: '',
        date_joined: '',
        address: '',
    });

    useEffect(() => {
        const loadUser = async () => {
            setLoading(true);
            setError('');
            const loadingToast = toast.loading('Fetching user details...');
            try {
                const response = await api.get(USER_ENDPOINTS.DETAILS(userId));
                setUserData(response.data);
                toast.success('User details loaded successfully', {
                    id: loadingToast,
                });
            } catch (err) {
                toast.error(err.response?.data?.msg || 'Failed to fetch user details', {
                    id: loadingToast,
                });
                setError(err.response?.data?.msg || 'Failed to fetch user details');
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const loadingToast = toast.loading('Updating user...');
        try {
            await updateUser(dispatch, userId, userData);
            toast.success('User updated successfully!', {
                id: loadingToast,
            });
            navigate('/admin/master-data/data-pegawai');
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to update user', {
                id: loadingToast,
            });
            setError(err.response?.data?.msg || 'Failed to update user');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            // First try to delete the user
            await deleteUser(dispatch, userId);
            
            // If user deletion is successful, try to delete the profile photo
            try {
                if (userData.photo) {
                    await api.delete(`/api/users/${userId}/photo`);
                }
            } catch (photoError) {
                console.error('Failed to delete profile photo:', photoError);
                // Don't throw the error as user is already deleted
            }

            toast.success('User deleted successfully!');
            navigate('/admin/master-data/data-pegawai');
        } catch (err) {
            const errorMessage = err.response?.data?.msg || 'Failed to delete user';
            if (errorMessage.includes('foreign key constraint fails')) {
                toast.error('Cannot delete user because they have associated loans. Please delete or reassign the loans first.');
                setError('Cannot delete user because they have associated loans. Please delete or reassign the loans first.');
            } else {
                toast.error(errorMessage);
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
            setShowDeleteModal(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <DefaultLayoutAdmin>
            <BreadcrumbAdmin pageName='Edit User' />

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-boxdark rounded-sm shadow-default p-6 max-w-md w-full">
                        <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">Confirm Delete</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-3">
                            Are you sure you want to delete this user? This action cannot be undone.
                        </p>
                        <p className="text-warning text-sm mb-6">
                            Note: Users with associated loans cannot be deleted. Please delete or reassign any loans first.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-danger text-white rounded hover:bg-opacity-90"
                                disabled={loading}
                            >
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className='sm:grid-cols-2'>
                <div className='flex flex-col gap-9'>
                    <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
                        <div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center'>
                            <h3 className='font-medium text-black dark:text-white'>
                                Edit User Data
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(true)}
                                className="flex items-center gap-2 text-danger hover:text-opacity-90"
                            >
                                <FaTrash />
                                <span>Delete User</span>
                            </button>
                        </div>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className='p-6.5'>
                                {/* Username and Email */}
                                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            Username <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='text'
                                            name='username'
                                            value={userData.username}
                                            onChange={handleChange}
                                            required
                                            placeholder='Enter username'
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>

                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            Email <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='email'
                                            name='email'
                                            value={userData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder='Enter email'
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>
                                </div>

                                {/* Mobile Number and Gender */}
                                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            Mobile Number <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='text'
                                            name='mobile_number'
                                            value={userData.mobile_number}
                                            onChange={handleChange}
                                            required
                                            placeholder='Enter mobile number'
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>

                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            Gender <span className='text-meta-1'>*</span>
                                        </label>
                                        <div className='relative z-20 bg-transparent dark:bg-form-input'>
                                            <select
                                                name='gender'
                                                value={userData.gender}
                                                onChange={handleChange}
                                                required
                                                className='relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                            >
                                                <option value=''>Select Gender</option>
                                                <option value='male'>Male</option>
                                                <option value='female'>Female</option>
                                            </select>
                                            <span className='absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl'>
                                                <MdOutlineKeyboardArrowDown />
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Role and Status */}
                                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            Role <span className='text-meta-1'>*</span>
                                        </label>
                                        <div className='relative z-20 bg-transparent dark:bg-form-input'>
                                            <select
                                                name='role'
                                                value={userData.role}
                                                onChange={handleChange}
                                                required
                                                className='relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                            >
                                                <option value=''>Select Role</option>
                                                <option value='admin'>Admin</option>
                                                <option value='user'>User</option>
                                            </select>
                                            <span className='absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl'>
                                                <MdOutlineKeyboardArrowDown />
                                            </span>
                                        </div>
                                    </div>

                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            Status <span className='text-meta-1'>*</span>
                                        </label>
                                        <div className='relative z-20 bg-transparent dark:bg-form-input'>
                                            <select
                                                name='status'
                                                value={userData.status}
                                                onChange={handleChange}
                                                required
                                                className='relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                            >
                                                <option value=''>Select Status</option>
                                                <option value='active'>Active</option>
                                                <option value='inactive'>Inactive</option>
                                            </select>
                                            <span className='absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl'>
                                                <MdOutlineKeyboardArrowDown />
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className='mb-4.5'>
                                    <label className='mb-2.5 block text-black dark:text-white'>
                                        Address <span className='text-meta-1'>*</span>
                                    </label>
                                    <textarea
                                        name='address'
                                        value={userData.address}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter address'
                                        className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        rows={4}
                                    />
                                </div>

                                {/* Form Buttons */}
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
                                        onClick={() => navigate('/admin/master-data/data-pegawai')}
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

export default EditUser;