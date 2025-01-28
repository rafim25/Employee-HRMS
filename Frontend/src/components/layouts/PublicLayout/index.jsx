import React from 'react';
import TopNavigation from '../../molecules/TopNavigation';
import LoginModalWrapper from '../../molecules/LoginModalWrapper';
import { useLoginModal } from '../../../context/LoginModalContext';

const PublicLayout = ({ children }) => {
    const { openLoginModal } = useLoginModal();

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-boxdark dark:to-boxdark-2 flex flex-col">
            <TopNavigation onLoginClick={openLoginModal} />
            <LoginModalWrapper />
            {children}
        </div>
    );
};

export default PublicLayout; 