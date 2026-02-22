import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';

const DashboardLayout = () => {
    return (
        <div className="flex h-screen overflow-hidden bg-[#050505] relative w-full absolute top-0 left-0 z-50">
            {/* Background with mesh gradient and blobs overlay for dashboard content feeling */}
            <div className="blob-c w-[500px] h-[500px] bg-purple-500/20 top-[-100px] left-[-100px] animate-blob pointer-events-none"></div>
            <div className="blob-c w-[500px] h-[500px] bg-blue-500/20 bottom-[-100px] right-[-100px] animate-blob pointer-events-none" style={{ animationDelay: '3s' }}></div>
            <div className="blob-c w-[400px] h-[400px] bg-pink-500/20 top-1/2 left-1/3 transform -translate-y-1/2 animate-blob pointer-events-none" style={{ animationDelay: '5s' }}></div>

            <Sidebar />
            <main className="flex-1 h-full overflow-y-auto relative z-10 p-6 md:p-10 no-scrollbar">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="max-w-7xl mx-auto h-full"
                >
                    <Outlet />
                </motion.div>
            </main>
        </div>
    );
};

export default DashboardLayout;
