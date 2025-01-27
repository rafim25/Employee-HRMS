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
      title: "Agreement Stage",
      description: "Property agreement and documentation verification completed"
    },
    {
      icon: FiAward,
      title: "Payment Status",
      description: "30% of total payment processed and confirmed"
    },
    {
      icon: FiTrendingUp,
      title: "Construction Phase",
      description: "Foundation work completed, structure 40% done"
    },
    {
      icon: FiShield,
      title: "Completion Status",
      description: "Expected completion in 8 months with current progress"
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