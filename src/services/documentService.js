import api from './api';

export const documentService = {
    // Existing methods...
    getPublicFeed: async (limit = 20, offset = 0) => {
        return api.get(`/feed/public?limit=${limit}&offset=${offset}`);
    },
    getFollowingFeed: async (limit = 20, offset = 0) => {
        return api.get(`/feed/private/following?limit=${limit}&offset=${offset}`);
    },
    getMyDocuments: async () => {
        return api.get('/documents/');
    },
    // NEW: Get User Documents
    getUserDocuments: async (userId, limit = 20, offset = 0) => {
        return api.get(`/users/${userId}/documents?limit=${limit}&offset=${offset}`);
    },
    // ... rest of existing methods
    getUploadUrl: async (contentType) => {
        return api.post('/documents/upload-url', { content_type: contentType });
    },
    uploadFile: async (uploadUrl, file) => {
        const axios = (await import('axios')).default; // Dynamic import to avoid circular dependency issues if any
        return axios.put(uploadUrl, file, {
            headers: { 'Content-Type': file.type },
        });
    },
    commitUpload: async (data) => {
        return api.post('/documents/commit', data);
    },
    // NEW: Direct upload for Cloudinary
    uploadDocumentDirect: async (file, title, docType, visibility, content) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('doc_type', docType);
        formData.append('visibility', visibility);
        formData.append('content', content || '');

        return api.post('/documents/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    deleteDocument: async (documentId) => {
        return api.delete(`/documents/${documentId}`);
    },
    getDocumentDetails: async (documentId) => {
        return api.get(`/feed/${documentId}`);
    },
    getDownloadUrl: async (documentId) => {
        return api.get(`/documents/${documentId}/download`);
    },
    likeDocument: async (documentId) => {
        return api.post(`/documents/${documentId}/like`);
    },
    unlikeDocument: async (documentId) => {
        return api.delete(`/documents/${documentId}/like`);
    },
    bookmarkDocument: async (documentId) => {
        return api.post(`/documents/${documentId}/bookmark`);
    },
    removeBookmark: async (documentId) => {
        return api.delete(`/documents/${documentId}/bookmark`);
    },
    getBookmarks: async (limit = 20, offset = 0) => {
        return api.get(`/documents/bookmarks/me?limit=${limit}&offset=${offset}`);
    },
    getComments: async (documentId) => {
        return api.get(`/documents/${documentId}/comments`);
    },
    addComment: async (documentId, content, parentId = null) => {
        return api.post(`/documents/${documentId}/comments`, { content, parent_id: parentId });
    },
    deleteComment: async (commentId) => {
        return api.delete(`/comments/${commentId}`);
    },
};
