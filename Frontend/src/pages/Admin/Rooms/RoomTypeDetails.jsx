import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const RoomTypeDetails = () => {
  const { id } = useParams();
  const [roomType, setRoomType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoomType = async () => {
      try {
        const response = await axios.get(`/api/room-types/${id}`);
        setRoomType(response.data);
      } catch (error) {
        console.error('Error fetching room type:', error);
        toast.error('Failed to fetch room type details');
      } finally {
        setLoading(false);
      }
    };

    fetchRoomType();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!roomType) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Room type not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/admin/room-types/list"
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" />
            Back to Room Types
          </Link>
          <Link
            to={`/admin/room-types/edit/${id}`}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaEdit className="mr-2" />
            Edit Room Type
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{roomType.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Basic Information</h2>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Base Price</dt>
                    <dd className="text-lg text-gray-900">₹{roomType.base_price}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Maximum Capacity</dt>
                    <dd className="text-lg text-gray-900">{roomType.max_capacity} persons</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Bed Type</dt>
                    <dd className="text-lg text-gray-900 capitalize">{roomType.bed_type}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Room Size</dt>
                    <dd className="text-lg text-gray-900">{roomType.room_size} sq ft</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Additional Information</h2>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="text-gray-900">{roomType.description}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Amenities</dt>
                    <dd className="text-gray-900">
                      {roomType.amenities ? (
                        <ul className="list-disc list-inside">
                          {roomType.amenities.split(',').map((amenity, index) => (
                            <li key={index} className="capitalize">{amenity.trim()}</li>
                          ))}
                        </ul>
                      ) : (
                        'No amenities listed'
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomTypeDetails; 