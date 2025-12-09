import axios, { AxiosHeaders } from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8000", // ganti sesuai backend
});

// Interceptor untuk otomatis menambahkan token ke header Authorization
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    } else if (!(config.headers instanceof AxiosHeaders)) {
      // cast object biasa ke AxiosHeaders
      config.headers = new AxiosHeaders(config.headers);
    }
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});
