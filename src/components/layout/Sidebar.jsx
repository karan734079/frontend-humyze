import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileUp, FileText, Settings, LogOut, ChevronRight, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(true);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: FileUp, label: 'Upload Content', path: '/upload' },
    ];

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    }

    return (
        <motion.aside
            initial={false}
            animate={{ width: isOpen ? 280 : 80 }}
            className="glass-panel border-r border-t-0 border-b-0 border-l-0 hidden md:flex flex-col relative z-20 transition-all duration-300 ease-in-out bg-[#0a0a0a]"
        >
            <div className="p-6 flex items-center justify-between border-b border-white/10">
                <Link to="/dashboard" className={`flex items-center gap-3 overflow-hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)] shrink-0">
                        <span className="text-white font-bold text-xl">H</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gradient whitespace-nowrap">Humyze</span>
                </Link>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors absolute right-[-20px] top-6 bg-[#1a1a1a] border border-white/10 glass-panel"
                >
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                        <ChevronRight size={16} />
                    </motion.div>
                </button>
            </div>

            <div className="flex-1 py-6 flex flex-col gap-2 px-4">
                {menuItems.map((item) => {
                    const isActive = location.pathname.includes(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative group overflow-hidden ${isActive
                                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="active-sidebar-bg"
                                    className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-50 z-0"
                                />
                            )}
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-md bg-gradient-to-b from-purple-500 to-pink-500"></div>
                            )}
                            <item.icon size={20} className={`relative z-10 shrink-0 ${isActive ? 'text-purple-400' : 'group-hover:text-purple-400 transition-colors'}`} />

                            <AnimatePresence>
                                {isOpen && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: 'auto' }}
                                        exit={{ opacity: 0, width: 0 }}
                                        className="font-medium whitespace-nowrap relative z-10"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-white/10">
                <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 rounded-xl w-full text-gray-400 hover:text-pink-500 hover:bg-white/5 transition-all overflow-hidden cursor-pointer">
                    <LogOut size={20} className="shrink-0" />
                    <AnimatePresence>
                        {isOpen && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                className="font-medium whitespace-nowrap"
                            >
                                Log Out
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
