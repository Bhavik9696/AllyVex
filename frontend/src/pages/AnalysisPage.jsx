import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronDown, Copy, Activity, Zap, TrendingUp, AlertTriangle, MessageSquare, Globe, Target } from 'lucide-react';

const agentTrace = [
    { id: 1, name: 'Web Scraper', status: 'completed', details: 'Crawled 45 pages across domain and news sources.' },
    { id: 2, name: 'Signal Detector', status: 'completed', details: 'Found recent Series B funding and 3 new executive hires.' },
    { id: 3, name: 'Strategic Analyzer', status: 'completed', details: 'Determined high alignment with target ICP.' },
    { id: 4, name: 'Copywriter Agent', status: 'completed', details: 'Drafted 2 highly personalized email variants.' },
];

const dossierItems = [
    { title: 'Company Overview', content: 'Stripe is a technology company that builds economic infrastructure for the internet. Businesses of every size use their software to accept payments and manage their businesses online.' },
    { title: 'Tech Stack', content: 'React, Node.js, Ruby, PostgreSQL, Redis, AWS.' },
    { title: 'Recent News', content: 'Announced massive expansion into crypto payouts and acquired multiple smaller FinTech startups to bolster their tax compliance offerings.' },
];

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
    const { id } = useParams();
    const domain = id || 'Stripe.com';

    const [openAccordion, setOpenAccordion] = useState(0);
    const [copied, setCopied] = useState(false);

    const emailDraft = "Hi Sarah,\n\nI noticed Stripe recently expanded its crypto payout capabilities—huge congrats on the launch. \n\nGiven your focus on scaling compliance alongside this growth, I thought you might be interested in how our platform automates tax compliance for decentralized payments, reducing manual overhead by 40%.\n\nOpen to a quick chat next Tuesday?";

    const handleCopy = () => {
        navigator.clipboard.writeText(emailDraft);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-6xl mx-auto w-full pb-12 pt-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Globe className="w-8 h-8 text-accent" />
                        {domain}
                    </h1>
                    <div className="flex items-center gap-3 mt-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 border border-accent/20 text-accent flex items-center gap-1.5"><Target className="w-3 h-3" /> Target Match: High</span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-success/10 border border-success/20 text-success flex items-center gap-1.5"><TrendingUp className="w-3 h-3" /> Series B Raised</span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center gap-1.5"><Globe className="w-3 h-3" /> US & EU Market</span>
                    </div>
                </div>
            </div>

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

                        <CircularProgress value={94} />

                        <div className="mt-4 mb-6">
                            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-success to-green-400">
                                STRONG BUY
                            </span>
                        </div>

                        <div className="w-full text-left bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-sm space-y-2 border border-slate-100 dark:border-slate-800">
                            <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Why Now?</p>
                            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" /> Recent funding indicates budget availability.</li>
                                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" /> Growing executive team needs new tooling.</li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* Agent Research Trace */}
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
                            <Activity className="w-5 h-5 text-accent" />
                            Agent Trace
                        </h3>
                        <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
                            {agentTrace.map((step, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.2 + 0.5 }}
                                    key={step.id}
                                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-4"
                                >
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 dark:bg-slate-800 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors">
                                        <CheckCircle2 className="w-5 h-5 text-accent" />
                                    </div>
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="font-semibold text-sm">{step.name}</div>
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
                            Company Dossier
                        </h3>
                        <div className="space-y-3">
                            {dossierItems.map((item, idx) => (
                                <div key={idx} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/50">
                                    <button
                                        onClick={() => setOpenAccordion(openAccordion === idx ? null : idx)}
                                        className="w-full flex items-center justify-between p-4 font-semibold text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
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
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-accent" />
                                Suggested Outreach
                            </h3>
                            <div className="text-sm font-medium text-slate-500">
                                Target: <span className="text-slate-800 dark:text-slate-200 font-semibold">Sarah Jenkins, VP Engineering</span>
                            </div>
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
                                className="w-full h-48 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-slate-700 dark:text-slate-300 resize-none font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent/50"
                                value={emailDraft}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
