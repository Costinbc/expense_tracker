import api from './api';

const expenseService = {
    getPage: async (page = 1, pageSize = 10, search = '') => {
        try {
            const response = await api.get('/Expense/GetPage', {
                params: { page, pageSize, search }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/Expense/GetById/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    add: async (expense) => {
        try {
            const response = await api.post('/Expense/Add', expense,
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

    update: async (expense) => {
        try {
            const response = await api.put('/Expense/Update', expense);
            return response;
        } catch (error) {
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const response = await api.delete(`/Expense/Delete/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default expenseService;