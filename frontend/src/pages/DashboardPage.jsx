import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Clock, Star, TrendingUp, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const recentSearches = [
    { id: 1, company: 'Stripe.com', verdict: 'Strong', confidence: 94, date: '2 hours ago', icon: Star, color: 'text-success', bg: 'bg-success/10 border-success/20' },
    { id: 2, company: 'AcmeCorp.io', verdict: 'Medium', confidence: 68, date: '5 hours ago', icon: TrendingUp, color: 'text-warning', bg: 'bg-warning/10 border-warning/20' },
    { id: 3, company: 'LegacyTech.net', verdict: 'Weak', confidence: 82, date: '1 day ago', icon: AlertTriangle, color: 'text-danger', bg: 'bg-danger/10 border-danger/20' },
    { id: 4, company: 'Vercel.com', verdict: 'Strong', confidence: 91, date: '2 days ago', icon: Star, color: 'text-success', bg: 'bg-success/10 border-success/20' },
];

export default function DashboardPage() {
    const [domain, setDomain] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (domain) {
            // Simulate navigate to analysis
            navigate(`/analysis/${encodeURIComponent(domain)}`);
        }
    };

    return (
        <div className="max-w-6xl mx-auto w-full pb-12">

            {/* Header & Search */}
            <div className="mb-12 pt-8">
                <h1 className="text-3xl font-bold mb-2">Welcome back, Alex</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8">Ready to analyze your next prospect?</p>

                <form onSubmit={handleSearch} className="relative max-w-2xl">
                    <motion.div
                        animate={{
                            boxShadow: isFocused
                                ? '0 0 0 2px rgba(59,130,246,0.5), 0 10px 30px -10px rgba(59,130,246,0.3)'
                                : '0 4px 6px -1px rgba(0,0,0,0.05)'
                        }}
                        className="flex items-center glass-card overflow-hidden transition-all duration-300"
                    >
                        <div className="pl-5 text-slate-400">
                            <Search className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Enter Company Domain (e.g. stripe.com)"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            className="w-full bg-transparent px-4 py-4 focus:outline-none text-lg"
                        />
                        <button
                            type="submit"
                            disabled={!domain}
                            className={`px-6 py-4 flex items-center gap-2 font-medium transition-colors ${domain ? 'bg-accent text-white hover:bg-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            Analyze
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </motion.div>
                </form>
            </div>

            {/* Recent Searches Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Clock className="w-5 h-5 text-slate-400" />
                    Recent Analyses
                </h2>
                <button className="text-sm text-accent hover:text-blue-600 font-medium">
                    View all
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentSearches.map((item, idx) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        onClick={() => navigate(`/analysis/${item.id}`)}
                        className="glass-card p-5 cursor-pointer relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(59,130,246,0.1)] transition-all"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="font-semibold text-lg truncate pr-2">{item.company}</div>
                            <div className={`p-1.5 rounded-md border ${item.bg}`}>
                                <item.icon className={`w-4 h-4 ${item.color}`} />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500 dark:text-slate-400">Verdict</span>
                                <span className={`text-sm font-semibold ${item.color}`}>{item.verdict}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500 dark:text-slate-400">Confidence</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.confidence > 80 ? 'bg-success' : item.confidence > 60 ? 'bg-warning' : 'bg-danger'}`}
                                            style={{ width: `${item.confidence}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium">{item.confidence}%</span>
                                </div>
                            </div>

                            <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                                {item.date}
                                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-accent" transform="translate(-4,0) group-hover:translate(0,0)" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

        </div>
    );
}
