import React from 'react';
import { useLoginModal } from '../../../context/LoginModalContext';
import LoginModal from '../LoginModal';

const LoginModalWrapper = () => {
    const {
        isLoginModalOpen,
        username,
        password,
        error,
        setUsername,
        setPassword,
        handleLoginSubmit,
        closeLoginModal
    } = useLoginModal();

    return (
        <LoginModal
            isOpen={isLoginModalOpen}
            onClose={closeLoginModal}
            onSubmit={handleLoginSubmit}
            error={error}
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
        />
    );
};

export default LoginModalWrapper; 