import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Zap, FileText, ArrowRight, UploadCloud, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

const Home = () => {
    const [demoStep, setDemoStep] = useState(0);

    // Auto-play the demo
    useEffect(() => {
        const timer = setInterval(() => {
            setDemoStep((prev) => (prev + 1) % 4);
        }, 3500);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col min-h-screen pt-24 pb-12 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-6 w-full flex-grow flex flex-col items-center relative z-10">

                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto mt-12 md:mt-16 mb-16 relative z-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
                            <span className="text-sm font-medium text-purple-300">Humyze AI 2.0 is now live</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
                            Bypass AI Detectors, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-500">
                                Write Like a Human
                            </span>
                        </h1>
                        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Detect algorithmic patterns in seconds and rewrite your content naturally.
                            The most advanced web app for converting AI-generated text into completely undetectable human prose.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/register"
                                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all transform hover:scale-105"
                            >
                                Start Free Trial
                                <ArrowRight size={20} />
                            </Link>
                            <Link
                                to="/login"
                                className="w-full sm:w-auto px-8 py-4 rounded-full glass-button hover:bg-white/10 text-white font-bold text-lg flex items-center justify-center transition-all"
                            >
                                Sign In
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Animated Demo Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="w-full max-w-5xl mx-auto mb-24 relative"
                >
                    {/* Glowing background for the demo */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-purple-500/20 rounded-full blur-[100px] -z-10"></div>

                    <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl shadow-black/50">
                        {/* Demo Header */}
                        <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex items-center gap-2">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                            </div>
                            <div className="mx-auto flex gap-6 text-sm font-medium text-gray-400">
                                <span className={demoStep === 0 ? "text-white transition-colors" : ""}>1. Upload</span>
                                <span className={demoStep === 1 ? "text-purple-400 transition-colors" : ""}>2. Analyze</span>
                                <span className={demoStep === 2 ? "text-pink-400 transition-colors" : ""}>3. Detect</span>
                                <span className={demoStep === 3 ? "text-green-400 transition-colors" : ""}>4. Humanize</span>
                            </div>
                        </div>

                        {/* Demo Body */}
                        <div className="p-8 md:p-12 min-h-[400px] flex flex-col justify-center items-center relative overflow-hidden bg-[#0A0A0A]">
                            <AnimatePresence mode="wait">
                                {demoStep === 0 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="flex flex-col items-center text-center w-full max-w-md border-2 border-dashed border-white/20 rounded-2xl p-10 bg-white/5"
                                    >
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-6">
                                            <UploadCloud size={40} className="text-purple-400 animate-bounce" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2 text-white">Upload Your Essay.pdf</h3>
                                        <div className="w-full bg-gray-800 h-2 rounded-full mt-6 overflow-hidden">
                                            <motion.div
                                                className="h-full bg-purple-500"
                                                initial={{ width: "0%" }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: 3, ease: "easeInOut" }}
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {demoStep === 1 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="w-full relative"
                                    >
                                        <motion.div
                                            className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b from-transparent via-purple-500/20 to-purple-500/40 border-b border-purple-500 z-10"
                                            initial={{ top: -150 }}
                                            animate={{ top: "100%" }}
                                            transition={{ duration: 3, ease: "linear" }}
                                        />
                                        <div className="font-serif text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed relative z-0 italic opacity-50">
                                            "Artificial intelligence has fundamentally changed the landscape of modern technology. Its rapid advancement across numerous sectors demonstrates an unprecedented level of computational efficiency. The implementation of neural network architectures enables complex pattern recognition capabilities that supersede traditional algorithmic approaches..."
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center z-20">
                                            <div className="glass-panel px-6 py-3 rounded-full flex items-center gap-3 text-purple-400 font-bold border border-purple-500/50 shadow-lg shadow-purple-500/20">
                                                <RefreshCw size={20} className="animate-spin" /> Analyzing Patterns...
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {demoStep === 2 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="w-full flex-col flex gap-8 items-center"
                                    >
                                        <div className="text-center">
                                            <h3 className="text-3xl font-bold text-pink-500 flex items-center justify-center gap-2 mb-2">
                                                <AlertTriangle size={28} /> AI Detected
                                            </h3>
                                            <p className="text-gray-400">100% Probability of AI Generation</p>
                                        </div>

                                        <div className="font-serif text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed bg-black/40 p-6 rounded-xl border border-pink-500/30">
                                            <span className="bg-pink-500/30 text-pink-200 rounded px-1 group cursor-pointer border-b border-pink-500/50">"Artificial intelligence has fundamentally changed the landscape of modern technology."</span> <span className="bg-pink-500/30 text-pink-200 rounded px-1 group cursor-pointer border-b border-pink-500/50">"Its rapid advancement across numerous sectors demonstrates an unprecedented level of computational efficiency."</span> <span className="bg-pink-500/30 text-pink-200 rounded px-1 group cursor-pointer border-b border-pink-500/50">"The implementation of neural network architectures enables complex pattern recognition capabilities that supersede traditional algorithmic approaches..."</span>
                                        </div>

                                        <motion.button
                                            className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 shadow-[0_0_20px_rgba(168,85,247,0.5)] text-white font-bold flex items-center gap-2"
                                            whileHover={{ scale: 1.05 }}
                                            animate={{ scale: [1, 1.05, 1] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                        >
                                            <Zap size={20} /> Humanize Now
                                        </motion.button>
                                    </motion.div>
                                )}

                                {demoStep === 3 && (
                                    <motion.div
                                        key="step4"
                                        initial={{ opacity: 0, filter: "blur(10px)" }}
                                        animate={{ opacity: 1, filter: "blur(0px)" }}
                                        exit={{ opacity: 0 }}
                                        className="w-full flex-col flex gap-8 items-center"
                                    >
                                        <div className="text-center">
                                            <h3 className="text-3xl font-bold text-green-400 flex items-center justify-center gap-2 mb-2">
                                                <CheckCircle size={28} /> Human Written
                                            </h3>
                                            <p className="text-gray-400">98% Probability of Human Generation</p>
                                        </div>

                                        <div className="font-serif text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed bg-black/40 p-6 rounded-xl border border-green-500/30">
                                            "AI has completely flipped the script on modern tech. We're seeing it grow incredibly fast in almost every industry, showing off a level of speed and efficiency we honestly haven't really seen before. By using neural networks, these systems can pick up on insanely complex patterns, blowing older, traditional algorithms out of the water..."
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>

                {/* Features Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto mb-20">
                    {[
                        {
                            icon: FileText,
                            title: "Instant Analysis",
                            desc: "Upload PDFs, DOCX, or TXT. Our deep-learning engines highlight robotic phrasing instantly.",
                            color: "text-blue-400",
                            bg: "bg-blue-500/10",
                            border: "border-blue-500/20"
                        },
                        {
                            icon: Zap,
                            title: "One-Click Humanizer",
                            desc: "Restructure sentences, inject natural idioms, and guarantee 99% human scores dynamically.",
                            color: "text-purple-400",
                            bg: "bg-purple-500/10",
                            border: "border-purple-500/20"
                        },
                        {
                            icon: ShieldCheck,
                            title: "100% Undetectable",
                            desc: "Bypass Turnitin, GPTZero, AI Content Detector, and more with our proprietary cloaking system.",
                            color: "text-pink-400",
                            bg: "bg-pink-500/10",
                            border: "border-pink-500/20"
                        }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
                            className={`glass-card p-8 rounded-3xl border ${feature.border} hover:border-white/30 transition-all group`}
                        >
                            <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <feature.icon size={28} className={feature.color} />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Home;

