import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Users, Globe, Target, Building2, Calendar, Zap, Rocket, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const metrics = [
    { title: 'Total ICP Matches', value: '1,284', icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Active Markets', value: '4 Regions', icon: Globe, color: 'text-success', bg: 'bg-success/10' },
    { title: 'Total Engagements', value: '342', icon: Activity, color: 'text-warning', bg: 'bg-warning/10' },
    { title: 'Pipeline Value', value: '$4.2M', icon: TrendingUp, color: 'text-accent', bg: 'bg-accent/10' },
];

const recentEvents = [
    { title: 'New Product Launch: Auto-Scoring API', date: 'Oct 24, 2023', type: 'Product' },
    { title: 'Expanded into EMEA Market via London Office', date: 'Sep 12, 2023', type: 'Expansion' },
    { title: 'Series A Funding Round Closed ($12M)', date: 'Aug 05, 2023', type: 'Funding' },
];

export default function DashboardPage() {
    const navigate = useNavigate();
    return (
        <div className="max-w-6xl mx-auto w-full pb-12">

            {/* Header & Global CTA */}
            <div className="mb-12 pt-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <Building2 className="w-8 h-8 text-blue-500" />
                        Company Internal Overview
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage your company profile and review operational metrics.</p>
                </div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <button
                        onClick={() => navigate('/intelligence')}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-accent hover:from-accent hover:to-secondary text-white px-8 py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_rgba(0,245,212,0.5)] transition-all duration-300 border border-white/10"
                    >
                        <Zap className="w-5 h-5" />
                        Deploy Strategic Intelligence
                    </button>
                </motion.div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {metrics.map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card p-6 flex flex-col justify-between overflow-hidden relative group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.title}</h3>
                            <div className={`p-2 rounded-lg ${item.bg}`}>
                                <item.icon className={`w-5 h-5 ${item.color}`} />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-slate-800 dark:text-white">
                            {item.value}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Services Summary */}
                <div className="glass-card p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
                        <Rocket className="w-5 h-5 text-accent" />
                        Core Services Summary
                    </h2>
                    <ul className="space-y-4">
                        <li className="flex gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                            <div>
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200">Enterprise Cloud Security Architecture</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Full-stack security audits and Zero-Trust implementations for Fortune 500s.</p>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                            <div>
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200">Data Privacy & Compliance Governance</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Automated GDPR/CCPA readiness frameworks and continuous monitoring.</p>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-success mt-2 shrink-0" />
                            <div>
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200">Managed Threat Intelligence</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">24/7 proactive threat hunting and automated incident response integration.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* Recent Operational Events */}
                <div className="glass-card p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
                        <Calendar className="w-5 h-5 text-warning" />
                        Recent Operational Events
                    </h2>
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 dark:before:from-slate-700 before:to-transparent">
                        {recentEvents.map((event, idx) => (
                            <div key={idx} className="relative pl-8">
                                <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-white dark:bg-[#0F0A1F] border-2 border-warning z-10" />
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200">{event.title}</h4>
                                <div className="flex items-center gap-3 mt-1.5">
                                    <span className="text-xs font-medium text-slate-500">{event.date}</span>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                        {event.type}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
