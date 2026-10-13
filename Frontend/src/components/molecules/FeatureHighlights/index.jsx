import React from 'react';
import {
  FiUserCheck,
  FiClipboard,
  FiVideo,
  FiAward,
  FiFileText,
  FiCheckCircle,
} from 'react-icons/fi';

const steps = [
  {
    icon: FiUserCheck,
    title: 'Application',
    description: 'Submit your application and complete the initial screening process.',
  },
  {
    icon: FiClipboard,
    title: 'Assessment',
    description: 'Complete technical assessments and skill evaluations.',
  },
  {
    icon: FiVideo,
    title: 'Interview',
    description: 'Participate in virtual or in-person interview rounds.',
  },
  {
    icon: FiAward,
    title: 'Selection',
    description: 'Receive feedback and a selection decision from the hiring team.',
  },
  {
    icon: FiFileText,
    title: 'Documentation',
    description: 'Complete required documentation and background verification.',
  },
  {
    icon: FiCheckCircle,
    title: 'Onboarding',
    description: 'Receive the offer letter and begin the onboarding process.',
  },
];

const RecruitmentWorkflow = () => {
  return (
    <div className="w-full">
      <div className="max-w-3xl mb-12">
        <p className="text-[#d4af37] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
          How we hire
        </p>
        <h2 className="text-3xl lg:text-4xl font-semibold text-white leading-tight">
          Recruitment process at Seven Wings
        </h2>
        <p className="mt-4 text-white/70 leading-relaxed">
          A clear path from application to onboarding, designed to keep candidates and hiring teams aligned.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <article
              key={step.title}
              className="group rounded-2xl border-2 border-[#d4af37]/50 bg-[#1e4568] p-6 hover:border-[#d4af37] hover:bg-[#245077] transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#d4af37] text-[#0b1d36] flex items-center justify-center">
                  <Icon className="text-xl" />
                </div>
                <span className="text-xs font-semibold tracking-[0.16em] uppercase text-[#d4af37]">
                  Step {index + 1}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-white/70 leading-relaxed">{step.description}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default RecruitmentWorkflow;
