import axios from "axios";

const API = axios.create({
  baseURL: "/api/v1",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT from localStorage to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("sm_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("sm_token");
      localStorage.removeItem("sm_user");
      // Redirect to login if on protected page
      if (!["/login", "/register", "/verify-otp"].includes(window.location.pathname)) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;
