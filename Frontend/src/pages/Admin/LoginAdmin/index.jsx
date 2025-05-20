import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaLock, FaSwimmingPool, FaUtensils, FaWifi, FaBed, FaUsers, FaParking, FaExclamationTriangle, FaGamepad, FaTv, FaConciergeBell, FaStar, FaQuoteLeft, FaUserCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { loginUser } from '../../../context/actions/authActions';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import VideoHero from '../../../components/Booking/VideoHero';
import TopNavigation from '../../../components/molecules/TopNavigation';
import Footer from '../../../components/molecules/Footer';
import ActivityCard from '../../../components/Booking/ActivityCard';
import RoomCard from '../../../components/Booking/RoomCard';
import LoginModal from '../../../components/molecules/LoginModal';
import { motion } from 'framer-motion';

const activities = [
    {
        id: 1,
        image: '/images/activity/rope.jpg',
        title: 'Rope Activity',
        description: 'Experience thrilling rope adventures with professional safety equipment',
        category: 'Adventure'
    },
    {
        id: 2,
        image: '/images/activity/rain-dance.jpg',
        title: 'Rain Dance',
        description: 'Enjoy refreshing rain dance sessions with music and entertainment',
        category: 'Entertainment'
    },
    {
        id: 3,
        image: '/images/activity/fire-camp.jpg',
        title: 'Fire Camp',
        description: 'Gather around the bonfire for stories, music, and warm conversations',
        category: 'Entertainment'
    },
    {
        id: 4,
        image: '/images/activity/games.jpg',
        title: 'Lake Boating',
        description: 'Relaxing boat rides on our serene lake with beautiful views',
        category: 'Leisure'
    },
    {
        id: 5,
        image: '/images/activity/trekking.jpg',
        title: 'Trekking',
        description: 'Guided trekking trails through scenic forest paths',
        category: 'Adventure'
    },
    {
        id: 6,
        image: '/images/activity/outdoor-games.jpg',
        title: 'Indoor & Outdoor Games',
        description: 'Wide range of games for all ages, both indoors and outdoors',
        category: 'Entertainment'
    }
];

const rooms = [
    {
        id: 1,
        images: [
            '/images/rooms/suite.jpg',
            '/images/rooms/suite-2.jpg',
            '/images/rooms/suite-3.jpg'
        ],
        title: 'Forest View Suite',
        description: 'Luxurious suite with panoramic forest views and private balcony',
        price: 2250,
        amenities: [
            { icon: <FaBed />, text: 'King Bed' },
            { icon: <FaUsers />, text: '2 Guests' },
            { icon: <FaParking />, text: 'Free Parking' },
            { icon: <FaSwimmingPool />, text: 'Pool Access' },
            { icon: <FaGamepad />, text: 'Indoor Games' },
            { icon: <FaUtensils />, text: 'Room Service' },
            { icon: <FaConciergeBell />, text: '24/7 Service' }
        ]
    },
    {
        id: 2,
        images: [
            '/images/rooms/family.jpg',
            '/images/rooms/family-2.jpg',
            '/images/rooms/family-3.jpg'
        ],
        title: 'Family Room',
        description: 'Spacious room perfect for families with children',
        price: 3000,
        amenities: [
            { icon: <FaBed />, text: 'Queen Bed' },
            { icon: <FaUsers />, text: '4 Guests' },
            { icon: <FaParking />, text: 'Free Parking' },
            { icon: <FaSwimmingPool />, text: 'Pool Access' },
            { icon: <FaGamepad />, text: 'Outdoor Games' },
            { icon: <FaUtensils />, text: 'Food Service' },
            { icon: <FaConciergeBell />, text: '24/7 Service' }
        ]
    },
    {
        id: 3,
        images: [
            '/images/rooms/tent.jpg',
            // '/images/rooms/tent-2.jpg',
            // '/images/rooms/tent-3.jpg'
        ],
        title: 'Glamping Tent',
        description: 'Unique glamping experience with modern amenities',
        price: 1500,
        amenities: [
            { icon: <FaBed />, text: 'Double Bed' },
            { icon: <FaUsers />, text: '2 Guests' },
            { icon: <FaParking />, text: 'Free Parking' },
            { icon: <FaSwimmingPool />, text: 'Pool Access' },
            { icon: <FaGamepad />, text: 'Outdoor Games' },
            { icon: <FaUtensils />, text: 'Food Service' },
            { icon: <FaConciergeBell />, text: '24/7 Service' }
        ]
    },
    {
        id: 4,
        images: [
            '/images/rooms/dormitory.jpg',
            '/images/rooms/dormitory-2.jpg',
            '/images/rooms/dormitory-3.jpg'
        ],
        title: 'Dormitory Room',
        description: 'Budget-friendly shared accommodation for groups',
        price: 2000,
        amenities: [
            { icon: <FaBed />, text: 'Bunk Beds' },
            { icon: <FaUsers />, text: '8 Guests' },
            { icon: <FaParking />, text: 'Free Parking' },
            { icon: <FaSwimmingPool />, text: 'Pool Access' },
            { icon: <FaGamepad />, text: 'Indoor Games' },
            { icon: <FaUtensils />, text: 'Food Service' },
            { icon: <FaConciergeBell />, text: '24/7 Service' }
        ]
    }
];

