import React from 'react';
import NavHeader from '../NavHeader/index';
import ImageHero from '../Booking/ImageHero';
import './PublicLayout.css';

const PublicLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-20">
        {/* <NavHeader /> */}
      </div>

      {/* Hero Section */}
      <ImageHero
        imageSrc="/images/resort-bg.jpg"
        title="Forest View Resort"
        subtitle="Experience luxury and tranquility in the heart of nature"
      />

      {/* Content Container */}
      <div className="relative z-10">
        {/* Scrollable Content */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
};

export default PublicLayout; 