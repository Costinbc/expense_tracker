import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { register } = useAuth();
    const { addToast } = useToast();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const { confirmPassword, ...registerData } = formData;
            await register(registerData);

            addToast('Registration successful! Please log in.', 'success');
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else if (error.response?.data?.errorMessage) {
                setErrors({ general: error.response.data.errorMessage });
            } else {
                setErrors({ general: 'An error occurred during registration. Please try again.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
                <div className="text-red-600 text-sm mb-2">{errors.general}</div>
            )}

            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.name && <div className="text-red-600 text-xs mt-1">{errors.name}</div>}
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && <div className="text-red-600 text-xs mt-1">{errors.email}</div>}
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.password && <div className="text-red-600 text-xs mt-1">{errors.password}</div>}
            </div>

            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                </label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.confirmPassword && <div className="text-red-600 text-xs mt-1">{errors.confirmPassword}</div>}
            </div>

            <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition-colors duration-200"
                disabled={isLoading}
            >
                {isLoading ? 'Registering...' : 'Register'}
            </button>
        </form>
    );
};

export default Register;
