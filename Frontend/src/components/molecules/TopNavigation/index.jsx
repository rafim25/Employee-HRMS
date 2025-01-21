import React from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';

const TopNavigation = ({ onLoginClick }) => {
  const handleWhatsAppClick = () => {
    const phoneNumber = '+919876543210';
    const message = 'Hi, I would like to know more about your projects.';
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-50 via-white to-blue-50 dark:from-boxdark dark:to-boxdark shadow-sm border-b border-blue-100/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <span className="font-serif text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-primary transition-all duration-300">
                  Raghav
                </span>
                <span className="font-serif text-xl font-light text-gray-700 dark:text-gray-200">
                  Elite
                </span>
                <span className="font-serif text-xl font-bold text-primary dark:text-gray-200 group-hover:text-blue-600 transition-colors duration-300">
                  Projects
                </span>
              </Link>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex space-x-2">
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
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-blue-600 
                rounded-lg transition-all duration-300 flex items-center space-x-2 
                hover:shadow-lg hover:shadow-blue-500/30 tracking-wide"
              >
                <svg 
                  className="w-4 h-4" 
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
              <button className="p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-blue-50 dark:text-gray-200 dark:hover:bg-boxdark-2 transition-all duration-300">
                <svg 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16" 
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        className="fixed left-6 bottom-6 z-[9999] flex items-center justify-center w-12 h-12 
        bg-green-500 rounded-full shadow-lg hover:bg-green-600 
        transition-all duration-300 hover:scale-110 
        animate-bounce-slow group"
      >
        <FaWhatsapp className="text-white text-2xl group-hover:scale-110 transition-transform duration-300" />
        
        {/* Tooltip */}
        <span className="absolute left-full ml-3 px-3 py-1.5 bg-white text-gray-700 
        text-xs font-medium rounded-lg shadow-lg whitespace-nowrap 
        opacity-0 group-hover:opacity-100 transition-opacity duration-300
        border border-gray-100">
          Chat with us on WhatsApp
          {/* Triangle Pointer */}
          <span className="absolute top-1/2 -left-2 -translate-y-1/2 
          border-6 border-transparent border-r-white"></span>
        </span>
      </button>
    </>
  );
};

const NavLink = ({ href, children }) => (
  <a
    href={href}
    className="relative px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-lg 
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