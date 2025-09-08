import React from 'react';
import { Link } from 'react-router-dom';
import Login from '../components/auth/Login';
import logo from '../assets/logo.png';

const LoginPage = () => (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
        <div className="flex items-center justify-center bg-white p-8">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
                    <p className="mt-2 text-gray-600">
                        Log in to access your expense tracking dashboard
                    </p>
                </div>
                <Login />
                <div className="text-center">
                    <span className="text-gray-600">No account? </span>
                    <Link
                        to="/register"
                        className="text-indigo-600 hover:underline font-medium"
                    >
                        Register here
                    </Link>
                </div>
            </div>
        </div>

        <div className="hidden md:flex items-center justify-center bg-indigo-50">
            <div className="w-3/4 max-w-sm">
                <div className="w-full max-w-lg flex items-center justify-center">
                    <img
                        src={logo}
                        alt="App Logo"
                        className="w-full h-500 object-contain"
                    />
                </div>
            </div>
        </div>
    </div>
);

export default LoginPage;
