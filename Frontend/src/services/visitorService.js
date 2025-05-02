import api from '../config/axios';

export const getAllVisitors = async () => {
  try {
    const response = await api.get('/api/visitors');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred while fetching visitors' };
  }
};

export const getVisitorById = async (id) => {
  try {
    const response = await api.get(`/api/visitors/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred while fetching visitor details' };
  }
};

export const createVisitor = async (visitorData) => {
  try {
    const response = await api.post('/api/visitors', visitorData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred while creating visitor' };
  }
};

export const updateVisitor = async (id, visitorData) => {
  try {
    const response = await api.put(`/api/visitors/${id}`, visitorData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred while updating visitor' };
  }
};

export const deleteVisitor = async (id) => {
  try {
    const response = await api.delete(`/api/visitors/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred while deleting visitor' };
  }
};

export const getVisitorBookings = async (id) => {
  try {
    const response = await api.get(`/api/visitors/${id}/bookings`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred while fetching visitor bookings' };
  }
}; 