import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileUp, Zap, FileText, TrendingUp, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getReports } from '../features/report/reportSlice';

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { reports, isLoading } = useSelector((state) => state.report);

    useEffect(() => {
        dispatch(getReports());
    }, [dispatch]);

    const avgScore = reports.length > 0
        ? reports.reduce((acc, curr) => acc + curr.humanScore, 0) / reports.length
        : 0;

    const humanizedCount = reports.filter(r => r.humanizedText).length;

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold mb-2 pt-2">Welcome, <span className="text-gradient">{user?.name}</span></h1>
                    <p className="text-gray-400">Analyze, detect, and humanize your content instantly.</p>
                </div>
                <Link to="/upload" className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all transform hover:-translate-y-1">
                    <FileUp size={18} />
                    <span>New Upload</span>
                </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Files Analyzed', value: reports.length, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/20' },
                    { label: 'Files Humanized', value: humanizedCount, icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/20' },
                    { label: 'Average Human Score', value: `${avgScore.toFixed(0)}%`, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/20' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="glass-card p-6 rounded-2xl relative overflow-hidden group"
                    >
                        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl ${stat.bg} group-hover:scale-150 transition-transform duration-500`}></div>
                        <div className="relative z-10 flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                                <stat.icon size={24} className={stat.color} />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                                <h3 className="text-3xl font-bold mt-1 text-white">{isLoading ? '-' : stat.value}</h3>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="glass-card rounded-2xl overflow-hidden"
            >
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Recent History</h2>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {isLoading ? (
                            <p className="text-gray-400">Loading reports...</p>
                        ) : reports.length === 0 ? (
                            <p className="text-gray-400">No reports generated yet. Upload a file to get started.</p>
                        ) : (
                            reports.map((report) => (
                                <div
                                    key={report._id}
                                    onClick={() => navigate(`/report/${report._id}`)}
                                    className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 group cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                                            <FileText size={20} />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-medium text-white group-hover:text-purple-400 transition-colors truncate">{report.originalFileName}</h4>
                                            <p className="text-xs text-gray-500">{new Date(report.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 shrink-0">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-xs text-gray-500 mb-1">Human Score</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400" style={{ width: `${report.humanScore}%` }}></div>
                                                </div>
                                                <span className="text-sm font-bold text-green-400 min-w-[32px]">{report.humanScore.toFixed(0)}%</span>
                                            </div>
                                        </div>
                                        <div className="p-2 rounded-lg glass-button group-hover:bg-purple-500 group-hover:border-purple-500 group-hover:text-white transition-colors">
                                            <ChevronRight size={18} />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
