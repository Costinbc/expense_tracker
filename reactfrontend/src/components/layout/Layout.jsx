import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ noNav = false }) => (
    <div className="flex flex-col min-h-screen">
        {!noNav && (
                <Navbar />
        )}
        <main className="flex-grow">
            <Outlet />
        </main>
    </div>
);

export default Layout;