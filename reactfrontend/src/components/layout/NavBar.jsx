import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    Home,
    DollarSign,
    TrendingUp,
    TrendingDown,
    User,
    LogOut,
    ChevronDown,
    Settings
} from 'lucide-react';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    const toggleProfileDropdown = () => {
        setProfileDropdownOpen((prev) => !prev);
        setAdminDropdownOpen(false); // Close admin dropdown if open
    };

    const toggleAdminDropdown = () => {
        setAdminDropdownOpen((prev) => !prev);
        setProfileDropdownOpen(false); // Close profile dropdown if open
    };

    React.useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.profile-dropdown') && !e.target.closest('.admin-dropdown')) {
                setProfileDropdownOpen(false);
                setAdminDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="bg-gradient-to-r from-indigo-700 to-indigo-900 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/home" className="flex items-center">
                            <div className="bg-white p-1 rounded-md shadow-inner">
                                <DollarSign size={24} className="text-indigo-700" />
                            </div>
                            <span className="ml-2 text-xl font-semibold">CosTracker</span>
                        </Link>
                    </div>

                    {user && (
                        <div className="hidden md:flex items-center space-x-1">
                            <Link to="/home" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200 ${isActive('/home') ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-800'}`}>
                                <Home size={18} className="mr-1" />
                                <span>Home</span>
                            </Link>

                            <Link to="/expenses" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200 ${isActive('/expenses') ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-800'}`}>
                                <TrendingDown size={18} className="mr-1" />
                                <span>Expenses</span>
                            </Link>

                            <Link to="/incomes" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200 ${isActive('/incomes') ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-800'}`}>
                                <TrendingUp size={18} className="mr-1" />
                                <span>Incomes</span>
                            </Link>

                            <Link to="/feedback" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200 ${isActive('/feedback') ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-800'}`}>
                                <User size={18} className="mr-1" />
                                <span>Feedback</span>
                            </Link>

                            {isAdmin && (
                                <div className="relative admin-dropdown">
                                    <button
                                        className="px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200 text-indigo-100 hover:bg-indigo-800"
                                        onClick={toggleAdminDropdown}
                                    >
                                        <Settings size={18} className="mr-1" />
                                        <span>Admin</span>
                                        <ChevronDown size={16} className="ml-1" />
                                    </button>
                                    {adminDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                            <Link
                                                to="/categories"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setAdminDropdownOpen(false)}
                                            >
                                                Categories
                                            </Link>
                                            <Link
                                                to="/payment-methods"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setAdminDropdownOpen(false)}
                                            >
                                                Payment Methods
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {user && (
                        <div className="hidden md:flex items-center">
                            <div className="relative profile-dropdown">
                                <button
                                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-indigo-800 hover:bg-indigo-900"
                                    onClick={toggleProfileDropdown}
                                >
                                    <div className="h-8 w-8 rounded-full bg-indigo-200 text-indigo-800 flex items-center justify-center font-semibold mr-2">
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <span>{user.name}</span>
                                    <ChevronDown size={16} className="ml-1" />
                                </button>

                                {profileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                            onClick={() => setProfileDropdownOpen(false)}
                                        >
                                            <User size={16} className="mr-2" />
                                            Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                        >
                                            <LogOut size={16} className="mr-2" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
