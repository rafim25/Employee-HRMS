import React from 'react';
import { motion } from 'framer-motion';
import ImageHero from '../../components/Booking/ImageHero';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Fixed Background Hero */}
      <ImageHero
        imageSrc="/images/resort-bg.jpg"
        title="Welcome to Forest View Resort"
        subtitle="Experience luxury and tranquility in the heart of nature"
        ctaText="Book Now"
        ctaLink="/reservation"
      />

      {/* Scrollable Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="max-w-7xl mx-auto">
            {/* Add your home page content here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 