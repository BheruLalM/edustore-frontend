import axios from 'axios';

// Create API instance pointing to Chat Server
const chatApi = axios.create({
    baseURL: `${import.meta.env.VITE_CHAT_SERVICE_URL || 'http://localhost:3000'}/api`,
    withCredentials: true, // If needed for cookies, though we use Bearer token
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
chatApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('chat_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default chatApi;
