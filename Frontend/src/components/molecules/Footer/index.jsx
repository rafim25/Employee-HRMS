import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaStar } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import sevenWingsLogo from '../../../Assets/images/logo/logo-dark.png';

const Footer = () => {
  return (
    <footer className="bg-[#0b1d36] text-white py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info Section */}
          <div>
            <img
              src={sevenWingsLogo}
              alt="Seven Wings Technologies"
              className="h-14 w-auto object-contain bg-white rounded-md mb-4 p-1"
            />
            <div className="flex items-center mb-3">
              <div className="flex text-[#d4af37]">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <span className="ml-2 text-sm text-white/70">3.012 Google reviews</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Your trusted partner in recruitment and talent acquisition. We connect top talent with leading organizations across industries.
            </p>
          </div>

          {/* Contact Info Section */}
          <div>
            <h6 className="text-sm font-semibold tracking-[0.16em] uppercase text-[#d4af37] mb-4">Contact</h6>
            <div className="space-y-3">
              <div className="flex items-start">
                <MdLocationOn className="mr-2 text-xl mt-1 flex-shrink-0" />
                <span className="text-sm text-white/75">
                  Anugraha, No.313/313A, Siddhaiah Puranik Rd,
                  East Jayanagar, 3rd Stage 4th Block,
                  3rd Stage, Basaveshwar Nagar,
                  Bengaluru, Karnataka 560079
                </span>
              </div>
              <div className="flex items-center">
                <MdEmail className="mr-2 text-xl" />
                <a href="mailto:contact@sevenwingstech.com" className="text-sm text-white/80 hover:text-[#d4af37] transition-colors">
                  contact@sevenwingstech.com
                </a>
              </div>
              <div className="flex items-start">
                <MdPhone className="mr-2 text-xl mt-1" />
                <div className="flex flex-col">
                  <a href="tel:+919964009363" className="text-sm text-white/80 hover:text-[#d4af37] transition-colors">
                    +91 9964009363
                  </a>
                  <a href="tel:+919036413385" className="text-sm text-white/80 hover:text-[#d4af37] transition-colors">
                    +91 90364 13385
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links & Social Section */}
          <div>
            <h6 className="text-sm font-semibold tracking-[0.16em] uppercase text-[#d4af37] mb-4">Explore</h6>
            <ul className="space-y-2 mb-6">
              <li>
                <Link to="/careers" className="text-sm text-white/80 hover:text-[#d4af37] transition-colors">
                  Job openings
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-white/80 hover:text-[#d4af37] transition-colors">
                  Contact us
                </Link>
              </li>
            </ul>

            <h6 className="text-sm font-semibold tracking-[0.16em] uppercase text-[#d4af37] mb-3">Follow us</h6>
            <div className="flex space-x-4">
              <a href="#" className="text-white/80 hover:text-[#d4af37] transition-colors" aria-label="Facebook">
                <FaFacebook className="text-2xl" />
              </a>
              <a href="#" className="text-white/80 hover:text-[#d4af37] transition-colors" aria-label="Twitter">
                <FaTwitter className="text-2xl" />
              </a>
              <a href="#" className="text-white/80 hover:text-[#d4af37] transition-colors" aria-label="Instagram">
                <FaInstagram className="text-2xl" />
              </a>
              <a href="#" className="text-white/80 hover:text-[#d4af37] transition-colors" aria-label="LinkedIn">
                <FaLinkedin className="text-2xl" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} Seven Wings Technologies. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;