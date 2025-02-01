import React from 'react';
import { FaQuoteLeft, FaStar, FaHome, FaHandshake, FaTools, FaCheckCircle, FaUser } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const Testimonials = () => {
    const testimonials = [
        {
            name: "Dada Khalander",
            role: "Property Owner",
            content: "The entire process from agreement to construction has been transparent and professional. The team's attention to detail and regular updates gave us complete peace of mind.",
            rating: 5,
            projectStatus: {
                agreement: "Completed",
                payment: "40% Processed",
                construction: "50% Complete",
                timeline: "On Schedule"
            }
        },
        {
            name: "Mohammad Rafee",
            role: "First-time Buyer",
            content: "As a first-time property buyer, I was impressed with their professional approach. The team guided me through each step, making it seamless and stress-free.",
            rating: 5,
            projectStatus: {
                agreement: "Completed",
                payment: "30% Processed",
                construction: "35% Complete",
                timeline: "On Schedule"
            }
        },
        {
            name: "Suresh Kumar",
            role: "Investment Buyer",
            content: "The quality of construction and adherence to timelines has been impressive. Their property management solutions are truly world-class.",
            rating: 5,
            projectStatus: {
                agreement: "Completed",
                payment: "60% Processed",
                construction: "75% Complete",
                timeline: "Ahead of Schedule"
            }
        },
        {
            name: "Venkatesh Reddy",
            role: "Property Owner",
            content: "Exceptional service and quality construction. The team's commitment to excellence and timely delivery has exceeded my expectations.",
            rating: 5,
            projectStatus: {
                agreement: "Completed",
                payment: "45% Processed",
                construction: "55% Complete",
                timeline: "On Schedule"
            }
        },
        {
            name: "Abdul Rahman",
            role: "Business Owner",
            content: "Their attention to detail and customer service is outstanding. The construction quality and project management are top-notch.",
            rating: 5,
            projectStatus: {
                agreement: "Completed",
                payment: "70% Processed",
                construction: "80% Complete",
                timeline: "On Schedule"
            }
        },
        {
            name: "Ramesh Babu",
            role: "Property Investor",
            content: "Very satisfied with the project progress and professional approach. The team's communication and transparency are commendable.",
            rating: 5,
            projectStatus: {
                agreement: "Completed",
                payment: "50% Processed",
                construction: "60% Complete",
                timeline: "On Schedule"
            }
        }
    ];

    return (
        <div className="py-12 bg-gradient-to-br from-white via-blue-50 to-white dark:from-boxdark dark:via-boxdark-2 dark:to-boxdark">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
                        Client Success Stories
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        Discover how we've helped our clients achieve their property dreams with our comprehensive solutions and dedicated support.
                    </p>
                </div>

                <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={30}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        640: {
                            slidesPerView: 1,
                        },
                        768: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 3,
                        },
                    }}
                    className="testimonial-swiper"
                >
                    {testimonials.map((testimonial, index) => (
                        <SwiperSlide key={index}>
                            <div className="bg-white dark:bg-boxdark rounded-xl shadow-default p-6 mb-10 transform hover:scale-105 transition-all duration-300">
                                <div className="relative">
                                    {/* Quote Icon */}
                                    <div className="absolute -top-10 -left-2">
                                        <FaQuoteLeft className="text-4xl text-primary/20" />
                                    </div>

                                    {/* Client Info */}
                                    <div className="flex items-center mb-6">
                                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                            <FaUser className="text-3xl text-primary" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-semibold text-black dark:text-white">
                                                {testimonial.name}
                                            </h4>
                                            <p className="text-gray-500 dark:text-gray-400">
                                                {testimonial.role}
                                            </p>
                                            <div className="flex mt-1">
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <FaStar key={i} className="text-yellow-400 text-sm" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Testimonial Content */}
                                    <p className="text-gray-600 dark:text-gray-300 mb-6 min-h-[80px]">
                                        "{testimonial.content}"
                                    </p>

                                    {/* Project Status */}
                                    <div className="border-t border-stroke dark:border-strokedark pt-4">
                                        <h5 className="text-sm font-semibold text-black dark:text-white mb-3">
                                            Project Status
                                        </h5>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="flex items-center">
                                                <FaHandshake className="text-primary mr-2" />
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    Agreement: {testimonial.projectStatus.agreement}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <FaHome className="text-primary mr-2" />
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    Payment: {testimonial.projectStatus.payment}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <FaTools className="text-primary mr-2" />
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    Construction: {testimonial.projectStatus.construction}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <FaCheckCircle className="text-primary mr-2" />
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    Timeline: {testimonial.projectStatus.timeline}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                .testimonial-swiper .swiper-pagination {
                    position: relative;
                    margin-top: 2rem;
                }
                .testimonial-swiper .swiper-pagination-bullet {
                    width: 10px;
                    height: 10px;
                    background: #e2e8f0;
                    opacity: 1;
                }
                .testimonial-swiper .swiper-pagination-bullet-active {
                    background: var(--color-primary);
                    transform: scale(1.2);
                }
            `}</style>
        </div>
    );
};

export default Testimonials; 