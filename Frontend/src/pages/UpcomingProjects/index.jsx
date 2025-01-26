import React from 'react';
import Layout from '../../components/Layout';
import Carousel from '../../components/molecules/Carousel';

const UpcomingProjects = () => {
    const projects = [
        {
            id: 1,
            name: "Raghav Elite Gardens",
            location: "Mustoor Road, Manvi",
            description: "Luxury plots with modern amenities",
            features: [
                "24/7 Security",
                "Underground Electricity",
                "Wide Roads",
                "Park and Play Area",
                "Temple"
            ],
            status: "Launching Soon"
        },
        {
            id: 2,
            name: "Raghav Elite Residency",
            location: "Chikalparvi Road, Manvi",
            description: "Premium residential plots",
            features: [
                "Gated Community",
                "Landscaped Gardens",
                "Community Hall",
                "Children's Play Area",
                "Walking Track"
            ],
            status: "Pre-Launch"
        }
    ];

    return (
        <Layout>
            <div className="w-full">
                <Carousel />
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
                    Upcoming Projects
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((project) => (
                        <div 
                            key={project.id}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                                            {project.name}
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                                            {project.location}
                                        </p>
                                    </div>
                                    <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                        {project.status}
                                    </span>
                                </div>

                                <p className="text-gray-700 dark:text-gray-200 mb-6">
                                    {project.description}
                                </p>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                                        Key Features
                                    </h3>
                                    <ul className="space-y-2">
                                        {project.features.map((feature, index) => (
                                            <li 
                                                key={index}
                                                className="flex items-center text-gray-600 dark:text-gray-300"
                                            >
                                                <svg 
                                                    className="w-5 h-5 mr-3 text-green-500" 
                                                    fill="none" 
                                                    stroke="currentColor" 
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path 
                                                        strokeLinecap="round" 
                                                        strokeLinejoin="round" 
                                                        strokeWidth={2} 
                                                        d="M5 13l4 4L19 7" 
                                                    />
                                                </svg>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
                                    Register Interest
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default UpcomingProjects; 