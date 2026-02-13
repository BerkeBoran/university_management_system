import axios  from "axios";
import { refreshToken } from "./authApi";


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "ContentType": "application/json",
    },
});
export  default api

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access")
        if (token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config
    },
    (error) => Promise.reject(error)
);



api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");

      if (refresh) {
        const data = await refreshToken(refresh);

        localStorage.setItem("access", data.access);

        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);
