import React, { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiUser, FiMessageSquare } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import TopNavigation from '../../components/molecules/TopNavigation';
import FeatureHighlights from '../../components/molecules/FeatureHighlights';
import Carousel from '../../components/molecules/Carousel';
import logo from '../../Assets/images/logo/logo-dark.png';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleWhatsAppClick = () => {
    const phoneNumber = '9686918665';
    const message = 'Hi, I would like to know more about your projects.';
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleLoginClick = () => {
    // Handle login click if needed
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-boxdark dark:to-boxdark-2 flex flex-col">
      {/* Navigation */}
      <TopNavigation onLoginClick={handleLoginClick} />

      {/* Carousel Section */}
      <div className="w-full">
        <Carousel />
      </div>

      {/* Feature Highlights */}
      {/* <div className="py-8">
        <FeatureHighlights />
      </div> */}

      {/* Contact Content */}
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Main Heading */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              The Biggest Project In Manvi
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
              Anyone Can Dream
            </p>
            <p className="text-2xl text-primary font-semibold">
              "Your Site In Raghav Elite"
            </p>
          </div>

          {/* Contact Form and Map Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Contact Form */}
            <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-semibold mb-6">Get in Touch</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Google Map */}
            <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3841.989046895411!2d77.05435091477558!3d15.671675989126277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb78bde7f4b9a67%3A0x5f4b5b4b4b4b4b4b!2sRaghav%20Elite%20Projects!5e0!3m2!1sen!2sin!4v1621234567890!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Contact Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Office Address */}
            <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg p-8">
              <div className="flex items-start mb-6">
                <FiMapPin className="text-primary text-2xl mr-4 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Office Address</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    RAGHAVA ELITE PROJECTS<br />
                    (REG NO: BLY-P-110-2023-24)<br />
                    AMRUTHA COLONY, CHIKALPARVI ROAD, MANVI<br />
                    MOB: 9686918665, 9900220446
                  </p>
                  <a 
                    href="https://maps.app.goo.gl/gcVuVYRte4PZMAHn6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline mt-2 inline-block"
                  >
                    View on Google Maps →
                  </a>
                </div>
              </div>
            </div>

            {/* Layout Address */}
            <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg p-8">
              <div className="flex items-start mb-6">
                <FiMapPin className="text-primary text-2xl mr-4 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Layout Address</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    9TH WARD, OPP: SRIRAM INDUSTRY<br />
                    NEAR FOREST RANGE OFFICE<br />
                    MUSTOOR ROAD, MANVI-583123
                  </p>
                  <a 
                    href="https://maps.app.goo.gl/gcVuVYRte4PZMAHn6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline mt-2 inline-block"
                  >
                    View on Google Maps →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Buttons */}
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <button
              onClick={handleWhatsAppClick}
              className="flex items-center px-6 py-3 bg-[#25D366] text-white rounded-lg hover:bg-[#20BA56] transition-all duration-300"
            >
              <span className="mr-2">Chat on WhatsApp</span>
            </button>
            
            <a
              href="tel:+919686918665"
              className="flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
            >
              <FiPhone className="mr-2" />
              <span>Call Us</span>
            </a>
            
            <a
              href="mailto:info@raghavprojects.com"
              className="flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
            >
              <FiMail className="mr-2" />
              <span>Email Us</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 