import React from 'react';
import { FaDownload, FaFileAlt, FaBuilding, FaHome, FaTree, FaRoad } from 'react-icons/fa';
import TopNavigation from '../../components/molecules/TopNavigation';
import Carousel from '../../components/molecules/Carousel';

const ProjectDocuments = () => {
    // Real estate facilities data
    const facilities = [
        {
            id: 1,
            name: 'Residential Plots',
            description: 'Premium residential plots with all modern amenities',
            area: '1200-2400 sq ft',
            type: 'Residential',
            icon: <FaHome className="text-2xl text-primary" />
        },
        {
            id: 2,
            name: 'Commercial Spaces',
            description: 'Strategic commercial plots for business development',
            area: '2000-5000 sq ft',
            type: 'Commercial',
            icon: <FaBuilding className="text-2xl text-meta-3" />
        },
        {
            id: 3,
            name: 'Green Zones',
            description: 'Dedicated green spaces and parks',
            area: '5 acres',
            type: 'Recreational',
            icon: <FaTree className="text-2xl text-success" />
        },
        {
            id: 4,
            name: 'Infrastructure',
            description: 'Well-planned roads and utilities network',
            area: 'Project-wide',
            type: 'Infrastructure',
            icon: <FaRoad className="text-2xl text-meta-5" />
        }
    ];

    // Documents data
    const documents = [
        {
            id: 1,
            name: 'Project Overview',
            fileName: 'project_overview.pdf',
            category: 'General',
            lastUpdated: '2024-03-15'
        },
        {
            id: 2,
            name: 'Legal Documentation',
            fileName: 'legal_docs.pdf',
            category: 'Legal',
            lastUpdated: '2024-03-10'
        },
        {
            id: 3,
            name: 'Site Aggreemnt Plan',
            fileName: 'aggreemntPlan.pdf',
            category: 'Technical',
            lastUpdated: '2024-03-12'
        },
        {
            id: 4,
            name: 'Facility and infrastructure',
            fileName: 'Facility_Infra_Details.pdf',
            category: 'Financial',
            lastUpdated: '2024-03-14'
        }
    ];

    const handleDownload = async (fileName) => {
        try {
            // Create the full path to the document - using direct path to public folder
            const filePath = `/documents/${fileName}`;
            
            // Fetch the file
            const response = await fetch(filePath);
            
            if (!response.ok) {
                throw new Error('File not found');
            }
            
            // Convert response to blob
            const blob = await response.blob();
            
            // Create a temporary URL for the blob
            const url = window.URL.createObjectURL(blob);
            
            // Create a temporary link element
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            
            // Append to body, click, and cleanup
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Cleanup the temporary URL
            window.URL.revokeObjectURL(url);
            
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Error downloading file. Please make sure the file exists and try again.');
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-boxdark-2 min-h-screen">
            <TopNavigation />
            
            {/* Carousel Section */}
            <div id="top" className="w-full">
                <Carousel />
            </div>
            
            <div className="container mx-auto px-4 py-8">
                <div id="facilities" className="mb-8">
                    <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Project Documents</h1>
                    <p className="text-gray-600 dark:text-gray-400">Access all project-related documents and facilities information</p>
                </div>

                {/* Real Estate Facilities Section */}
                <div className="mb-8">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-4 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Real Estate Facilities
                            </h3>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {facilities.map((facility) => (
                                    <div key={facility.id} className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-meta-4 hover:shadow-lg transition-shadow duration-300">
                                        <div className="flex items-center gap-4 mb-3">
                                            {facility.icon}
                                            <h4 className="text-lg font-semibold text-black dark:text-white">
                                                {facility.name}
                                            </h4>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                            {facility.description}
                                        </p>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-meta-5">Area: {facility.area}</span>
                                            <span className="text-meta-3">{facility.type}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Documents Section */}
                <div id="documents" className="mb-8">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-4 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Project Documents
                            </h3>
                        </div>
                        <div className="p-4">
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto">
                                    <thead>
                                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                            <th className="py-4 px-4 font-medium text-black dark:text-white">Document Name</th>
                                            <th className="py-4 px-4 font-medium text-black dark:text-white">Category</th>
                                            <th className="py-4 px-4 font-medium text-black dark:text-white">Last Updated</th>
                                            <th className="py-4 px-4 font-medium text-black dark:text-white">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {documents.map((doc) => (
                                            <tr key={doc.id} className="border-b border-[#eee] dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4 transition-colors duration-200">
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <FaFileAlt className="text-lg text-meta-3" />
                                                        <span className="text-black dark:text-white">
                                                            {doc.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="inline-block rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium">
                                                        {doc.category}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    {new Date(doc.lastUpdated).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <button
                                                        onClick={() => handleDownload(doc.fileName)}
                                                        className="flex items-center gap-2 text-primary hover:text-meta-3 transition-colors duration-200"
                                                        title="Download Document"
                                                    >
                                                        <FaDownload className="text-lg" />
                                                        <span>Download</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDocuments; 