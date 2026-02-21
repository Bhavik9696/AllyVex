import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Users, Globe, Target, Building2, Calendar, Zap, Rocket, TrendingUp, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCompanyDashboard } from '../services/api';

const iconMap = { Target, Globe, Activity, TrendingUp };

export default function DashboardPage() {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCompanyDashboard();
                setData(response);
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto w-full pb-12 pt-32 flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Fetching Intelligence Profile...</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Loading core metrics and stored documents.</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto w-full pb-12">

            {/* Header & Global CTA */}
            <div className="mb-12 pt-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <Building2 className="w-8 h-8 text-blue-500" />
                        {data.overview.name} Internal Profile
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl">{data.overview.description}</p>
                    {data.documentsSummmary && (
                        <div className="mt-4 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm text-slate-600 dark:text-slate-300 font-medium inline-block border border-slate-200 dark:border-slate-700">
                            {data.documentsSummmary}
                        </div>
                    )}
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
                        Find High-Value Prospects
                    </button>
                </motion.div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {data.metrics.map((item, idx) => {
                    const mappedColors = ['text-blue-500', 'text-success', 'text-warning', 'text-accent'];
                    const mappedBgs = ['bg-blue-500/10', 'bg-success/10', 'bg-warning/10', 'bg-accent/10'];
                    const Icon = Object.values(iconMap)[idx] || Activity;
                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card p-6 flex flex-col justify-between overflow-hidden relative group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.title}</h3>
                                <div className={`p-2 rounded-lg ${mappedBgs[idx % mappedBgs.length]}`}>
                                    <Icon className={`w-5 h-5 ${mappedColors[idx % mappedColors.length]}`} />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-slate-800 dark:text-white">
                                {item.value}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Services Summary */}
                <div className="glass-card p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
                        <Rocket className="w-5 h-5 text-accent" />
                        Core Services Summary
                    </h2>
                    <ul className="space-y-4">
                        {data.services.map((service, idx) => {
                            const bulletColors = ['bg-accent', 'bg-blue-500', 'bg-success'];
                            return (
                                <li className="flex gap-3" key={idx}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${bulletColors[idx % bulletColors.length]} mt-2 shrink-0`} />
                                    <div>
                                        <h4 className="font-semibold text-slate-800 dark:text-slate-200">{service.name}</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{service.description}</p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Recent Operational Events */}
                <div className="glass-card p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
                        <Calendar className="w-5 h-5 text-warning" />
                        Recent Operational Events
                    </h2>
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 dark:before:from-slate-700 before:to-transparent">
                        {data.recentSignals.map((event, idx) => (
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
