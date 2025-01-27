import React, { useState } from 'react';
import TopNavigation from '../../components/molecules/TopNavigation';
import FeatureHighlights from '../../components/molecules/FeatureHighlights';
import Carousel from '../../components/molecules/Carousel';
import gallery1 from '../../Assets/images/gallery/gallery1.jpeg';
import gallery2 from '../../Assets/images/gallery/gallery2.jpeg';
import gallery3 from '../../Assets/images/gallery/gallery3.jpeg';
import gallery4 from '../../Assets/images/gallery/gallery4.jpeg';
import gallery5 from '../../Assets/images/gallery/gallery5.jpeg';

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-boxdark dark:to-boxdark-2 flex flex-col">
      <TopNavigation />
      
      <div className="w-full">
        <Carousel />
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Project Gallery
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Showcasing Excellence in Real Estate Development
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item) => (
            <div 
              key={item.id}
              className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
              onClick={() => setSelectedImage(item)}
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="object-cover w-full h-[300px] transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-sm text-primary font-medium mb-2 block bg-white/10 px-3 py-1 rounded-full w-fit">
                    {item.category}
                  </span>
                  <h3 className="text-xl text-white font-semibold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-200 text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
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
      </div>

      {/* <div className="py-8">
        <FeatureHighlights />
      </div> */}
    </div>
  );
};

export default Gallery; 