const nearbyPlaces = [
    {
        id: 1,
        image: '/images/places/manjarabad.jpg',
        title: 'Manjarabad Fort',
        description: 'Historic fort built by Tipu Sultan with unique star-shaped architecture and panoramic views',
        distance: '15 km',
        category: 'Historical'
    },
    {
        id: 2,
        image: '/images/places/bisle.jpg',
        title: 'Bisle View Point',
        description: 'Scenic viewpoint offering breathtaking views of the Western Ghats and surrounding valleys',
        distance: '25 km',
        category: 'Nature'
    },
    {
        id: 3,
        image: '/images/places/waterfall.jpg',
        title: 'Manjehalli Waterfall',
        description: 'Beautiful waterfall surrounded by lush greenery, perfect for nature photography',
        distance: '20 km',
        category: 'Nature'
    },
    {
        id: 4,
        image: '/images/places/temple.jpg',
        title: 'Sakleshwara Temple',
        description: 'Ancient temple dedicated to Lord Shiva, showcasing Hoysala architecture',
        distance: '5 km',
        category: 'Religious'
    },
    {
        id: 5,
        image: '/images/places/coffee.jpg',
        title: 'Kadamane Tea Estate',
        description: 'Vast expanses of coffee estates offering guided tours and tasting sessions',
        distance: '10 km',
        category: 'Nature'
    },
    {
        id: 6,
        image: '/images/places/hosalli-gudda.jpg',
        title: 'Hosahalli Gudda',
        description: 'Challenging trek with stunning views of the Western Ghats',
        distance: '30 km',
        category: 'Adventure'
    },
    // {
    //     id: 6,
    //     image: '/images/places/trek.jpg',
    //     title: 'Jenukal Gudda Trek',
    //     description: 'Challenging trek with stunning views of the Western Ghats',
    //     distance: '30 km',
    //     category: 'Adventure'
    // },
    // {
    //     id: 7,
    //     image: '/images/places/lake.jpg',
    //     title: 'Heggadadevana Kote Lake',
    //     description: 'Serene lake surrounded by hills, perfect for boating and bird watching',
    //     distance: '18 km',
    //     category: 'Nature'
    // },
    // {
    //     id: 8,
    //     image: '/images/places/garden.jpg',
    //     title: 'Rose Garden',
    //     description: 'Beautiful garden with various species of roses and other flowers',
    //     distance: '8 km',
    //     category: 'Nature'
    // },
    {
        id: 9,
        image: '/images/places/green-route.jpg',
        title: 'Railway tunnel sakleshpur',
        description: 'Scenic railway trek through the Western Ghats, offering breathtaking views of valleys and tunnels',
        distance: '35 km',
        category: 'Adventure'
    },
    {
        id: 10,
        image: '/images/places/hadlu.jpg',
        title: 'Hadlu Waterfall',
        description: 'Majestic waterfall surrounded by dense forests, perfect for nature lovers and photographers',
        distance: '22 km',
        category: 'Nature'
    }
];

