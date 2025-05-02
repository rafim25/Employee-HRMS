import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import DefaultLayoutAdmin from '../../../layout/DefaultLayoutAdmin';

const RoomTypeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    base_price: '',
    max_capacity: '',
    bed_type: '',
    room_size: '',
    description: '',
    amenities: []
  });

  const [roomTypes] = useState([
    { room_type_id: 1, name: 'Standard' },
    { room_type_id: 2, name: 'Deluxe' },
    { room_type_id: 3, name: 'Suite' },
    { room_type_id: 4, name: 'Executive' },
    { room_type_id: 5, name: 'Family' }
  ]);

  useEffect(() => {
    fetchRoomType();
  }, [id]);

  const fetchRoomType = async () => {
    try {
      const response = await axios.get(`/api/rooms/${id}`);
      const roomData = response.data;
      setFormData({
        name: roomData.name || '',
        base_price: roomData.base_price || '',
        max_capacity: roomData.max_capacity || '',
        bed_type: roomData.bed_type || '',
        room_size: roomData.room_size || '',
        description: roomData.description || '',
        amenities: roomData.amenities || []
      });
    } catch (error) {
      console.error('Error fetching room type:', error);
      toast.error('Failed to fetch room type details');
      navigate('/admin/room-types');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoomTypeChange = (e) => {
    const selectedType = roomTypes.find(type => type.name === e.target.value);
    if (selectedType) {
      setFormData(prev => ({
        ...prev,
        name: selectedType.name,
        room_type_id: selectedType.room_type_id
      }));
    }
  };

  const handleAmenitiesChange = (e) => {
    const amenities = e.target.value.split(',').map(item => item.trim());
    setFormData(prev => ({
      ...prev,
      amenities
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/room-types/${id}`, formData);
      toast.success('Room type updated successfully');
      navigate('/admin/room-types');
    } catch (error) {
      console.error('Error updating room type:', error);
      toast.error('Failed to update room type');
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
            Edit Room Type
          </h2>
          <button
            onClick={() => navigate('/admin/room-types')}
            className="inline-flex items-center justify-center rounded-md border border-stroke py-2 px-4 text-center font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
          >
            <FaArrowLeft className="mr-2" /> Back to List
          </button>
        </div>

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Room Type Information
            </h3>
          </div>
          <div className="p-4 md:p-6 2xl:p-10">
            <form onSubmit={handleSubmit}>
              <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Room Type Name <span className="text-meta-1">*</span>
                  </label>
                  <select
                    name="name"
                    value={formData.name}
                    onChange={handleRoomTypeChange}
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
                    Base Price (₹) <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="number"
                    name="base_price"
                    value={formData.base_price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Maximum Capacity <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="number"
                    name="max_capacity"
                    value={formData.max_capacity}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Bed Type <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="bed_type"
                    value={formData.bed_type}
                    onChange={handleChange}
                    required
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Room Size (sq ft) <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="number"
                    name="room_size"
                    value={formData.room_size}
                    onChange={handleChange}
                    required
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
                    rows="4"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Amenities (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="amenities"
                    value={formData.amenities.join(', ')}
                    onChange={handleAmenitiesChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4.5">
                <button
                  type="button"
                  onClick={() => navigate('/admin/room-types')}
                  className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
                >
                  Update Room Type
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayoutAdmin>
  );
};

export default RoomTypeEdit; 