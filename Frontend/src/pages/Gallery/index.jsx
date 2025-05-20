import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageHero from '../../components/Booking/ImageHero';
import TopNavigation from '../../components/molecules/TopNavigation';
import { FiX } from 'react-icons/fi';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [loadedImages, setLoadedImages] = useState(new Set());

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate image data with standardized sizes
  const images = Array.from({ length: 68 }, (_, index) => {
    const imageNumber = index + 1;
    // Standardize size distribution
    const sizeOptions = ['small', 'medium', 'large'];
    const sizeIndex = Math.floor((imageNumber % 12) / 4); // Cycles through sizes every 4 images
    const size = sizeOptions[sizeIndex];

    // Set fixed dimensions for each size
    const dimensions = {
      small: { width: 300, height: 300 },
      medium: { width: 300, height: 400 },
      large: { width: 600, height: 400 }
    };

    return {
      id: imageNumber,
      src: `/gallery/img${imageNumber}.jpg`,
      alt: `Gallery Image ${imageNumber}`,
      category: ['Resort', 'Rooms', 'Dining', 'Amenities', 'Wellness', 'Outdoor', 'Business', 'Entertainment', 'Scenery'][Math.floor(Math.random() * 9)],
      size,
      ...dimensions[size]
    };
  });

  const handleImageClick = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const handleImageLoad = (imageId) => {
    setLoadedImages(prev => new Set([...prev, imageId]));
  };

  const handleImageError = (imageId) => {
    console.error(`Failed to load image ${imageId}`);
    // You could set a fallback image here if needed
  };

  // Responsive column count for masonry
  const getColumnCount = () => {
    if (windowWidth < 640) return 1;
    if (windowWidth < 1024) return 2;
    return 3;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <TopNavigation />
      </div>

      {/* Fixed Background Hero */}
      <ImageHero
        imageSrc="/gallery/resort-bg.jpg"
      />

      {/* Gallery Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="max-w-7xl mx-auto">
            {/* Page Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12 mt-16"
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Our Gallery
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Explore the beauty and luxury of Unnathi Forest View.
              </p>
            </motion.div>
            {/* Glassmorphism wrapper */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 md:p-10">
              {/* <h2 className="text-2xl font-bold text-center mb-4 text-white drop-shadow-lg">Discover Our World</h2>
              <p className="text-center text-white/90 mb-6 max-w-2xl mx-auto drop-shadow-md text-base">
                Immerse yourself in the stunning visuals of Unnathi Forest View. From luxurious accommodations to breathtaking landscapes, our gallery showcases the perfect blend of comfort and natural beauty.
              </p> */}

              {/* Masonry layout using columns */}
              <div
                className="w-full"
                style={{
                  columnCount: getColumnCount(),
                  columnGap: '16px',
                  margin: '0 auto'
                }}
              >
                {images.map((image) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: loadedImages.has(image.id) ? 1 : 0, y: loadedImages.has(image.id) ? 0 : 20 }}
                    transition={{ duration: 0.5, delay: image.id * 0.02 }}
                    className="mb-4 break-inside-avoid rounded-lg shadow-lg cursor-pointer bg-gray-800"
                    style={{
                      width: '100%',
                      display: 'inline-block',
                      padding: 4
                    }}
                    onClick={() => handleImageClick(image)}
                  >
                    <div className="w-full h-full rounded-lg overflow-hidden">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                        style={{ borderRadius: 12, minHeight: 180, maxHeight: 350, width: '100%' }}
                        onLoad={() => handleImageLoad(image.id)}
                        onError={() => handleImageError(image.id)}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                        <span className="text-white text-base font-semibold">{image.alt}</span>
                        <span className="text-white/80 text-xs">{image.category}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative max-w-5xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseModal}
                className="absolute -top-3 -right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg 
                text-gray-700 hover:text-primary transition-colors duration-200 border border-white/50 z-10"
                aria-label="Close"
              >
                <FiX className="text-xl" />
              </button>
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-full object-contain rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
                <h3 className="text-white text-xl font-semibold">{selectedImage.alt}</h3>
                <p className="text-white/80">{selectedImage.category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery; 