import React from 'react';
import PublicLayout from '../../components/layouts/PublicLayout';
import { motion } from 'framer-motion';
import { FaFileAlt, FaFileContract, FaFilePdf, FaFileSignature, FaFileInvoice, FaFileDownload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
const ProjectDocuments = () => {
    const navigate = useNavigate();
    const documents = [
        // {
        //     icon: <FaFileContract />,
        //     title: "Legal Documents",
        //     description: "Essential legal paperwork and approvals",
        //     fileName: "legal_docs.pdf"
        // },
        // {
        //     icon: <FaFilePdf />,
        //     title: "Project Plans",
        //     description: "Detailed architectural and structural plans",
        //     fileName: "Project_Elite_MANVI_2.pdf"
        // },
        // {
        //     icon: <FaFileSignature />,
        //     title: "Agreements",
        //     description: "Sale and purchase agreements",
        //     fileName: "aggreemntPlan.pdf"
        // },
        {
            icon: <FaFileInvoice />,
            title: "Facility Documents",
            description: "facility documents for the project",
            fileName: "Facility_Infra_Details.pdf"
        },
        {
            icon: <FaFileAlt />,
            title: "Specifications",
            description: "Technical specifications and materials",
            fileName: "Facility_Infra_Details.pdf"
        },
        {
            icon: <FaFileDownload />,
            title: "Project Brochure",
            description: "Complete project overview and details",
            fileName: "project_overview.pdf"
        }
    ];

    const handleDownload = async (fileName) => {
        try {
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
        <PublicLayout>
            <div className="min-h-screen bg-white dark:bg-boxdark">
                {/* Hero Section */}
                <div className="container mx-auto px-4 py-8 lg:py-12">
                    <div className="max-w-7xl mx-auto">
                        {/* Welcome Header */}
                        <div className="text-center mb-12">
                            <h1 className="text-4xl lg:text-5xl font-bold text-black dark:text-white mb-4">
                                Project Documents
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Download essential documents about our projects
                            </p>
                        </div>

                        {/* Documents Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {documents.map((doc, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-white dark:bg-boxdark rounded-xl 
                                        shadow-lg hover:shadow-xl p-8
                                        transform hover:scale-105 transition-all duration-300
                                        border-2 border-stroke dark:border-strokedark
                                        group cursor-pointer"
                                    onClick={() => handleDownload(doc.fileName)}
                                >
                                    <div className="w-16 h-16 rounded-lg bg-primary flex items-center justify-center mb-6
                                        transform group-hover:scale-110 transition-transform duration-300">
                                        <div className="text-white text-2xl">
                                            {doc.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-black dark:text-white mb-4">
                                        {doc.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                        {doc.description}
                                    </p>
                                    <button 
                                        className="w-full px-4 py-2 bg-primary text-white
                                        rounded-lg font-medium hover:bg-primary/90
                                        transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <FaFileDownload />
                                        Download Document
                                    </button>
                                </motion.div>
                            ))}
                        </div>

                        {/* Additional Info Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            className="mt-16"
                        >
                            <div className="bg-white dark:bg-boxdark rounded-xl shadow-xl p-8
                                border-2 border-stroke dark:border-strokedark">
                                <div className="max-w-3xl mx-auto text-center">
                                    <h2 className="text-3xl font-bold text-black dark:text-white mb-6">
                                        Need Assistance?
                                    </h2>
                                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                                        Our team is here to help you with any document-related queries. 
                                        Feel free to reach out for detailed information about any project documentation.
                                    </p>
                                    <button className="px-8 py-3 bg-primary text-white rounded-lg
                                        transform hover:scale-105 transition-all duration-300
                                        hover:shadow-lg"
                                        onClick={() => navigate('/contact')} >
                                        Contact Support
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default ProjectDocuments; 