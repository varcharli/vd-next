// client/services/api.ts
import axios from 'axios';
import { useRouter } from 'next/router';
import { auth } from './apiAuth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// 请求拦截器：在每个请求中添加 Authorization 头
api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token');
    const token = auth.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：拦截 401 错误并进行处理
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // 清除本地存储中的 token
      localStorage.removeItem('token');
      // 重定向到登录页面
      const router = useRouter();
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default api;