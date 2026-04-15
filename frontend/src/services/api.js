import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Request interceptor — attach token from localStorage if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("fitai_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      "Something went wrong";
    return Promise.reject(
      new Error(
        typeof message === "string" ? message : JSON.stringify(message),
      ),
    );
  },
);

export default apiClient;
