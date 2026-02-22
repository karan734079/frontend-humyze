import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Zap, RefreshCw, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getReport, humanizeReport } from '../features/report/reportSlice';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const ReportPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const { currentReport, isLoading } = useSelector((state) => state.report);
    const [isHumanizing, setIsHumanizing] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(getReport(id));
        }
    }, [dispatch, id]);

    if (isLoading && !currentReport) {
        return (
            <div className="h-full flex items-center justify-center">
                <RefreshCw className="animate-spin text-purple-400 w-12 h-12" />
            </div>
        );
    }

    if (!currentReport) return null;

    const data = [
        { name: 'Human', value: currentReport.humanScore, color: '#10b981' }, // emerald-500
        { name: 'AI', value: currentReport.aiScore, color: '#ec4899' }, // pink-500
    ];

    const hasBeenHumanized = !!currentReport.humanizedText;

    const renderText = () => {
        if (hasBeenHumanized) {
            return (
                <p className="text-gray-300 leading-relaxed max-w-none text-lg">
                    {currentReport.humanizedText}
                </p>
            );
        }

        let result = [];
        let currentText = currentReport.originalText;
        let sentencesToHighlight = currentReport.aiSentences || [];

        // Filter array to only strings
        sentencesToHighlight = sentencesToHighlight.filter(s => typeof s === 'string');

        // Sort longest string first to avoid partial replacements breaking larger sentences
        sentencesToHighlight.sort((a, b) => b.length - a.length);

        // Simple robust replacement strategy avoiding JSX mapping issues
        for (let i = 0; i < sentencesToHighlight.length; i++) {
            const sentence = sentencesToHighlight[i].trim();
            if (!sentence) continue;

            let parts = currentText.split(sentence);
            if (parts.length > 1) {
                if (parts[0]) result.push(<span key={`t-${i}-${Math.random()}`}>{parts[0]}</span>);
                result.push(
                    <span key={`h-${i}`} className="bg-pink-500/20 text-pink-300 border-b border-pink-500/50 pb-0.5 relative group cursor-help transition-all hover:bg-pink-500/40 rounded px-1">
                        {sentence}
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1 bg-gray-900 border border-pink-500/30 text-xs rounded text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            {currentReport.confidence} AI Probability
                        </span>
                    </span>
                );
                currentText = parts.slice(1).join(sentence);
            }
        }
        if (currentText) result.push(<span key={`end-${Math.random()}`}>{currentText}</span>);

        return <p className="text-gray-300 leading-relaxed max-w-none text-lg selection:bg-purple-500/30 whitespace-pre-wrap">{result}</p>;
    };

    const handleHumanize = async () => {
        setIsHumanizing(true);
        await dispatch(humanizeReport(currentReport._id));
        setIsHumanizing(false);
    };

    const downloadReportTxt = () => {
        const element = document.createElement("a");
        const file = new Blob([currentReport.humanizedText || currentReport.originalText], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "Humyze_Annotated_" + currentReport.originalFileName + ".txt";
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Analysis <span className="text-gradient">Report</span></h1>
                    <p className="text-gray-400">{currentReport.originalFileName} • Analyzed on {new Date(currentReport.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-wrap gap-4">
                    <button onClick={downloadReportTxt} className="px-6 py-3 rounded-xl glass-panel hover:bg-white/10 text-white font-medium flex items-center gap-2 transition-all">
                        <Download size={18} />
                        <span>Download Results</span>
                    </button>
                    {!hasBeenHumanized && (
                        <button
                            onClick={handleHumanize}
                            disabled={isHumanizing || isLoading}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all transform hover:-translate-y-1 overflow-hidden relative"
                        >
                            {isHumanizing ? (
                                <>
                                    <RefreshCw size={18} className="animate-spin" />
                                    <span>Humanizing...</span>
                                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                </>
                            ) : (
                                <>
                                    <Zap size={18} />
                                    <span>Humanize Content</span>
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Scores */}
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="glass-card rounded-3xl p-6 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl"></div>

                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <FileText className="text-purple-400" />
                            Content Score
                        </h3>

                        <div className="h-48 relative flex justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="100%"
                                        startAngle={180}
                                        endAngle={0}
                                        innerRadius={70}
                                        outerRadius={90}
                                        paddingAngle={2}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0 0 10px ${entry.color}40)` }} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(20,20,20,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute bottom-4 text-center">
                                <span className="text-4xl font-black text-white">{currentReport.aiScore}%</span>
                                <p className="text-sm font-medium text-pink-400 mt-1">AI Generated</p>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 flex items-center gap-2"><CheckCircle size={16} className="text-green-400" /> Human Written</span>
                                <span className="font-bold">{currentReport.humanScore}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 flex items-center gap-2"><AlertTriangle size={16} className="text-pink-400" /> AI Generated</span>
                                <span className="font-bold">{currentReport.aiScore}%</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Text Document */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="lg:col-span-2 glass-card rounded-3xl relative overflow-hidden flex flex-col min-h-[500px] max-h-[700px]"
                >
                    <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>

                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20 backdrop-blur-md">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                        </div>
                        <div className="text-sm font-mono text-gray-500">{currentReport.originalFileName}</div>
                    </div>

                    <div className="p-8 flex-1 overflow-y-auto no-scrollbar relative">
                        {isHumanizing && (
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                                <div className="relative w-24 h-24 flex items-center justify-center">
                                    <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
                                    <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 animate-spin"></div>
                                    <Zap size={32} className="text-purple-400 animate-pulse" />
                                </div>
                                <h3 className="mt-4 text-xl font-bold text-white text-gradient">Rewriting like a human...</h3>
                                <p className="text-sm text-gray-400 mt-2">Bypassing AI detectors</p>
                            </div>
                        )}

                        <div className="font-serif text-lg text-gray-200">
                            {renderText()}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ReportPage;
