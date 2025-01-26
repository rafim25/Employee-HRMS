import React from 'react';
import Layout from '../../components/Layout';
import { FiCheck, FiAward, FiHome, FiUsers, FiShield, FiClock } from 'react-icons/fi';

const WhyUs = () => {
    const features = [
        {
            icon: <FiAward className="w-8 h-8" />,
            title: "Quality Assurance",
            description: "We maintain the highest standards in construction and development, ensuring lasting value for our clients."
        },
        {
            icon: <FiHome className="w-8 h-8" />,
            title: "Prime Locations",
            description: "Our projects are strategically located in high-growth areas with excellent connectivity and amenities."
        },
        {
            icon: <FiUsers className="w-8 h-8" />,
            title: "Customer First",
            description: "We prioritize customer satisfaction through transparent dealings and responsive support."
        },
        {
            icon: <FiShield className="w-8 h-8" />,
            title: "Legal Compliance",
            description: "All our projects are legally verified and comply with all regulatory requirements."
        },
        {
            icon: <FiClock className="w-8 h-8" />,
            title: "Timely Delivery",
            description: "We have a proven track record of delivering projects on schedule without compromising quality."
        }
    ];

    const achievements = [
        {
            number: "10+",
            label: "Years of Experience"
        },
        {
            number: "500+",
            label: "Happy Customers"
        },
        {
            number: "20+",
            label: "Completed Projects"
        },
        {
            number: "100%",
            label: "Customer Satisfaction"
        }
    ];

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
                    Why Choose Raghav Elite Projects?
                </h1>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                    {achievements.map((achievement, index) => (
                        <div 
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center"
                        >
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                                {achievement.number}
                            </div>
                            <div className="text-gray-600 dark:text-gray-300">
                                {achievement.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div 
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="text-blue-600 mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Trust Factors */}
                <div className="mt-16 bg-blue-50 dark:bg-gray-800 rounded-xl p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
                        Our Commitment to Excellence
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            "100% Legal Documentation",
                            "Transparent Dealings",
                            "Quality Construction",
                            "After-sales Support",
                            "Competitive Pricing",
                            "Professional Team"
                        ].map((item, index) => (
                            <div 
                                key={index}
                                className="flex items-center space-x-3 text-gray-700 dark:text-gray-300"
                            >
                                <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default WhyUs; 