// Add testimonials data before the LoginAdmin component
const testimonials = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Travel Enthusiast",
        image: "/gallery/gallery_001.jpg",
        rating: 5,
        review: "An absolutely magical experience! The forest view from our suite was breathtaking, and the staff went above and beyond to make our stay memorable. The activities were well-organized and the food was exceptional.",
        date: "March 15, 2024"
    },
    {
        id: 2,
        name: "Rajesh Kumar",
        role: "Family Vacationer",
        image: "/gallery/gallery_002.jpg",
        rating: 5,
        review: "Perfect for a family getaway! The kids loved the outdoor activities and the pool. The rooms were spacious and clean, and the staff was incredibly friendly. Will definitely come back!",
        date: "March 10, 2024"
    },
    {
        id: 3,
        name: "Priya Sharma",
        role: "Nature Lover",
        image: "/gallery/gallery_003.jpg",
        rating: 5,
        review: "The perfect blend of luxury and nature. Waking up to the sound of birds and the view of misty mountains was surreal. The trekking trails were amazing, and the evening bonfire was a great way to end the day.",
        date: "March 5, 2024"
    },
    {
        id: 4,
        name: "Michael Chen",
        role: "Adventure Seeker",
        image: "/gallery/gallery_004.jpg",
        rating: 5,
        review: "The adventure activities were thrilling and well-organized. The rope course and trekking were highlights of our stay. The resort's location is perfect for exploring the Western Ghats.",
        date: "February 28, 2024"
    },
    {
        id: 5,
        name: "Ananya Patel",
        role: "Couple's Retreat",
        image: "/gallery/gallery_005.jpg",
        rating: 5,
        review: "A romantic paradise! The tent house experience was unique and comfortable. The candlelight dinner by the lake was magical. The staff made our anniversary special with thoughtful gestures.",
        date: "February 20, 2024"
    }
];

