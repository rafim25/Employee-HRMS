import axios from "axios";

const BASE_URL = "http://localhost:3002"; // Backend URL

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // This ensures cookies are sent with requests
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Optional: Attach token if you switch to token-based auth in the future
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized and refresh token logic if needed
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Refresh token logic (if implemented on the backend)
      // Example:
      // try {
      //     const refreshToken = localStorage.getItem("refreshToken");
      //     const response = await axios.post(`${BASE_URL}/refresh-token`, { refreshToken }, { withCredentials: true });
      //     const { token } = response.data;
      //     localStorage.setItem("token", token);
      //     originalRequest.headers.Authorization = `Bearer ${token}`;
      //     return axiosInstance(originalRequest);
      // } catch (refreshError) {
      //     console.error("Refresh token failed:", refreshError);
      //     window.location.href = "/login";
      // }
    }

    return Promise.reject(error);
  }
);

// Helper methods
export const api = {
  get: (url, config = {}) => axiosInstance.get(url, config),
  post: (url, data, config = {}) => axiosInstance.post(url, data, config),
  put: (url, data, config = {}) => axiosInstance.put(url, data, config),
  delete: (url, config = {}) => axiosInstance.delete(url, config),
  patch: (url, data, config = {}) => axiosInstance.patch(url, data, config),
};

export default axiosInstance;
