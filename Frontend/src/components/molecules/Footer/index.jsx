import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaStar } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info Section */}
          <div>
            <h6 className="text-xl font-semibold mb-4">Seven Wings Technologies</h6>
            <div className="flex items-center mb-3">
              <div className="flex text-yellow-400">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <span className="ml-2 text-sm text-gray-200">3.012 Google reviews</span>
            </div>
            <p className="text-sm text-gray-200">
              Your trusted partner in recruitment and talent acquisition. We connect top talent with leading organizations across industries.
            </p>
          </div>

          {/* Contact Info Section */}
          <div>
            <h6 className="text-xl font-semibold mb-4">Contact Info</h6>
            <div className="space-y-3">
              <div className="flex items-start">
                <MdLocationOn className="mr-2 text-xl mt-1 flex-shrink-0" />
                <span className="text-sm">
                  Anugraha, No.313/313A, Siddhaiah Puranik Rd,
                  East Jayanagar, 3rd Stage 4th Block,
                  3rd Stage, Basaveshwar Nagar,
                  Bengaluru, Karnataka 560079
                </span>
              </div>
              <div className="flex items-center">
                <MdEmail className="mr-2 text-xl" />
                <a href="mailto:contact@sevenwingstech.com" className="text-sm hover:text-gray-300 transition-colors">
                  contact@sevenwingstech.com
                </a>
              </div>
              <div className="flex items-center">
                <MdPhone className="mr-2 text-xl" />
                <a href="tel:+919900220446" className="text-sm hover:text-gray-300 transition-colors">
                  +91 9900220446
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links & Social Section */}
          <div>
            <h6 className="text-xl font-semibold mb-4">Quick Links</h6>
            <ul className="space-y-2 mb-6">
              <li>
                <a href="#" className="text-sm hover:text-gray-300 transition-colors">
                  Job Openings
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-gray-300 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-gray-300 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-gray-300 transition-colors">
                  Career Resources
                </a>
              </li>
            </ul>

            <h6 className="text-xl font-semibold mb-3">Follow Us</h6>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-300 transition-colors" aria-label="Facebook">
                <FaFacebook className="text-2xl" />
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors" aria-label="Twitter">
                <FaTwitter className="text-2xl" />
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors" aria-label="Instagram">
                <FaInstagram className="text-2xl" />
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors" aria-label="LinkedIn">
                <FaLinkedin className="text-2xl" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-6 border-t border-gray-600 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Seven Wings Technologies. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;