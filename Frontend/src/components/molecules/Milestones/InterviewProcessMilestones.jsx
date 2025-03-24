import React from 'react';

const InterviewProcessMilestone = ({ rounds = [], currentStep = rounds.length - 1 }) => {
  const defaultRounds = [
    'Shortlisting',
    'Telephonic / Face-to-Face',
    'Technical Round 1',
    'Technical Round 2',
    'HR Round',
    'Selected'
  ];

  // Use provided rounds or fall back to default rounds
  const displayRounds = rounds.length > 0 ? rounds : defaultRounds;

  return (
    <div className="relative flex items-center justify-between px-4 py-2">
      {displayRounds.map((round, index) => (
        <React.Fragment key={index}>
          {/* Milestone Node */}
          <div className="flex flex-col items-center relative z-10">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center 
              ${index <= currentStep
                ? 'bg-primary text-white'
                : 'bg-gray-200 dark:bg-gray-700'}`}>
              {index < currentStep ? (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <div className={`w-2 h-2 rounded-full 
                  ${index === currentStep
                    ? 'bg-white'
                    : 'bg-gray-400 dark:bg-gray-500'}`}
                />
              )}
            </div>
            <span className={`mt-2 text-xs font-medium text-center w-24
              ${index <= currentStep
                ? 'text-primary'
                : 'text-gray-500 dark:text-gray-400'}`}>
              {round}
            </span>
          </div>

          {/* Connector Line */}
          {index < displayRounds.length - 1 && (
            <div className="flex-1 h-[1px] bg-gray-200 dark:bg-gray-700 mx-1">
              <div className={`h-full transition-all duration-300 ease-in-out
                ${index < currentStep ? 'bg-primary' : ''}`}
                style={{ width: index < currentStep ? '100%' : '0%' }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default InterviewProcessMilestone;