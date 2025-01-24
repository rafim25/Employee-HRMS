import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';

const TopNavigation = ({ onLoginClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleWhatsAppClick = () => {
    const phoneNumber = '+919876543210';
    const message = 'Hi, I would like to know more about your projects.';
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-50 via-white to-blue-50 dark:from-boxdark dark:to-boxdark shadow-sm border-b border-blue-100/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo/Brand */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <span className="font-serif text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-primary transition-all duration-300">
                  Raghav
                </span>
                <span className="font-serif text-3xl font-light text-gray-700 dark:text-gray-200">
                  Elite
                </span>
                <span className="font-serif text-3xl font-bold text-primary dark:text-gray-200 group-hover:text-blue-600 transition-colors duration-300">
                  Projects
                </span>
              </Link>
            </div>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-4">
              {[
                { href: "#projects", label: "Upcoming Projects" },
                { href: "#gallery", label: "Gallery" },
                { href: "#completed", label: "Completed Projects" },
                { href: "#why-us", label: "Why Choose Us" },
                { href: "#contact", label: "Contact Us" },
              ].map((item) => (
                <NavLink key={item.href} href={item.href}>
                  {item.label}
                </NavLink>
              ))}
              
              {/* Login Button */}
              <button
                onClick={onLoginClick}
                className="px-6 py-2.5 text-base font-medium text-white bg-primary hover:bg-blue-600 
                rounded-lg transition-all duration-300 flex items-center space-x-2.5 
                hover:shadow-lg hover:shadow-blue-500/30 tracking-wide"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" 
                  />
                </svg>
                <span>Login</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-blue-50 dark:text-gray-200 dark:hover:bg-boxdark-2 transition-all duration-300"
              >
                <svg 
                  className="h-7 w-7" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <div className="py-3 space-y-2">
              {[
                { href: "#projects", label: "Upcoming Projects" },
                { href: "#gallery", label: "Gallery" },
                { href: "#completed", label: "Completed Projects" },
                { href: "#why-us", label: "Why Choose Us" },
                { href: "#contact", label: "Contact Us" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2.5 text-base font-medium text-gray-700 dark:text-gray-200 
                  hover:bg-blue-50 hover:text-primary dark:hover:bg-boxdark-2 rounded-lg
                  transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              
              {/* Mobile Login Button */}
              <button
                onClick={() => {
                  onLoginClick();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-base font-medium text-primary 
                hover:bg-blue-50 dark:hover:bg-boxdark-2 rounded-lg
                transition-all duration-300 flex items-center space-x-2"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" 
                  />
                </svg>
                <span>Login</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        className="fixed right-6 bottom-6 z-[9999] flex items-center justify-center w-14 h-14 
        bg-[#25D366] rounded-full shadow-lg hover:bg-[#20BA56] 
        transition-all duration-300 hover:scale-110 
        animate-bounce-slow group hover:shadow-xl hover:shadow-green-500/20"
      >
        <FaWhatsapp className="text-white text-3xl group-hover:scale-110 transition-transform duration-300" />
        
        {/* Tooltip */}
        <span className="absolute right-full mr-3 px-3 py-2 bg-white text-gray-700 
        text-sm font-medium rounded-lg shadow-lg whitespace-nowrap 
        opacity-0 group-hover:opacity-100 transition-opacity duration-300
        border border-gray-100">
          Chat with us on WhatsApp
          {/* Triangle Pointer */}
          <span className="absolute top-1/2 -right-2 -translate-y-1/2 
          border-6 border-transparent border-l-white"></span>
        </span>
      </button>
    </>
  );
};

const NavLink = ({ href, children }) => (
  <a
    href={href}
    className="relative px-5 py-2.5 text-base font-medium text-gray-700 dark:text-gray-200 rounded-lg 
    hover:text-primary hover:bg-blue-50/80 dark:hover:bg-boxdark-2 
    transition-all duration-300 group overflow-hidden tracking-wide"
  >
    {/* Hover effect background */}
    <span className="absolute inset-0 w-0 bg-blue-50 dark:bg-boxdark-2 transition-all duration-300 ease-out group-hover:w-full -z-10"></span>
    
    {/* Text content */}
    <span className="relative">
      {children}
    </span>
    
    {/* Bottom border animation */}
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
  </a>
);

export default TopNavigation; 