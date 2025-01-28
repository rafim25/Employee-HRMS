import React from 'react';
import PublicLayout from '../../../components/layouts/PublicLayout';
import FeatureHighlights from '../../../components/molecules/FeatureHighlights';
import Carousel from '../../../components/molecules/Carousel';
import Testimonials from '../../../components/molecules/Testimonial';

const LoginAdmin = () => {
    return (
        <PublicLayout>
            <div className='flex-grow flex flex-wrap items-center'>
                <div className='w-full'>
                    <Carousel />
                </div>
            </div>

            <FeatureHighlights />

            <div className='border-t border-stroke dark:border-strokedark'>
                <div className='container mx-auto py-4'>
                    <Testimonials />
                </div>
            </div>

            <footer className="bg-white dark:bg-boxdark py-2 border-t border-stroke dark:border-strokedark">
                <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
                    <p>&copy; 2024 Raghav Elite Projects All rights reserved.</p>
                </div>
            </footer>
        </PublicLayout>
    );
};

export default LoginAdmin;
