import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Central Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the JWT to every request automatically, if one exists.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("nomade_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error messages
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    const message =
      data?.error ||
      (Array.isArray(data?.errors) ? data.errors.join(" ") : null) ||
      data?.message ||
      (error.request && !error.response
        ? "Can't reach the server. Check your connection and try again."
        : "Something went wrong. Please try again.");
    return Promise.reject(new Error(message));
  }
);

export default apiClient;