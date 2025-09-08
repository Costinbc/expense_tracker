import api from './api';

const paymentMethodService = {
    getPage: async (page = 1, pageSize = 10, search = '') => {
        try {
            const response = await api.get('/PaymentMethod/GetPage', {
                params: { page, pageSize, search }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/PaymentMethod/GetById/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    add: async (paymentMethod) => {
        try {
            const response = await api.post('/PaymentMethod/Add', paymentMethod);
            return response;
        } catch (error) {
            throw error;
        }
    },

    update: async (paymentMethod) => {
        try {
            const response = await api.put('/PaymentMethod/Update', paymentMethod);
            return response;
        } catch (error) {
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const response = await api.delete(`/PaymentMethod/Delete/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    getAll: async () => {
        try {
            const response = await api.get('/PaymentMethod/GetPage', {
                params: { page: 1, pageSize: 100 }
            });
            console.log('Payment methods:', response.response.data);
            return response.response.data || [];
        } catch (error) {
            throw error;
        }
    }
};

export default paymentMethodService;