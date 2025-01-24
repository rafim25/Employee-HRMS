import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const testimonials = [
  {
    name: "Rajesh Sharma",
    profession: "Business Owner",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    message: "Investing in RaghavElite's commercial plot was the best business decision I made. Their transparent process and prime location selection helped me establish my new showroom."
  },
  {
    name: "Dr. Priya Patel",
    profession: "Medical Professional",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    message: "As a busy doctor, I wanted a hassle-free property investment. Their team guided me through every step, from plot selection to documentation. Now I own a beautiful piece of land for my future clinic."
  },
  {
    name: "Amit Verma",
    profession: "IT Professional",
    image: "https://randomuser.me/api/portraits/men/55.jpg",
    message: "The gated community plots offered by RaghavElite are perfect for tech professionals like me. Excellent infrastructure, security, and future appreciation potential made it an easy choice."
  },
  {
    name: "Meera Reddy",
    profession: "School Principal",
    image: "https://randomuser.me/api/portraits/women/28.jpg",
    message: "After years of teaching, I wanted to invest in property. Their educational institution plots with proper zoning and amenities were exactly what I was looking for my dream school project."
  },
  {
    name: "Suresh Kumar",
    profession: "Restaurant Chain Owner",
    image: "https://randomuser.me/api/portraits/men/36.jpg",
    message: "Expanding my restaurant chain was made easier with RaghavElite's commercial plots. Strategic locations and excellent connectivity have helped boost my business significantly."
  },
  {
    name: "Anita Desai",
    profession: "Software Company CEO",
    image: "https://randomuser.me/api/portraits/women/22.jpg",
    message: "The tech park plots are strategically located and perfect for our new development center. The infrastructure and amenities are exactly what we needed for our growing team."
  },
  {
    name: "Vikram Malhotra",
    profession: "Hotel Chain Owner",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    message: "RaghavElite helped us find the perfect location for our new resort. Their understanding of hospitality sector requirements made the whole process seamless."
  },
  {
    name: "Dr. Sanjay Gupta",
    profession: "Hospital Director",
    image: "https://randomuser.me/api/portraits/men/47.jpg",
    message: "We acquired a prime plot for our new multi-specialty hospital through RaghavElite. Their expertise in healthcare property requirements was impressive."
  }
];

const TestimonialCard = ({ name, profession, image, message }) => {
  return (
    <div className="bg-white dark:bg-boxdark p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 mx-2">
      <div className="flex items-center mb-4">
        <img 
          src={image} 
          alt={name} 
          className="w-16 h-16 rounded-full mr-4 object-cover border-2 border-primary"
        />
        <div>
          <h3 className="font-semibold text-lg text-black dark:text-white">{name}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{profession}</p>
        </div>
      </div>
      <div className="relative">
        <svg 
          className="absolute top-0 left-0 transform -translate-x-3 -translate-y-3 h-8 w-8 text-primary opacity-20" 
          fill="currentColor" 
          viewBox="0 0 32 32"
        >
          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"/>
        </svg>
        <p className="text-gray-700 dark:text-gray-300 italic pl-4">{message}</p>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  };

  // Function to get current items per view based on screen size
  const getCurrentItemsPerView = () => {
    if (window.innerWidth < 768) return itemsPerView.mobile;
    if (window.innerWidth < 1024) return itemsPerView.tablet;
    return itemsPerView.desktop;
  };

  const [visibleItems, setVisibleItems] = useState(getCurrentItemsPerView());

  // Update visible items on window resize
  useEffect(() => {
    const handleResize = () => {
      setVisibleItems(getCurrentItemsPerView());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to get visible testimonials with circular rotation
  const getVisibleTestimonials = () => {
    let visibleItems = [];
    for (let i = 0; i < visibleItems; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visibleItems.push(testimonials[index]);
    }
    return visibleItems;
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto scroll
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <div className="py-12 bg-gray-50 dark:bg-boxdark-2">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-black dark:text-white">
          What Our Valued Customers Say
        </h2>
        
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 
            bg-white dark:bg-boxdark p-2 rounded-full shadow-lg 
            hover:bg-gray-100 dark:hover:bg-boxdark-2 transition-all duration-300
            md:-translate-x-6"
          >
            <FiChevronLeft className="text-2xl text-primary" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 
            bg-white dark:bg-boxdark p-2 rounded-full shadow-lg 
            hover:bg-gray-100 dark:hover:bg-boxdark-2 transition-all duration-300
            md:translate-x-6"
          >
            <FiChevronRight className="text-2xl text-primary" />
          </button>

          {/* Testimonials Container */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${(currentIndex * 100) / visibleItems}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div 
                  key={`${testimonial.name}-${index}`} 
                  className={`flex-shrink-0 ${
                    visibleItems === 1 ? 'w-full' : 
                    visibleItems === 2 ? 'w-1/2' : 'w-1/3'
                  } px-2`}
                >
                  <TestimonialCard {...testimonial} />
                </div>
              ))}
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.slice(0, testimonials.length - visibleItems + 1).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-6 bg-primary' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials; 