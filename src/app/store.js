import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import documentReducer from '../features/documents/documentSlice';
import profileReducer from '../features/profile/profileSlice';
import chatReducer from '../features/chat/chatSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        documents: documentReducer,
        profile: profileReducer,
        chat: chatReducer,
    },
});
