"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface GalleryProps {
  images?: GalleryImage[];
  isAdminLogin?: boolean;
}

const Gallery: React.FC<GalleryProps> = ({ images: propImages, isAdminLogin = false }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    if (propImages) {
      setImages(propImages);
    } else {
      // Generate gallery images array
      const galleryImages: GalleryImage[] = Array.from({ length: 24 }, (_, index) => ({
        id: index + 1,
        src: `/gallery/gallery_${(index + 1).toString().padStart(3, '0')}.jpg`,
        alt: `Gallery Image ${index + 1}`,
        width: 800,
        height: 600
      }));
      setImages(galleryImages);
    }
  }, [propImages]);

  return (
    <div className={`w-full ${isAdminLogin ? 'relative z-10' : ''}`}>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative group cursor-pointer overflow-hidden rounded-xl ${isAdminLogin ? 'z-20' : ''}`}
            onClick={() => setSelectedImage(image)}
          >
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className={`absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center ${isAdminLogin ? 'z-30' : ''}`}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                className="text-white text-lg font-medium"
              >
                Click to view
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Image Popup */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute -top-12 right-0 text-white hover:text-primary transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                <IoClose size={32} />
              </button>
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery; 