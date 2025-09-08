import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const Login = () => {
    const [email,   setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();
    const { addToast } = useToast();

    const validateForm = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!password) {
            newErrors.password = 'Password is required';
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
            const success = await login(email, password);

            if (success) {
                addToast('Login successful', 'success');
                navigate('/home');
            } else {
                setErrors({ general: 'Invalid email or password' });
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setErrors({ general: 'Invalid email or password' });
            } else {
                setErrors({ general: 'An error occurred. Please try again.' });
            }
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form-wrapper">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {errors.general && (
                        <p className="text-sm text-red-600 text-center">{errors.general}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
                    >
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;