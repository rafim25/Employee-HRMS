import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import logoDark from '../../../Assets/images/logo/logo-dark.png?url';

const Footer = () => {
  return (
    <footer className="bg-green-700 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Unnathi Forest View</h3>
            <p className="text-white/80">Experience luxury and tranquility in the heart of nature.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-white/80 hover:text-white">About Us</Link></li>
              <li><Link to="/rooms" className="text-white/80 hover:text-white">Rooms</Link></li>
              <li><Link to="/activities" className="text-white/80 hover:text-white">Activities</Link></li>
              <li><Link to="/contact" className="text-white/80 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Info</h3>
            <ul className="space-y-2">
              <li className="text-white/80">Maranahalli, Sakaleshpur, Karnataka</li>
              <li className="text-white/80">Phone: +91 8123432999</li>
              <li className="text-white/80">Email: unnathiforestview@gmail.com</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/unnathi.forest.view/" target="_blank" className="text-white/80 hover:text-white"><FaFacebook /></a>
              {/* <a href="#" className="text-white/80 hover:text-white"><FaTwitter /></a> */}
              <a href="https://www.instagram.com/unnathi_forest_view/?igsh=MXBnYTNpM2tycHp5OA%3D%3D" target="_blank" className="text-white/80 hover:text-white"><FaInstagram /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/20 text-center text-white/80">
          <p>&copy; 2025 Unnathi Forest View. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;