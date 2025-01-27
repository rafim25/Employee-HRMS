import React from 'react';
import { FiAward, FiUsers, FiHome, FiShield, FiClock, FiDollarSign } from 'react-icons/fi';
import TopNavigation from '../../components/molecules/TopNavigation';
import FeatureHighlights from '../../components/molecules/FeatureHighlights';
import Carousel from '../../components/molecules/Carousel';

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: <FiAward className="text-4xl text-primary" />,
      title: "Proven Track Record",
      description: "Years of experience delivering exceptional real estate projects with highest quality standards."
    },
    {
      icon: <FiUsers className="text-4xl text-primary" />,
      title: "Customer-Centric Approach",
      description: "We prioritize your needs and provide personalized solutions for your dream home."
    },
    {
      icon: <FiHome className="text-4xl text-primary" />,
      title: "Prime Locations",
      description: "Strategic locations with excellent connectivity and future growth potential."
    },
    {
      icon: <FiShield className="text-4xl text-primary" />,
      title: "Legal Clarity",
      description: "100% clear titles and all necessary approvals ensuring your investment is secure."
    },
    {
      icon: <FiClock className="text-4xl text-primary" />,
      title: "Timely Delivery",
      description: "Committed to delivering your property within the promised timeframe."
    },
    {
      icon: <FiDollarSign className="text-4xl text-primary" />,
      title: "Transparent Pricing",
      description: "No hidden costs, with flexible payment plans to suit your budget."
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
            Why Choose Raghav Elite Projects?
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Building Trust, Delivering Excellence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-boxdark rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  {reason.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {reason.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white dark:bg-boxdark rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Commitment to Excellence
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              At Raghav Elite Projects, we are committed to creating not just homes, but lifelong relationships built on trust and excellence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">15+</div>
              <div className="text-gray-600 dark:text-gray-400">Years of Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-400">Happy Families</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-gray-600 dark:text-gray-400">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="py-8">
        <FeatureHighlights />
      </div> */}
    </div>
  );
};

export default WhyChooseUs; 