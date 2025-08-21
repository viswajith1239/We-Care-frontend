import { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {}

type Role = 'user' | 'doctor' | 'admin';

const LOGIN_REDIRECT: Record<Role, string> = {
  user: '/login',
  doctor: '/doctor/login',
  admin: '/admin/login',
};

export function axiosInstance(instance: AxiosInstance, role: Role) {
  instance.interceptors.request.use(
    (config: CustomAxiosRequestConfig) => {
   
      config.withCredentials = true;
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      


      if (error.response?.status === 401 || error.response?.status === 403) {
        window.location.href = LOGIN_REDIRECT[role];
      }

      return Promise.reject(error);
    }
  );
}
