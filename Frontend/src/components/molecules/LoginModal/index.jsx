import React, { useState } from 'react';
import { FiUser, FiX, FiMail } from 'react-icons/fi';
import { TfiLock } from 'react-icons/tfi';
import LoginImg from '../../../Assets/images/LoginImg/login.svg';

const LoginModal = ({ isOpen, onClose, onSubmit, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    onSubmit({
      username: isAdminLogin ? username : null,
      email: !isAdminLogin ? username : null,
      password,
      isAdminLogin
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/20 backdrop-blur-md rounded-xl w-full max-w-md p-8 relative shadow-2xl transform transition-all border border-white/30">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg 
          text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary 
          transition-colors duration-200 border border-white/50"
          aria-label="Close"
        >
          <FiX className="text-xl" />
        </button>

        <div className="text-center mb-6">
          <h2 className='text-2xl font-bold text-white mb-2'>
            {isAdminLogin ? 'Admin Login' : 'Guest Login'}
          </h2>
          <p className="text-white/80 text-sm">
            {isAdminLogin
              ? 'Enter your admin credentials to access the dashboard'
              : 'Enter your email and password to access your bookings'}
          </p>
        </div>

        <form onSubmit={(e) => { handleSubmit(e) }} className="space-y-5">
          <div className="flex items-center justify-end">
            <label className="flex items-center space-x-2 text-white text-sm">
              <input
                type="checkbox"
                checked={isAdminLogin}
                onChange={(e) => setIsAdminLogin(e.target.checked)}
                className="rounded border-white/30 bg-white/10 text-primary focus:ring-primary"
              />
              <span>Admin Login</span>
            </label>
          </div>

          <div>
            <label className='mb-2 block font-medium text-sm text-white'>
              {isAdminLogin ? 'Username' : 'Email'}
            </label>
            <div className='relative'>
              <input
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                type={isAdminLogin ? 'text' : 'email'}
                placeholder={isAdminLogin ? 'Enter your username' : 'Enter your email'}
                className='w-full rounded-lg border border-white/30 bg-white/10 py-3 pl-4 pr-10 text-sm outline-none 
                focus:border-primary focus-visible:shadow-none text-white placeholder-white/60
                focus:bg-white/20 transition-colors duration-200'
              />
              {isAdminLogin ? (
                <FiUser className="absolute right-3 top-3 text-lg text-white/70" />
              ) : (
                <FiMail className="absolute right-3 top-3 text-lg text-white/70" />
              )}
            </div>
          </div>

          <div>
            <label className='mb-2 block font-medium text-sm text-white'>
              Password
            </label>
            <div className='relative'>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type='password'
                placeholder='Enter your password'
                className='w-full rounded-lg border border-white/30 bg-white/10 py-3 pl-4 pr-10 text-sm outline-none 
                focus:border-primary focus-visible:shadow-none text-white placeholder-white/60
                focus:bg-white/20 transition-colors duration-200'
              />
              <TfiLock className="absolute right-3 top-3 text-lg text-white/70" />
            </div>
          </div>

          <button
            type='submit'
            className='w-full cursor-pointer rounded-lg border border-primary bg-primary/80 backdrop-blur-sm py-3 text-sm font-medium 
            text-white transition-all duration-200 hover:bg-opacity-90 hover:shadow-lg hover:shadow-primary/25
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50'
          >
            Login
          </button>

          {error && (
            <div className="rounded-md bg-red-500/20 backdrop-blur-sm p-3 text-sm text-white flex items-center border border-red-500/30">
              <svg
                className="mr-2 h-4 w-4 flex-shrink-0"
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