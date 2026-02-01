import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as chatService from '../../services/chatService';

const initialState = {
    chatToken: null,
    chatUserData: null, // Mongoose user object
    isStudent: false,
    conversations: [],
    activeChat: null,
    messages: [],
    onlineUsers: [],
    unreadCounts: {},
    isConnected: false,
    loading: false,
    error: null,
};

// Async thunk to sync user to chat
export const syncToChat = createAsyncThunk(
    'chat/syncToChat',
    async (_, { rejectWithValue }) => {
        try {
            const response = await chatService.syncUser();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to sync to chat');
        }
    }
);

// Async thunk to get chat users
export const fetchChatUsers = createAsyncThunk(
    'chat/fetchUsers',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { chatToken } = getState().chat;
            const response = await chatService.getUsers(chatToken);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to fetch users');
        }
    }
);

// Async thunk to get messages
export const fetchMessages = createAsyncThunk(
    'chat/fetchMessages',
    async (userId, { getState, rejectWithValue }) => {
        try {
            const { chatToken } = getState().chat;
            const response = await chatService.getMessages(chatToken, userId);
            return { userId, messages: response.messages };
        } catch (error) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to fetch messages');
        }
    }
);

// Async thunk to send message
export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async ({ userId, text, image }, { getState, rejectWithValue }) => {
        try {
            const { chatToken } = getState().chat;
            const response = await chatService.sendMessage(chatToken, userId, text, image);
            return response.newMessage;
        } catch (error) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to send message');
        }
    }
);

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setActiveChat: (state, action) => {
            state.activeChat = action.payload;
        },
        clearActiveChat: (state) => {
            state.activeChat = null;
            state.messages = [];
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        setConnected: (state, action) => {
            state.isConnected = action.payload;
        },
        addMessage: (state, action) => {
            // Add message to the messages array if it's for the active chat
            const message = action.payload;
            if (state.activeChat &&
                (message.senderId === state.activeChat || message.receiverId === state.activeChat)) {
                state.messages.push(message);
            }

            // Update unread count if not active chat
            if (!state.activeChat || message.senderId !== state.activeChat) {
                const senderId = message.senderId;
                state.unreadCounts[senderId] = (state.unreadCounts[senderId] || 0) + 1;
            }
        },
        markAsRead: (state, action) => {
            const userId = action.payload;
            state.unreadCounts[userId] = 0;
        },
        resetChat: (state) => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            // Sync to chat
            .addCase(syncToChat.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(syncToChat.fulfilled, (state, action) => {
                state.loading = false;
                state.chatToken = action.payload.chatToken;
                state.chatUserData = action.payload.userData;
                state.isStudent = action.payload.isStudent || false;
            })
            .addCase(syncToChat.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isStudent = false;
            })
            // Fetch users
            .addCase(fetchChatUsers.fulfilled, (state, action) => {
                state.conversations = action.payload.users || [];
                state.unreadCounts = action.payload.unseenMessages || {};
                state.loading = false;
            })
            .addCase(fetchChatUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch messages
            .addCase(fetchMessages.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = action.payload.messages || [];
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Send message
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.messages.push(action.payload);
            });
    },
});

export const {
    setActiveChat,
    clearActiveChat,
    setOnlineUsers,
    setConnected,
    addMessage,
    markAsRead,
    resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;
