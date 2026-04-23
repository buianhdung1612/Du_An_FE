import axios from "axios"
import { useAuthStore } from "@core/stores/useAuthStore"

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

const apiApp = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})

// Request interceptor: Gắn token vào header
apiApp.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor: Xử lý lỗi 401 (Hết hạn đăng nhập)
apiApp.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
            // AuthGuard sẽ tự động chuyển hướng về /admin/auth/login khi token = null
        }
        return Promise.reject(error);
    }
);

export { apiApp }
