import api from '../config/axios';

export const getAllBookings = async () => {
  try {
    const response = await api.get('/api/bookings');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred while fetching bookings' };
  }
};

export const getBookingById = async (id) => {
  try {
    const response = await api.get(`/api/bookings/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred while fetching booking details' };
  }
};

export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/api/bookings', bookingData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred while creating booking' };
  }
};

export const updateBooking = async (id, bookingData) => {
  try {
    const response = await api.put(`/api/bookings/${id}`, bookingData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred while updating booking' };
  }
};

export const deleteBooking = async (id) => {
  try {
    const response = await api.delete(`/api/bookings/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred while deleting booking' };
  }
};

export const getBookingByDateRange = async (startDate, endDate) => {
  try {
    const response = await api.get(`/api/bookings/date-range?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred while fetching bookings by date range' };
  }
}; 