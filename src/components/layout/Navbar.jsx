import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
    const location = useLocation();

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="fixed w-full z-50 px-6 py-4"
        >
            <div className="max-w-7xl mx-auto glass-panel rounded-full px-6 py-3 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2">
                    {/* A glowing logo representation */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                        <span className="text-white font-bold text-xl">H</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gradient">Humyze</span>
                </Link>

                {/* Dynamic Desktop Links */}
                <div className="hidden md:flex gap-8 items-center text-sm font-medium">
                    <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">About</a>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a>
                </div>

                <div className="flex gap-4">
                    <Link to="/login" className="px-6 py-2 rounded-full glass-button hover:bg-white/10 transition-all font-medium hidden sm:block">
                        Log In
                    </Link>
                    <Link to="/register" className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all transform hover:scale-105">
                        Sign Up Free
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
