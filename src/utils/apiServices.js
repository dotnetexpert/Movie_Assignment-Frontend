import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL, 
});

// Request interceptor
axiosInstance.interceptors.request.use(
    async config => {
        // Get the token from local storage
        const authToken = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        // Set the Authorization header if the token exists
        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
        }
        
        return config;
    },
    error => {
       
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    response => {
       
        return response;
    },
    error => {
        // Handle 401 Unauthorized error by redirecting to login
        if (error.response && error.response.status === 401) {
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
