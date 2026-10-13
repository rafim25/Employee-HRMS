import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../../components/layouts/PublicLayout';
import FeatureHighlights from '../../../components/molecules/FeatureHighlights';
import Testimonials from '../../../components/molecules/Testimonial';
import {
  FaUsers,
  FaUserTie,
  FaBriefcase,
  FaChalkboardTeacher,
  FaChartLine,
  FaCogs,
  FaArrowRight,
} from 'react-icons/fa';

const stats = [
  { value: '20+', label: 'Years of excellence' },
  { value: '5,000+', label: 'Candidates placed' },
  { value: '200+', label: 'Hiring partners' },
  { value: '12+', label: 'Industries served' },
];

const workforce = [
  {
    icon: FaUsers,
    title: 'Contract staffing',
    description: 'Skilled professionals for short-term and project-based needs, deployed when you need them.',
  },
  {
    icon: FaUserTie,
    title: 'Permanent recruitment',
    description: 'Executive search, volume hiring and talent strategy aligned to your growth plans.',
  },
  {
    icon: FaBriefcase,
    title: 'Industry hiring',
    description: 'Specialist hiring across banking, IT, manufacturing, sales and operations roles.',
  },
  {
    icon: FaChalkboardTeacher,
    title: 'Hire-train-deploy',
    description: 'High-potential talent trained in role-specific skills and placed as job-ready employees.',
  },
];

const platforms = [
  {
    icon: FaCogs,
    title: 'Talent operations platform',
    description: 'From demand to onboarding, payroll and analytics — one workspace for HR teams.',
  },
  {
    icon: FaChartLine,
    title: 'Hiring intelligence',
    description: 'Live pipeline metrics, interview progress and placement outcomes in one dashboard.',
  },
];

const LoginAdmin = () => {
  return (
    <PublicLayout>
      <div className="bg-white">
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster=""
          >
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1d36]/90 via-[#0b1d36]/70 to-[#0b1d36]/35" />

          <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-28 pb-28">
            <p className="text-[#d4af37] text-xs sm:text-sm font-semibold tracking-[0.28em] uppercase mb-5">
              Workforce & talent solutions
            </p>
            <h1 className="max-w-4xl text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight">
              We elevate your talent strategy and unlock operational excellence
            </h1>
            <p className="mt-6 max-w-2xl text-base sm:text-lg text-white/80 leading-relaxed">
              Seven Wings Technologies is a recruitment partner with proven experience in
              tech-enabled hiring, managed talent programs, and industry-focused staffing
              that helps businesses grow with the right people.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              {/* <Link
                to="/careers"
                className="inline-flex items-center gap-2 rounded-full bg-[#d4af37] px-7 py-3 text-sm font-semibold text-[#0b1d36] hover:bg-[#e3c356] transition-colors"
              >
                View openings <FaArrowRight className="text-xs" />
              </Link> */}
              {/* <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Talk to us
              </Link> */}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-[#0b1d36]/80 backdrop-blur-sm border-t border-white/10">
            <div className="container mx-auto px-4 lg:px-8 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-semibold text-[#d4af37]">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-white/70 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-[#16324f] text-white border-y-2 border-[#d4af37]">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mb-12">
              <p className="text-[#d4af37] text-xs font-semibold tracking-[0.2em] uppercase mb-3">What we do</p>
              <h2 className="text-3xl lg:text-4xl font-semibold text-white leading-tight">
                Connecting exceptional talent with ambitious business goals
              </h2>
              <p className="mt-4 text-white/70 leading-relaxed">
                End-to-end workforce solutions that help you hire faster, staff with confidence, and keep operations moving.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {workforce.map((item) => (
                <article
                  key={item.title}
                  className="group rounded-2xl border-2 border-[#d4af37]/50 bg-[#1e4568] p-6 hover:border-[#d4af37] hover:bg-[#245077] transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-[#d4af37] text-[#0b1d36] flex items-center justify-center mb-4">
                    <item.icon />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-section-navy py-16 lg:py-24 bg-[#0b1d36] text-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-[#d4af37] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
                  Smarter tech. Stronger outcomes.
                </p>
                <h2 className="text-3xl lg:text-4xl font-semibold leading-tight">
                  A digital engine for hiring, HR operations, and talent insight
                </h2>
                <p className="mt-5 text-white/70 leading-relaxed">
                  Explore the HRMS that powers Seven Wings — from candidate pipelines and
                  interview workflows to employee records, payroll support, and live
                  dashboards that help teams make faster decisions.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                {platforms.map((item) => (
                  <article key={item.title} className="rounded-2xl bg-white/5 border border-white/20 p-6">
                    <item.icon className="text-[#d4af37] text-2xl mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-white/70 leading-relaxed">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-[#16324f] text-white border-y-2 border-[#d4af37]">
          <div className="container mx-auto px-4 lg:px-8">
            <FeatureHighlights />
          </div>
        </section>

        <Testimonials />
      </div>
    </PublicLayout>
  );
};

export default LoginAdmin;
