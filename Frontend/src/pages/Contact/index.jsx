import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import ImageHero from '../../components/Booking/ImageHero';
import TopNavigation from '../../components/molecules/TopNavigation';
import toast from 'react-hot-toast';
import axios from 'axios';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/email/contact/forestview', form);
      if (response.data.success) {
        toast.success('Message sent successfully!');
        setForm({ name: '', email: '', message: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black relative">
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <TopNavigation />
      </div>

      {/* Fixed Background Hero */}
      <ImageHero
        imageSrc="/images/resort-bg.jpg"
      />

      {/* Glassy Contact Card Overlay */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, type: 'spring' }}
              className="w-full max-w-6xl mx-auto"
            >
              <div className='mt-16'>
                {/* Page Title */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center mb-12"
                >
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                    Contact Us
                  </h1>
                  <p className="text-xl text-white/90 max-w-2xl mx-auto">
                    Get in touch with our team
                  </p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Contact Information */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                  >
                    <h2 className="text-3xl font-bold text-white mb-6">Let's Connect</h2>
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-primary/20 p-3 rounded-lg">
                          <FaMapMarkerAlt className="text-primary text-xl" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold mb-1">Our Location</h3>
                          <p className="text-white">Maranahalli, Sakaleshpur, Karnataka</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="bg-primary/20 p-3 rounded-lg">
                          <FaPhone className="text-primary text-xl" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold mb-1">Phone Number</h3>
                          <p className="text-white">+91 8123432999</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="bg-primary/20 p-3 rounded-lg">
                          <FaEnvelope className="text-primary text-xl" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold mb-1">Email Address</h3>
                          <p className="text-white">unnathiforestview@gmail.com</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Contact Form */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                  >
                    <h2 className="text-3xl font-bold text-white mb-6">Send Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          placeholder="Your Name"
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          placeholder="Your Email"
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      <div>
                        <textarea
                          name="message"
                          rows="4"
                          value={form.message}
                          onChange={handleChange}
                          required
                          placeholder="Your Message"
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg transition-all duration-300 font-semibold flex items-center justify-center space-x-2 disabled:opacity-70"
                      >
                        {loading ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <span>Send Message</span>
                        )}
                      </button>
                    </form>
                  </motion.div>
                </div>

                {/* Map Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                >
                  <h3 className="text-xl font-bold text-white mb-4">Find Us Here</h3>
                  <div className="rounded-xl overflow-hidden h-[300px] border border-white/20">
                    <iframe
                      title="Unnathi Forest View Map"
                      src="https://maps.google.com/maps?q=12.871403,75.716255&z=15&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 