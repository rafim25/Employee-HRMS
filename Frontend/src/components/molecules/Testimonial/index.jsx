import React from 'react';
import { FaQuoteLeft, FaStar, FaBriefcase, FaCheckCircle, FaUser, FaClock } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const Testimonials = () => {
    const testimonials = [
        {
            name: "Anil Kumar S",
            role: "Placed Candidate",
            content: "I had a fantastic experience working with Seven Wings technology during my recent job search. Their team was highly professional, responsive, and supportive throughout the entire process. From the initial stage to the final placement, they went above and beyond to ensure that my needs and preferences were met.",
            rating: 5,
            date: "1 year ago",
            placementDetails: {
                position: "Software Engineer",
                company: "Leading Tech Company",
                timeframe: "Quick Placement",
                status: "Successfully Placed"
            }
        },
        {
            name: "Rachana Amrutha",
            role: "Placed Candidate",
            content: "I had an outstanding experience with Seven Wings Technology. From the moment I reached out to them, they provided top-notch support and guidance. I landed my dream job within a surprisingly short period. Great response from all the HR and the one day process is the impressive one.",
            rating: 5,
            date: "1 year ago",
            placementDetails: {
                position: "Banking Professional",
                company: "Top Bank",
                timeframe: "One Day Process",
                status: "Successfully Placed"
            }
        },
        {
            name: "Srijith Gowda",
            role: "Placed Candidate",
            content: "Really happy with the kind of services they provide and handle all the candidates well. A special thanks to the Recruiter Rachana, Team Leader Anikha. As a team they helped and motivated me until I complete my last round of interview for Axis Bank and get my offer letter.",
            rating: 5,
            date: "1 year ago",
            placementDetails: {
                position: "Banking Professional",
                company: "Axis Bank",
                timeframe: "Efficient Process",
                status: "Successfully Placed"
            }
        },
        {
            name: "Megha S",
            role: "HDFC Bank Employee",
            content: "I have taken training on BANK EDGE and have been placed in HDFC Bank. Thanks for your support to build my career in this field. Please contact Seven Wings Technology, you'll definitely get a good job in Banking.",
            rating: 5,
            date: "3 years ago",
            placementDetails: {
                position: "Banking Professional",
                company: "HDFC Bank",
                timeframe: "After Training",
                status: "Successfully Placed"
            }
        }
    ];

    return (
        <div className="py-12 bg-gradient-to-br from-white via-blue-50 to-white dark:from-boxdark dark:via-boxdark-2 dark:to-boxdark">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
                        Success Stories
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        Discover how we've helped candidates secure their dream positions at leading organizations through our expert recruitment services.
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
                                            <div className="flex items-center mt-1">
                                                <div className="flex mr-2">
                                                    {[...Array(testimonial.rating)].map((_, i) => (
                                                        <FaStar key={i} className="text-yellow-400 text-sm" />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-gray-400">
                                                    {testimonial.date}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Testimonial Content */}
                                    <p className="text-gray-600 dark:text-gray-300 mb-6 min-h-[100px]">
                                        "{testimonial.content}"
                                    </p>

                                    {/* Placement Details */}
                                    <div className="border-t border-stroke dark:border-strokedark pt-4">
                                        <h5 className="text-sm font-semibold text-black dark:text-white mb-3">
                                            Placement Details
                                        </h5>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="flex items-center">
                                                <FaBriefcase className="text-primary mr-2" />
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {testimonial.placementDetails.position}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <FaCheckCircle className="text-primary mr-2" />
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {testimonial.placementDetails.company}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <FaClock className="text-primary mr-2" />
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {testimonial.placementDetails.timeframe}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <FaCheckCircle className="text-primary mr-2" />
                                                <span className="text-sm text-green-500 font-medium">
                                                    {testimonial.placementDetails.status}
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