import axios from 'axios';

// Create an Axios instance
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        // Ensure we are running on the client side
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        // Return the response directly if successful
        return response;
    },
    (error) => {
        // Handle response errors (e.g., 401 Unauthorized)
        if (error.response && error.response.status === 401) {
            // Optional: Handle 401 globally (e.g., redirect to login)
            // if (typeof window !== 'undefined') {
            //   window.location.href = '/login';
            // }
        }
        return Promise.reject(error);
    }
);

export default api;
