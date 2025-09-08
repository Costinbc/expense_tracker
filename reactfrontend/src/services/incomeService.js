import api from './api';

const incomeService = {
    getPage: async (page = 1, pageSize = 10, search = '') => {
        try {
            const response = await api.get('/Income/GetPage', {
                params: { page, pageSize, search }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/Income/GetById/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    add: async (income) => {
        try {
            const response = await api.post('/Income/Add', income,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            return response;
        } catch (error) {
            throw error;
        }
    },

    update: async (income) => {
        try {
            const response = await api.put('/Income/Update', income);
            return response;
        } catch (error) {
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const response = await api.delete(`/Income/Delete/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default incomeService;