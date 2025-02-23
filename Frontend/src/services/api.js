import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3002";

console.log("BASE_URL", import.meta.env);
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear any stored user data
      localStorage.removeItem("user");

      // Show session expiry message
      toast.error("Session expired. Please login again.");

      // Redirect to login page after a short delay to allow toast to be visible
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    }
    return Promise.reject(error);
  }
);

export const api = {
  get: (url, config = {}) => axiosInstance.get(url, config),
  post: (url, data, config = {}) => axiosInstance.post(url, data, config),
  put: (url, data, config = {}) => axiosInstance.put(url, data, config),
  delete: (url, config = {}) => axiosInstance.delete(url, config),
  patch: (url, data, config = {}) => axiosInstance.patch(url, data, config),
};

export default axiosInstance;
