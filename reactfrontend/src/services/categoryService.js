import api from './api';

const categoryService = {
    getPage: async (page = 1, pageSize = 10, search = '') => {
        try {
            const response = await api.get('/Category/GetPage', {
                params: { page, pageSize, search }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/Category/GetById/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    add: async (category) => {
        try {
            const response = await api.post('/Category/Add', category);
            return response;
        } catch (error) {
            throw error;
        }
    },

    update: async (category) => {
        try {
            const response = await api.put('/Category/Update', category);
            return response;
        } catch (error) {
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const response = await api.delete(`/Category/Delete/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    getAll: async () => {
        try {
            const response = await api.get('/Category/GetPage', { params: { page: 1, pageSize: 100 } });
            console.log('Response data:', response.response.data);
            return response.response.data || [];
        } catch (error) {
            throw error;
        }
    }
};

export default categoryService;