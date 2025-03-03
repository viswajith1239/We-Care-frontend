import axios, {  AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import API_URL from './API_URL';
import Cookies from 'js-cookie';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

const userAxiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// Request Interceptor for User
userAxiosInstance.interceptors.request.use(
    (config: CustomAxiosRequestConfig) => {
        console.log('Request Interceptor for User');
        
        const token = localStorage.getItem("accesstoken");
        if (token) {
            
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        console.error('User request error:', error);
        return Promise.reject(error);
    }
);

userAxiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;
        if (originalRequest && error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                
                const response = await userAxiosInstance.post<{ accessToken: string }>('/api/user/refresh-token', {}, { withCredentials: true });
                const { accessToken } = response.data;
                
               
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                return userAxiosInstance(originalRequest);
            } catch (refreshError) {
                console.error('Error refreshing user token:', refreshError);
                // window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        if (error.response?.status === 403) {
            console.error('Access denied, account is blocked');
            
            // Clear the token and redirect to login
            
            // window.location.href = '/login';
        }
        

        console.error('User response error:', error.response?.data);
        return Promise.reject(error);
    }
);

export default userAxiosInstance;