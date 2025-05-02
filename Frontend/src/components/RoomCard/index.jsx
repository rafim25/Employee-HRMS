import React, { useState } from 'react';
import { FaWifi, FaSwimmingPool, FaUtensils, FaTv, FaParking, FaAirFreshener } from 'react-icons/fa';
import { motion } from 'framer-motion';

const RoomCard = ({ room, onSelect }) => {
  const [selectedTab, setSelectedTab] = useState('photos');

  const amenities = [
    { icon: <FaWifi />, name: 'Free Wi-Fi' },
    { icon: <FaSwimmingPool />, name: 'Private Pool' },
    { icon: <FaUtensils />, name: 'Room Service' },
    { icon: <FaTv />, name: 'Smart TV' },
    { icon: <FaParking />, name: 'Free Parking' },
    { icon: <FaAirFreshener />, name: 'Air Conditioning' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold">{room.name}</h3>
            <p className="text-gray-600">{room.size} sq. ft.</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 line-through">₹{room.originalPrice}</p>
            <p className="text-2xl font-bold text-primary">₹{room.price}</p>
            <p className="text-sm text-gray-600">per night</p>
          </div>
        </div>

        <div className="flex mb-4 border-b">
          <button
            className={`px-4 py-2 ${selectedTab === 'photos' ? 'border-b-2 border-primary text-primary' : ''}`}
            onClick={() => setSelectedTab('photos')}
          >
            Photos
          </button>
          <button
            className={`px-4 py-2 ${selectedTab === 'amenities' ? 'border-b-2 border-primary text-primary' : ''}`}
            onClick={() => setSelectedTab('amenities')}
          >
            Amenities
          </button>
        </div>

        {selectedTab === 'photos' && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {room.photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Room view ${index + 1}`}
                className="rounded-lg w-full h-32 object-cover"
              />
            ))}
          </div>
        )}

        {selectedTab === 'amenities' && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            {amenities.map((amenity, index) => (
              <div key={index} className="flex items-center space-x-2 text-gray-600">
                {amenity.icon}
                <span>{amenity.name}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {room.maxOccupancy} guests max
            </span>
          </div>
          <button
            onClick={() => onSelect(room)}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Select Room
          </button>
        </div>

        {room.availability === 'limited' && (
          <p className="mt-2 text-red-500 text-sm">
            In high demand! Only {room.roomsLeft} rooms left
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default RoomCard; 