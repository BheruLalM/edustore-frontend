import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://edustore-api-1.onrender.com',
    withCredentials: true, // CRITICAL: Enables HttpOnly cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for handling 401 errors and auto-refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retried, try to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt token refresh
                await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                // Retry original request
                return api.request(originalRequest);
            } catch (refreshError) {
                // Refresh failed, notify the app to handle logout/redirect smoothly
                window.dispatchEvent(new CustomEvent('unauthorized'));
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
