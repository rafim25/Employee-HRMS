import React,{useState} from 'react';
import Logo from '../../../Assets/images/logo/logo.svg'
import LogoDark from '../../../Assets/images/logo/logo-dark.png'
import LoginImg from '../../../Assets/images/LoginImg/login.svg'
import { FiUser } from 'react-icons/fi'
import { TfiLock } from 'react-icons/tfi'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../../../context/actions/authActions';
import { useAuth } from '../../../context/AuthContext'; // Add this import

const LoginAdmin = () => {
    const navigate = useNavigate();
    const { dispatch } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await loginUser(dispatch, { username, password });
            navigate('/admin/dashboard');
        } catch (error) {
            setError(error.response?.data?.msg || 'Login failed');
        }
    };

    return (
        <div className=' min-h-screen rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark '>
            <div className='flex flex-wrap items-center min-h-screen '>
                <div className='hidden w-full xl:block xl:w-1/2 '>
                    <div className='py-18.5 px-26 text-center'>
                        <span className="'mb-5.5 inline-block ">
                            <img className='hidden dark:block' src={Logo} alt='Snipe Tech Pvt Ltd' />
                            <img className='dark:hidden' width={400} height={100}  src={LogoDark} alt='Snipe Tech Pvt Ltd' />
                        </span>
                        <p className='2xl:px-20'>
                            Login in to continue your activity!
                        </p>
                        <img className="mt-15 inline-block " src={LoginImg} alt='Logo' />
                    </div>
                </div>

                <div className='w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2'>
                    <div className='w-full p-4 sm:p-12.5 xl:p-17.5'>
                        <h2 className='mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2'>
                            Login to Admin
                        </h2>

                        <form>
                            <div className='mb-4'>
                                <label className='mb-2.5 block font-medium text-black dark:text-white'>
                                    Username
                                </label>
                                <div className='relative'>
                                    <input
                                        onChange={(e)=>{setUsername(e.target.value)}}
                                        type='username'
                                        placeholder='Enter your username'
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
                                    onChange={(e)=>{setPassword(e.target.value)}}
                                        type='password'
                                        placeholder='Enter your password'
                                        className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                    />
                                    <TfiLock className="absolute right-4 top-4 text-xl" />
                                </div>
                            </div>

                            <div className='mb-5'>
                                {/* <Link to='/admin/dashboard'> */}
                                    <input
                                        onClick={handleSubmit}
                                        type='submit'
                                        value='Login'
                                        className='w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90'
                                    />
                                {/* </Link> */}
                            </div>
                            {error && (
                                <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-500 dark:bg-red-100">
                                    <div className="flex items-center">
                                        <svg
                                            className="mr-2 h-4 w-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {error}
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginAdmin;
