import React from 'react';
import TopNavigation from '../../molecules/TopNavigation';
import LoginModalWrapper from '../../molecules/LoginModalWrapper';
import { useLoginModal } from '../../../context/LoginModalContext';
import Footer from '../../molecules/Footer';

const PublicLayout = ({ children }) => {
    const { openLoginModal } = useLoginModal();

    return (
        <div className="min-h-screen bg-white dark:bg-boxdark flex flex-col">
            <TopNavigation onLoginClick={openLoginModal} />
            <LoginModalWrapper />
            <div className="flex-grow">
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default PublicLayout; 