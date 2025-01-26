import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { motion } from 'framer-motion';
import gallery1 from '../../Assets/images/gallery/gallery1.jpeg';
import gallery2 from '../../Assets/images/gallery/gallery2.jpeg';
import gallery3 from '../../Assets/images/gallery/gallery3.jpeg';
import gallery4 from '../../Assets/images/gallery/gallery4.jpeg';
import gallery5 from '../../Assets/images/gallery/gallery5.jpeg';

const Gallery = () => {
    const galleryItems = [
        {
            id: 1,
            title: "Project View 1",
            category: "Site Views",
            imageUrl: gallery1,
            description: "Aerial view of our premium residential plots"
        },
        {
            id: 2,
            title: "Layout Plan",
            category: "Plans",
            imageUrl: gallery2,
            description: "Detailed layout plan of Raghav Elite Gardens"
        },
        {
            id: 3,
            title: "Construction Progress",
            category: "Progress",
            imageUrl: gallery3,
            description: "Current development status of our projects"
        },
        {
            id: 4,
            title: "Amenities View",
            category: "Features",
            imageUrl: gallery4,
            description: "World-class amenities for our residents"
        },
        {
            id: 5,
            title: "Project Overview",
            category: "Site Views",
            imageUrl: gallery5,
            description: "Panoramic view of our development"
        }
    ];

    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = ['all', ...new Set(galleryItems.map(item => item.category))];

    const filteredItems = selectedCategory === 'all' 
        ? galleryItems 
        : galleryItems.filter(item => item.category === selectedCategory);

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white relative inline-block">
                        Project Gallery
                        <span className="absolute -bottom-2 left-0 right-0 h-1 bg-blue-600 transform scale-x-50 transition-transform duration-300 hover:scale-x-100"></span>
                    </h1>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">
                        Explore our beautiful projects and developments
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
                                ${selectedCategory === category 
                                    ? 'bg-blue-600 text-gray-100 shadow-lg shadow-blue-500/30' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                                }`}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    layout
                >
                    {filteredItems.map((item) => (
                        <motion.div
                            layout
                            key={item.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow duration-300"
                            onClick={() => setSelectedImage(item)}
                        >
                            <div className="aspect-w-16 aspect-h-12">
                                <img 
                                    src={item.imageUrl} 
                                    alt={item.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                                    <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs rounded-full mb-3">
                                        {item.category}
                                    </span>
                                    <h3 className="text-white text-xl font-semibold mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Image Modal */}
                {selectedImage && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <div className="relative max-w-5xl w-full">
                            <button 
                                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200"
                                onClick={() => setSelectedImage(null)}
                            >
                                <svg 
                                    className="w-8 h-8" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M6 18L18 6M6 6l12 12" 
                                    />
                                </svg>
                            </button>
                            <motion.img 
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                src={selectedImage.imageUrl} 
                                alt={selectedImage.title}
                                className="w-full h-auto rounded-lg shadow-2xl"
                            />
                            <div className="absolute bottom-4 left-4 right-4 bg-black/50 p-6 rounded-lg backdrop-blur-sm">
                                <h3 className="text-2xl font-semibold text-white mb-2">
                                    {selectedImage.title}
                                </h3>
                                <p className="text-gray-200 mb-2">
                                    {selectedImage.description}
                                </p>
                                <span className="inline-block px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                                    {selectedImage.category}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </Layout>
    );
};

export default Gallery; 