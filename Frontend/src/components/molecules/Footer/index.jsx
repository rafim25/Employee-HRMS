import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Us Section */}
          <div>
            <h6 className="text-xl font-semibold mb-4">About Us</h6>
            <p className="text-sm text-gray-200">
We are dedicated to providing the best real estate management solutions,
 helping clients streamline their property transactions efficiently and effectively.
            </p>
          </div>

          {/* Contact Info Section */}
          <div>
            <h6 className="text-xl font-semibold mb-4">Contact Info</h6>
            <div className="space-y-3">
              <div className="flex items-center">
                <MdEmail className="mr-2 text-xl" />
                <span className="text-sm">raghav.elite.projects@gmail.com</span>
              </div>
              <div className="flex items-center">
                <MdPhone className="mr-2 text-xl" />
                <span className="text-sm">+91 9900220446</span>
              </div>
              <div className="flex items-center">
                <MdLocationOn className="mr-2 text-xl" />
                <span className="text-sm">RAGHAVA ELITE PROJECTS
AMRUTHA COLONY, CHIKALPARVI ROAD
MANVI - 584123
</span>
              </div>
            </div>
          </div>

          {/* Follow Us Section */}
          <div>
            <h6 className="text-xl font-semibold mb-4">Follow Us</h6>
            <div className="flex space-x-4">
              <button className="hover:text-gray-300 transition-colors" aria-label="Facebook">
                <FaFacebook className="text-2xl" />
              </button>
              <button className="hover:text-gray-300 transition-colors" aria-label="Twitter">
                <FaTwitter className="text-2xl" />
              </button>
              <button className="hover:text-gray-300 transition-colors" aria-label="Instagram">
                <FaInstagram className="text-2xl" />
              </button>
              <button className="hover:text-gray-300 transition-colors" aria-label="LinkedIn">
                <FaLinkedin className="text-2xl" />
              </button>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-6 border-t border-gray-600 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Raghav Elite Projects. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;