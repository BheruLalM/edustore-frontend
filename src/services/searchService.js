import api from './api';

const searchService = {
    searchDocuments: async (query, limit = 20, offset = 0) => {
        const response = await api.get('/search/documents', {
            params: { query, limit, offset },
        });
        return response.data;
    },

    searchUsers: async (query, limit = 20, offset = 0) => {
        const response = await api.get('/search/users', {
            params: { query, limit, offset },
        });
        return response.data;
    },
};

export default searchService;
