import React from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import sevenWingsLogo from '../../../Assets/images/logo/logo-dark.png';

const TopNavigation = ({ onLoginClick, overlay = false }) => {
  const handleWhatsAppClick = () => {
    const phoneNumber = '+919900220446';
    const message = 'Hi, I would like to know more about your projects.';
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      <header
        className={`${
          overlay
            ? 'absolute top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/50 via-black/20 to-transparent'
            : 'relative z-40 w-full bg-[#0b1d36]/95 backdrop-blur-md shadow-lg'
        } transition-all duration-300`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-[96px] lg:h-[112px]">
            <Link to="/" className="flex items-center shrink-0">
              <img
                src={sevenWingsLogo}
                alt="Seven Wings Technologies"
                className="h-16 sm:h-[4.5rem] lg:h-20 w-auto object-contain rounded-md bg-white/95 shadow-lg shadow-black/25 ring-1 ring-white/40"
              />
            </Link>
            <button
              type="button"
              onClick={onLoginClick}
              className="px-5 lg:px-6 py-2.5 text-sm font-semibold tracking-wide text-[#0b1d36] bg-[#d4af37] hover:bg-[#e3c356] rounded-full transition-all duration-300 shadow-lg shadow-black/25"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      <button
        onClick={handleWhatsAppClick}
        className="fixed right-6 bottom-6 z-[9999] flex items-center justify-center w-14 h-14
        bg-[#25D366] rounded-full shadow-lg hover:bg-[#20BA56]
        transition-all duration-300 hover:scale-110 group"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="text-white text-3xl" />
        <span className="absolute right-full mr-3 px-3 py-2 bg-white text-gray-700
        text-sm font-medium rounded-lg shadow-lg whitespace-nowrap
        opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
          Chat with us on WhatsApp
        </span>
      </button>
    </>
  );
};

export default TopNavigation;
