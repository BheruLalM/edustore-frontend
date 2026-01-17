import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { profileService } from '../../services/profileService';
import { documentService } from '../../services/documentService'; // Assuming we fetch user docs here

// ✅ Request deduplication tracking
const pendingRequests = new Map();

const createDedupedThunk = (typePrefix, asyncFn) => {
    return createAsyncThunk(typePrefix, async (arg, thunkAPI) => {
        const key = JSON.stringify({ typePrefix, arg });

        // If request is already in flight, wait for it
        if (pendingRequests.has(key)) {
            return pendingRequests.get(key);
        }

        // Create new request promise
        const promise = asyncFn(arg, thunkAPI).finally(() => {
            pendingRequests.delete(key);
        });

        pendingRequests.set(key, promise);
        return promise;
    });
};

export const fetchUserProfile = createDedupedThunk(
    'profile/fetchUserProfile',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await profileService.getUserProfile(userId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to fetch profile');
        }
    }
);

export const fetchUserDocuments = createDedupedThunk(
    'profile/fetchUserDocuments',
    async ({ userId, limit = 20, offset = 0 }, { rejectWithValue }) => {
        try {
            // Backend doesn't have a specific "get user public documents" endpoint in the provided list
            // other than /users/{user_id}/documents ? Let's check api/document/user_documents.py
            // Yes, @router.get("/{user_id}/documents") exists.
            // But in services/documentService.js I implemented 'getMyDocuments' (GET /documents/).
            // I need to check if documentService has 'getUserDocuments'.
            // It doesn't! I need to add it to documentService.js or call axios directly here.
            // I'll assume I'll add it.
            const response = await documentService.getUserDocuments(userId, limit, offset);
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to fetch user documents');
        }
    }
);

export const fetchFollowers = createDedupedThunk(
    'profile/fetchFollowers',
    async (arg, { rejectWithValue }) => {
        try {
            // Support both direct userId (legacy) and object with params
            const userId = typeof arg === 'object' ? arg.userId : arg;
            const limit = typeof arg === 'object' ? arg.limit : 20;
            const offset = typeof arg === 'object' ? arg.offset : 0;

            const response = await profileService.getFollowers(userId, limit, offset);
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to fetch followers');
        }
    }
);

export const fetchFollowing = createDedupedThunk(
    'profile/fetchFollowing',
    async (arg, { rejectWithValue }) => {
        try {
            // Support both direct userId (legacy) and object with params
            const userId = typeof arg === 'object' ? arg.userId : arg;
            const limit = typeof arg === 'object' ? arg.limit : 20;
            const offset = typeof arg === 'object' ? arg.offset : 0;

            const response = await profileService.getFollowing(userId, limit, offset);
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to fetch following');
        }
    }
);

// Load More Followers
export const loadMoreFollowers = createAsyncThunk(
    'profile/loadMoreFollowers',
    async (userId, { getState, rejectWithValue }) => {
        try {
            const { followersPagination } = getState().profile;
            const response = await profileService.getFollowers(
                userId,
                followersPagination.limit,
                followersPagination.offset
            );
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to load more followers');
        }
    }
);

// Load More Following
export const loadMoreFollowing = createAsyncThunk(
    'profile/loadMoreFollowing',
    async (userId, { getState, rejectWithValue }) => {
        try {
            const { followingPagination } = getState().profile;
            const response = await profileService.getFollowing(
                userId,
                followingPagination.limit,
                followingPagination.offset
            );
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to load more following');
        }
    }
);

// Toggle follow
export const toggleFollowUser = createAsyncThunk(
    'profile/toggleFollowUser',
    async ({ userId, isFollowing }, { rejectWithValue }) => {
        try {
            if (isFollowing) {
                await profileService.unfollowUser(userId);
            } else {
                await profileService.followUser(userId);
            }
            return { userId, isFollowing: !isFollowing };
        } catch (error) {
            return rejectWithValue('Failed to update follow status');
        }
    }
);

// Update Profile
export const updateUserProfile = createAsyncThunk(
    'profile/updateUserProfile',
    async (profileData, { dispatch, rejectWithValue }) => {
        try {
            await profileService.updateProfile(profileData);

            // ✅ SYNC: Update global auth state without re-fetching /profile/me
            const { updateUser } = await import('../auth/authSlice');
            dispatch(updateUser(profileData));

            return profileData;
        } catch (error) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to update profile');
        }
    }
);

