import React, { useEffect } from 'react';
import { FiUser, FiX } from 'react-icons/fi';
import { TfiLock } from 'react-icons/tfi';

const LoginModal = ({ isOpen, onClose, onSubmit, error, username, password, setUsername, setPassword }) => {
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close login"
        onClick={onClose}
      />
      <div
        className="absolute top-20 right-4 left-4 sm:left-auto sm:w-[380px] bg-white rounded-2xl shadow-2xl p-6 sm:p-7"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors duration-200"
          aria-label="Close"
        >
          <FiX className="text-xl" />
        </button>

        <div className="mb-5 pr-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#d4af37] font-semibold mb-1">Seven Wings</p>
          <h2 id="login-title" className="text-2xl font-bold text-[#0b1d36]">
            Sign in
          </h2>
          <p className="text-sm text-gray-500 mt-1">Access your HRMS workspace</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block font-medium text-sm text-[#0b1d36]">
              Username
            </label>
            <div className="relative">
              <input
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                type="text"
                placeholder="Enter your username"
                className="w-full rounded-lg border border-stroke bg-transparent py-2.5 pl-4 pr-8 text-sm outline-none
                focus:border-[#d4af37] transition-colors duration-200"
                required
              />
              <FiUser className="absolute right-3 top-2.5 text-lg text-gray-500" />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block font-medium text-sm text-[#0b1d36]">
              Password
            </label>
            <div className="relative">
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-lg border border-stroke bg-transparent py-2.5 pl-4 pr-8 text-sm outline-none
                focus:border-[#d4af37] transition-colors duration-200"
                required
              />
              <TfiLock className="absolute right-3 top-2.5 text-lg text-gray-500" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer rounded-full bg-[#0b1d36] py-2.5 text-sm font-semibold
            text-white transition-all duration-200 hover:bg-[#123056]"
          >
            Login
          </button>

          {error && (
            <div className="rounded-md bg-red-50 p-2.5 text-xs text-red-500 flex items-center">
              <span className="flex-1">{error}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
