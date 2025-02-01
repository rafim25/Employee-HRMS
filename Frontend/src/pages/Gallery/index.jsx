import React, { useState } from 'react';
import PublicLayout from '../../components/layouts/PublicLayout';
import Carousel from '../../components/molecules/Carousel';
import gallery1 from '../../Assets/images/gallery/gallery1.jpeg';
import gallery2 from '../../Assets/images/gallery/gallery2.jpeg';
import gallery3 from '../../Assets/images/gallery/gallery3.jpeg';
import gallery4 from '../../Assets/images/gallery/gallery4.jpeg';
import gallery5 from '../../Assets/images/gallery/gallery5.jpeg';
import { FiZoomIn } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Gallery items using local images
  const galleryItems = [
    {
      id: 1,
      category: 'Completed Projects',
      title: 'Luxury Villa Estate',
      description: 'Premium residential development with modern amenities',
      imageUrl: gallery1
    },
    {
      id: 2,
      category: 'Ongoing Projects',
      title: 'Urban Apartments',
      description: 'Contemporary city living spaces',
      imageUrl: gallery2
    },
    {
      id: 3,
      category: 'Featured Projects',
      title: 'Waterfront Residences',
      description: 'Exclusive waterfront properties with scenic views',
      imageUrl: gallery3
    },
    {
      id: 4,
      category: 'Upcoming Projects',
      title: 'Green Living Complex',
      description: 'Eco-friendly residential development',
      imageUrl: gallery4
    },
    {
      id: 5,
      category: 'Completed Projects',
      title: 'Modern Townhouses',
      description: 'Stylish townhouses in prime location',
      imageUrl: gallery5
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
                Our Project Gallery
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Explore our beautiful collection of completed and ongoing projects
              </p>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleryItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white dark:bg-boxdark rounded-xl 
                    shadow-lg hover:shadow-xl
                    transform hover:scale-105 transition-all duration-300
                    border-2 border-stroke dark:border-strokedark
                    overflow-hidden group"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-full object-cover transform 
                      group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 
                      group-hover:opacity-100 transition-opacity duration-300
                      flex items-center justify-center">
                      {/* <button className="px-6 py-2 bg-primary text-white rounded-lg
                        transform -translate-y-4 group-hover:translate-y-0
                        transition-all duration-300 opacity-0 group-hover:opacity-100">
                        View Details
                      </button> */}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Section */}
        <div className="bg-white dark:bg-boxdark">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white dark:bg-boxdark rounded-xl shadow-xl p-8
                border-2 border-stroke dark:border-strokedark 
                transition-transform transition-shadow duration-300">
                <h2 className="text-3xl font-bold text-black dark:text-white mb-8 text-center">
                  Featured Projects
                </h2>
                {/* Add featured projects content */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl w-full bg-white/5 p-4 rounded-xl backdrop-blur-sm">
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.title}
              className="w-full h-auto rounded-lg"
            />
            <div className="mt-4 text-white">
              <span className="text-sm text-primary font-medium mb-2 inline-block bg-white/10 px-3 py-1 rounded-full">
                {selectedImage.category}
              </span>
              <h3 className="text-2xl font-semibold mb-2 mt-2">{selectedImage.title}</h3>
              <p className="text-gray-300">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
};

export default Gallery; 