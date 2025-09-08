import api from './api';

const unwrap = (resp) => {
    if (!resp) return null;
    if (resp.data?.result) return resp.data.result;
    if (resp.data) return resp.data;
    if (resp.result) return resp.result;
    return resp; // fallback
};

const userProfileService = {

    get: async () => {
        const resp = await api.get('/UserProfile/GetMyProfile');
        return unwrap(resp);
    },


    add: async (payload) => {
        const resp = await api.post('/UserProfile/Add', payload);
        return unwrap(resp);
    },


    update: async (payload) => {
        const resp = await api.put('/UserProfile/Update', payload);
        return unwrap(resp);
    }
};

export default userProfileService;
