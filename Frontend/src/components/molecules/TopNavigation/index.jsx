import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaWhatsapp, FaBars, FaTimes, FaUser, FaHistory, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import logoDark from '../../../Assets/images/logo/logo-dark.png?url';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import LoginModal from '../LoginModal';
import { loginUser } from '../../../context/actions/authActions';

const TopNavigation = ({ onLoginClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { state, dispatch } = useAuth();
  const { user, isAuthenticated } = state;

  console.log('isAuthenticated', isAuthenticated);
  const isAdminLogin = location.pathname === '/admin/login';
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWhatsAppClick = () => {
    const phoneNumber = '+918123432999';
    const message = 'Hi, I would like to know more about booking a room.';
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleLogin = async (loginData) => {
    try {
      setLoginError('');
      const endpoint = loginData.isAdminLogin ? '/api/admin/login' : '/api/visitors/login';
      const payload = loginData.isAdminLogin
        ? { username: loginData.username, password: loginData.password }
        : { email: loginData.email, password: loginData.password };

      let response;
      if (loginData.isAdminLogin) {
        response = await loginUser(dispatch, {
          username: loginData.username,
          password: loginData.password
        });
      } else {
        response = await axios.post(endpoint, payload);
      }

      if (response) {
        if (loginData.isAdminLogin) {
          localStorage.setItem('adminAuth', JSON.stringify(response.data));
          toast.success('Admin login successful');
          navigate('/admin/booking-dashboard');
        } else {
          const payload = {
            visitor_id: response.data.visitor.visitor_id,
            name: response.data.visitor.name,
            email: response.data.visitor.email,
            role: 'visitor'
          }
          dispatch({ type: 'SET_USER', payload });
          localStorage.setItem('auth', JSON.stringify({ ...payload, isAuthenticated: true }));
          toast.success('Login successful');
          navigate('/my-bookings');
        }
        setShowLoginModal(false);
      }
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Login failed. Please try again.');
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('auth');
    localStorage.removeItem('adminAuth');
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isAdminLogin
        ? 'bg-white/10 backdrop-blur-md'
        : isScrolled
          ? 'bg-black'
          : 'bg-transparent'
        }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo/Brand */}
            <div className="flex-shrink-0 ml-0">
              <Link to="/" className="flex items-center">
                <img src={logoDark} alt="Logo" className="h-20" />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center justify-end flex-1 space-x-6 ml-32">
              {[
                { to: "/", label: "Home" },
                { to: "/gallery", label: "Gallery" },
                { to: "/activities", label: "Activities" },
                { to: "/contact", label: "Contact Us" },
                { to: "/reservation", label: "Book Now" },
              ].map((item) => (
                <NavLink key={item.to} to={item.to}>
                  {item.label}
                </NavLink>
              ))}

              {/* User Menu or Login Button */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="px-6 py-2.5 text-base font-medium text-white bg-primary hover:bg-blue-600 
                    rounded-lg transition-all duration-300 flex items-center space-x-2.5 
                    hover:shadow-lg hover:shadow-blue-500/30 tracking-wide ml-4"
                  >
                    <FaUser className="w-5 h-5" />
                    <span>{state.user?.name || 'My Account'}</span>
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                      <Link
                        to="/my-bookings"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FaHistory className="mr-2" />
                        My Bookings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <FaSignOutAlt className="mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-6 py-2.5 text-base font-medium text-white bg-primary hover:bg-blue-600 
                  rounded-lg transition-all duration-300 flex items-center space-x-2.5 
                  hover:shadow-lg hover:shadow-blue-500/30 tracking-wide ml-4"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Login</span>
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-blue-50 dark:text-gray-200 dark:hover:bg-boxdark-2 transition-all duration-300"
              >
                <svg
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <div className="py-3 space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/gallery", label: "Gallery" },
                { to: "/activities", label: "Activities" },
                { to: "/contact", label: "Contact Us" },
                { to: "/reservation", label: "Book Now" },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="block px-4 py-2.5 text-base font-medium text-white
                  hover:bg-white/10 hover:text-white/90 rounded-lg
                  transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile User Menu or Login Button */}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/my-bookings"
                    className="block px-4 py-2.5 text-base font-medium text-white
                    hover:bg-white/10 hover:text-white/90 rounded-lg
                    transition-all duration-300 flex items-center space-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaHistory />
                    <span>My Bookings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-base font-medium text-white
                    hover:bg-white/10 hover:text-white/90 rounded-lg
                    transition-all duration-300 flex items-center space-x-2"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowLoginModal(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-base font-medium text-white
                  hover:bg-white/10 hover:text-white/90 rounded-lg
                  transition-all duration-300 flex items-center space-x-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Login1</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        className="fixed right-6 bottom-6 z-[9999] flex items-center justify-center w-14 h-14 
        bg-[#25D366] rounded-full shadow-lg hover:bg-[#20BA56] 
        transition-all duration-300 hover:scale-110 
        animate-bounce-slow group hover:shadow-xl hover:shadow-green-500/20"
      >
        <FaWhatsapp className="text-white text-3xl group-hover:scale-110 transition-transform duration-300" />

        {/* Tooltip */}
        <span className="absolute right-full mr-3 px-3 py-2 bg-white text-gray-700 
        text-sm font-medium rounded-lg shadow-lg whitespace-nowrap 
        opacity-0 group-hover:opacity-100 transition-opacity duration-300
        border border-gray-100">
          Chat with us on WhatsApp
          {/* Triangle Pointer */}
          <span className="absolute top-1/2 -right-2 -translate-y-1/2 
          border-6 border-transparent border-l-white"></span>
        </span>
      </button>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          setLoginError('');
        }}
        onSubmit={handleLogin}
        error={loginError}
      />
    </>
  );
};

const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="relative px-5 py-2.5 text-base font-medium text-white hover:text-white/90 rounded-lg 
    hover:bg-white/10 transition-all duration-300 group overflow-hidden tracking-wide"
  >
    <span className="absolute inset-0 w-0 bg-white/10 transition-all duration-300 ease-out group-hover:w-full -z-10"></span>
    <span className="relative">{children}</span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
  </Link>
);

export default TopNavigation; 