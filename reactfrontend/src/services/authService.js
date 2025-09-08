import api from './api';

export const authService = {
    login: async (email, password) => {
        try {
            const result = await api.post('/Authorization/Login', { email, password });

            const data = result?.response;

            console.log(data);

            if (data?.token && data?.user) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                return data; // contains token + user
            }

            console.warn("Login failed: no token or user in response");
            return null;
        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
            return null;
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/Authorization/Register', userData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    isAdmin: () => {
        const user = authService.getCurrentUser();
        return user && user.role === 'Admin';
    }
};

export default authService;