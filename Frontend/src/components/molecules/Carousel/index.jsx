import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
// import project1 from '../../../Assets/images/projects/project1.jpg';
// import project2 from '../../../Assets/images/projects/project2.jpg';
// import project3 from '../../../Assets/images/projects/project3.jpg';
// import project4 from '../../../Assets/images/projects/project1.jpg';
// import project5 from '../../../Assets/images/projects/project2.jpg';

import project1 from '../../../Assets/images/gallery/gallery1.jpeg';
import project2 from '../../../Assets/images/gallery/gallery2.jpeg';
import project3 from '../../../Assets/images/gallery/gallery3.jpeg';
import project4 from '../../../Assets/images/gallery/gallery4.jpeg';
import project5 from '../../../Assets/images/gallery/gallery5.jpeg';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: project1,
      title: 'Luxury Villa Project',
      description: 'Premium residential villas with modern amenities and spacious layouts'
    },
    {
      image: project2,
      title: 'Commercial Complex',
      description: 'State-of-the-art office spaces and retail outlets in prime location'
    },
    {
      image: project3,
      title: 'Residential Apartments',
      description: 'Contemporary living spaces with world-class facilities'
    },
    {
      image: project4,
      title: 'Smart Township',
      description: 'Integrated township with sustainable infrastructure'
    },
    {
      image: project5,
      title: 'Eco-Friendly Homes',
      description: 'Green living spaces with energy-efficient design'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="relative h-full w-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="container mx-auto">
                  <h2 className="text-4xl font-bold mb-3 transform translate-y-0 transition-transform duration-500">
                    {slide.title}
                  </h2>
                  <p className="text-xl max-w-2xl text-gray-200">
                    {slide.description}
                  </p>
                  <button className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all duration-300">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
      >
        <FiChevronLeft className="text-3xl text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
      >
        <FiChevronRight className="text-3xl text-white" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 ${
              index === currentSlide 
                ? 'w-8 h-2 bg-primary rounded-full' 
                : 'w-2 h-2 bg-white/60 rounded-full hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel; 