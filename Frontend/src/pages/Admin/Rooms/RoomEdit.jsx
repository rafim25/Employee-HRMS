import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import DefaultLayoutAdmin from '../../../layout/DefaultLayoutAdmin';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const RoomEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roomTypes, setRoomTypes] = useState([
    {
      room_type_id: '1',
      name: 'Family Room'
    },
    {
      room_type_id: '2',
      name: 'Dormitory'
    },
    {
      room_type_id: '3',
      name: 'Tent House'
    },
    {
      room_type_id: '5',
      name: 'Suite Room'
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    room_id: '',
    room_number: '',
    room_type: '',
    description: '',
    floor: '',
    capacity: '',
    price_per_night: '',
    discount_percentage: '',
    amenities: '',
    view_type: '',
    bed_type: '',
    room_size: '',
    is_featured: false,
    status: 'available'
  });

  useEffect(() => {
    // fetchRoomTypes();
    fetchRoomDetails();
  }, [id]);

  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get('/admin/rooms/types');
      if (response.data && Array.isArray(response.data)) {
        setRoomTypes(response.data);
      } else {
        console.error('Invalid room types response:', response.data);
        toast.error('Invalid room types data received');
      }
    } catch (error) {
      console.error('Error fetching room types:', error);
      toast.error('Failed to fetch room types');
    }
  };

  const fetchRoomDetails = async () => {
    try {
      const response = await axios.get(`/api/rooms/${id}`);
      const room = response.data;
      console.log('Fetched room data:', room);

      setFormData({
        room_id: room.room_id || '',
        room_number: room.room_number || '',
        room_type: room.room_type || '',
        description: room.description || '',
        floor: room.floor || 1,
        capacity: room.capacity || 1,
        price_per_night: room.price_per_night || '0.00',
        discount_percentage: room.discount_percentage || '0.00',
        amenities: Array.isArray(room.amenities) ? room.amenities.join(', ') : '',
        view_type: room.view_type || '',
        bed_type: room.bed_type || '',
        room_size: room.room_size || 0,
        is_featured: room.is_featured || false,
        status: room.status || 'available'
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching room details:', error);
      toast.error('Failed to fetch room details');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        floor: parseInt(formData.floor),
        capacity: parseInt(formData.capacity),
        price_per_night: parseFloat(formData.price_per_night).toFixed(2),
        discount_percentage: parseFloat(formData.discount_percentage).toFixed(2),
        room_size: parseInt(formData.room_size),
        amenities: formData.amenities.split(',').map(item => item.trim()).filter(Boolean)
      };

      console.log('Submitting room data:', submitData);
      await axios.put(`/api/admin/rooms/${id}`, submitData);
      toast.success('Room updated successfully');
      navigate('/admin/rooms/list');
    } catch (error) {
      console.error('Error updating room:', error);
      toast.error(error.response?.data?.message || 'Failed to update room');
      setLoading(false);
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
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Edit Room
          </h2>
          <button
            onClick={() => navigate('/admin/rooms/list')}
            className="inline-flex items-center justify-center rounded-md border border-stroke py-2 px-4 text-center font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
          >
            <FaArrowLeft className="mr-2" /> Back to List
          </button>
        </div>

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Room Information
            </h3>
          </div>
          <div className="p-4 md:p-6 2xl:p-10">
            <form onSubmit={handleSubmit}>
              <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Room ID <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="room_id"
                    value={formData.room_id}
                    onChange={handleChange}
                    required
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Room Number <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="room_number"
                    value={formData.room_number}
                    onChange={handleChange}
                    required
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Room Type <span className="text-meta-1">*</span>
                  </label>
                  <select
                    name="room_type"
                    value={formData.room_type}
                    onChange={handleChange}
                    required
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  >
                    <option value="">Select a room type</option>
                    {roomTypes.map(type => (
                      <option key={type.room_type_id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Floor <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="number"
                    name="floor"
                    value={formData.floor}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Capacity <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Price per Night (₹) <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="number"
                    name="price_per_night"
                    value={formData.price_per_night}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Discount Percentage
                  </label>
                  <input
                    type="number"
                    name="discount_percentage"
                    value={formData.discount_percentage}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Bed Type
                  </label>
                  <input
                    type="text"
                    name="bed_type"
                    value={formData.bed_type}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Room Size (sq ft)
                  </label>
                  <input
                    type="number"
                    name="room_size"
                    value={formData.room_size}
                    onChange={handleChange}
                    min="0"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Amenities
                  </label>
                  <input
                    type="text"
                    name="amenities"
                    value={formData.amenities}
                    onChange={handleChange}
                    placeholder="Separate amenities with commas"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    View Type
                  </label>
                  <input
                    type="text"
                    name="view_type"
                    value={formData.view_type}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Status <span className="text-meta-1">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="booked">Booked</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label className="ml-2 block text-sm text-black dark:text-white">
                    Featured Room
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4.5">
                <button
                  type="button"
                  onClick={() => navigate('/admin/rooms/list')}
                  className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
                >
                  {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    <>
                      <FaSave className="mr-2" /> Update Room
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayoutAdmin>
  );
};

export default RoomEdit; 