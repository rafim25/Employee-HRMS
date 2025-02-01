import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../../../components/layouts/PublicLayout';
import FeatureHighlights from '../../../components/molecules/FeatureHighlights';
import Testimonials from '../../../components/molecules/Testimonial';
import { FaUserShield, FaLock, FaChartLine, FaUsers, FaFileInvoiceDollar, FaShieldAlt } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { api } from '../../../services/api';
import toast from 'react-hot-toast';
import { loginUser } from '../../../context/actions/authActions';
import { useAuth } from '../../../context/AuthContext';

const LoginAdmin = () => {
    const { dispatch } = useAuth();

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const loadingToast = toast.loading('Signing in...');

        try {
            const userData = await loginUser(dispatch, { 
                username: formData.username, 
                password: formData.password 
            });
            
            if (!userData) {
                throw new Error('No user data received');
            }
            const role = userData.role?.toLowerCase();
            localStorage.setItem('role', role);
            
            toast.success('Login successful!', { id: loadingToast });
            
            // Redirect based on role
            if (role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/pegawai/dashboard');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || 'Login failed', { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    const features = [
        {
            icon: <FaUsers className="text-2xl" />,
            title: 'User Management',
            description: 'Seamlessly manage user profiles and access controls with our intuitive interface.'
        },
        {
            icon: <FaFileInvoiceDollar className="text-2xl" />,
            title: 'Financial Tracking',
            description: 'Monitor transactions, generate reports, and maintain complete financial transparency.'
        },
        {
            icon: <FaChartLine className="text-2xl" />,
            title: 'Real-time Analytics',
            description: 'Access comprehensive analytics and insights to make data-driven decisions.'
        },
        {
            icon: <FaShieldAlt className="text-2xl" />,
            title: 'Secure Access',
            description: 'Enterprise-grade security ensuring your data remains protected at all times.'
        }
    ];

    return (
        <PublicLayout>
            <div className="min-h-screen bg-white dark:bg-boxdark">
                {/* Hero Section with Login */}
                <div className="container mx-auto px-4 py-8 lg:py-12">
                    <div className="max-w-7xl mx-auto">
                        {/* Welcome Header */}
                        <div className="text-center mb-12">
                            {/* <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary mb-6 
                                transform hover:scale-105 transition-transform duration-300">
                                <MdDashboard className="text-white text-5xl" />
                            </div> */}
                            <h1 className="text-4xl lg:text-5xl font-bold text-black dark:text-white mb-4">
                                Welcome to Raghav Elite Projects
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Access your personalized dashboard to manage all your activities in one secure place
                            </p>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                            {/* Left Column - Features */}
                            <div className="order-2 lg:order-1">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {features.map((feature, index) => (
                                        <div 
                                            key={index}
                                            className="bg-white dark:bg-boxdark rounded-xl 
                                                shadow-lg hover:shadow-xl p-6 
                                                transform hover:scale-105 transition-transform duration-300
                                                border-2 border-stroke dark:border-strokedark
                                                relative overflow-hidden"
                                        >
                                            <div className="relative z-10">
                                                <div className="w-14 h-14 rounded-lg bg-primary flex items-center justify-center mb-4">
                                                    <div className="text-white">
                                                        {feature.icon}
                                                    </div>
                                                </div>
                                                <h4 className="text-lg font-semibold text-black dark:text-white mb-3">
                                                    {feature.title}
                                                </h4>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Column - Login Form */}
                            <div className="order-1 lg:order-2">
                                <div className="max-w-md mx-auto">
                                    <div className="bg-white dark:bg-boxdark rounded-xl 
                                        shadow-2xl hover:shadow-3xl p-8 lg:p-10
                                        border-2 border-stroke dark:border-strokedark 
                                        transition-transform transition-shadow duration-300">
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="text-center mb-8">
                                                <h3 className="text-3xl font-bold text-black dark:text-white mb-3">
                                                    Sign In
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    Enter your credentials to access your account
                                                </p>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Username
                                                    </label>
                                                    <div className="relative group">
                                                        <input
                                                            type="text"
                                                            name="username"
                                                            value={formData.username}
                                                            onChange={handleChange}
                                                            placeholder="Enter your username"
                                                            className="w-full rounded-lg border-2 border-stroke bg-white py-4 pl-12 pr-6 
                                                            outline-none focus:border-primary hover:border-primary
                                                            dark:border-strokedark dark:bg-boxdark dark:hover:border-primary
                                                            text-black dark:text-white transition-all duration-300"
                                                            required
                                                        />
                                                        <span className="absolute left-4 top-4 text-gray-500 dark:text-gray-400
                                                            group-hover:text-primary transition-all duration-300">
                                                            <FaUserShield className="text-xl" />
                                                        </span>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Password
                                                    </label>
                                                    <div className="relative group">
                                                        <input
                                                            type="password"
                                                            name="password"
                                                            value={formData.password}
                                                            onChange={handleChange}
                                                            placeholder="Enter your password"
                                                            className="w-full rounded-lg border-2 border-stroke bg-white py-4 pl-12 pr-6 
                                                            outline-none focus:border-primary hover:border-primary
                                                            dark:border-strokedark dark:bg-boxdark dark:hover:border-primary
                                                            text-black dark:text-white transition-all duration-300"
                                                            required
                                                        />
                                                        <span className="absolute left-4 top-4 text-gray-500 dark:text-gray-400
                                                            group-hover:text-primary transition-all duration-300">
                                                            <FaLock className="text-xl" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="w-full rounded-lg bg-primary p-4 
                                                    text-white font-medium transition-all duration-300 
                                                    hover:bg-opacity-90 hover:shadow-lg hover:scale-[1.02]
                                                    disabled:opacity-70 disabled:cursor-not-allowed"
                                                >
                                                    {loading ? 'Signing in...' : 'Sign In'}
                                                </button>
                                            </div>

                                            <div className="text-center">
                                                <a
                                                    href="#"
                                                    className="text-primary font-medium hover:text-opacity-80 transition-all duration-300"
                                                >
                                                    Forgot Password?
                                                </a>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Sections with Improved Spacing */}
                <div className="bg-white dark:bg-boxdark">
                    <div className="container mx-auto px-4 py-16">
                        <div className="max-w-7xl mx-auto space-y-16">
                            <div className="bg-white dark:bg-boxdark rounded-xl shadow-xl p-8
                                border-2 border-stroke dark:border-strokedark transition-transform transition-shadow duration-300">
                                <FeatureHighlights />
                            </div>

                            <div className="bg-white dark:bg-boxdark rounded-xl shadow-xl p-8
                                border-2 border-stroke dark:border-strokedark transition-transform transition-shadow duration-300">
                                <Testimonials />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default LoginAdmin;
