import React from 'react';
import { useLocation } from 'react-router-dom';
import TopNavigation from '../../molecules/TopNavigation';
import LoginModalWrapper from '../../molecules/LoginModalWrapper';
import { useLoginModal } from '../../../context/LoginModalContext';
import Footer from '../../molecules/Footer';

const overlayPaths = ['/', '/admin/login'];

const PublicLayout = ({ children }) => {
    const { openLoginModal } = useLoginModal();
    const location = useLocation();
    const overlay = overlayPaths.includes(location.pathname);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <TopNavigation onLoginClick={openLoginModal} overlay={overlay} />
            <LoginModalWrapper />
            <div className={`flex-grow ${overlay ? '' : 'pt-20'}`}>
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default PublicLayout;
