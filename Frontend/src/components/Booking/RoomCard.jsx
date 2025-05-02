import React from 'react';
import { motion } from 'framer-motion';
import { FaBed, FaUsers, FaParking, FaSwimmingPool, FaGamepad, FaUtensils, FaConciergeBell } from 'react-icons/fa';

const RoomCard = ({ image, title, description, price, amenities }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-56 object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-primary text-white rounded-full text-sm font-medium">
            From ₹{price}/night
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-black mb-2">{title}</h3>
        <p className="text-black text-sm mb-3 line-clamp-2">{description}</p>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {amenities.map((amenity, index) => (
            <div key={index} className="flex items-center space-x-1 text-black text-sm">
              {amenity.icon}
              <span>{amenity.text}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button className="bg-primary text-white py-1.5 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium shadow-md w-28">
            Book Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RoomCard; 