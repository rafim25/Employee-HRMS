import React, { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiUser, FiMessageSquare } from 'react-icons/fi';
import PublicLayout from '../../components/layouts/PublicLayout';
import { api } from '../../services/api';
import Carousel from '../../components/molecules/Carousel';

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
      <div className="w-full">
        <Carousel />
      </div>

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
              Your Dream Home Awaits
            </p>
          </div>

          {/* Contact Form and Info Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>
              
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
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Office Address */}
              <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg p-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg">
                    <FiMapPin className="text-2xl text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Office Address
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      RAGHAVA ELITE PROJECTS<br />
                      (REG NO: BLY-P-110-2023-24)<br />
                      AMRUTHA COLONY, CHIKALPARVI ROAD<br />
                      MANVI<br />
                      MOB: 9686918665, 9900220446
                    </p>
                    <button 
                      onClick={() => window.open('https://maps.google.com/?q=RAGHAVA+ELITE+PROJECTS+MANVI', '_blank')}
                      className="mt-3 text-primary hover:text-blue-600 flex items-center gap-1"
                    >
                      View on Google Maps →
                    </button>
                  </div>
                </div>
              </div>

              {/* Layout Address */}
              <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg p-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg">
                    <FiMapPin className="text-2xl text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Layout Address
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      9TH WARD, OPP: SRIRAM INDUSTRY<br />
                      NEAR FOREST RANGE OFFICE<br />
                      MUSTOOR ROAD, MANVI-583123
                    </p>
                    <button 
                      onClick={() => window.open('https://maps.google.com/?q=SRIRAM+INDUSTRY+MANVI', '_blank')}
                      className="mt-3 text-primary hover:text-blue-600 flex items-center gap-1"
                    >
                      View on Google Maps →
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact Numbers */}
              <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg p-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg">
                    <FiPhone className="text-2xl text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Contact Numbers
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Main: +91 9686918665<br />
                      Office: +91 9686918665<br />
                      Support: +91 9686918665
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Addresses */}
              <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg p-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg">
                    <FiMail className="text-2xl text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Email Addresses
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Info: raghav.elite.projects@gmail.com<br />
                      Support: raghav.elite.projects@gmail.com<br />
                      Sales: raghav.elite.projects@gmail.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps Section */}
          <div className="mt-12">
            <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg p-4">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3835.8067521882244!2d77.05019899999999!3d15.971465100000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb7d10058cee913%3A0x66b0e7032568c2b!2sRAGHAV%20ELITE%20PROJECTS!5e0!3m2!1sen!2sin!4v1738206121713!5m2!1sen!2sin"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-white dark:bg-boxdark py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2024 Raghav Elite Projects. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </PublicLayout>
  );
};

export default Contact; 