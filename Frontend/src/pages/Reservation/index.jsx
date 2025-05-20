import React, { useState, useEffect } from 'react';
import { FaCalendar, FaUser, FaChild, FaTimes, FaCamera, FaList, FaWifi, FaSwimmingPool, FaSearch, FaBed, FaCreditCard, FaExclamationTriangle, FaChevronDown, FaChevronUp, FaMinus, FaPlus, FaSpinner, FaUsers, FaRuler, FaCheck, FaMobile, FaLock, FaStar, FaUserPlus } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { motion, AnimatePresence } from 'framer-motion';
import RoomCard from '../../components/RoomCard';
import ImageHero from '../../components/Booking/ImageHero';
import axios from 'axios';
import toast from "react-hot-toast";
import confetti from 'canvas-confetti';
import TopNavigation from '../../components/molecules/TopNavigation/index';
import { useAuth } from '../../context/AuthContext';
import { SET_USER } from '../../context/types';

const AccordionSection = ({ title, isOpen, onToggle, children, icon, disabled }) => {
  return (
    <div className={`mb-4 overflow-hidden rounded-lg border border-gray-200 ${disabled ? 'opacity-60 pointer-events-none' : ''}`}>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-4 ${isOpen ? 'bg-primary text-white' : 'bg-white text-black'
          } transition-colors duration-200 ${disabled ? 'cursor-not-allowed' : ''}`}
        disabled={disabled}
        type="button"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-lg font-semibold">{title}</span>
        </div>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Reservation = () => {
  const { state, dispatch } = useAuth();
  const { user, isAuthenticated, } = state;
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState(null);

  // Available rooms state
  const [availableRooms, setAvailableRooms] = useState([
    {
      room_id: "D101",
      room_type: "Dormitory",
      description: "Spacious dormitory with bunk beds, perfect for groups",
      floor: 1,
      capacity: 8,
      price_per_night: 200.00,
      amenities: ["Free Wi-Fi", "Air Conditioning", "Shared Bathroom", "Lockers", "Reading Lights"],
      bed_type: "Bunk Beds",
      room_size: 400,
      images: ["/images/rooms/dormitory.jpg"],
      is_featured: true
    },
    {
      room_id: "F201",
      room_type: "Family Room",
      description: "Comfortable family room with separate living area",
      floor: 2,
      capacity: 6,
      price_per_night: 300.00,
      amenities: ["Free Wi-Fi", "Air Conditioning", "Private Bathroom", "Kitchen", "TV", "Sofa"],
      bed_type: "Queen Bed + 2 Single Beds",
      room_size: 600,
      images: ["/images/rooms/family.jpg"],
      is_featured: true
    },
    {
      room_id: "S301",
      room_type: "Suite Room",
      description: "Luxurious suite with separate bedroom and living area",
      floor: 3,
      capacity: 4,
      price_per_night: 400.00,
      amenities: ["Free Wi-Fi", "Air Conditioning", "Private Bathroom", "Mini Bar", "TV", "Balcony"],
      bed_type: "King Bed",
      room_size: 800,
      images: ["/images/rooms/suite.jpg"],
      is_featured: true
    },
    {
      room_id: "T101",
      room_type: "Tent House",
      description: "Unique tent house experience with modern amenities",
      floor: 1,
      capacity: 4,
      price_per_night: 250.00,
      amenities: ["Free Wi-Fi", "Air Conditioning", "Private Bathroom", "Camping Chairs", "BBQ Area"],
      bed_type: "2 Single Beds",
      room_size: 300,
      images: ["/images/rooms/tent.jpg"],
      is_featured: true
    }
  ]);

  // Search state
  const [searchData, setSearchData] = useState({
    checkIn: new Date(),
    checkOut: new Date(new Date().setDate(new Date().getDate() + 1)),
    adults: 1,
    children: 0,
    childrenAges: []
  });

  // Registration state
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    country: '',
    city: '',
    postal_code: ''
  });

  // Guest info state
  const [guestInfo, setGuestInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    gender: '',
    govtIdType: '',
    govtIdNumber: '',
    dateOfBirth: '',
    specialRequests: '',
    paymentOption: 'qr',
    selectedRoom: null
  });

  // Active section state - Skip registration if user is authenticated
  const [activeSection, setActiveSection] = useState(isAuthenticated ? 'search' : 'registration');

  // Selected room state
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showAllRooms, setShowAllRooms] = useState(true);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Room details state
  const [roomDetails, setRoomDetails] = useState({
    amenities: [],
    policies: [],
    cancellationPolicy: '',
    checkInTime: '2:00 PM',
    checkOutTime: '11:00 AM',
    maxOccupancy: 4,
    roomSize: '',
    bedType: '',
    viewType: ''
  });

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Lock room state
  const [lockTimer, setLockTimer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(180); // 180 seconds
  const [isRoomLocked, setIsRoomLocked] = useState(false);
  const [lockError, setLockError] = useState(null);

  // Add this state for payment
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);

  // Validation state
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const [isFormValid, setIsFormValid] = useState(false);

  // Add useEffect to validate form on every change
  useEffect(() => {
    const validateForm = () => {
      const errors = {};
      let isValid = true;

      if (!registrationData.name.trim()) {
        errors.name = 'Name is required';
        isValid = false;
      }

      if (!registrationData.email.trim()) {
        errors.email = 'Email is required';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registrationData.email)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
      }

      if (!registrationData.password) {
        errors.password = 'Password is required';
        isValid = false;
      } else if (registrationData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
        isValid = false;
      }

      if (!registrationData.phone.trim()) {
        errors.phone = 'Phone number is required';
        isValid = false;
      } else if (!/^\d{10}$/.test(registrationData.phone)) {
        errors.phone = 'Please enter a valid 10-digit phone number';
        isValid = false;
      }

      setValidationErrors(errors);
      setIsFormValid(isValid && Object.keys(errors).length === 0);
    };

    validateForm();
  }, [registrationData]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error('Please fix the validation errors before submitting');
      return;
    }

    if (isAuthenticated) {
      toast.error('You are already logged in');
      return;
    }

    setIsRegistering(true);
    const loadingToast = toast.loading('Registering...');

    try {
      const response = await axios.post('/api/visitors/register', registrationData);

      if (response.data.msg === "Registration successful") {
        toast.success('Registration successful!', {
          id: loadingToast,
          style: {
            background: '#4CAF50',
            color: '#ffffff',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '16px',
          }
        });

        // Store authentication data in context
        dispatch({
          type: SET_USER,
          payload: {
            visitor_id: response.data.visitor.visitor_id,
            name: registrationData.name,
            email: registrationData.email,
            role: 'visitor'
          }
        });

        // Store in localStorage
        localStorage.setItem('auth', JSON.stringify({
          visitor_id: response.data.visitor.visitor_id,
          name: registrationData.name,
          email: registrationData.email,
          role: 'visitor',
          isAuthenticated: true
        }));

        // Update guest information
        setGuestInfo({
          ...guestInfo,
          fullName: registrationData.name,
          email: registrationData.email,
          phone: registrationData.phone
        });

        // Clear registration form
        setRegistrationData({
          name: '',
          email: '',
          password: '',
          phone: ''
        });

        // Move to next section
        setActiveSection('search');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.msg || 'Registration failed';
      toast.error(errorMessage, {
        id: loadingToast,
        style: {
          background: '#ff0000',
          color: '#ffffff',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '16px',
        }
      });

      // If email is already registered, show error under email field
      if (errorMessage.includes('Email already registered')) {
        setValidationErrors(prev => ({
          ...prev,
          email: 'This email is already registered'
        }));
      }
    } finally {
      setIsRegistering(false);
    }
  };

  // Add useEffect to check authentication status
  useEffect(() => {
    if (isAuthenticated) {
      setActiveSection('search');
    }
  }, [isAuthenticated]);

  // Search available rooms with improved error handling
  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate dates
    if (searchData.checkIn >= searchData.checkOut) {
      const errorMsg = 'Check-out date must be after check-in date';
      setError(errorMsg);
      toast.error(errorMsg);
      setIsLoading(false);
      return;
    }

    try {
      const checkInDate = searchData.checkIn.toISOString();
      const checkOutDate = searchData.checkOut.toISOString();
      const totalGuests = searchData.adults + searchData.children;

      const response = await axios.get(`/api/rooms/available`, {
        params: {
          check_in_date: checkInDate,
          check_out_date: checkOutDate,
          guests: totalGuests
        }
      });

      if (response.data && response.data.length > 0) {
        setAvailableRooms(response.data);
        setSelectedRoom(null);
        setShowAllRooms(true);
        setActiveSection('rooms');
      } else {
        const errorMsg = 'No rooms available for the selected dates and guest count.';
        setError(errorMsg);
        toast.error(errorMsg, {
          position: "top-center",
          duration: 4000,
          style: {
            background: '#CA8E46',
            color: '#fff',
          }
        });
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
      const errorMessage = err.response?.data?.message || 'Failed to fetch available rooms. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle room selection with detailed information
  const handleRoomSelect = async (room) => {
    setSelectedRoom(room);
    setShowAllRooms(false);

    try {
      // Fetch detailed room information
      const response = await axios.get(`/api/rooms/${room.room_id}/details`);
      setRoomDetails(response.data);

      // Update guest info with selected room
      setGuestInfo(prevInfo => ({
        ...prevInfo,
        selectedRoom: {
          room_id: room.room_id,
          room_type: room.room_type,
          price_per_night: room.price_per_night,
          check_in_date: searchData.checkIn.toISOString(),
          check_out_date: searchData.checkOut.toISOString(),
          number_of_guests: searchData.adults + searchData.children
        }
      }));

      // Automatically move to guest information section after room selection
      setActiveSection('guest');

      toast.success('Room selected successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch room details';
      toast.error(errorMessage);
    }
  };

  // Handle booking confirmation
  const handleBookingConfirm = async () => {
    if (!selectedRoom) {
      toast.error('Please select a room first');
      return;
    }

    if (!user?.visitor_id) {
      toast.error('Please register or login first');
      return;
    }

    setIsBooking(true);
    setBookingError(null);

    try {
      // First, verify if visitor exists
      const visitorResponse = await axios.get(`/api/visitors/${user.visitor_id}`);

      if (!visitorResponse.data) {
        throw new Error('Visitor not found. Please register first.');
      }

      const visitorData = visitorResponse.data;
      console.log('Visitor data:', visitorData);

      const bookingResponse = await axios.post('/api/bookings', {
        visitor_id: visitorData.visitor_id,
        room_id: selectedRoom.room_id,
        check_in_date: searchData.checkIn.toISOString(),
        check_out_date: searchData.checkOut.toISOString(),
        number_of_guests: searchData.adults + searchData.children,
        guest_info: {
          full_name: guestInfo.fullName,
          email: guestInfo.email,
          phone: guestInfo.phone,
          gender: guestInfo.gender,
          date_of_birth: guestInfo.dateOfBirth,
          govt_id_type: guestInfo.govtIdType,
          govt_id_number: guestInfo.govtIdNumber,
          special_requests: guestInfo.specialRequests
        },
        payment_method: guestInfo.paymentOption,
        payment_status: guestInfo.paymentOption === 'qr' ? 'pending' : 'pending_checkin',
        total_amount: selectedRoom.price_per_night
      });

      const data = bookingResponse.data;

      // Show success message
      toast.success('Booking confirmed successfully!');

      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Set booking success data
      setBookingSuccess({
        booking_id: data.booking_id,
        room: {
          room_id: selectedRoom.room_id,
          room_type: selectedRoom.room_type,
          price_per_night: selectedRoom.price_per_night
        },
        check_in: searchData.checkIn,
        check_out: searchData.checkOut,
        guests: searchData.adults + searchData.children,
        guest_info: {
          full_name: guestInfo.fullName,
          email: guestInfo.email,
          phone: guestInfo.phone
        },
        payment_method: guestInfo.paymentOption,
        total_amount: selectedRoom.price_per_night
      });

      // If payment is at check-in, show instructions
      if (guestInfo.paymentOption === 'checkin') {
        toast.success('Please pay at the hotel during check-in.');
      }

      // Reset form
      setSelectedRoom(null);
      setGuestInfo({
        fullName: '',
        email: '',
        phone: '',
        gender: '',
        govtIdType: '',
        govtIdNumber: '',
        dateOfBirth: '',
        specialRequests: '',
        paymentOption: 'qr',
        selectedRoom: null
      });

      // Move back to search section
      setActiveSection('search');

    } catch (error) {
      console.error('Booking error:', error);
      setBookingError(error.message);
      toast.error(error.message);
    } finally {
      setIsBooking(false);
    }
  };

  // Handle section click
  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  // Lock room for payment
  const lockRoom = async () => {
    if (!selectedRoom) return;

    setIsProcessingPayment(true);
    setLockError(null);
    setTimeRemaining(180);
    setIsRoomLocked(true);

    try {
      // Lock the room for 180 seconds
      const lockResponse = await fetch('http://localhost:3002/api/rooms/lock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          room_id: selectedRoom.room_id,
          lock_duration: 180, // 180 seconds
          visitor_id: localStorage.getItem('visitorId')
        })
      });

      const lockData = await lockResponse.json();

      if (!lockResponse.ok) {
        throw new Error(lockData.msg || 'Failed to lock room');
      }

      // Start the countdown timer
      const timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsRoomLocked(false);
            setLockTimer(null);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      setLockTimer(timer);

      // Initiate payment
      const paymentResponse = await fetch('http://localhost:3002/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          room_id: selectedRoom.room_id,
          visitor_id: localStorage.getItem('visitorId'),
          amount: selectedRoom.price_per_night,
          gateway: 'paytm'
        })
      });

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(paymentData.msg || 'Failed to initiate payment');
      }

      // Redirect to payment gateway
      window.location.href = paymentData.redirect_url;

    } catch (error) {
      console.error('Room lock error:', error);
      setLockError(error.message);
      setIsRoomLocked(false);
      if (lockTimer) {
        clearInterval(lockTimer);
        setLockTimer(null);
      }
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Clean up timer on component unmount
  useEffect(() => {
    return () => {
      if (lockTimer) {
        clearInterval(lockTimer);
      }
    };
  }, [lockTimer]);

  // Format time remaining
  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form submission
    // Remove the API call to lockRoom
    // if (selectedRoom) {
    //   lockRoom();
    // }
  };

  // Add this function to handle payment QR code fetching
  const handlePaymentQR = async (bookingId) => {
    try {
      setIsLoadingPayment(true);
      const response = await fetch(`http://localhost:3002/api/payments/qr/${bookingId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setPaymentDetails(data);
      } else {
        console.error('Failed to get payment QR:', data.msg);
      }
    } catch (error) {
      console.error('Error fetching payment QR:', error);
    } finally {
      setIsLoadingPayment(false);
    }
  };

  // Add handleGuestChange function
  const handleGuestChange = (type, action) => {
    setSearchData(prevData => {
      const newData = { ...prevData };
      if (type === 'adults') {
        if (action === 'add') {
          newData.adults = Math.min(prevData.adults + 1, 10);
        } else {
          newData.adults = Math.max(prevData.adults - 1, 1);
        }
      } else if (type === 'children') {
        if (action === 'add') {
          newData.children = Math.min(prevData.children + 1, 10);
          // Add a new age entry for the new child
          newData.childrenAges = [...prevData.childrenAges, 0];
        } else {
          newData.children = Math.max(prevData.children - 1, 0);
          // Remove the last age entry
          newData.childrenAges = prevData.childrenAges.slice(0, -1);
        }
      }
      return newData;
    });
  };

  // Validation for guest info fields
  const isGuestInfoValid = () => {
    return (
      guestInfo.fullName.trim() &&
      guestInfo.email.trim() &&
      guestInfo.phone.trim() &&
      guestInfo.gender &&
      guestInfo.dateOfBirth &&
      guestInfo.govtIdType &&
      guestInfo.govtIdNumber.trim()
    );
  };

  console.log('isAuthenticated', isAuthenticated, user);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Top Navigation with Welcome Message */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <TopNavigation />
        {/* {isAuthenticated && (
          <div className="bg-primary/10 text-white py-2 px-4 text-center">
            Welcome back, {user.name}!
            <button
              onClick={() => setActiveSection('search')}
              className="ml-2 text-primary hover:text-primary/80 underline"
            >
              Start New Booking
            </button>
          </div>
        )} */}
      </div>
      <ImageHero
        imageSrc="/images/resort-bg.jpg"
        title="Unnathi Forest View"
        subtitle="Experience luxury and tranquility in the heart of nature"
      />

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="max-w-7xl mx-auto">
            {/* Page Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12 mt-16"
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Book Your Stay
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Experience luxury and comfort in the heart of nature
              </p>
            </motion.div>

            {/* Booking Success View */}
            {bookingSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden mb-8"
              >
                <div className="bg-white p-6 text-center border-b border-gray-200">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                    <FaCheck className="text-5xl text-black" />
                  </div>
                  <h2 className="text-3xl font-bold text-black mb-2">Booking Confirmed!</h2>
                  <p className="text-black text-lg font-medium">Your reservation has been successfully confirmed</p>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                          <FaBed className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-black">Room Details</h3>
                          <p className="text-black">{bookingSuccess.room.room_type}</p>
                          <p className="text-sm text-black">Room ID: {bookingSuccess.room.room_id}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                          <FaCalendar className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-black">Check-in & Check-out</h3>
                          <p className="text-black">
                            {new Date(bookingSuccess.check_in).toLocaleDateString()} - {new Date(bookingSuccess.check_out).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-black">
                            {Math.ceil((new Date(bookingSuccess.check_out) - new Date(bookingSuccess.check_in)) / (1000 * 60 * 60 * 24))} nights
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                          <FaUsers className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-black">Guests</h3>
                          <p className="text-black">{bookingSuccess.guests} guests</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                          <FaUser className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-black">Guest Information</h3>
                          <p className="text-black">{bookingSuccess.guest_info.full_name}</p>
                          <p className="text-sm text-black">{bookingSuccess.guest_info.email}</p>
                          <p className="text-sm text-black">{bookingSuccess.guest_info.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                          <FaCreditCard className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-black">Payment</h3>
                          <p className="text-black">
                            {bookingSuccess.payment_method === 'qr' ? 'Pay Now (QR Code)' : 'Pay at Check-in'}
                          </p>
                          <p className="text-lg font-bold text-primary">₹{bookingSuccess.total_amount}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                          <FaCheck className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-black">Booking ID</h3>
                          <p className="text-black font-medium">{bookingSuccess.booking_id}</p>
                          <p className="text-sm text-black">Please keep this ID for your reference</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={() => setBookingSuccess(null)}
                        className="px-6 py-3 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Book Another Room
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Print Booking Details
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                {/* Registration Section */}
                <AccordionSection
                  title="1. Register"
                  isOpen={activeSection === 'register' && !isAuthenticated}
                  onToggle={() => !isAuthenticated && handleSectionClick('register')}
                  icon={<FaUserPlus className="text-xl" />}
                >
                  <div className="p-6 space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Name</label>
                        <input
                          type="text"
                          value={registrationData.name}
                          onChange={(e) => setRegistrationData({ ...registrationData, name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                          required
                          disabled={isAuthenticated}
                        />
                        {validationErrors.name && (
                          <p className="text-red-600 text-sm mt-1 font-medium">{validationErrors.name}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Email</label>
                        <input
                          type="email"
                          value={registrationData.email}
                          onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                          required
                          disabled={isAuthenticated}
                        />
                        {validationErrors.email && (
                          <p className="text-red-600 text-sm mt-1 font-medium">{validationErrors.email}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Password</label>
                        <input
                          type="password"
                          value={registrationData.password}
                          onChange={(e) => setRegistrationData({ ...registrationData, password: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                          required
                          disabled={isAuthenticated}
                        />
                        {validationErrors.password && (
                          <p className="text-red-600 text-sm mt-1 font-medium">{validationErrors.password}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Phone</label>
                        <input
                          type="tel"
                          value={registrationData.phone}
                          onChange={(e) => setRegistrationData({ ...registrationData, phone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                          required
                          disabled={isAuthenticated}
                        />
                        {validationErrors.phone && (
                          <p className="text-red-600 text-sm mt-1 font-medium">{validationErrors.phone}</p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleRegister}
                      disabled={isRegistering || isAuthenticated || !isFormValid}
                      className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isRegistering ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Registering...
                        </>
                      ) : isAuthenticated ? (
                        'Already Registered'
                      ) : !isFormValid ? (
                        'Please fill all fields correctly'
                      ) : (
                        'Register & Continue'
                      )}
                    </button>
                  </div>
                </AccordionSection>

                {/* Search Section */}
                <AccordionSection
                  title="2. Search"
                  isOpen={activeSection === 'search'}
                  onToggle={() => handleSectionClick('search')}
                  icon={<FaSearch className="text-xl" />}
                >
                  <div className="p-6 space-y-6">
                    {/* Date Selection */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Check In</label>
                        <div className="relative">
                          <DatePicker
                            selected={searchData.checkIn}
                            onChange={date => setSearchData({ ...searchData, checkIn: date })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-black"
                            minDate={new Date()}
                            dateFormat="MMM d, yyyy"
                          />
                          <FaCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-black" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Check Out</label>
                        <div className="relative">
                          <DatePicker
                            selected={searchData.checkOut}
                            onChange={date => setSearchData({ ...searchData, checkOut: date })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-black"
                            minDate={searchData.checkIn}
                            dateFormat="MMM d, yyyy"
                          />
                          <FaCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-black" />
                        </div>
                      </div>
                    </div>

                    {/* Guest Selection */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-black">Adults</h3>
                          <p className="text-sm text-black">Ages 13 or above</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => { e.preventDefault(); handleGuestChange('adults', 'subtract'); }}
                            className={`p-2 rounded-full ${searchData.adults <= 1
                              ? 'bg-gray-100 text-black cursor-not-allowed'
                              : 'bg-gray-200 text-black hover:bg-gray-300'
                              }`}
                            disabled={searchData.adults <= 1}
                          >
                            <FaMinus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{searchData.adults}</span>
                          <button
                            onClick={(e) => { e.preventDefault(); handleGuestChange('adults', 'add'); }}
                            className="p-2 rounded-full bg-gray-200 text-black hover:bg-gray-300"
                          >
                            <FaPlus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-black">Children</h3>
                          <p className="text-sm text-black">Ages 0-12</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => { e.preventDefault(); handleGuestChange('children', 'subtract'); }}
                            className={`p-2 rounded-full ${searchData.children <= 0
                              ? 'bg-gray-100 text-black cursor-not-allowed'
                              : 'bg-gray-200 text-black hover:bg-gray-300'
                              }`}
                            disabled={searchData.children <= 0}
                          >
                            <FaMinus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{searchData.children}</span>
                          <button
                            onClick={(e) => { e.preventDefault(); handleGuestChange('children', 'add'); }}
                            className="p-2 rounded-full bg-gray-200 text-black hover:bg-gray-300"
                          >
                            <FaPlus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {error && (
                      <div className="text-[#CA8E46] text-center py-4 bg-red-50 p-4 rounded-lg border border-red-200">
                        <FaExclamationTriangle className="mx-auto mb-2 text-2xl" />
                        <p className="font-medium">{error}</p>
                        <p className="text-sm mt-1">Please try different dates or guest count.</p>
                      </div>
                    )}

                    <button
                      onClick={handleSearch}
                      disabled={isSearching}
                      className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                      {isSearching ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <FaSearch />
                          Search Available Rooms
                        </>
                      )}
                    </button>
                  </div>
                </AccordionSection>

                {/* Room Selection Section */}
                <AccordionSection
                  title={`3. Select Room (${searchData.adults + searchData.children} Guests)`}
                  isOpen={activeSection === 'rooms'}
                  onToggle={() => handleSectionClick('rooms')}
                  icon={<FaBed className="text-xl" />}
                >
                  <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-black">Select Room ({searchData.adults + searchData.children} Guests)</h2>
                      {selectedRoom && (
                        <button
                          onClick={() => setShowAllRooms(true)}
                          className="text-primary hover:text-primary/80 flex items-center gap-2"
                        >
                          <FaList className="text-lg" />
                          Show All Rooms
                        </button>
                      )}
                    </div>

                    {isLoading ? (
                      <div className="flex justify-center items-center py-8">
                        <FaSpinner className="animate-spin text-4xl text-primary" />
                      </div>
                    ) : error ? (
                      <div className="text-red-500 text-center py-4 bg-red-50 p-4 rounded-lg border border-red-200">
                        <FaExclamationTriangle className="mx-auto mb-2 text-2xl" />
                        <p className="font-medium">{error}</p>
                        <p className="text-sm mt-1">Please try different dates or guest count.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {availableRooms
                          .filter(room => showAllRooms || room.room_id === selectedRoom?.room_id)
                          .map((room) => (
                            <div
                              key={room.room_id}
                              className={`border rounded-lg p-4 transition-all duration-300 ${selectedRoom?.room_id === room.room_id
                                ? "border-primary bg-primary/5"
                                : "border-gray-200 hover:border-primary/50"
                                }`}
                            >
                              <div className="flex flex-col md:flex-row gap-6">
                                <div className="md:w-1/3">
                                  <img
                                    src={room.images?.[0] || "/images/rooms/default.jpg"}
                                    alt={room.room_type}
                                    className="w-full h-48 object-cover rounded-lg"
                                  />
                                </div>
                                <div className="md:w-2/3">
                                  <div className="flex justify-between items-start mb-4">
                                    <div>
                                      <h3 className="text-xl font-bold text-black">{room.room_type}</h3>
                                      <p className="text-sm text-black">{room.description}</p>
                                      <div className="flex items-center gap-4 mt-2">
                                        <span className="text-sm text-black">
                                          <FaUsers className="inline mr-1" /> {room.capacity} guests
                                        </span>
                                        <span className="text-sm text-black">
                                          <FaBed className="inline mr-1" /> {room.bed_type}
                                        </span>
                                        <span className="text-sm text-black">
                                          <FaRuler className="inline mr-1" /> {room.room_size} sq. ft.
                                        </span>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-2xl font-bold text-primary">₹{room.current_price}</p>
                                      <p className="text-sm text-black">Per Night</p>
                                    </div>
                                  </div>

                                  <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-black mb-2">Amenities:</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {room.amenities?.map((amenity, index) => (
                                        <span
                                          key={index}
                                          className="px-3 py-1 bg-gray-100 text-black rounded-full text-sm"
                                        >
                                          {amenity}
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  {selectedRoom?.room_id === room.room_id ? (
                                    <div className="space-y-4">
                                      <div className="bg-green-50 p-4 rounded-lg">
                                        <p className="text-green-700 font-medium">Room Selected!</p>
                                      </div>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => handleRoomSelect(room)}
                                      className="w-full py-2 px-4 rounded-lg transition-colors bg-gray-100 text-black hover:bg-primary/10 border-2 border-primary"
                                    >
                                      Select Room
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}

                    {/* Add Room Details Modal */}
                    {selectedRoom && (
                      <div className="mt-6 bg-white rounded-lg p-6 shadow-lg">
                        <h3 className="text-xl font-bold mb-4">Room Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-2">Amenities</h4>
                            <ul className="space-y-2">
                              {roomDetails.amenities.map((amenity, index) => (
                                <li key={index} className="flex items-center">
                                  <FaCheck className="text-green-500 mr-2" />
                                  {amenity}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Policies</h4>
                            <ul className="space-y-2">
                              <li>Check-in: {roomDetails.checkInTime}</li>
                              <li>Check-out: {roomDetails.checkOutTime}</li>
                              <li>Max Occupancy: {roomDetails.maxOccupancy} guests</li>
                              <li>Room Size: {roomDetails.roomSize}</li>
                              <li>Bed Type: {roomDetails.bedType}</li>
                              <li>View: {roomDetails.viewType}</li>
                            </ul>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">Cancellation Policy</h4>
                          <p className="text-black">{roomDetails.cancellationPolicy}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionSection>

                {/* Guest Information Section */}
                <AccordionSection
                  title="4. Guest Information"
                  isOpen={activeSection === 'guest'}
                  onToggle={() => {
                    if (selectedRoom) handleSectionClick('guest');
                  }}
                  icon={<FaUser className="text-xl" />}
                  disabled={!selectedRoom}
                >
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Full Name</label>
                        <input
                          type="text"
                          value={guestInfo.fullName}
                          onChange={(e) => setGuestInfo({ ...guestInfo, fullName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Email</label>
                        <input
                          type="email"
                          value={guestInfo.email}
                          onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Phone</label>
                        <input
                          type="tel"
                          value={guestInfo.phone}
                          onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Gender</label>
                        <select
                          value={guestInfo.gender}
                          onChange={(e) => setGuestInfo({ ...guestInfo, gender: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Date of Birth</label>
                        <input
                          type="date"
                          value={guestInfo.dateOfBirth}
                          onChange={(e) => setGuestInfo({ ...guestInfo, dateOfBirth: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Government ID Type</label>
                        <select
                          value={guestInfo.govtIdType}
                          onChange={(e) => setGuestInfo({ ...guestInfo, govtIdType: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                          required
                        >
                          <option value="">Select ID Type</option>
                          <option value="passport">Passport</option>
                          <option value="driving_license">Driving License</option>
                          <option value="national_id">National ID</option>
                          <option value="aadhar">Aadhar Card</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Government ID Number</label>
                        <input
                          type="text"
                          value={guestInfo.govtIdNumber}
                          onChange={(e) => setGuestInfo({ ...guestInfo, govtIdNumber: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Special Requests</label>
                      <textarea
                        value={guestInfo.specialRequests}
                        onChange={(e) => setGuestInfo({ ...guestInfo, specialRequests: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                        rows="3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Payment Option</label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="qr"
                            name="paymentOption"
                            value="qr"
                            checked={guestInfo.paymentOption === 'qr'}
                            onChange={(e) => setGuestInfo({ ...guestInfo, paymentOption: e.target.value })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor="qr" className="ml-2 block text-sm text-black">
                            Pay Now (QR Code)
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="checkin"
                            name="paymentOption"
                            value="checkin"
                            checked={guestInfo.paymentOption === 'checkin'}
                            onChange={(e) => setGuestInfo({ ...guestInfo, paymentOption: e.target.value })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor="checkin" className="ml-2 block text-sm text-black">
                            Pay at Check-in
                          </label>
                        </div>
                      </div>
                    </div>

                    {guestInfo.paymentOption === 'qr' && selectedRoom && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-center">
                          <img
                            src="/QR/QR.jpeg"
                            alt="Payment QR Code"
                            className="w-64 h-64 object-contain"
                          />
                        </div>
                        <div className="text-center space-y-2 mt-4">
                          <p className="text-lg font-medium">Amount to Pay: ₹{selectedRoom?.price_per_night || 0}</p>
                          <p className="text-black">Scan the QR code to make payment. After payment, please contact the hotel to confirm your booking.</p>
                          <p className="text-black">Contact: +91-1234567890</p>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleBookingConfirm}
                      className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!isGuestInfoValid() || isBooking}
                    >
                      Confirm Booking
                    </button>
                  </div>
                </AccordionSection>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation; 