import api from '../config/axios';

export const getAllRooms = async () => {
  try {
    const response = await api.get('/api/rooms');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred while fetching rooms' };
  }
};

export const getRoomById = async (id) => {
  try {
    const response = await api.get(`/api/rooms/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred while fetching room details' };
  }
};

export const createRoom = async (roomData) => {
  try {
    const response = await api.post('/api/rooms', roomData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred while creating room' };
  }
};

export const updateRoom = async (id, roomData) => {
  try {
    const response = await api.put(`/api/rooms/${id}`, roomData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred while updating room' };
  }
};

export const deleteRoom = async (id) => {
  try {
    const response = await api.delete(`/api/rooms/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred while deleting room' };
  }
};

export const getAvailableRooms = async (startDate, endDate) => {
  try {
    const response = await api.get(`/api/rooms/available?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred while fetching available rooms' };
  }
}; 