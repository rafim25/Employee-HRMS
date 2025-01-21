import React from 'react';
import { FiCheckCircle, FiAward, FiTrendingUp, FiShield } from 'react-icons/fi';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white dark:bg-boxdark p-4 rounded-lg shadow-sm border border-stroke dark:border-strokedark">
    <div className="flex items-center mb-2">
      <Icon className="text-primary text-xl mr-2" />
      <h3 className="font-semibold text-black dark:text-white">{title}</h3>
    </div>
    <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
  </div>
);

const FeatureHighlights = () => {
  const features = [
    {
      icon: FiCheckCircle,
      title: "Easy Process",
      description: "Simple and streamlined loan application process"
    },
    {
      icon: FiAward,
      title: "Best Rates",
      description: "Competitive interest rates and flexible terms"
    },
    {
      icon: FiTrendingUp,
      title: "Fast Growth",
      description: "Quick approval and disbursement process"
    },
    {
      icon: FiShield,
      title: "Secure Platform",
      description: "Advanced security measures to protect your data"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 py-2">
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </div>
  );
};

export default FeatureHighlights; 