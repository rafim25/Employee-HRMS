import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DefaultLayoutAdmin from '../../../layout/DefaultLayoutAdmin';

const RoomPricing = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [basePrice, setBasePrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [pricingHistory, setPricingHistory] = useState([]);

  useEffect(() => {
    fetchRooms();
    fetchPricingHistory();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('/api/admin/rooms/list');
      setRooms(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to fetch rooms');
      setLoading(false);
    }
  };

  const fetchPricingHistory = async () => {
    try {
      const response = await axios.get('/api/admin/rooms/pricing-history');
      setPricingHistory(response.data);
    } catch (error) {
      console.error('Error fetching pricing history:', error);
      toast.error('Failed to fetch pricing history');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoom || !startDate || !endDate || !basePrice) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await axios.post('/api/admin/rooms/pricing', {
        room_id: selectedRoom,
        start_date: startDate,
        end_date: endDate,
        base_price: basePrice,
        discount: discount || 0,
        coupon_code: couponCode || null
      });

      toast.success('Room price set successfully');
      fetchPricingHistory();
      // Reset form
      setSelectedRoom('');
      setStartDate(null);
      setEndDate(null);
      setBasePrice('');
      setDiscount('');
      setCouponCode('');
    } catch (error) {
      console.error('Error setting room price:', error);
      toast.error(error.response?.data?.message || 'Failed to set room price');
    }
  };

  if (loading) {
    return (
      <DefaultLayoutAdmin>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DefaultLayoutAdmin>
    );
  }

  return (
    <DefaultLayoutAdmin>
      <div className="mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-black">Room Pricing Management</h1>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Pricing Form */}
          <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h2 className="text-xl font-semibold mb-4">Set Room Price</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Select Room
                </label>
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="w-full rounded border border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
                >
                  <option value="">Select a room</option>
                  {rooms.map((room) => (
                    <option key={room.room_id} value={room.room_id}>
                      {room.room_number} - {room.room_type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Start Date
                  </label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    className="w-full rounded border border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    End Date
                  </label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    className="w-full rounded border border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Base Price
                  </label>
                  <input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className="w-full rounded border border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full rounded border border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full rounded border border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90"
                >
                  Set Price
                </button>
              </div>
            </form>
          </div>

          {/* Pricing History */}
          <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h2 className="text-xl font-semibold mb-4">Pricing History</h2>
            <div className="max-w-full overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark:bg-meta-4">
                    <th className="py-4 px-4 font-medium text-black dark:text-white">Room</th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">Date Range</th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">Base Price</th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">Discount</th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">Final Price</th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingHistory.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        <p className="text-gray-500">No pricing history available</p>
                      </td>
                    </tr>
                  ) : (
                    pricingHistory.map((price) => (
                      <tr key={price.pricing_id}>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          {price.room?.room_number} - {price.room?.room_type}
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          {new Date(price.start_date).toLocaleDateString()} - {new Date(price.end_date).toLocaleDateString()}
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          ₹{price.base_price}
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          {price.discount}%
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          ₹{price.final_price}
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <span className={`px-2 inline-flex text-md leading-5 rounded-full ${price.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {price.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayoutAdmin>
  );
};

export default RoomPricing; 