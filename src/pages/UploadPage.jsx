import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, File, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFile, resetReport, getReports } from '../features/report/reportSlice';

const UploadPage = () => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const inputRef = useRef(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isLoading, isError, message, isSuccess } = useSelector((state) => state.report);

    useEffect(() => {
        return () => {
            if (isSuccess || isError) {
                dispatch(resetReport());
            }
        }
    }, [isSuccess, isError, dispatch]);

    const handleDrag = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = function (e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = function (e) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (selectedFile) => {
        // Only accept PDF, DOCX, TXT
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        if (validTypes.includes(selectedFile.type)) {
            setFile(selectedFile);
        } else {
            alert("Please upload a PDF, DOCX, or TXT file.");
        }
    };

    const analyzeFile = async () => {
        if (!file) return;

        // Dispatch upload
        const actionResult = await dispatch(uploadFile(file));
        if (uploadFile.fulfilled.match(actionResult)) {
            // Get the reportID via unwrap or action.payload then trigger router
            const newReportId = actionResult.payload.reportId;
            dispatch(getReports());
            navigate(`/report/${newReportId}`);
        } else {
            alert("Verification failed: " + actionResult.payload);
        }
    };

    return (
        <div className="h-full flex flex-col max-w-4xl mx-auto space-y-8 pb-10">
            <div>
                <h1 className="text-4xl font-bold mb-2">Upload Content for <span className="text-gradient">Analysis</span></h1>
                <p className="text-gray-400">We support PDF, DOCX, and TXT files. Detect AI and humanize instantly.</p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-card flex-1 rounded-3xl p-1 relative overflow-hidden flex flex-col justify-center items-center min-h-[400px]"
            >
                {/* Animated border using pseudo-element */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-20 animate-spin-slow blur-xl"></div>

                <div
                    className={`relative z-10 w-full h-full p-10 flex flex-col items-center justify-center rounded-[1.4rem] border-2 border-dashed transition-all duration-300 ${dragActive ? 'border-purple-400 bg-purple-500/10' : 'border-white/20 bg-[#0a0a0a]/80 backdrop-blur-3xl'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.docx,.txt"
                        onChange={handleChange}
                    />

                    {!file ? (
                        <div className="flex flex-col items-center justify-center text-center space-y-6">
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.3)] mb-4"
                            >
                                <UploadCloud size={48} className="text-purple-400" />
                            </motion.div>
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Drag & Drop your file here</h3>
                                <p className="text-gray-400 mb-6">or click to browse your local files</p>
                                <div className="flex gap-4 justify-center text-xs font-medium text-gray-500">
                                    <span className="px-3 py-1 rounded-full glass-panel">PDF</span>
                                    <span className="px-3 py-1 rounded-full glass-panel">DOCX</span>
                                    <span className="px-3 py-1 rounded-full glass-panel">TXT</span>
                                </div>
                            </div>
                            <button
                                onClick={() => inputRef.current?.click()}
                                className="px-8 py-3 rounded-xl bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all transform hover:scale-105"
                            >
                                Select File
                            </button>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-full max-w-md glass-panel rounded-2xl p-6 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>

                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                                        <File size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-white truncate max-w-[200px]">{file.name}</h4>
                                        <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB • {file.type.split('/')[1] || 'txt'}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setFile(null)}
                                    className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                    disabled={isLoading}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {isLoading ? (
                                <div className="mt-8 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-purple-400 font-medium animate-pulse">Analyzing with AI...</span>
                                        <span className="animate-pulse">Loading</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                            initial={{ width: "0%" }}
                                            animate={{ width: "95%" }}
                                            transition={{ duration: 15 }} // Fake loading time estimate
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-8">
                                    <button
                                        onClick={analyzeFile}
                                        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all transform hover:-translate-y-1"
                                    >
                                        Analyze Content
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default UploadPage;
