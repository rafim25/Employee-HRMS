import React from 'react';
import PublicLayout from '../../components/layouts/PublicLayout';
import { motion } from 'framer-motion';
import { 
    FaAward, FaHandshake, FaHeart, FaShieldAlt, FaClock, FaUserTie,
    FaTree, FaWater, FaRoad, FaLightbulb, FaCamera, FaWifi,
    FaParking, FaRunning, FaChild, FaLock, FaUmbrella, FaRecycle
} from 'react-icons/fa';

const WhyChooseUs = () => {
    const reasons = [
        {
            icon: <FaAward className="text-3xl" />,
            title: "Quality Assurance",
            description: "We maintain the highest standards in construction and materials."
        },
        {
            icon: <FaHandshake className="text-3xl" />,
            title: "Trust & Reliability",
            description: "Building relationships through transparency and dependability."
        },
        {
            icon: <FaHeart className="text-3xl" />,
            title: "Customer Satisfaction",
            description: "Your happiness is our top priority in every project."
        },
        {
            icon: <FaShieldAlt className="text-3xl" />,
            title: "Security",
            description: "Ensuring your investment is protected at every step."
        },
        {
            icon: <FaClock className="text-3xl" />,
            title: "Timely Delivery",
            description: "We value your time and stick to project schedules."
        },
        {
            icon: <FaUserTie className="text-3xl" />,
            title: "Expert Team",
            description: "Skilled professionals dedicated to excellence."
        }
    ];

    const facilities = [
        {
            icon: <FaTree className="text-3xl" />,
            title: "Landscaped Gardens",
            description: "Beautiful green spaces for relaxation"
        },
        {
            icon: <FaWater className="text-3xl" />,
            title: "24/7 Water Supply",
            description: "Uninterrupted water supply with purification"
        },
        {
            icon: <FaRoad className="text-3xl" />,
            title: "Wide Roads",
            description: "Well-planned roads with proper lighting"
        },
        {
            icon: <FaLightbulb className="text-3xl" />,
            title: "Power Backup",
            description: "24/7 power backup for essential areas"
        },
        {
            icon: <FaCamera className="text-3xl" />,
            title: "CCTV Surveillance",
            description: "Round-the-clock security monitoring"
        },
        {
            icon: <FaWifi className="text-3xl" />,
            title: "Internet Ready",
            description: "Pre-installed fiber optic connectivity"
        },
        {
            icon: <FaParking className="text-3xl" />,
            title: "Parking Space",
            description: "Designated parking for residents"
        },
        {
            icon: <FaRunning className="text-3xl" />,
            title: "Jogging Track",
            description: "Dedicated track for fitness enthusiasts"
        },
        {
            icon: <FaChild className="text-3xl" />,
            title: "Children's Play Area",
            description: "Safe and fun space for kids"
        },
        {
            icon: <FaLock className="text-3xl" />,
            title: "Gated Community",
            description: "Secure entrance with 24/7 security"
        },
        {
            icon: <FaUmbrella className="text-3xl" />,
            title: "Rain Water Harvesting",
            description: "Sustainable water conservation"
        },
        {
            icon: <FaRecycle className="text-3xl" />,
            title: "Waste Management",
            description: "Organized waste collection & disposal"
        }
    ];

    return (
        <PublicLayout>
            <div className="min-h-screen bg-white dark:bg-boxdark">
                {/* Hero Section */}
                <div className="container mx-auto px-4 py-8 lg:py-12">
                    <div className="max-w-7xl mx-auto">
                        {/* Welcome Header */}
                        <div className="text-center mb-12">
                            <h1 className="text-4xl lg:text-5xl font-bold text-black dark:text-white mb-4">
                                Why Choose Us
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Discover the unique advantages of partnering with Raghav Elite Projects
                            </p>
                        </div>

                        {/* Reasons Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                            {reasons.map((reason, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-white dark:bg-boxdark rounded-xl 
                                        shadow-lg hover:shadow-xl p-8
                                        transform hover:scale-105 transition-all duration-300
                                        border-2 border-stroke dark:border-strokedark
                                        group"
                                >
                                    <div className="w-16 h-16 rounded-lg bg-primary flex items-center justify-center mb-6
                                        transform group-hover:scale-110 transition-transform duration-300">
                                        <div className="text-white">
                                            {reason.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-black dark:text-white mb-4">
                                        {reason.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {reason.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Facilities Section */}
                        <div className="mt-20">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl lg:text-4xl font-bold text-black dark:text-white mb-4">
                                    World-Class Facilities
                                </h2>
                                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                    Experience luxury living with our premium amenities and facilities
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {facilities.map((facility, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="bg-white dark:bg-boxdark rounded-xl p-6
                                            shadow-lg hover:shadow-xl
                                            transform hover:scale-105 transition-all duration-300
                                            border-2 border-stroke dark:border-strokedark
                                            group flex items-center space-x-4"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center
                                            transform group-hover:scale-110 transition-transform duration-300">
                                            <div className="text-primary">
                                                {facility.icon}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-black dark:text-white mb-1">
                                                {facility.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {facility.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Additional Info Section */}
                        <div className="mt-16">
                            <div className="bg-white dark:bg-boxdark rounded-xl shadow-xl p-8
                                border-2 border-stroke dark:border-strokedark">
                                <div className="max-w-3xl mx-auto text-center">
                                    <h2 className="text-3xl font-bold text-black dark:text-white mb-6">
                                        Our Commitment to Excellence
                                    </h2>
                                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                                        At Raghav Elite Projects, we're committed to delivering exceptional quality 
                                        and value in every project. Our team of experts ensures that your 
                                        investment is in safe hands.
                                    </p>
                                    <button className="px-8 py-3 bg-primary text-white rounded-lg
                                        transform hover:scale-105 transition-all duration-300
                                        hover:shadow-lg">
                                        Contact Us Today
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default WhyChooseUs; 