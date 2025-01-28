import React, { createContext, useContext, useState } from 'react';
import { loginUser } from './actions/authActions';
import { useAuth } from './AuthContext';

const LoginModalContext = createContext();

export const LoginModalProvider = ({ children }) => {
    const { dispatch } = useAuth();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await loginUser(dispatch, { username, password });
            
            if (!userData) {
                throw new Error('No user data received');
            }

            setIsLoginModalOpen(false);
            setUsername('');
            setPassword('');
            setError('');

            const userRole = userData.role?.toLowerCase();
            
            if (userRole === 'admin') {
                window.location.href = '/admin/dashboard';
            } else if (userRole === 'user') {
                window.location.href = '/pegawai/dashboard';
            } else {
                setError('Invalid user role');
            }

        } catch (error) {
            setError(error.response?.data?.msg || error.message || 'Login failed');
        }
    };

    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => {
        setIsLoginModalOpen(false);
        setUsername('');
        setPassword('');
        setError('');
    };

    return (
        <LoginModalContext.Provider value={{
            isLoginModalOpen,
            username,
            password,
            error,
            setUsername,
            setPassword,
            handleLoginSubmit,
            openLoginModal,
            closeLoginModal
        }}>
            {children}
        </LoginModalContext.Provider>
    );
};

export const useLoginModal = () => {
    const context = useContext(LoginModalContext);
    if (!context) {
        throw new Error('useLoginModal must be used within a LoginModalProvider');
    }
    return context;
}; 