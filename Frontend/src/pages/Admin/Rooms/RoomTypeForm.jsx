import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import DefaultLayoutAdmin from '../../../layout/DefaultLayoutAdmin';

const RoomTypeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [formData, setFormData] = useState({
    name: '',
    base_price: '',
    max_capacity: '',
    bed_type: '',
    room_size: '',
    description: '',
    amenities: []
  });

  useEffect(() => {
    if (isEditing) {
      fetchRoomType();
    }
  }, [id]);

  const fetchRoomType = async () => {
    try {
      const response = await axios.get(`/api/room-types/${id}`);
      setFormData(response.data);
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
      if (isEditing) {
        await axios.put(`/api/room-types/${id}`, formData);
        toast.success('Room type updated successfully');
      } else {
        await axios.post('/api/room-types', formData);
        toast.success('Room type created successfully');
      }
      navigate('/admin/room-types');
    } catch (error) {
      console.error('Error saving room type:', error);
      toast.error(isEditing ? 'Failed to update room type' : 'Failed to create room type');
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
      <div className="mx-auto px-4 py-8 max-w-3xl">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate('/admin/room-types')}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Room Type' : 'Add New Room Type'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Room Type Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="base_price" className="block text-sm font-medium text-gray-700">
                  Base Price (₹)
                </label>
                <input
                  type="number"
                  id="base_price"
                  name="base_price"
                  value={formData.base_price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="max_capacity" className="block text-sm font-medium text-gray-700">
                  Maximum Capacity
                </label>
                <input
                  type="number"
                  id="max_capacity"
                  name="max_capacity"
                  value={formData.max_capacity}
                  onChange={handleChange}
                  required
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="bed_type" className="block text-sm font-medium text-gray-700">
                  Bed Type
                </label>
                <input
                  type="text"
                  id="bed_type"
                  name="bed_type"
                  value={formData.bed_type}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="room_size" className="block text-sm font-medium text-gray-700">
                  Room Size (sq ft)
                </label>
                <input
                  type="number"
                  id="room_size"
                  name="room_size"
                  value={formData.room_size}
                  onChange={handleChange}
                  required
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="amenities" className="block text-sm font-medium text-gray-700">
                  Amenities (comma-separated)
                </label>
                <input
                  type="text"
                  id="amenities"
                  name="amenities"
                  value={formData.amenities.join(', ')}
                  onChange={handleAmenitiesChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isEditing ? 'Update Room Type' : 'Create Room Type'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayoutAdmin>
  );
};

export default RoomTypeForm; 