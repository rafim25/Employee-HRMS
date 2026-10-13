import React from 'react';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    name: 'Anil Kumar S',
    role: 'Software Engineer',
    company: 'Leading tech company',
    content:
      'Their team was highly professional, responsive, and supportive throughout. From the first conversation to final placement, they made sure my preferences were understood.',
  },
  {
    name: 'Rachana Amrutha',
    role: 'Banking professional',
    company: 'Top private bank',
    content:
      'I landed my role in a surprisingly short time. The HR team was responsive, and the one-day process was the most impressive part of the journey.',
  },
  {
    name: 'Srijith Gowda',
    role: 'Banking professional',
    company: 'Axis Bank',
    content:
      'They handled every candidate with care. A special thanks to recruiter Rachana and team leader Anikha for staying with me until the offer letter arrived.',
  },
  {
    name: 'Megha S',
    role: 'HDFC Bank employee',
    company: 'HDFC Bank',
    content:
      'I completed BANK EDGE training and was placed at HDFC Bank. The support helped me build a career I am proud of.',
  },
];

const Testimonials = () => {
  return (
    <section className="landing-section-navy py-16 lg:py-24 bg-[#0b1d36] text-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mb-12">
          <p className="text-[#d4af37] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Success stories in action
          </p>
          <h2 className="text-3xl lg:text-4xl font-semibold leading-tight">
            Real placements. Real careers. Real outcomes.
          </h2>
          <p className="mt-4 text-white/70 leading-relaxed">
            Discover how candidates found lasting roles with leading organisations through
            Seven Wings recruitment programmes.
          </p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="success-stories-swiper"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.name} className="h-auto pb-14">
              <article className="h-full flex flex-col rounded-2xl border border-white/20 bg-white/[0.04] p-7 hover:border-[#d4af37]/50 transition-colors duration-300">
                <FaQuoteLeft className="text-[#d4af37] text-2xl mb-5" />
                <p className="text-white/80 leading-relaxed flex-1">
                  {testimonial.content}
                </p>
                <div className="mt-8 pt-5 border-t border-white/10">
                  <div className="flex text-[#d4af37] gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-xs" />
                    ))}
                  </div>
                  <h4 className="text-lg font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-white/60 mt-1">{testimonial.role}</p>
                  <p className="text-sm text-[#d4af37] mt-1">{testimonial.company}</p>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style>{`
        .success-stories-swiper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: rgba(255, 255, 255, 0.35);
          opacity: 1;
        }
        .success-stories-swiper .swiper-pagination-bullet-active {
          background: #d4af37;
          width: 22px;
          border-radius: 999px;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
