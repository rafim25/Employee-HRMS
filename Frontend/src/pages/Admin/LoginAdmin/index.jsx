import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../../context/actions/authActions';
import { useAuth } from '../../../context/AuthContext';
import Testimonials from '../../../components/molecules/Testimonial';
import TopNavigation from '../../../components/molecules/TopNavigation';
import FeatureHighlights from '../../../components/molecules/FeatureHighlights';
import LoginModal from '../../../components/molecules/LoginModal';
import Carousel from '../../../components/molecules/Carousel';

const LoginAdmin = () => {
    const navigate = useNavigate();
    const { dispatch, state } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    // If already authenticated, redirect to dashboard
    React.useEffect(() => {
        if (state.isAuthenticated) {
            navigate('/admin/dashboard');
        }
    }, [state.isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const result = await loginUser(dispatch, { username, password });
            if (result.success) {
                navigate('/admin/dashboard', { replace: true });
            }
        } catch (error) {
            setError(error.response?.data?.msg || 'Login failed');
            setIsLoginModalOpen(true);
        }
    };

    return (
        <div className='min-h-screen bg-white dark:bg-boxdark flex flex-col'>
            <TopNavigation onLoginClick={() => setIsLoginModalOpen(true)} />
            
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
                    <p>&copy; 2024 Raghav Elite Projects. All rights reserved.</p>
                </div>
            </footer>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onSubmit={handleSubmit}
                error={error}
                username={username}
                password={password}
                setUsername={setUsername}
                setPassword={setPassword}
            />
        </div>
    );
};

export default LoginAdmin;
