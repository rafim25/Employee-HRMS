import React, { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiUser, FiMessageSquare } from 'react-icons/fi';
import PublicLayout from '../../components/layouts/PublicLayout';
import { api } from '../../services/api';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    success: false,
    error: null
  });

  const handleWhatsAppClick = () => {
    const phoneNumber = '9686918665';
    const message = 'Hi, I would like to know more about your projects.';
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ loading: true, success: false, error: null });

    try {
      const response = await api.post('/api/email/contact', formData);
      
      if (response.data.success) {
        setSubmitStatus({
          loading: false,
          success: true,
          error: null
        });
        // Reset form
        setFormData({ name: '', email: '', phone: '', message: '' });
        
        // Show success message for 5 seconds
        setTimeout(() => {
          setSubmitStatus(prev => ({ ...prev, success: false }));
        }, 5000);
      }
    } catch (error) {
      setSubmitStatus({
        loading: false,
        success: false,
        error: error.response?.data?.message || 'Failed to send message. Please try again.'
      });
      
      // Clear error after 5 seconds
      setTimeout(() => {
        setSubmitStatus(prev => ({ ...prev, error: null }));
      }, 5000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-white dark:bg-boxdark">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-black dark:text-white mb-4">
                Contact Us
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Get in touch with us for any inquiries or support
              </p>
            </div>

            {/* Contact Form and Info Grid */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-boxdark rounded-xl 
                  shadow-xl hover:shadow-2xl p-8
                  border-2 border-stroke dark:border-strokedark 
                  transition-all duration-300"
              >
                <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Send us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                      Your Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                        focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-boxdark-2
                        text-gray-900 dark:text-gray-100"
                        placeholder="John Doe"
                      />
                      <FiUser className="absolute right-3 top-3.5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                        focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-boxdark-2
                        text-gray-900 dark:text-gray-100"
                        placeholder="john@example.com"
                      />
                      <FiMail className="absolute right-3 top-3.5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                        focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-boxdark-2
                        text-gray-900 dark:text-gray-100"
                        placeholder="+1 (555) 000-0000"
                      />
                      <FiPhone className="absolute right-3 top-3.5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                      Message
                    </label>
                    <div className="relative">
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows="4"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                        focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-boxdark-2
                        text-gray-900 dark:text-gray-100"
                        placeholder="Your message here..."
                      ></textarea>
                      <FiMessageSquare className="absolute right-3 top-3.5 text-gray-400" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitStatus.loading}
                    className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium
                    hover:bg-blue-600 transition-colors duration-300 disabled:opacity-50"
                  >
                    {submitStatus.loading ? 'Sending...' : 'Send Message'}
                  </button>

                  {submitStatus.success && (
                    <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg">
                      Message sent successfully!
                    </div>
                  )}

                  {submitStatus.error && (
                    <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
                      {submitStatus.error}
                    </div>
                  )}
                </form>
              </motion.div>

              {/* Contact Information */}
              <div className="space-y-6">
                {[
                  {
                    icon: <FiMapPin />,
                    title: "Office Address",
                    content: `RAGHAVA ELITE PROJECTS\n(REG NO: BLY-P-110-2023-24)\nAMRUTHA COLONY, CHIKALPARVI ROAD\nMANVI\nMOB: 9686918665, 9900220446`
                  },
                  {
                    icon: <FiMapPin />,
                    title: "Layout Address",
                    content: `9TH WARD, OPP: SRIRAM INDUSTRY\nNEAR FOREST RANGE OFFICE\nMUSTOOR ROAD, MANVI-584123`,
                    onClick: () => window.open('https://maps.app.goo.gl/LC3v5tY1Xf5hbegp7', '_blank')
                  },
                  {
                    icon: <FiPhone />,
                    title: "Contact Numbers",
                    content: `Main: +91 9686918665\nOffice: +91 9686918665\nSupport: +91 9686918665`
                  },
                  {
                    icon: <FiMail />,
                    title: "Email Addresses",
                    content: `Info: raghav.elite.projects@gmail.com\nSupport: raghav.elite.projects@gmail.com\nSales: raghav.elite.projects@gmail.com`
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`bg-white dark:bg-boxdark rounded-xl 
                      shadow-lg hover:shadow-xl p-6
                      transform hover:scale-105 transition-all duration-300
                      border-2 border-stroke dark:border-strokedark
                      group ${item.onClick ? 'cursor-pointer' : ''}`}
                    onClick={item.onClick}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center
                        transform group-hover:scale-110 transition-transform duration-300">
                        <div className="text-white text-xl">
                          {item.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-black dark:text-white mb-2 flex items-center gap-2">
                          {item.title}
                          {item.onClick && <FiMapPin className="text-primary animate-bounce" />}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                          {item.content}
                        </p>
                        {item.onClick && (
                          <p className="text-primary mt-2 text-sm">Click to open in Google Maps</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12 mb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-boxdark rounded-xl shadow-xl p-4
                  border-2 border-stroke dark:border-strokedark"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3835.8067521882244!2d77.05019899999999!3d15.971465100000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb7d10058cee913%3A0x66b0e7032568c2b!2sRAGHAV%20ELITE%20PROJECTS!5e0!3m2!1sen!2sin!4v1738206121713!5m2!1sen!2sin"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Contact; 