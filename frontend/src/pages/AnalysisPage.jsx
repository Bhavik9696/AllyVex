import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronDown, Copy, Activity, Zap, TrendingUp, MessageSquare, Globe, Target, Search, ArrowRight, Loader2, Download, Building } from 'lucide-react';
import { getRecommendations, runTargetAnalysis, generatePDF } from '../services/api';

const CircularProgress = ({ value }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
        <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="transform -rotate-90 w-24 h-24">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-200 dark:text-slate-800" />
                <motion.circle
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent"
                    strokeDasharray={circumference}
                    className="text-success"
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xl font-bold">{value}%</span>
            </div>
        </div>
    );
};

export default function AnalysisPage() {
    const [domainInput, setDomainInput] = useState('');
    const [activeDomain, setActiveDomain] = useState(null);
    const [isFocused, setIsFocused] = useState(false);

    const [openAccordion, setOpenAccordion] = useState(0);
    const [copied, setCopied] = useState(false);

    // New backend integration state
    const [recs, setRecs] = useState([]);
    const [loadingRecs, setLoadingRecs] = useState(true);

    const [targetData, setTargetData] = useState(null);
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);
    const [analysisStage, setAnalysisStage] = useState('');

    const [generatingPdf, setGeneratingPdf] = useState(false);

    useEffect(() => {
        const fetchRecs = async () => {
            try {
                const data = await getRecommendations();
                setRecs(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingRecs(false);
            }
        };
        fetchRecs();
    }, []);

    const fetchAnalysis = async (domain) => {
        setLoadingAnalysis(true);
        setActiveDomain(domain);
        setTargetData(null);
        setAnalysisStage('Agent swarm deploying...');

        try {
            const data = await runTargetAnalysis(domain, (stage) => {
                setAnalysisStage(stage);
            });
            setTargetData(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingAnalysis(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (domainInput) {
            fetchAnalysis(domainInput);
            setDomainInput('');
        }
    };

    const handleCopy = () => {
        if (targetData) {
            navigator.clipboard.writeText(targetData.outreachStrategy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDownloadPdf = async () => {
        setGeneratingPdf(true);
        try {
            await generatePDF(activeDomain);
        } catch (e) {
            console.error(e);
        } finally {
            setGeneratingPdf(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto w-full pb-12 pt-4">

            {/* Run Analysis Search Bar */}
            <div className="mb-12 glass-card p-6 border-accent/20">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
                    <Target className="w-5 h-5 text-accent" />
                    Target Intelligence Console
                </h2>
                <form onSubmit={handleSearch} className="relative w-full max-w-3xl">
                    <motion.div
                        animate={{
                            boxShadow: isFocused
                                ? '0 0 0 2px rgba(59,130,246,0.5), 0 10px 30px -10px rgba(59,130,246,0.3)'
                                : '0 4px 6px -1px rgba(0,0,0,0.05)'
                        }}
                        className="flex items-center bg-white/5 dark:bg-[#0F0A1F]/50 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition-all duration-300"
                    >
                        <div className="pl-5 text-slate-400">
                            <Search className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Enter Target Company URL (e.g. stripe.com)"
                            value={domainInput}
                            onChange={(e) => setDomainInput(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            className="w-full bg-transparent px-4 py-4 focus:outline-none text-lg dark:text-white"
                        />
                        <button
                            type="submit"
                            disabled={!domainInput || loadingAnalysis}
                            className={`px-8 py-4 flex items-center gap-2 font-bold transition-all ${domainInput && !loadingAnalysis ? 'bg-gradient-to-r from-blue-600 to-accent text-white hover:opacity-90' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            Analyze
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </motion.div>
                </form>
            </div>

            {/* Main Content Area */}
            {!activeDomain ? (
                // MODE: Smart Recommendations
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Zap className="w-6 h-6 text-accent" />
                        Smart Prospect Recommendations
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-3xl">
                        Based on your company's profile and extracted documents, our AI has identified the following strategic-fit prospects.
                    </p>

                    {loadingRecs ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-10 h-10 text-accent animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                            {recs.map((rec, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    key={rec.id}
                                    className="glass-card p-6 flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-2">
                                                <Building className="w-5 h-5 text-blue-500" />
                                                <h3 className="text-xl font-bold text-slate-800 dark:text-white">{rec.name}</h3>
                                            </div>
                                            <span className="px-2.5 py-1 rounded bg-success/10 text-success text-xs font-bold whitespace-nowrap">
                                                {rec.matchScore}% Match
                                            </span>
                                        </div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400 mb-2 font-medium">Industry: {rec.industry}</div>
                                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 line-clamp-3">
                                            <span className="font-semibold text-slate-800 dark:text-slate-200">Strategic Fit:</span> {rec.reason}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => fetchAnalysis(rec.name.toLowerCase() + '.com')}
                                        className="w-full flex justify-center items-center gap-2 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-lg font-semibold transition-colors text-sm"
                                    >
                                        Analyze Deeply
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                // MODE: Target Analysis Loading & Results
                <>
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                        <div>
                            <h1 className="text-4xl font-black flex items-center gap-3 tracking-tight text-slate-800 dark:text-white">
                                <Globe className="w-8 h-8 text-blue-500" />
                                {activeDomain}
                            </h1>
                            {targetData && (
                                <div className="flex items-center gap-3 mt-3">
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 border border-accent/20 text-accent flex items-center gap-1.5"><Target className="w-3 h-3" /> Target Match: High</span>
                                </div>
                            )}
                        </div>
                        {targetData && (
                            <button
                                onClick={handleDownloadPdf}
                                disabled={generatingPdf}
                                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all border border-slate-200 dark:border-slate-700 disabled:opacity-50"
                            >
                                {generatingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                {generatingPdf ? 'Generating PDF...' : 'Download Intelligence Report'}
                            </button>
                        )}
                    </div>

                    {loadingAnalysis ? (
                        <div className="glass-card p-12 flex flex-col items-center justify-center min-h-[400px]">
                            <Loader2 className="w-16 h-16 text-accent animate-spin mb-6" />
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{analysisStage}</h3>
                            <p className="text-slate-500 dark:text-slate-400">Our autonomous agents are gathering and synthesizing intelligence.</p>
                        </div>
                    ) : targetData && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column (Verdict & Agent Trace) */}
                            <div className="space-y-6 lg:col-span-1">
                                {/* Big Verdict Card */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="glass-card relative overflow-hidden flex flex-col items-center text-center p-8 border-success/30 shadow-[0_0_30px_rgba(34,197,94,0.1)] dark:shadow-[0_0_30px_rgba(34,197,94,0.05)]"
                                >
                                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-success/50 via-success to-success/50"></div>
                                    <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">Final Verdict</h2>

                                    <CircularProgress value={targetData.confidence} />

                                    <div className="mt-4 mb-6">
                                        <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-success to-green-400 uppercase">
                                            {targetData.verdict}
                                        </span>
                                    </div>
                                </motion.div>

                                {/* Agent Research Trace */}
                                <div className="glass-card p-6">
                                    <h3 className="text-lg font-bold flex items-center gap-2 mb-6 text-slate-800 dark:text-white">
                                        <Activity className="w-5 h-5 text-accent" />
                                        Agent Trace
                                    </h3>
                                    <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
                                        {targetData.agentTrace.map((step, idx) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.2 }}
                                                key={step.id}
                                                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-4"
                                            >
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-[#0F0A1F] bg-slate-100 dark:bg-slate-800 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors">
                                                    <CheckCircle2 className="w-5 h-5 text-accent" />
                                                </div>
                                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">{step.name}</div>
                                                    </div>
                                                    <div className="text-xs text-slate-600 dark:text-slate-400">{step.details}</div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column (Dossier & Outreach) */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* Company Dossier Accordion */}
                                <div className="glass-card p-6">
                                    <h3 className="text-lg font-bold flex items-center gap-2 mb-6 text-slate-800 dark:text-slate-100">
                                        <Zap className="w-5 h-5 text-warning" />
                                        Company Dossier & Signals
                                    </h3>
                                    <div className="space-y-3">
                                        {targetData.dossier.map((item, idx) => (
                                            <div key={idx} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/50">
                                                <button
                                                    onClick={() => setOpenAccordion(openAccordion === idx ? null : idx)}
                                                    className="w-full flex items-center justify-between p-4 font-semibold text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
                                                >
                                                    {item.title}
                                                    <motion.div
                                                        animate={{ rotate: openAccordion === idx ? 180 : 0 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <ChevronDown className="w-5 h-5 text-slate-400" />
                                                    </motion.div>
                                                </button>
                                                <AnimatePresence>
                                                    {openAccordion === idx && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="p-4 pt-0 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200 dark:border-slate-800 mt-2">
                                                                {item.content}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Outreach Strategy Panel */}
                                <div className="glass-card p-6 border-accent/20">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                                            <MessageSquare className="w-5 h-5 text-accent" />
                                            Suggested Outreach Strategy
                                        </h3>
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute top-4 right-4 z-10">
                                            <button
                                                onClick={handleCopy}
                                                className="p-2 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm"
                                            >
                                                {copied ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                                                {copied ? 'Copied' : 'Copy'}
                                            </button>
                                        </div>
                                        <textarea
                                            readOnly
                                            className="w-full h-48 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 pr-24 text-slate-700 dark:text-slate-300 resize-none font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent/50"
                                            value={targetData.outreachStrategy}
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
