import React, { useState } from 'react';
import TopNavigation from '../molecules/TopNavigation';
import LoginModal from '../molecules/LoginModal';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../context/actions/authActions';

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const { dispatch } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            await loginUser(dispatch, { username, password });
            navigate('/admin/dashboard');
        } catch (error) {
            setError(error.response?.data?.msg || 'Login failed');
        }
    };

    return (
        <div className='min-h-screen bg-white dark:bg-boxdark flex flex-col'>
            <TopNavigation onLoginClick={() => setIsLoginModalOpen(true)} />
            
            <main className="flex-grow">
                {children}
            </main>

            <footer className="bg-white dark:bg-boxdark py-2 border-t border-stroke dark:border-strokedark">
                <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
                    <p>&copy; 2024 Raghav Elite Projects. All rights reserved.</p>
                </div>
            </footer>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onSubmit={handleLoginSubmit}
                error={error}
                username={username}
                password={password}
                setUsername={setUsername}
                setPassword={setPassword}
            />
        </div>
    );
};

export default Layout; 