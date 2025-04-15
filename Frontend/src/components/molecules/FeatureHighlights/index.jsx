import React from 'react';
import {
  FiUserCheck,
  FiClipboard,
  FiVideo,
  FiAward,
  FiFileText,
  FiCheckCircle,
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

const RecruitmentWorkflow = () => {
  const steps = [
    {
      icon: FiUserCheck,
      title: "Application",
      description: "Submit your application and complete initial screening process"
    },
    {
      icon: FiClipboard,
      title: "Assessment",
      description: "Complete technical assessments and skill evaluations"
    },
    {
      icon: FiVideo,
      title: "Interview",
      description: "Participate in virtual or in-person interview rounds"
    },
    {
      icon: FiAward,
      title: "Selection",
      description: "Receive feedback and selection decision from hiring team"
    },
    {
      icon: FiFileText,
      title: "Documentation",
      description: "Complete required documentation and background verification"
    },
    {
      icon: FiCheckCircle,
      title: "Onboarding",
      description: "Receive offer letter and begin the onboarding process"
    }
  ];

  return (
    <div className="w-full p-6 bg-white dark:bg-boxdark rounded-xl shadow-sm border border-stroke dark:border-strokedark overflow-x-auto">
      <h2 className="text-2xl font-bold text-black dark:text-white mb-12 text-center">
        Recruitment Process at Seven Wings
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
      <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
        <p>Join hundreds of successful candidates who found their dream jobs through our streamlined process</p>
      </div>
    </div>
  );
};

export default RecruitmentWorkflow; 