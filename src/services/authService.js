import api from './api';

export const authService = {
    // Request OTP
    requestOTP: async (email) => {
        return api.post('/auth/request-otp', { email });
    },

    // Verify OTP
    verifyOTP: async (email, otp) => {
        return api.post('/auth/verify-otp', { email, otp });
    },

    // Logout
    logout: async () => {
        return api.post('/auth/logout');
    },

    // Google Login
    googleLogin: async (credential) => {
        return api.post('/auth/google', { credential });
    },

    // Get current user (for auth check)
    getCurrentUser: async () => {
        return api.get('/profile/me');
    },
};
