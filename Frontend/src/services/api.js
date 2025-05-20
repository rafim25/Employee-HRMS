import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3002",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      const { visitor_id } = JSON.parse(auth);
      config.headers["X-Visitor-ID"] = visitor_id;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem("auth");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const apiFunctions = {
  get: (url, config = {}) => api.get(url, config),
  post: (url, data, config = {}) => api.post(url, data, config),
  put: (url, data, config = {}) => api.put(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
  patch: (url, data, config = {}) => api.patch(url, data, config),
};

// Export both the api instance and apiFunctions
export { api };
export default api;
