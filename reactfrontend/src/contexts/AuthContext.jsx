import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setIsLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);
            console.log('Login response:', response); // Debugging

            if (response) {
                setUser(response.user);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Login error:', error);

            // Check if the error is due to invalid credentials
            if (error.response?.status === 401) {
                console.error('Invalid email or password');
            }

            return false;
        }
    };

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            return response;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const isAdmin = () => {
        return user && user.role === 'Admin';
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                register,
                logout,
                isAuthenticated: !!user,
                isAdmin: isAdmin(),
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;