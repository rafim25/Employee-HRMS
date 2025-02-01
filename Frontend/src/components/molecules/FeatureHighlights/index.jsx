import React from 'react';
import {
  FiUserPlus,
  FiFileText,
  FiDollarSign,
  FiCalendar,
  FiBook,
  FiKey,
} from 'react-icons/fi';

const ProcessStep = ({ icon: Icon, title, description, isLast }) => (
  <div className="flex flex-col items-center flex-1 relative">
    <div className="relative z-10">
      <div className="bg-primary p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
        <Icon className="text-white text-2xl" />
      </div>
    </div>
    {!isLast && (
      <div className="absolute top-8 left-[60%] w-full h-0.5 bg-primary" />
    )}
    <div className="text-center mt-4 px-4">
      <h3 className="font-semibold text-black dark:text-white text-lg mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </div>
  </div>
);

const LandPurchaseWorkflow = () => {
  const steps = [
    {
      icon: FiUserPlus,
      title: "Registration",
      description: "Complete the initial registration process and verify your details"
    },
    {
      icon: FiFileText,
      title: "Agreement",
      description: "Review and sign the purchase agreement with all terms and conditions"
    },
    {
      icon: FiDollarSign,
      title: "Downpayment",
      description: "Make the initial downpayment to secure your land purchase"
    },
    {
      icon: FiCalendar,
      title: "EMI Process",
      description: "Set up and manage your EMI payments through our easy payment system"
    },
    {
      icon: FiBook,
      title: "Land Registration",
      description: "Complete the legal registration process and documentation"
    },
    {
      icon: FiKey,
      title: "Site Delivery",
      description: "Receive your property documents and take possession of your land"
    }
  ];

  return (
    <div className="w-full p-6 bg-white dark:bg-boxdark rounded-xl shadow-sm border border-stroke dark:border-strokedark overflow-x-auto">
      <h2 className="text-2xl font-bold text-black dark:text-white mb-12 text-center">
        Land Purchase Process
      </h2>
      <div className="flex min-w-[900px] px-4">
        {steps.map((step, index) => (
          <ProcessStep
            key={index}
            {...step}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default LandPurchaseWorkflow; 