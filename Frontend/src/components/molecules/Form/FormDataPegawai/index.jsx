import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin, ButtonOne, ButtonTwo, ButtonThree } from '../../..';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { useAuth } from '../../../../context/AuthContext';
import { api } from '../../../../services/api';
import { USER_ENDPOINTS } from '../../../../constants/apiEndpoints';

const UserDataForm = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    user_id: generateUserId(),
    username: '',
    email: '',
    password: '',
    gender: '',
    role: '',
    date_joined: '',
    mobile_number: '',
    address: '',
    status: '',
    photo: null,
    permissions: ''
  });

  // Generate unique user ID (CID)
  function generateUserId() {
    const prefix = 'USR';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  }

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const loadingToast = toast.loading('Creating user...');
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'photo' && formData[key]) {
          formDataToSend.append('photo', formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await api.post(USER_ENDPOINTS.CREATE, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        toast.success('User created successfully!', {
          id: loadingToast,
        });
        navigate('/admin/master-data/data-pegawai');
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to create user', {
        id: loadingToast,
      });
      setError(err.response?.data?.msg || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayoutAdmin>
      <BreadcrumbAdmin pageName='User Form' />

      <div className='sm:grid-cols-2'>
        <div className='flex flex-col gap-9'>
          <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
            <div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
              <h3 className='font-medium text-black dark:text-white'>
                User Data Form
              </h3>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className='p-6.5'>
                {/* User ID and Username */}
                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      User ID <span className='text-meta-1'>*</span>
                    </label>
                    <input
                      type='text'
                      name='user_id'
                      value={formData.user_id}
                      readOnly
                      className='w-full rounded border-[1.5px] border-stroke bg-gray-100 py-3 px-5 font-medium outline-none'
                    />
                  </div>

                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      Username <span className='text-meta-1'>*</span>
                    </label>
                    <input
                      type='text'
                      name='username'
                      value={formData.username}
                      onChange={handleChange}
                      required
                      placeholder='Enter username'
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                    />
                  </div>
                </div>

                {/* Email and Password */}
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      Email <span className='text-meta-1'>*</span>
                    </label>
                    <input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder='Enter email'
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                    />
                  </div>

                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      Password <span className='text-meta-1'>*</span>
                    </label>
                    <input
                      type='password'
                      name='password'
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder='Enter password'
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                    />
                  </div>
                </div>

                {/* Gender and Role */}
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      Gender <span className='text-meta-1'>*</span>
                    </label>
                    <div className='relative z-20 bg-transparent dark:bg-form-input'>
                      <select
                        name='gender'
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className='relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                      >
                        <option value=''>Select Gender</option>
                        <option value='Male'>Male</option>
                        <option value='Female'>Female</option>
                      </select>
                      <span className='absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl'>
                        <MdOutlineKeyboardArrowDown />
                      </span>
                    </div>
                  </div>

                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      Role <span className='text-meta-1'>*</span>
                    </label>
                    <div className='relative z-20 bg-transparent dark:bg-form-input'>
                      <select
                        name='role'
                        value={formData.role}
                        onChange={handleChange}
                        required
                        className='relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                      >
                        <option value=''>Select Role</option>
                        <option value='Admin'>Admin</option>
                        <option value='User'>User</option>
                      </select>
                      <span className='absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl'>
                        <MdOutlineKeyboardArrowDown />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Join Date and Status */}
                {/* <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      Date of Joining <span className='text-meta-1'>*</span>
                    </label>
                    <input
                      type='date'
                      name='date_joined'
                      value={formData.date_joined}
                      onChange={handleChange}
                      required
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                    />
                  </div>

                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      Status <span className='text-meta-1'>*</span>
                    </label>
                    <div className='relative z-20 bg-transparent dark:bg-form-input'>
                      <select
                        name='status'
                        value={formData.status}
                        onChange={handleChange}
                        required
                        className='relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                      >
                        <option value=''>Select Status</option>
                        <option value='Active'>Active</option>
                        <option value='Inactive'>Inactive</option>
                      </select>
                      <span className='absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl'>
                        <MdOutlineKeyboardArrowDown />
                      </span>
                    </div>
                  </div>
                </div> */}

                {/* Mobile and Address */}
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      Mobile Number <span className='text-meta-1'>*</span>
                    </label>
                    <input
                      type='tel'
                      name='mobile_number'
                      value={formData.mobile_number}
                      onChange={handleChange}
                      required
                      placeholder='Enter mobile number'
                      pattern="[0-9]{10}"
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                    />
                  </div>

                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      Address <span className='text-meta-1'>*</span>
                    </label>
                    <input
                      type='text'
                      name='address'
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder='Enter address'
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                    />
                  </div>
                </div>

                {/* Photo and Permissions */}
                {/* <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      Photo
                    </label>
                    <input
                      type='file'
                      name='photo'
                      onChange={handleChange}
                      accept="image/*"
                      className='w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm file:font-medium focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input'
                    />
                  </div>

                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      Permissions <span className='text-meta-1'>*</span>
                    </label>
                    <div className='relative z-20 bg-transparent dark:bg-form-input'>
                      <select
                        name='permissions'
                        value={formData.permissions}
                        onChange={handleChange}
                        required
                        className='relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                      >
                        <option value=''>Select Permissions</option>
                        <option value='Full'>Full Access</option>
                        <option value='Limited'>Limited Access</option>
                        <option value='Read'>Read Only</option>
                      </select>
                      <span className='absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl'>
                        <MdOutlineKeyboardArrowDown />
                      </span>
                    </div>
                  </div>
                </div> */}

                {/* Form Buttons */}
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
                    onClick={() => setFormData({
                      user_id: generateUserId(),
                      username: '',
                      email: '',
                      password: '',
                      gender: '',
                      role: '',
                      date_joined: '',
                      mobile_number: '',
                      address: '',
                      status: '',
                      photo: null,
                      permissions: ''
                    })}
                    className='inline-flex items-center justify-center gap-2.5 rounded-md bg-warning py-2.5 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10'
                  >
                    Reset
                  </button>

                  <Link
                    to="/admin/master-data/data-pegawai"
                    className='inline-flex items-center justify-center gap-2.5 rounded-md bg-danger py-2.5 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10'
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayoutAdmin>
  );
};

export default UserDataForm;