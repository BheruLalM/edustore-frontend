import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { documentService } from '../../services/documentService';

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

// Async thunks
export const fetchPublicFeed = createDedupedThunk(
    'documents/fetchPublicFeed',
    async ({ limit = 20, offset = 0 }, { rejectWithValue }) => {
        try {
            const response = await documentService.getPublicFeed(limit, offset);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to fetch feed');
        }
    }
);

export const fetchFollowingFeed = createDedupedThunk(
    'documents/fetchFollowingFeed',
    async ({ limit = 20, offset = 0 }, { rejectWithValue }) => {
        try {
            const response = await documentService.getFollowingFeed(limit, offset);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to fetch following feed');
        }
    }
);

// ✅ NEW: Load More thunks for pagination
export const loadMorePublicFeed = createAsyncThunk(
    'documents/loadMorePublicFeed',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { publicPagination } = getState().documents;
            const response = await documentService.getPublicFeed(
                publicPagination.limit,
                publicPagination.offset
            );
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to load more documents');
        }
    }
);

export const loadMoreFollowingFeed = createAsyncThunk(
    'documents/loadMoreFollowingFeed',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { followingPagination } = getState().documents;
            const response = await documentService.getFollowingFeed(
                followingPagination.limit,
                followingPagination.offset
            );
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to load more documents');
        }
    }
);

export const fetchDocumentDetails = createAsyncThunk(
    'documents/fetchDocumentDetails',
    async (documentId, { rejectWithValue }) => {
        try {
            const response = await documentService.getDocumentDetails(documentId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to fetch document details');
        }
    }
);

export const toggleLike = createAsyncThunk(
    'documents/toggleLike',
    async ({ documentId, isLiked }, { rejectWithValue }) => {
        try {
            const response = isLiked
                ? await documentService.unlikeDocument(documentId)
                : await documentService.likeDocument(documentId);
            return { documentId, ...response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to update like');
        }
    }
);

export const toggleBookmark = createAsyncThunk(
    'documents/toggleBookmark',
    async ({ documentId, isBookmarked }, { rejectWithValue }) => {
        try {
            const response = isBookmarked
                ? await documentService.removeBookmark(documentId)
                : await documentService.bookmarkDocument(documentId);
            return { documentId, ...response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to update bookmark');
        }
    }
);

const documentSlice = createSlice({
    name: 'documents',
    initialState: {
        publicFeed: [],
        followingFeed: [],
        currentDocument: null,
        loading: false,
        loadingMore: false, // ✅ NEW: Separate loading state for pagination
        docLoading: false,
        error: null,
        currentFeed: 'public', // 'public' or 'following'
        // ✅ NEW: Pagination state
        publicPagination: {
            hasMore: true,
            offset: 0,
            limit: 20,
        },
        followingPagination: {
            hasMore: true,
            offset: 0,
            limit: 20,
        },
    },
    reducers: {
        setCurrentFeed: (state, action) => {
            state.currentFeed = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch public feed
            .addCase(fetchPublicFeed.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPublicFeed.fulfilled, (state, action) => {
                state.loading = false;
                state.publicFeed = action.payload;
                // ✅ Reset pagination on fresh fetch
                state.publicPagination.offset = action.payload.length;
                state.publicPagination.hasMore = action.payload.length === state.publicPagination.limit;
            })
            .addCase(fetchPublicFeed.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // ✅ NEW: Load more public feed
            .addCase(loadMorePublicFeed.pending, (state) => {
                state.loadingMore = true;
            })
            .addCase(loadMorePublicFeed.fulfilled, (state, action) => {
                state.loadingMore = false;
                // Append new documents
                state.publicFeed = [...state.publicFeed, ...action.payload];
                // Update pagination
                state.publicPagination.offset += action.payload.length;
                state.publicPagination.hasMore = action.payload.length === state.publicPagination.limit;
            })
            .addCase(loadMorePublicFeed.rejected, (state) => {
                state.loadingMore = false;
            })
            // Fetch following feed
            .addCase(fetchFollowingFeed.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFollowingFeed.fulfilled, (state, action) => {
                state.loading = false;
                state.followingFeed = action.payload;
                // ✅ Reset pagination on fresh fetch
                state.followingPagination.offset = action.payload.length;
                state.followingPagination.hasMore = action.payload.length === state.followingPagination.limit;
            })
            .addCase(fetchFollowingFeed.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // ✅ NEW: Load more following feed
            .addCase(loadMoreFollowingFeed.pending, (state) => {
                state.loadingMore = true;
            })
            .addCase(loadMoreFollowingFeed.fulfilled, (state, action) => {
                state.loadingMore = false;
                // Append new documents
                state.followingFeed = [...state.followingFeed, ...action.payload];
                // Update pagination
                state.followingPagination.offset += action.payload.length;
                state.followingPagination.hasMore = action.payload.length === state.followingPagination.limit;
            })
            .addCase(loadMoreFollowingFeed.rejected, (state) => {
                state.loadingMore = false;
            })
            // Fetch document details
            .addCase(fetchDocumentDetails.pending, (state) => {
                state.docLoading = true;
                state.error = null;
                state.currentDocument = null; // ✅ Clear previous document to prevent stale data
            })
            .addCase(fetchDocumentDetails.fulfilled, (state, action) => {
                state.docLoading = false;
                state.currentDocument = action.payload;
            })
            .addCase(fetchDocumentDetails.rejected, (state, action) => {
                state.docLoading = false;
                state.error = action.payload;
            })
            // Toggle like (optimistic update)
            .addCase(toggleLike.fulfilled, (state, action) => {
                const { documentId, is_liked } = action.payload;

                // Update current document if it matches
                if (state.currentDocument && state.currentDocument.id === documentId) {
                    state.currentDocument.is_liked = is_liked;
                    state.currentDocument.like_count += is_liked ? 1 : -1;
                }

                // Update in public feed
                const publicDoc = state.publicFeed.find(doc => doc.id === documentId);
                if (publicDoc) {
                    publicDoc.is_liked = is_liked;
                    publicDoc.like_count += is_liked ? 1 : -1;
                }

                // Update in following feed
                const followingDoc = state.followingFeed.find(doc => doc.id === documentId);
                if (followingDoc) {
                    followingDoc.is_liked = is_liked;
                    followingDoc.like_count += is_liked ? 1 : -1;
                }
            })
            // Toggle bookmark
            .addCase(toggleBookmark.fulfilled, (state, action) => {
                const { documentId, is_bookmarked } = action.payload;

                // Update current document if it matches
                if (state.currentDocument && state.currentDocument.id === documentId) {
                    state.currentDocument.is_bookmarked = is_bookmarked;
                }

                // Update in public feed
                const publicDoc = state.publicFeed.find(doc => doc.id === documentId);
                if (publicDoc) {
                    publicDoc.is_bookmarked = is_bookmarked;
                }

                // Update in following feed
                const followingDoc = state.followingFeed.find(doc => doc.id === documentId);
                if (followingDoc) {
                    followingDoc.is_bookmarked = is_bookmarked;
                }
            });
    },
});

export const { setCurrentFeed, clearError } = documentSlice.actions;
export default documentSlice.reducer;
