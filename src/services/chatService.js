import axios from 'axios';
import api from './api';

const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL;

/**
 * Sync current user to chat microservice
 * Only works for students
 */
export const syncUser = async () => {
    const response = await api.post('/api/chat/sync');
    return response.data;
};

/**
 * Sync a target user (the person being messaged)
 */
export const syncTargetUser = async (userData) => {
    const response = await api.post('/api/auth/sync', userData, {
        baseURL: CHAT_API_URL // Communicate directly with chat service
    });
    return response.data;
};

/**
 * Get list of users for chat sidebar
 */
export const getUsers = async (chatToken) => {
    const response = await axios.get(
        `${CHAT_API_URL}/api/messages/users`,
        {
            headers: {
                Authorization: `Bearer ${chatToken}`,
            },
        }
    );
    return response.data;
};

/**
 * Get messages with a specific user
 */
export const getMessages = async (chatToken, userId) => {
    const response = await axios.get(
        `${CHAT_API_URL}/api/messages/${userId}`,
        {
            headers: {
                Authorization: `Bearer ${chatToken}`,
            },
        }
    );
    return response.data;
};

/**
 * Send a message to a user
 */
export const sendMessage = async (chatToken, userId, text, image = null) => {
    const response = await axios.post(
        `${CHAT_API_URL}/api/messages/send/${userId}`,
        { text, image },
        {
            headers: {
                Authorization: `Bearer ${chatToken}`,
            },
        }
    );
    return response.data;
};

/**
 * Mark messages as seen
 */
export const markAsSeen = async (chatToken, userId) => {
    const response = await axios.put(
        `${CHAT_API_URL}/api/messages/mark/${userId}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${chatToken}`,
            },
        }
    );
    return response.data;
};
