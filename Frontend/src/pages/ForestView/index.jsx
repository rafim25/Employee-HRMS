import React from 'react';
import { motion } from 'framer-motion';
import TopNavigation from '../../components/molecules/TopNavigation';
import Footer from '../../components/molecules/Footer';
import ActivityCard from '../../components/Booking/ActivityCard';
import RoomCard from '../../components/Booking/RoomCard';
import { FaBed, FaUsers, FaWifi, FaParking, FaSwimmingPool, FaUtensils } from 'react-icons/fa';

const activities = [
  {
    id: 1,
    image: '/gallery/image1.jpg',
    title: 'Forest Hiking',
    description: 'Explore our scenic forest trails with experienced guides',
    category: 'Outdoor'
  },
  {
    id: 2,
    image: '/gallery/image2.jpg',
    title: 'Swimming Pool',
    description: 'Luxurious infinity pool with panoramic forest views',
    category: 'Indoor'
  },
  {
    id: 3,
    image: '/gallery/image3.jpg',
    title: 'Spa & Wellness',
    description: 'Rejuvenate your body and mind with our premium spa treatments',
    category: 'Indoor'
  },
  {
    id: 4,
    image: '/gallery/image4.jpg',
    title: 'Mountain Biking',
    description: 'Adventure through our specially designed mountain bike trails',
    category: 'Outdoor'
  }
];

const rooms = [
  {
    id: 1,
    image: '/gallery/image5.jpg',
    title: 'Forest View Suite',
    description: 'Luxurious suite with panoramic forest views and private balcony',
    price: 299,
    amenities: [
      { icon: <FaBed />, text: 'King Bed' },
      { icon: <FaUsers />, text: '2 Guests' },
      { icon: <FaWifi />, text: 'Free WiFi' },
      { icon: <FaParking />, text: 'Free Parking' }
    ]
  },
  {
    id: 2,
    image: '/gallery/image6.jpg',
    title: 'Mountain View Room',
    description: 'Comfortable room with stunning mountain views',
    price: 199,
    amenities: [
      { icon: <FaBed />, text: 'Queen Bed' },
      { icon: <FaUsers />, text: '2 Guests' },
      { icon: <FaWifi />, text: 'Free WiFi' },
      { icon: <FaParking />, text: 'Free Parking' }
    ]
  }
];

const ForestView = () => {
  return (
    <div className="min-h-screen bg-black-50">
      <TopNavigation />

      {/* Hero Section */}
      <section className="relative h-[80vh]">
        <img
          src="/gallery/image7.jpg"
          alt="Forest View Resort"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50">
          <div className="container mx-auto px-4 h-full flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl text-white"
            >
              <h1 className="text-5xl font-bold mb-4">Welcome to Forest View Resort</h1>
              <p className="text-xl mb-8">Experience luxury and tranquility in the heart of nature</p>
              <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors">
                Book Your Stay
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black-900 mb-4">Activities & Experiences</h2>
            <p className="text-black-600">Discover our range of indoor and outdoor activities</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {activities.map(activity => (
              <ActivityCard key={activity.id} {...activity} />
            ))}
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section className="py-20 bg-black-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black-900 mb-4">Rooms & Suites</h2>
            <p className="text-black-600">Choose from our selection of luxurious accommodations</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {rooms.map(room => (
              <RoomCard key={room.id} {...room} />
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black-900 mb-4">Resort Amenities</h2>
            <p className="text-black-600">Enjoy our world-class facilities and services</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <FaSwimmingPool className="text-4xl text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Infinity Pool</h3>
              <p className="text-black-600">Luxurious pool with panoramic views</p>
            </div>
            <div className="text-center p-6">
              <FaUtensils className="text-4xl text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fine Dining</h3>
              <p className="text-black-600">Experience culinary excellence</p>
            </div>
            <div className="text-center p-6">
              <FaWifi className="text-4xl text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Free WiFi</h3>
              <p className="text-black-600">Stay connected throughout your stay</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ForestView; 