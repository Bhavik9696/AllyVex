import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Brain, Shield, Zap, Search, Globe, MessageSquare } from 'lucide-react';

const features = [
    {
        icon: <Brain className="w-6 h-6 text-accent" />,
        title: 'Autonomous Research',
        description: 'AI agents crawl the web to build a comprehensive dossier on any target company in seconds.'
    },
    {
        icon: <Shield className="w-6 h-6 text-success" />,
        title: 'Clear Verdits',
        description: 'Get a definitive Strong, Medium, or Weak verdict on the prospect with high confidence.'
    },
    {
        icon: <Zap className="w-6 h-6 text-warning" />,
        title: 'Instant Outreach',
        description: 'Generates hyper-personalized draft emails targeted exactly at the right decision-maker.'
    }
];

const agents = [
    { icon: <Globe />, name: 'Web Scraper Agent', delay: 0 },
    { icon: <Search />, name: 'Signal Detector', delay: 0.2 },
    { icon: <Brain />, name: 'Strategic Analyzer', delay: 0.4 },
    { icon: <MessageSquare />, name: 'Copywriter Agent', delay: 0.6 }
];

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark overflow-hidden relative selection:bg-accent/30 text-slate-900 dark:text-slate-50 font-sans">

            {/* Background Animated Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                        rotate: [0, 90, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-accent/20 blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.1, 0.15, 0.1],
                        rotate: [0, -90, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[40%] text-success -right-[10%] w-[40%] h-[40%] rounded-full bg-success/20 blur-[100px]"
                />
            </div>

            <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
                <div className="text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-300">
                    AllyVex
                </div>
                <div className="flex gap-4">
                    <Link to="/dashboard" className="text-sm font-medium hover:text-accent transition-colors">
                        Login
                    </Link>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center">
                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-8 border border-accent/20"
                    >
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        AllyVex v2.0 is live
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
                    >
                        Beyond the <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">Search Bar</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto"
                    >
                        Autonomous Strategic Intelligence for B2B Sales. Stop researching, start closing.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Link
                            to="/setup"
                            className="inline-flex items-center gap-2 bg-accent hover:bg-blue-600 text-white px-8 py-4 rounded-full font-medium text-lg shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all"
                        >
                            Start Intelligence
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>

                {/* Feature Cards */}
                <div className="grid md:grid-cols-3 gap-6 w-full mb-32">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 + 0.4 }}
                            whileHover={{ y: -5 }}
                            className="glass p-8 rounded-2xl border border-slate-200/50 dark:border-slate-700/50"
                        >
                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Multi-Agent System Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="w-full max-w-5xl text-center"
                >
                    <h2 className="text-3xl font-bold mb-4">Powered by Multi-Agent Swarms</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
                        Our specialized AI agents work in parallel to uncover, verify, and synthesize intelligence.
                    </p>

                    <div className="flex flex-wrap justify-center gap-6">
                        {agents.map((agent, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: agent.delay, type: "spring" }}
                                className="flex items-center gap-3 glass px-6 py-4 rounded-full border border-slate-200/50 dark:border-slate-700/50"
                            >
                                <div className="text-accent">
                                    {agent.icon}
                                </div>
                                <span className="font-medium">{agent.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

            </main>
        </div>
    );
}