// Upload Avatar
export const uploadUserAvatar = createAsyncThunk(
    'profile/uploadUserAvatar',
    async ({ file, localUrl }, { dispatch, rejectWithValue }) => {
        try {
            // 1. Optimistic Update (Immediate)
            const { updateUser } = await import('../auth/authSlice');
            dispatch(updateUser({ profile_url: localUrl }));

            // 2. Background Upload
            const formData = new FormData();
            formData.append('file', file);
            const response = await profileService.uploadAvatar(formData);

            // Note: response now contains { status: 'processing', predicted_key: ... }
            // We keep the localUrl as the source until the next full page refresh or sync
            return { profile_url: localUrl, ...response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to upload avatar');
        }
    }
);

const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        currentProfile: null,
        userDocuments: [],
        loading: false,
        docsLoading: false,
        error: null,
        followLoading: false,
        followers: [],
        following: [],
        listLoading: false,
        loadingMore: false, // ✅ NEW: Pagination loading state
        // ✅ NEW: Pagination state
        followersPagination: {
            hasMore: true,
            offset: 0,
            limit: 20
        },
        followingPagination: {
            hasMore: true,
            offset: 0,
            limit: 20
        }
    },
    reducers: {
        clearProfile: (state) => {
            state.currentProfile = null;
            state.userDocuments = [];
            state.followers = [];
            state.following = [];
            state.followersPagination = { hasMore: true, offset: 0, limit: 20 };
            state.followingPagination = { hasMore: true, offset: 0, limit: 20 };
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Profile
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.currentProfile = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Docs
            .addCase(fetchUserDocuments.pending, (state) => {
                state.docsLoading = true;
            })
            .addCase(fetchUserDocuments.fulfilled, (state, action) => {
                state.docsLoading = false;
                // If offset is 0, replace; otherwise append for pagination
                const offset = action.meta.arg?.offset || 0;
                if (offset === 0) {
                    state.userDocuments = action.payload;
                } else {
                    state.userDocuments = [...state.userDocuments, ...action.payload];
                }
            })
            // Toggle Follow (Optimistic handled in component usually, but here we update state)
            .addCase(toggleFollowUser.pending, (state) => {
                state.followLoading = true;
            })
            .addCase(toggleFollowUser.fulfilled, (state, action) => {
                state.followLoading = false;
                const { isFollowing } = action.payload;
                if (state.currentProfile) {
                    state.currentProfile.is_following = isFollowing;
                    // Update follower count
                    if (isFollowing) {
                        state.currentProfile.followers_count = (state.currentProfile.followers_count || 0) + 1;
                    } else {
                        state.currentProfile.followers_count = Math.max(0, (state.currentProfile.followers_count || 0) - 1);
                    }
                }
            })
            // Lists
            .addCase(fetchFollowers.pending, (state) => {
                state.listLoading = true;
            })
            .addCase(fetchFollowers.fulfilled, (state, action) => {
                state.listLoading = false;
                state.followers = action.payload;
                // ✅ Reset pagination
                state.followersPagination.offset = action.payload.length;
                state.followersPagination.hasMore = action.payload.length === state.followersPagination.limit;
            })
            // ✅ Load More Followers
            .addCase(loadMoreFollowers.pending, (state) => {
                state.loadingMore = true;
            })
            .addCase(loadMoreFollowers.fulfilled, (state, action) => {
                state.loadingMore = false;
                state.followers = [...state.followers, ...action.payload];
                state.followersPagination.offset += action.payload.length;
                state.followersPagination.hasMore = action.payload.length === state.followersPagination.limit;
            })
            .addCase(loadMoreFollowers.rejected, (state) => {
                state.loadingMore = false;
            })

            .addCase(fetchFollowing.pending, (state) => {
                state.listLoading = true;
            })
            .addCase(fetchFollowing.fulfilled, (state, action) => {
                state.listLoading = false;
                state.following = action.payload;
                // ✅ Reset pagination
                state.followingPagination.offset = action.payload.length;
                state.followingPagination.hasMore = action.payload.length === state.followingPagination.limit;
            })
            // ✅ Load More Following
            .addCase(loadMoreFollowing.pending, (state) => {
                state.loadingMore = true;
            })
            .addCase(loadMoreFollowing.fulfilled, (state, action) => {
                state.loadingMore = false;
                state.following = [...state.following, ...action.payload];
                state.followingPagination.offset += action.payload.length;
                state.followingPagination.hasMore = action.payload.length === state.followingPagination.limit;
            })
            .addCase(loadMoreFollowing.rejected, (state) => {
                state.loadingMore = false;
            })

            // Update Profile
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                if (state.currentProfile) {
                    state.currentProfile = { ...state.currentProfile, ...action.payload };
                }
            })
            // Upload Avatar
            .addCase(uploadUserAvatar.fulfilled, (state, action) => {
                if (state.currentProfile) {
                    state.currentProfile.profile_url = action.payload.profile_url;
                }
            });
    },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
