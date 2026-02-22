import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import DashboardLayout from './components/layout/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/UploadPage';
import ReportPage from './pages/ReportPage';
import { useSelector } from 'react-redux';

function App() {
    const { user } = useSelector((state) => state.auth);

    return (
        <BrowserRouter>
            {/* Background with mesh gradient and blobs */}
            <div className="bg-mesh"></div>

            {/* Background blobs for Auth pages mainly (z-index is -1 natively by css) */}
            <div className="blob-c w-96 h-96 bg-purple-500/30 top-0 left-0 animate-blob pointer-events-none"></div>
            <div className="blob-c w-96 h-96 bg-pink-500/30 bottom-0 right-0 animate-blob pointer-events-none" style={{ animationDelay: '2s' }}></div>
            <div className="blob-c w-96 h-96 bg-blue-500/30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-blob pointer-events-none" style={{ animationDelay: '4s' }}></div>

            <div className="min-h-screen flex flex-col relative z-10 w-full max-w-[100vw]">

                <Routes>
                    {/* Public Auth Routes */}
                    <Route path="/" element={<><Navbar /><Home /></>} />
                    <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <><Navbar /><main className="flex-grow flex flex-col"><Login /></main></>} />
                    <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <><Navbar /><main className="flex-grow flex flex-col"><Register /></main></>} />

                    {/* Protected Dashboard Routes */}
                    <Route element={user ? <DashboardLayout /> : <Navigate to="/login" />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/upload" element={<UploadPage />} />
                        <Route path="/report/:id" element={<ReportPage />} />
                        <Route path="/reports" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/settings" element={<Navigate to="/dashboard" replace />} />
                    </Route>
                </Routes>

            </div>
        </BrowserRouter>
    );
}

export default App;
