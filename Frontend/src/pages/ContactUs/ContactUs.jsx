import React, { useState } from 'react';
import Layout from '../../components/Layout';
import Carousel from '../../components/molecules/Carousel';
import TopNavigation from "../../components/molecules/TopNavigation";
import LoginModal from '../../components/molecules/LoginModal';
import FeatureHighlights from '../../components/molecules/FeatureHighlights';
import Testimonials from '../../components/molecules/Testimonial';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../context/actions/authActions';

const ContactUs = () => {
    const navigate = useNavigate();
    const { dispatch } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            await loginUser(dispatch, { username, password });
            navigate('/admin/dashboard');
        } catch (error) {
            setError(error.response?.data?.msg || 'Login failed');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <Layout>
            <div className='w-full'>
                <Carousel />
            </div>

            <div className='max-w-7xl mx-auto px-4 py-12 w-full'>
                <h1 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
                    Get in Touch
                </h1>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
                    {/* Contact Form */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Send us a Message</h2>
                        <form className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Office Address</h2>
                            <div className="space-y-4 text-gray-600 dark:text-gray-300">
                                <p className="flex items-center">
                                    <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    </svg>
                                    RAGHAVA ELITE PROJECTS
                                </p>
                                <p className="ml-9">(REG NO: BLY-F-110-2023-24)</p>
                                <p className="ml-9">AMRUTHA COLONY, CHIKALPARVI ROAD, MANVI</p>
                                <p className="flex items-center">
                                    <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                    </svg>
                                    9686918665, 9900220446
                                </p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Layout Address</h2>
                            <div className="space-y-4 text-gray-600 dark:text-gray-300">
                                <p className="flex items-center">
                                    <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                                    </svg>
                                    9TH WARD, OPP: SRIRAM INDUSTRY
                                </p>
                                <p className="ml-9">NEAR FOREST RANGE OFFICE</p>
                                <p className="ml-9">MUSTOOR ROAD, MANVI-583123</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white text-center">Our Location</h2>
                    <div className="rounded-lg overflow-hidden">
                        <iframe
                            title="Google Map"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3841.7897726512513!2d77.05392287485566!3d15.67657048482115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb7d0c7f9c0c001%3A0x4c7d8e6f7f9c0c00!2sRaghav%20Elite%20Projects!5e0!3m2!1sen!2sin!4v1710400000000!5m2!1sen!2sin"
                            width="100%"
                            height="400"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                    <div className="mt-4 text-center">
                        <a 
                            href="https://maps.app.goo.gl/py7Jwrqmpd2S1WWR9"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            <span>Open in Google Maps</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* <FeatureHighlights />

            <div className='border-t border-stroke dark:border-strokedark'>
                <div className='container mx-auto py-4'>
                    <Testimonials />
                </div>
            </div> */}

            {/* <footer className="bg-white dark:bg-boxdark py-2 border-t border-stroke dark:border-strokedark">
                <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
                    <p>&copy; 2024 Raghav Elite Projects. All rights reserved.</p>
                </div>
            </footer> */}

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onSubmit={handleLoginSubmit}
                error={error}
                username={username}
                password={password}
                setUsername={setUsername}
                setPassword={setPassword}
            />
        </Layout>
    );
};

export default ContactUs; 