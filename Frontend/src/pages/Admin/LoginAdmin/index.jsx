import React,{useState} from 'react';
import Logo from '../../../Assets/images/logo/logo.svg'
import LogoDark from '../../../Assets/images/logo/logo-dark.png'
import LoginImg from '../../../Assets/images/LoginImg/login.svg'
import BuildingImg from '../../../Assets/images/building-construction.svg'
import { FiUser } from 'react-icons/fi'
import { TfiLock } from 'react-icons/tfi'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../../../context/actions/authActions';
import { useAuth } from '../../../context/AuthContext'; // Add this import
import Testimonials from '../../../components/molecules/Testimonial';
import TopNavigation from '../../../components/molecules/TopNavigation';
import FeatureHighlights from '../../../components/molecules/FeatureHighlights';
import LoginModal from '../../../components/molecules/LoginModal';
import Carousel from '../../../components/molecules/Carousel';

const LoginAdmin = () => {
    const navigate = useNavigate();
    const { dispatch } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const handleSubmit = async (e) => {
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
    )
}

export default LoginAdmin;
