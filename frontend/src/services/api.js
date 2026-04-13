import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "http://localhost:5000";

export const api = axios.create({
  baseURL: `${API_BASE}/api/v1`,
  withCredentials: true,
  timeout: 30_000,
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("servicemate_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error?.response?.data?.message || error?.message || "Something went wrong";
    error.message = message;
    return Promise.reject(error);
  },
);
