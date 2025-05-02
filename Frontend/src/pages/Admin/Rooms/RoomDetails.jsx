import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaEdit, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import DefaultLayoutAdmin from '../../../layout/DefaultLayoutAdmin';

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoomDetails();
  }, [id]);

  const fetchRoomDetails = async () => {
    try {
      const response = await axios.get(`/api/rooms/${id}`);
      setRoom(response.data.room);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching room details:', error);
      toast.error('Failed to fetch room details');
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

  if (!room) {
    return (
      <DefaultLayoutAdmin>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Room not found</h2>
            <Link
              to="/admin/rooms/list"
              className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <FaArrowLeft className="mr-2" />
              Back to Rooms List
            </Link>
          </div>
        </div>
      </DefaultLayoutAdmin>
    );
  }

  return (
    <DefaultLayoutAdmin>
      <div className="mx-auto px-4 py-8 max-w-3xl">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Link
              to="/admin/rooms/list"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <FaArrowLeft className="mr-2" />
              Back to Rooms List
            </Link>
            <Link
              to={`/admin/rooms/edit/${id}`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FaEdit className="mr-2" />
              Edit Room1
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Room {room.room_number}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Basic Information
                  </h2>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Room Type</dt>
                      <dd className="mt-1 text-sm text-gray-900">{room.room_type}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${room.status === 'available'
                            ? 'bg-green-100 text-green-800'
                            : room.status === 'occupied'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                            }`}
                        >
                          {room.status}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Price</dt>
                      <dd className="mt-1 text-sm text-gray-900">₹{room.price}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Capacity</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {room.capacity} persons
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Additional Information
                  </h2>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Description
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {room.description || 'No description available'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Amenities</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {room.amenities ? (
                          <ul className="list-disc list-inside">
                            {room.amenities.split(',').map((amenity, index) => (
                              <li key={index}>{amenity.trim()}</li>
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

              {room.image_url && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Room Image
                  </h2>
                  <img
                    src={room.image_url}
                    alt={`Room ${room.room_number}`}
                    className="max-w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DefaultLayoutAdmin>
  );
};

export default RoomDetails; 