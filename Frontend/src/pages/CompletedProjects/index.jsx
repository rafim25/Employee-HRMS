import React, { useState } from 'react';
import Layout from '../../components/Layout';
import Carousel from '../../components/molecules/Carousel';
import { FiDownload, FiEye } from 'react-icons/fi';

const CompletedProjects = () => {
    // Sample data - replace with actual data from your backend
    const projects = [
        {
            id: 1,
            name: "Green Valley Residency",
            location: "Mustoor Road, Manvi",
            completionDate: "2023",
            documentType: "Property Layout",
            documentUrl: "/docs/sample.pdf"
        },
        {
            id: 2,
            name: "Sunshine Apartments",
            location: "Chikalparvi Road, Manvi",
            completionDate: "2023",
            documentType: "Floor Plan",
            documentUrl: "/docs/sample.pdf"
        },
        {
            id: 3,
            name: "Royal Heights",
            location: "Amrutha Colony, Manvi",
            completionDate: "2022",
            documentType: "Project Details",
            documentUrl: "/docs/sample.pdf"
        },
        // Add more projects as needed
    ];

    return (
        <Layout>
            <div className="w-full">
                <Carousel />
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
                    Completed Projects
                </h1>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-700">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-200">Project Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-200">Location</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-200">Completion</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-200">Document Type</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 dark:text-gray-200">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                {projects.map((project) => (
                                    <tr 
                                        key={project.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">{project.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{project.location}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{project.completionDate}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{project.documentType}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center space-x-3">
                                                <button 
                                                    className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 
                                                    hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200
                                                    tooltip"
                                                    data-tooltip="View Document"
                                                >
                                                    <FiEye className="w-5 h-5" />
                                                </button>
                                                <button 
                                                    className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 
                                                    hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors duration-200
                                                    tooltip"
                                                    data-tooltip="Download"
                                                >
                                                    <FiDownload className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* CSS for tooltips */}
            <style jsx>{`
                .tooltip {
                    position: relative;
                }
                .tooltip:before {
                    content: attr(data-tooltip);
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    padding: 4px 8px;
                    background-color: rgba(0, 0, 0, 0.8);
                    color: white;
                    font-size: 12px;
                    border-radius: 4px;
                    white-space: nowrap;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.2s ease;
                }
                .tooltip:hover:before {
                    opacity: 1;
                    visibility: visible;
                }
            `}</style>
        </Layout>
    );
};

export default CompletedProjects; 