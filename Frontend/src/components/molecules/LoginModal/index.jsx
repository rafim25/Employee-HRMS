import React from 'react';
import { FiUser, FiX } from 'react-icons/fi';
import { TfiLock } from 'react-icons/tfi';
import LoginImg from '../../../Assets/images/LoginImg/login.svg';

const LoginModal = ({ isOpen, onClose, onSubmit, error, username, password, setUsername, setPassword }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-boxdark rounded-lg w-full max-w-md p-5 relative">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 
          transition-colors duration-200"
        >
          <FiX className="text-xl" />
        </button>

        <div className="text-center mb-4">
          <h2 className='text-xl font-bold text-black dark:text-white 
           from-primary/5 to-blue-500/5 
          py-2 '>
            Login to Admin
          </h2>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className=''>
            <label className='mb-1.5 block font-medium text-sm text-black dark:text-white'>
              Username
            </label>
            <div className='relative'>
              <input
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                type='text'
                placeholder='Enter your username'
                className='w-full rounded-lg border border-stroke bg-transparent py-2.5 pl-4 pr-8 text-sm outline-none 
                focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input 
                dark:focus:border-primary transition-colors duration-200'
              />
              <FiUser className="absolute right-3 top-2.5 text-lg text-gray-500" />
            </div>
          </div>

          <div className=''>
            <label className='mb-1.5 block font-medium text-sm text-black dark:text-white'>
              Password
            </label>
            <div className='relative'>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type='password'
                placeholder='Enter your password'
                className='w-full rounded-lg border border-stroke bg-transparent py-2.5 pl-4 pr-8 text-sm outline-none 
                focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input 
                dark:focus:border-primary transition-colors duration-200'
              />
              <TfiLock className="absolute right-3 top-2.5 text-lg text-gray-500" />
            </div>
          </div>

          <button
            type='submit'
            className='w-full cursor-pointer rounded-lg border border-primary bg-primary py-2.5 text-sm font-medium 
            text-white transition-all duration-200 hover:bg-opacity-90 hover:shadow-lg hover:shadow-primary/25'
          >
            Login
          </button>

          {error && (
            <div className="rounded-md bg-red-50 p-2.5 text-xs text-red-500 dark:bg-red-100 flex items-center">
              <svg
                className="mr-2 h-3 w-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="flex-1">{error}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginModal; 