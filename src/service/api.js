// services/api.js

import axios from "axios";
import useStore from "../components/Usestore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const { token, businessId, clientId } = useStore.getState();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (businessId) {
    config.headers["X-Business-ID"] = businessId;
  }

  if (clientId) {
    config.headers["X-Client-ID"] = clientId;
  }

  return config;
});

export default api;