// Custom ActivityCard with fallback for missing images
const AdminActivityCard = ({ image, title, description, category }) => {
    const [imgError, setImgError] = useState(false);
    return (
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-white/20 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="relative h-48">
                {!imgError ? (
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-700/80 text-white text-lg font-semibold blur-sm">
                        <span className="text-4xl mb-2"><FaExclamationTriangle /></span>
                        Image Not Available
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm">
                        {category}
                    </span>
                </div>
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-2">{title}</h3>
                <p className="text-black mb-4 line-clamp-2">{description}</p>
                {/* <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-md">
                    Book Now
                </button> */}
            </div>
        </div>
    );
};

// Add this new component for the enhanced room card
const EnhancedRoomCard = ({ images, title, description, price, amenities }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        let interval;
        if (isAutoPlaying) {
            interval = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % images.length);
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isAutoPlaying, images.length]);

    const handlePrevImage = (e) => {
        e.stopPropagation();
        setIsAutoPlaying(false);
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleNextImage = (e) => {
        e.stopPropagation();
        setIsAutoPlaying(false);
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    return (
        <div className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105">
            <div className="relative h-80">
                <div className="absolute inset-0">
                    <img
                        src={images[currentImageIndex]}
                        alt={title}
                        className="w-full h-full object-cover transition-opacity duration-500"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                {/* Navigation Arrows */}
                <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
                >
                    <FaChevronLeft className="w-4 h-4" />
                </button>
                <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
                >
                    <FaChevronRight className="w-4 h-4" />
                </button>

                {/* Image Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsAutoPlaying(false);
                                setCurrentImageIndex(index);
                            }}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'
                                }`}
                        />
                    ))}
                </div>
            </div>
            <div className="p-6">
                <h3 className="text-2xl font-bold text-black mb-2">{title}</h3>
                <p className="text-gray-600 mb-4">{description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                            <span className="text-primary mr-2">{amenity.icon}</span>
                            <span className="text-sm text-gray-700">{amenity.text}</span>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">₹{price}</span>
                    <span className="text-sm text-gray-500">per night</span>
                </div>
            </div>
        </div>
    );
};

const LoginAdmin = () => {
    const { dispatch } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleScroll = (containerId, direction) => {
        const container = document.getElementById(containerId);
        if (container) {
            const scrollAmount = container.offsetWidth * 0.8; // Scroll 80% of container width
            const currentScroll = container.scrollLeft;
            const newScroll = direction === 'left'
                ? currentScroll - scrollAmount
                : currentScroll + scrollAmount;

            container.scrollTo({
                left: newScroll,
                behavior: 'smooth'
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        setLoading(true);
        const loadingToast = toast.loading('Signing in...');

        try {
            console.log("Submitting login form with:", formData);
            const userData = await loginUser(dispatch, {
                username: formData.username,
                password: formData.password
            });
            console.log("Login successful, user data:", userData);

            if (!userData) {
                console.error("No user data received");
                throw new Error('No user data received');
            }

            console.log("User role for navigation:", userData.role);
            toast.success('Login successful!', { id: loadingToast });
            setIsLoginModalOpen(false);

            // Navigate based on user role
            if (userData.role === 'Admin') {
                console.log("Navigating to admin dashboard");
                navigate('/admin/dashboard');
            } else if (userData.role === 'Pegawai') {
                console.log("Navigating to pegawai dashboard");
                navigate('/pegawai/dashboard');
            } else {
                console.log("Navigating to default dashboard");
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Login error:', error);
            console.error('Error details:', {
                response: error.response,
                message: error.message,
                stack: error.stack
            });
            toast.error(error.response?.data?.msg || 'Login failed', { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    const handleLoginClick = () => {
        setIsLoginModalOpen(true);
    };

    return (
        <div className="relative min-h-screen">
            <div className="absolute top-0 left-0 right-0 z-50">
                <TopNavigation onLoginClick={handleLoginClick} />
            </div>

            <VideoHero
                videoSrc="/videos/hero-background.mp4"
                title="Unnathi Forest View"
                subtitle="Experience luxury and tranquility in the heart of nature"
            />

            {/* Login Modal */}
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onSubmit={(e) => handleSubmit(e)}
                error={null}
                username={formData.username}
                password={formData.password}
                setUsername={(value) => setFormData(prev => ({ ...prev, username: value }))}
                setPassword={(value) => setFormData(prev => ({ ...prev, password: value }))}
            />

            {/* Activities Section */}
            <section className="py-10 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-black mb-4">Activities & Experiences</h2>
                        <p className="text-black">Discover our range of exciting activities</p>
                    </div>
                    <div className="relative">
                        <div id="activities-container" className="flex overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
                            {activities.map(activity => (
                                <div key={activity.id} className="flex-none w-80 mx-4 snap-center">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105"
                                    >
                                        <div className="relative h-48">
                                            <img
                                                src={activity.image}
                                                alt={activity.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                            <div className="absolute bottom-4 left-4">
                                                <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm">
                                                    {activity.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-black mb-2">{activity.title}</h3>
                                            <p className="text-black mb-4 line-clamp-2">{activity.description}</p>
                                            {/* <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-md">
                                                Book Now
                                            </button> */}
                                        </div>
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 pointer-events-none">
                            <button
                                onClick={() => handleScroll('activities-container', 'left')}
                                className="bg-white/80 hover:bg-white text-black rounded-full p-3 shadow-lg transform -translate-x-1/2 pointer-events-auto transition-all duration-300 hover:scale-110"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => handleScroll('activities-container', 'right')}
                                className="bg-white/80 hover:bg-white text-black rounded-full p-3 shadow-lg transform translate-x-1/2 pointer-events-auto transition-all duration-300 hover:scale-110"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Rooms Section */}
            <section className="py-10 bg-black-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-black mb-4">Rooms & Suites</h2>
                        <p className="text-black">Choose from our selection of luxurious accommodations</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {rooms.map(room => (
                            <EnhancedRoomCard key={room.id} {...room} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Amenities Section */}
            {/* <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-black mb-4">Resort Amenities</h2>
                        <p className="text-black">Enjoy our world-class facilities and services</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <FaSwimmingPool className="text-4xl text-green-500 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2 text-black">Infinity Pool</h3>
                            <p className="text-black">Luxurious pool with panoramic views</p>
                        </div>
                        <div className="text-center p-6">
                            <FaUtensils className="text-4xl text-green-500 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2 text-black">Fine Dining</h3>
                            <p className="text-black">Experience culinary excellence</p>
                        </div>
                        <div className="text-center p-6">
                            <FaWifi className="text-4xl text-green-500 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2 text-black">Free WiFi</h3>
                            <p className="text-black">Stay connected throughout your stay</p>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* Nearby Places Section */}
            <section className="py-10 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-black mb-4">Nearby Places to Visit</h2>
                        <p className="text-black">Explore the beautiful attractions around Sakleshpur</p>
                    </div>
                    <div className="relative">
                        <div id="places-container" className="flex overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
                            {nearbyPlaces.map(place => (
                                <div key={place.id} className="flex-none w-80 mx-4 snap-center">
                                    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105">
                                        <div className="relative h-48">
                                            <img
                                                src={place.image}
                                                alt={place.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-4 right-4">
                                                <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm">
                                                    {place.distance}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-black mb-2">{place.title}</h3>
                                            <p className="text-black mb-4 line-clamp-2">{place.description}</p>
                                            <span className="inline-block px-3 py-1 bg-gray-100 text-black rounded-full text-sm">
                                                {place.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 pointer-events-none">
                            <button
                                onClick={() => handleScroll('places-container', 'left')}
                                className="bg-white/80 hover:bg-white text-black rounded-full p-3 shadow-lg transform -translate-x-1/2 pointer-events-auto transition-all duration-300 hover:scale-110"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => handleScroll('places-container', 'right')}
                                className="bg-white/80 hover:bg-white text-black rounded-full p-3 shadow-lg transform translate-x-1/2 pointer-events-auto transition-all duration-300 hover:scale-110"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-black mb-4">Guest Experiences</h2>
                        <p className="text-black">What our guests say about their stay</p>
                    </div>
                    <div className="relative">
                        <div id="testimonials-container" className="flex overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
                            {testimonials.map(testimonial => (
                                <div key={testimonial.id} className="flex-none w-96 mx-4 snap-center">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="bg-white rounded-xl shadow-xl p-8 transform transition-all duration-300 hover:scale-105 h-[400px] flex flex-col"
                                    >
                                        <div className="flex items-center mb-6">
                                            <div className="w-16 h-16 rounded-full overflow-hidden mr-4 bg-gray-100 flex items-center justify-center">
                                                <FaUserCircle className="w-12 h-12 text-gray-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-black">{testimonial.name}</h3>
                                                <p className="text-gray-600">{testimonial.role}</p>
                                                <div className="flex items-center mt-1">
                                                    {[...Array(testimonial.rating)].map((_, i) => (
                                                        <FaStar key={i} className="text-yellow-400" />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative flex-grow">
                                            <FaQuoteLeft className="text-primary/20 text-4xl absolute -top-2 -left-2" />
                                            <p className="text-gray-700 italic mb-4 relative z-10 line-clamp-6">{testimonial.review}</p>
                                        </div>
                                        <div className="text-right text-sm text-gray-500 mt-auto">
                                            {testimonial.date}
                                        </div>
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 pointer-events-none">
                            <button
                                onClick={() => handleScroll('testimonials-container', 'left')}
                                className="bg-white/80 hover:bg-white text-black rounded-full p-3 shadow-lg transform -translate-x-1/2 pointer-events-auto transition-all duration-300 hover:scale-110"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => handleScroll('testimonials-container', 'right')}
                                className="bg-white/80 hover:bg-white text-black rounded-full p-3 shadow-lg transform translate-x-1/2 pointer-events-auto transition-all duration-300 hover:scale-110"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LoginAdmin;
