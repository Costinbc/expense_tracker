import api from './api';

const feedbackService = {
    add: payload => api.post('/Feedback/Add', payload),
    getPage: (page = 1, pageSize = 20, search = '') =>
        api.get('/Feedback/GetPage', { params: { page, pageSize, search } })
};

export default feedbackService;