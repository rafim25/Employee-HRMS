import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultLayoutAdmin from '../../../layout/DefaultLayoutAdmin';
import { toast } from 'react-hot-toast';
import { FaUserPlus, FaSearch, FaBed, FaUser, FaCheck, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

const AddBooking = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState(null);

  // Available rooms state
  const [availableRooms, setAvailableRooms] = useState([]);

  // Search state
  const [searchData, setSearchData] = useState({
    checkIn: new Date(),
    checkOut: new Date(new Date().setDate(new Date().getDate() + 1)),
    adults: 1,
    children: 0
  });

  // Registration state
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    city: '',
    postal_code: ''
  });

  // Guest info state
  const [guestInfo, setGuestInfo] = useState({
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

  // Active section state
  const [activeSection, setActiveSection] = useState('registration');

  // Selected room state
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Visitor ID state
  const [visitorId, setVisitorId] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsRegistering(true);

    try {
      const registrationPayload = {
        ...registrationData,
        password: registrationData.name
      };

      const response = await axios.post('https://unnathiforestview.com/api/visitors/register', registrationPayload);

      if (response.data.msg === "Registration successful") {
        toast.success('Registration successful!');
        setVisitorId(response.data.visitor.visitor_id);
        setGuestInfo({
          ...guestInfo,
          fullName: registrationData.name,
          email: registrationData.email,
          phone: registrationData.phone
        });
        setActiveSection('search');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.msg || 'Registration failed');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

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
        setActiveSection('rooms');
      } else {
        setError('No rooms available for the selected dates and guest count.');
        toast.error('No rooms available for the selected dates and guest count.');
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError('Failed to fetch available rooms. Please try again.');
      toast.error('Failed to fetch available rooms. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
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
    setActiveSection('guest');
    toast.success('Room selected successfully!');
  };

  const handleBookingConfirm = async () => {
    if (!selectedRoom || !visitorId) {
      toast.error('Please complete all steps first');
      return;
    }

    setIsBooking(true);

    try {
      const bookingResponse = await axios.post('/api/bookings', {
        visitor_id: visitorId,
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
      toast.success('Booking confirmed successfully!');

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

    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.message || 'Failed to create booking');
    } finally {
      setIsBooking(false);
    }
  };

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

  return (
    <DefaultLayoutAdmin>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Add New Booking
          </h2>
          <button
            onClick={() => navigate('/admin/bookings/list')}
            className="inline-flex items-center justify-center rounded-md border border-stroke py-2 px-4 text-center font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
          >
            Back to List
          </button>
        </div>

        {bookingSuccess ? (
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden mb-8">
            <div className="bg-white p-6 text-center border-b border-gray-200">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                <FaCheck className="text-5xl text-black" />
              </div>
              <h2 className="text-3xl font-bold text-black mb-2">Booking Confirmed!</h2>
              <p className="text-black text-lg font-medium">The reservation has been successfully created</p>
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
                      <FaUser className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black">Guest Information</h3>
                      <p className="text-black">{bookingSuccess.guest_info.full_name}</p>
                      <p className="text-sm text-black">{bookingSuccess.guest_info.email}</p>
                      <p className="text-sm text-black">{bookingSuccess.guest_info.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
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
                    Add Another Booking
                  </button>
                  <button
                    onClick={() => navigate('/admin/bookings/list')}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    View All Bookings
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Registration Section */}
            <div className="mb-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white flex items-center gap-2">
                  <FaUserPlus className="text-xl" />
                  1. Register Guest
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Name *</label>
                    <input
                      type="text"
                      value={registrationData.name}
                      onChange={(e) => setRegistrationData({ ...registrationData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Email *</label>
                    <input
                      type="email"
                      value={registrationData.email}
                      onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Phone *</label>
                    <input
                      type="tel"
                      value={registrationData.phone}
                      onChange={(e) => setRegistrationData({ ...registrationData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Address</label>
                    <input
                      type="text"
                      value={registrationData.address}
                      onChange={(e) => setRegistrationData({ ...registrationData, address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  onClick={handleRegister}
                  disabled={isRegistering}
                  className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRegistering ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Registering...
                    </>
                  ) : (
                    'Register & Continue'
                  )}
                </button>
              </div>
            </div>

            {/* Search Section */}
            <div className="mb-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white flex items-center gap-2">
                  <FaSearch className="text-xl" />
                  2. Search Available Rooms
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Check In</label>
                    <input
                      type="date"
                      value={searchData.checkIn.toISOString().split('T')[0]}
                      onChange={(e) => setSearchData({ ...searchData, checkIn: new Date(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Check Out</label>
                    <input
                      type="date"
                      value={searchData.checkOut.toISOString().split('T')[0]}
                      onChange={(e) => setSearchData({ ...searchData, checkOut: new Date(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Adults</label>
                    <input
                      type="number"
                      value={searchData.adults}
                      onChange={(e) => setSearchData({ ...searchData, adults: parseInt(e.target.value) })}
                      min="1"
                      max="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Children</label>
                    <input
                      type="number"
                      value={searchData.children}
                      onChange={(e) => setSearchData({ ...searchData, children: parseInt(e.target.value) })}
                      min="0"
                      max="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-red-500 text-center py-4 bg-red-50 p-4 rounded-lg border border-red-200">
                    <p className="font-medium">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
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
            </div>

            {/* Room Selection Section */}
            {availableRooms.length > 0 && (
              <div className="mb-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white flex items-center gap-2">
                    <FaBed className="text-xl" />
                    3. Select Room ({searchData.adults + searchData.children} Guests)
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {availableRooms.map((room) => (
                      <div
                        key={room.room_id}
                        className={`border rounded-lg p-4 transition-all duration-300 ${selectedRoom?.room_id === room.room_id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-primary/50"
                          }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-xl font-bold text-black">{room.room_type}</h3>
                            <p className="text-sm text-black">{room.description}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-sm text-black">
                                Capacity: {room.capacity} guests
                              </span>
                              <span className="text-sm text-black">
                                Bed: {room.bed_type}
                              </span>
                              <span className="text-sm text-black">
                                Size: {room.room_size} sq. ft.
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">₹{room.price_per_night}</p>
                            <p className="text-sm text-black">Per Night</p>
                            {selectedRoom?.room_id === room.room_id ? (
                              <div className="bg-green-50 p-2 rounded-lg mt-2">
                                <p className="text-green-700 font-medium text-sm">Selected!</p>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleRoomSelect(room)}
                                className="mt-2 py-2 px-4 rounded-lg transition-colors bg-gray-100 text-black hover:bg-primary/10 border-2 border-primary"
                              >
                                Select Room
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Guest Information Section */}
            {selectedRoom && (
              <div className="mb-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white flex items-center gap-2">
                    <FaUser className="text-xl" />
                    4. Guest Information
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={guestInfo.fullName}
                        onChange={(e) => setGuestInfo({ ...guestInfo, fullName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Email *</label>
                      <input
                        type="email"
                        value={guestInfo.email}
                        onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Phone *</label>
                      <input
                        type="tel"
                        value={guestInfo.phone}
                        onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Gender *</label>
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
                      <label className="block text-sm font-medium text-black mb-1">Date of Birth *</label>
                      <input
                        type="date"
                        value={guestInfo.dateOfBirth}
                        onChange={(e) => setGuestInfo({ ...guestInfo, dateOfBirth: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Government ID Type *</label>
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
                      <label className="block text-sm font-medium text-black mb-1">Government ID Number *</label>
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
                        <p className="text-black">Scan the QR code to make payment.</p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleBookingConfirm}
                    className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!isGuestInfoValid() || isBooking}
                  >
                    {isBooking ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Creating Booking...
                      </>
                    ) : (
                      'Confirm Booking'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DefaultLayoutAdmin>
  );
};

export default AddBooking; 