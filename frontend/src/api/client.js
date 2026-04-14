import axios from "axios";

const baseDomain = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: `${baseDomain}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
