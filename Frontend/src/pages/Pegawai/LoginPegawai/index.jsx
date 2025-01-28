import React, { useState } from 'react';
import Logo from '../../../Assets/images/logo/logo.svg'
import LogoDark from '../../../Assets/images/logo/logo-dark.png'
import LoginImg from '../../../Assets/images/LoginImg/login.svg'
import { FiUser } from 'react-icons/fi'
import { TfiLock } from 'react-icons/tfi'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../../../context/actions/authActions';
import { useAuth } from '../../../context/AuthContext';
import Testimonials from '../../../components/molecules/Testimonial';

const LoginPegawai = () => {
    const navigate = useNavigate();
    const { dispatch } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(dispatch, { username, password });
            console.log('Login Response:', response.data); // Debug log
            
            // Store user data in auth context
            dispatch({ 
                type: 'SET_USER', 
                payload: response.data 
            });

            // Navigate based on user role
            if (response.data && response.data.role) {
                const userRole = response.data.role;
                console.log('User Role:', userRole); // Debug log

                if (userRole === 'Admin' || userRole === 'admin') {
                    navigate('/admin/dashboard');
                } else if (userRole === 'User') {
                    navigate('/pegawai/dashboard');
                } else {
                    setError('Invalid user role');
                }
            } else {
                setError('Role information not found in response');
            }
        } catch (error) {
            console.error('Login Error:', error); // Debug log
            setError(error.response?.data?.msg || 'Login failed');
        }
    };

    return (
        <div className='min-h-screen bg-white dark:bg-boxdark'>
            <div className='flex flex-wrap items-center min-h-screen'>
                <div className='hidden w-full xl:block xl:w-1/2'>
                    <div className='py-18.5 px-26 text-center'>
                        <span className="mb-5.5 inline-block">
                            <img className='hidden dark:block' src={Logo} alt='Logo' />
                            <img className='dark:hidden' src={LogoDark} alt='Logo' />
                        </span>
                        <p className='2xl:px-20'>
                            Welcome back! Please login to continue.
                        </p>
                        <img className="mt-15 inline-block" src={LoginImg} alt='Login' />
                    </div>
                </div>

                <div className='w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2'>
                    <div className='w-full p-4 sm:p-12.5 xl:p-17.5'>
                        <h2 className='mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2'>
                            Sign In
                        </h2>

                        {error && (
                            <div className="mb-6 rounded-lg bg-danger px-4 py-3 text-sm text-white">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin}>
                            <div className='mb-4'>
                                <label className='mb-2.5 block font-medium text-black dark:text-white'>
                                    Username
                                </label>
                                <div className='relative'>
                                    <input
                                        type='text'
                                        placeholder='Enter your username'
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                    />
                                    <FiUser className="absolute right-4 top-4 text-xl" />
                                </div>
                            </div>

                            <div className='mb-6'>
                                <label className='mb-2.5 block font-medium text-black dark:text-white'>
                                    Password
                                </label>
                                <div className='relative'>
                                    <input
                                        type='password'
                                        placeholder='Enter your password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                    />
                                    <TfiLock className="absolute right-4 top-4 text-xl" />
                                </div>
                            </div>

                            <div className='mb-5'>
                                <input
                                    type='submit'
                                    value='Sign In'
                                    className='w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90'
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className='border-t border-stroke dark:border-strokedark'>
                <div className='container mx-auto'>
                    <Testimonials type="staff" />
                </div>
            </div>

            <footer className="bg-white dark:bg-boxdark py-4 border-t border-stroke dark:border-strokedark">
                <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
                    <p>&copy; 2024 Raghav Elite Projects All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default LoginPegawai;
