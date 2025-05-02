import React, { useState } from 'react';
import { FaUtensils, FaHiking, FaGamepad, FaClock, FaSignal, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import TopNavigation from '../../components/molecules/TopNavigation/index';
import Footer from '../../components/molecules/Footer';
import ImageHero from '../../components/Booking/ImageHero';

const outdoorActivitiesData = [
  {
    image: '/images/activity/trekking.jpg',
    title: 'Mountain Trekking',
    description: 'Experience the thrill of mountain trekking with our expert guides. Traverse through scenic trails and discover breathtaking views.',
    duration: '4-6 hours',
    difficulty: 'Moderate'
  },
  // {
  //   image: '/images/activity/rafting.jpg',
  //   title: 'River Rafting',
  //   description: 'Navigate through exciting rapids and enjoy the rush of white water rafting. Perfect for adventure seekers and team building.',
  //   duration: '3-4 hours',
  //   difficulty: 'High'
  // },
  {
    image: '/images/activity/fire-camp.jpg',
    title: 'Camping',
    description: 'Spend a night under the stars with our fully equipped camping experience. Includes tent setup, bonfire, and stargazing.',
    duration: 'Overnight',
    difficulty: 'Easy'
  },
  // {
  //   image: '/images/activity/rock-climbing.jpg',
  //   title: 'Rock Climbing',
  //   description: 'Challenge yourself with our rock climbing courses. Suitable for both beginners and experienced climbers.',
  //   duration: '2-3 hours',
  //   difficulty: 'Moderate to High'
  // },
  {
    image: '/images/activity/rope.jpg',
    title: 'Rope Activities',
    description: 'Test your balance and courage with our rope courses, zip lines, and high ropes challenges. Perfect for team building and personal growth.',
    duration: '2-3 hours',
    difficulty: 'Moderate'
  },
  {
    image: '/images/activity/rain-dance.jpg',
    title: 'Rain Dance',
    description: 'Enjoy the refreshing experience of our rain dance area. Perfect for cooling off on hot days and having fun with friends and family.',
    duration: '1-2 hours',
    difficulty: 'Easy'
  },
  {
    image: '/images/activity/boating.jpg',
    title: 'Fire Camp',
    description: 'Gather around our cozy fire pits for storytelling, marshmallow roasting, and evening entertainment under the stars.',
    duration: '2-3 hours',
    difficulty: 'Easy'
  },
  {
    image: '/images/activity/games.jpg',
    title: 'Lake Boating',
    description: 'Explore the serene lake with our rowboats, paddle boats, or guided boat tours. Enjoy the peaceful surroundings and wildlife spotting.',
    duration: '1-2 hours',
    difficulty: 'Easy'
  }
];

const indoorGamesData = [
  {
    image: '/images/indoor/chess.jpg',
    title: 'Chess',
    description: 'Challenge your mind with our chess sets. Perfect for strategic thinking and friendly competition.',
    duration: '30-60 minutes',
    difficulty: 'Varies'
  },
  {
    image: '/images/indoor/carrom.jpg',
    title: 'Carrom',
    description: 'Enjoy the classic board game of carrom with friends and family. Our tables are perfect for both beginners and experts.',
    duration: '30-60 minutes',
    difficulty: 'Easy to Moderate'
  },
  {
    image: '/images/indoor/table-tennis.jpg',
    title: 'Table Tennis',
    description: 'Test your reflexes and coordination with our table tennis facilities. Suitable for players of all skill levels.',
    duration: '30-60 minutes',
    difficulty: 'Easy to Moderate'
  },
  {
    image: '/images/indoor/board-games.jpg',
    title: 'Board Games',
    description: 'We offer a wide selection of board games for all ages. From strategy games to family favorites, there\'s something for everyone.',
    duration: '30-90 minutes',
    difficulty: 'Varies'
  }
];

const mealData = {
  breakfast: [
    { name: 'Continental Breakfast', time: '7:00 AM - 9:00 AM', description: 'Fresh bread, butter, jam, eggs, fruits, and beverages' },
    { name: 'Indian Breakfast', time: '7:00 AM - 9:00 AM', description: 'Idli, dosa, upma, paratha, and chutneys' }
  ],
  lunch: [
    { name: 'Buffet Lunch', time: '12:30 PM - 2:30 PM', description: 'Rice, dal, vegetables, bread, salad, and dessert' },
    { name: 'Thali Service', time: '12:30 PM - 2:30 PM', description: 'Complete meal with dal, vegetables, rice, bread, and dessert' }
  ],
  dinner: [
    { name: 'Buffet Dinner', time: '7:30 PM - 9:30 PM', description: 'Rice, dal, vegetables, bread, salad, and dessert' },
    { name: 'BBQ Dinner', time: '7:30 PM - 9:30 PM', description: 'Grilled vegetables, paneer, chicken, and accompaniments' }
  ]
};

const menuData = {
  starters: [
    {
      name: 'Vegetable Spring Rolls',
      type: 'veg',
      price: '₹250',
      image: '/images/menu/spring-rolls.jpg'
    },
    {
      name: 'Chicken Wings',
      type: 'non-veg',
      price: '₹350',
      image: '/images/menu/chicken-wings.jpg'
    },
    {
      name: 'Mushroom Bruschetta',
      type: 'veg',
      price: '₹280',
      image: '/images/menu/mushroom-bruschetta.jpg'
    },
    {
      name: 'Prawn Tempura',
      type: 'non-veg',
      price: '₹400',
      image: '/images/menu/prawn-tempura.jpg'
    }
  ],
  mainCourse: [
    {
      name: 'Vegetable Biryani',
      type: 'veg',
      price: '₹300',
      image: '/images/menu/veg-biryani.jpg'
    },
    {
      name: 'Butter Chicken',
      type: 'non-veg',
      price: '₹450',
      image: '/images/menu/butter-chicken.jpg'
    },
    {
      name: 'Paneer Tikka',
      type: 'veg',
      price: '₹350',
      image: '/images/menu/paneer-tikka.jpg'
    },
    {
      name: 'Fish Curry',
      type: 'non-veg',
      price: '₹400',
      image: '/images/menu/fish-curry.jpg'
    }
  ],
  desserts: [
    {
      name: 'Gulab Jamun',
      type: 'veg',
      price: '₹150',
      image: '/images/menu/gulab-jamun.jpg'
    },
    {
      name: 'Ice Cream Selection',
      type: 'veg',
      price: '₹200',
      image: '/images/menu/ice-cream.jpg'
    },
    {
      name: 'Chocolate Lava Cake',
      type: 'veg',
      price: '₹250',
      image: '/images/menu/chocolate-lava.jpg'
    }
  ]
};

const fallbackImage = 'https://via.placeholder.com/400x300?text=Activity+Image';

const ActivityCard = ({ activity }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105"
      whileHover={{ y: -10 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative h-56">
        {!imgError ? (
          <img
            src={activity.image}
            alt={activity.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-700 text-white text-lg font-semibold">
            Image Not Available
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 bg-primary text-white rounded-full text-sm">
            {activity.difficulty}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-black mb-2">{activity.title}</h3>
        <p className="text-black mb-4 line-clamp-2">{activity.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-black text-sm">
            <FaClock className="mr-2" />
            <span>{activity.duration}</span>
          </div>
          <button className="bg-primary text-white py-1.5 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium shadow-md w-28">
            Book Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const MenuCard = ({ title, items }) => (
  <motion.div
    className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-6 border border-white/20 hover:shadow-xl transition-all duration-300"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h3 className="text-2xl font-bold text-white mb-6">{title}</h3>
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center justify-between border-b border-white/20 pb-4 hover:bg-white/10 p-2 rounded-lg transition-colors">
          <div>
            <h4 className="text-lg font-semibold text-white">{item.name}</h4>
            {item.type && (
              <span className={`text-sm ${item.type === 'veg' ? 'text-green-400' : 'text-red-400'}`}>
                {item.type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

const MealCard = ({ title, meals }) => (
  <motion.div
    className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-6 border border-white/20 hover:shadow-xl transition-all duration-300"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h3 className="text-2xl font-bold text-white mb-6">{title}</h3>
    <div className="space-y-6">
      {meals.map((meal, index) => (
        <div key={index} className="border-b border-white/20 pb-4 hover:bg-white/10 p-2 rounded-lg transition-colors">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-lg font-semibold text-white">{meal.name}</h4>
            <span className="text-sm text-white/80">{meal.time}</span>
          </div>
          <p className="text-white/80">{meal.description}</p>
        </div>
      ))}
    </div>
  </motion.div>
);

const Activities = () => {
  const [activeTab, setActiveTab] = useState('outdoor');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="fixed top-0 left-0 right-0 z-50">
        <TopNavigation />
      </div>
      <div className="pt-20">
        <ImageHero
          imageSrc="/images/resort-bg.jpg"
        />
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-8 lg:py-12">
            <div className="max-w-7xl mx-auto">
              {/* Page Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  Activities & Dining
                </h1>
                <p className="text-xl text-white/90 max-w-2xl mx-auto">
                  Experience the best of adventure and cuisine at Forest View Resort
                </p>
              </motion.div>
              {/* Tabs */}
              <div className="flex justify-center space-x-4 mb-12">
                <motion.button
                  onClick={() => setActiveTab('outdoor')}
                  className={`px-8 py-3 rounded-full transition-all duration-300 ${activeTab === 'outdoor'
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaHiking className="inline-block mr-2" />
                  Outdoor Activities
                </motion.button>
                <motion.button
                  onClick={() => setActiveTab('indoor')}
                  className={`px-8 py-3 rounded-full transition-all duration-300 ${activeTab === 'indoor'
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaGamepad className="inline-block mr-2" />
                  Indoor Games
                </motion.button>
                <motion.button
                  onClick={() => setActiveTab('dining')}
                  className={`px-8 py-3 rounded-full transition-all duration-300 ${activeTab === 'dining'
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaUtensils className="inline-block mr-2" />
                  Dining
                </motion.button>
              </div>
              {/* Content */}
              <div className="py-8">
                {activeTab === 'outdoor' && (
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {outdoorActivitiesData.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.1,
                          type: "spring",
                          stiffness: 100,
                          damping: 15
                        }}
                        whileHover={{
                          y: -10,
                          transition: { duration: 0.2 }
                        }}
                      >
                        <ActivityCard activity={activity} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
                {activeTab === 'indoor' && (
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {indoorGamesData.map((game, index) => (
                      <ActivityCard key={index} activity={game} />
                    ))}
                  </motion.div>
                )}
                {activeTab === 'dining' && (
                  <motion.section
                    className="py-0 px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="text-center mb-16"
                    >
                      <h2 className="text-4xl font-bold mb-6 text-white">Our Menu</h2>
                      <p className="text-xl text-white/90 max-w-3xl mx-auto">
                        Explore our diverse selection of vegetarian and non-vegetarian dishes.
                      </p>
                    </motion.div>
                    <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-8 border border-white/20 transform hover:scale-[1.01] transition-transform duration-300">
                      <div className="space-y-8">
                        {Object.entries(menuData).map(([section, items], sectionIndex) => (
                          <motion.div
                            key={section}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
                          >
                            <h3 className="text-2xl font-bold mb-4 text-white capitalize">
                              {section.replace(/([A-Z])/g, ' $1').trim()}
                            </h3>
                            <div className="grid gap-4">
                              {items.map((item, index) => (
                                <div
                                  key={index}
                                  className="group flex justify-between items-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 cursor-pointer"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                      />
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className={`w-2 h-2 rounded-full ${item.type === 'veg' ? 'bg-green-400' : 'bg-red-400'}`} />
                                      <span className="font-medium text-white group-hover:text-primary transition-colors duration-300">{item.name}</span>
                                    </div>
                                  </div>
                                  <span className="text-white font-semibold group-hover:text-primary transition-colors duration-300">{item.price}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.section>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Activities; 