import api from './api';
import axios from 'axios';

export const profileService = {
    // Get my profile
    getMyProfile: async () => {
        return api.get('/profile/me');
    },

    // Get user profile
    getUserProfile: async (userId) => {
        return api.get(`/users/${userId}/profile`);
    },

    // Update profile
    updateProfile: async (data) => {
        return api.patch('/profile/update', data);
    },

    // Get avatar upload URL
    getAvatarUploadUrl: async (contentType) => {
        return api.post('/profile/upload-url', { content_type: contentType });
    },

    // Upload avatar (direct to storage)
    uploadAvatar: async (formData) => {
        return api.post('/profile/avatar/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Upload avatar (direct to storage - OLD/Presigned)
    uploadAvatarPresigned: async (uploadUrl, file) => {
        return axios.put(uploadUrl, file, {
            headers: { 'Content-Type': file.type },
        });
    },

    // Commit avatar upload
    commitAvatar: async (objectKey) => {
        return api.patch('/profile/commit', { object_key: objectKey });
    },

    // Follow user
    followUser: async (userId) => {
        return api.post(`/users/${userId}/follow`);
    },

    // Unfollow user
    unfollowUser: async (userId) => {
        return api.delete(`/users/${userId}/follow`);
    },

    // Get follow status
    getFollowStatus: async (userId) => {
        return api.get(`/users/${userId}/follow-status`);
    },

    // Get following list
    getFollowing: async (userId, limit = 20, offset = 0) => {
        return api.get(`/users/${userId}/following?limit=${limit}&offset=${offset}`);
    },

    // Get followers list
    getFollowers: async (userId, limit = 20, offset = 0) => {
        return api.get(`/users/${userId}/followers?limit=${limit}&offset=${offset}`);
    },

    // Search users
    searchUsers: async (query, limit = 20, offset = 0) => {
        return api.get(`/search/users?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`);
    },
};
