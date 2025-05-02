import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import DefaultLayoutAdmin from '../../../layout/DefaultLayoutAdmin';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
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

  const handleDelete = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await axios.delete(`/api/admin/rooms/${roomId}`);
        toast.success('Room deleted successfully');
        fetchRooms();
      } catch (error) {
        console.error('Error deleting room:', error);
        toast.error('Failed to delete room');
      }
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-black">Room Management</h1>
          <Link
            to="/admin/rooms/add"
            className="inline-flex items-center gap-2.5 rounded-md bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
          >
            <FaPlus />
            Add New Room
          </Link>
        </div>
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto py-4">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="py-4 px-4 font-medium text-black dark:text-white">Room Number</th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">Type</th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">Price</th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">No rooms found</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                          Get started by adding your first room.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rooms.map((room) => (
                    <tr key={room.room_id}>
                      <td className="border-b text-black border-[#eee] py-5 px-4 dark:border-strokedark">{room.room_number}</td>
                      <td className="border-b text-black border-[#eee] py-5 px-4 dark:border-strokedark">{room.room_type}</td>
                      <td className="border-b text-black border-[#eee] py-5 px-4 dark:border-strokedark">
                        <span className={`px-2 inline-flex text-md leading-5  rounded-full ${room.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{room.status}</span>
                      </td>
                      <td className="border-b text-black border-[#eee] py-5 px-4 dark:border-strokedark">₹{room.price_per_night}</td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center space-x-3.5">
                          <Link to={`/admin/rooms/${room.room_id}`}>
                            <FaEye className="text-success text-xl hover:text-black dark:hover:text-white" />
                          </Link>
                          <Link to={`/admin/rooms/edit/${room.room_id}`}>
                            <FaEdit className="text-primary text-xl hover:text-black dark:hover:text-white" />
                          </Link>
                          <button onClick={() => handleDelete(room.room_id)}>
                            <FaTrash className="text-danger text-xl hover:text-black dark:hover:text-white" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DefaultLayoutAdmin>
  );
};

export default RoomList; 