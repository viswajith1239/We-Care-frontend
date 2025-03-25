




import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";
import API_URL from "./API_URL";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const doctorAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});


doctorAxiosInstance.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const token = localStorage.getItem("accesstoken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("doctor request error:", error);
    return Promise.reject(error);
  }
);


doctorAxiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (originalRequest && error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.log("Attempting to refresh token...");
        const response = await doctorAxiosInstance.post<{ accessToken: string }>(
          "/api/doctor/refresh-token",
          {},
          { withCredentials: true }
        );
        const { accessToken } = response.data;
        localStorage.setItem("accesstoken", accessToken);
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        return doctorAxiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
       
        return Promise.reject(refreshError);
      }
    }

    console.error("doctor response error:", error.response?.data);
    return Promise.reject(error);
  }
);

export default doctorAxiosInstance;
