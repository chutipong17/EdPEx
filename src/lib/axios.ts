import axios from "axios";
import { handleTokenExpiration } from "./auth-utils";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Check if the error is due to unauthorized (401) - token expired
    if (error.response && error.response.status === 401) {
      // Clear all auth-related cookies and redirect to sign-in
      await handleTokenExpiration();
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
