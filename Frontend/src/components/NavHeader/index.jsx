import React from 'react';
import { Link } from 'react-router-dom';

const NavHeader = () => {
  return (
    <header className="bg-white/90 backdrop-blur-md shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-primary">Unnathi Forest View</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/rooms" className="text-gray-700 hover:text-primary transition-colors">
              Rooms
            </Link>
            <Link to="/activities" className="text-gray-700 hover:text-primary transition-colors">
              Activities
            </Link>
            <Link to="/dining" className="text-gray-700 hover:text-primary transition-colors">
              Dining
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          {/* CTA Button */}
          <Link
            to="/reservation"
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Book Now
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default NavHeader; 