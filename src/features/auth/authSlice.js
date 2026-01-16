import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';

// Async thunks
export const requestOTP = createAsyncThunk(
    'auth/requestOTP',
    async (email, { rejectWithValue }) => {
        try {
            const response = await authService.requestOTP(email);
            return { email, message: response.data.message };
        } catch (error) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to send OTP');
        }
    }
);

export const verifyOTP = createAsyncThunk(
    'auth/verifyOTP',
    async ({ email, otp }, { rejectWithValue }) => {
        try {
            await authService.verifyOTP(email, otp);
            // After successful login, get user profile
            const userResponse = await authService.getCurrentUser();
            return userResponse.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.detail || 'Invalid OTP');
        }
    }
);

export const googleLogin = createAsyncThunk(
    'auth/googleLogin',
    async (credential, { rejectWithValue }) => {
        try {
            await authService.googleLogin(credential);
            const userResponse = await authService.getCurrentUser();
            return userResponse.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.detail || 'Google login failed');
        }
    }
);

export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authService.getCurrentUser();
            return response.data;
        } catch (error) {
            return rejectWithValue('Not authenticated');
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authService.logout();
            return null;
        } catch (error) {
            return rejectWithValue(error.response?.data?.detail || 'Logout failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: false,
        isInitialized: false,
        error: null,
        otpSent: false,
        otpEmail: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearOTPState: (state) => {
            state.otpSent = false;
            state.otpEmail = null;
        },
        resetAuth: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            // state.loading = false; // Don't clear loading here to avoid stomping on active thunks
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Request OTP
            .addCase(requestOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(requestOTP.fulfilled, (state, action) => {
                state.loading = false;
                state.otpSent = true;
                state.otpEmail = action.payload.email;
            })
            .addCase(requestOTP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Verify OTP
            .addCase(verifyOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOTP.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.otpSent = false;
                state.otpEmail = null;
            })
            .addCase(verifyOTP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Check Auth
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.isInitialized = true;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.loading = false;
                state.isInitialized = true;
                state.user = null;
                state.isAuthenticated = false;
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
                state.error = null;
            })
            // Google Login
            .addCase(googleLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(googleLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.isInitialized = true;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.otpSent = false;
                state.otpEmail = null;
            })
            .addCase(googleLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearOTPState, resetAuth } = authSlice.actions;
export default authSlice.reducer;
