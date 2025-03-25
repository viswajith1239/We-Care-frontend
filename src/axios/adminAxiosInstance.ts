import axios, {
    AxiosResponse,
    AxiosError,
    InternalAxiosRequestConfig,
  } from "axios";
  import API_URL from "./API_URL";
  
  interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
  }
  
  const adminAxiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
  });
  
 
  adminAxiosInstance.interceptors.request.use(
    (config: CustomAxiosRequestConfig) => {
      const token = localStorage.getItem("admin_access_token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
  
      return config;
    },
    (error: AxiosError) => {
      console.error("Admin request error:", error);
      return Promise.reject(error);
    }
  );
  
 
  
  adminAxiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as CustomAxiosRequestConfig;
  
      if (
        originalRequest &&
        error.response?.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        try {
          const response = await adminAxiosInstance.post<{ accessToken: string }>(
            "/admin/refresh-token",
            {},
            { withCredentials: true }
          );
          const { accessToken } = response.data;
  
          localStorage.setItem("admin_access_token", accessToken);
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
  
          return adminAxiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Error refreshing admin token:", refreshError);
          window.location.href = "/admin/login";
          return Promise.reject(refreshError);
        }
      }
  
      console.error("Admin response error:", error.response?.data);
      return Promise.reject(error);
    }
  );
  
  export default adminAxiosInstance;