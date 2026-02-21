import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Brain, Shield, Zap, Search, Globe, MessageSquare } from 'lucide-react';
import Hero3D from '../components/Hero3D';

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
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            // Normalize mouse position between -1 and 1
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = (e.clientY / window.innerHeight) * 2 - 1;
            setMousePos({ x, y });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.8 }}
            className="min-h-screen bg-transparent overflow-hidden relative selection:bg-accent/30 text-slate-900 dark:text-slate-50 font-sans"
        >

            {/* Background Animated Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.15, 0.25, 0.15],
                        x: mousePos.x * -60,
                        y: mousePos.y * -60
                    }}
                    transition={{
                        scale: { duration: 25, repeat: Infinity, ease: "linear" },
                        opacity: { duration: 25, repeat: Infinity, ease: "linear" },
                        x: { type: "spring", stiffness: 50, damping: 20 },
                        y: { type: "spring", stiffness: 50, damping: 20 }
                    }}
                    className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-radial from-primary/30 to-transparent blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.15, 0.1],
                        x: mousePos.x * 40,
                        y: mousePos.y * 40
                    }}
                    transition={{
                        scale: { duration: 30, repeat: Infinity, ease: "linear" },
                        opacity: { duration: 30, repeat: Infinity, ease: "linear" },
                        x: { type: "spring", stiffness: 40, damping: 20 },
                        y: { type: "spring", stiffness: 40, damping: 20 }
                    }}
                    className="absolute top-[30%] -right-[15%] w-[50%] h-[50%] rounded-full bg-gradient-radial from-secondary/20 to-transparent blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.1, 0.2, 0.1],
                        x: mousePos.x * -80,
                        y: mousePos.y * -80
                    }}
                    transition={{
                        scale: { duration: 35, repeat: Infinity, ease: "linear" },
                        opacity: { duration: 35, repeat: Infinity, ease: "linear" },
                        x: { type: "spring", stiffness: 30, damping: 20 },
                        y: { type: "spring", stiffness: 30, damping: 20 }
                    }}
                    className="absolute bottom-[-10%] left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-radial from-accent/20 to-transparent blur-[100px]"
                />
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-32 flex flex-col items-center">
                {/* Hero Section Container */}
                <div className="relative w-full mb-32 mt-10 flex flex-col lg:flex-row items-center justify-between min-h-[60vh]">

                    {/* Left Content (Text & Buttons) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-left max-w-3xl relative z-10"
                    >
                        <motion.div
                            className="animate-float inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 dark:bg-primary/10 text-blue-600 dark:text-secondary text-sm font-semibold mb-8 border border-blue-600/20 dark:border-secondary/20 shadow-[0_0_15px_rgba(59,130,246,0.15)] dark:shadow-[0_0_15px_rgba(0,245,212,0.15)] backdrop-blur-md"
                        >
                            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-secondary animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)] dark:shadow-[0_0_8px_rgba(0,245,212,0.8)]" />
                            AllyVex Intelligence is Live
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-tight text-slate-900 dark:text-white">
                            Beyond the <motion.span
                                className="bg-[length:200%_auto] animate-gradient text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-accent to-secondary drop-shadow-[0_0_20px_rgba(59,130,246,0.3)] dark:drop-shadow-[0_0_20px_rgba(0,245,212,0.3)]"
                            >
                                Search Bar
                            </motion.span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300/80 mb-10 max-w-xl font-light">
                            Autonomous Strategic Intelligence for B2B Sales. Stop researching, start closing with our premium AI swarm.
                        </p>

                        <div className="flex flex-col sm:flex-row items-start sm:justify-start gap-4">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full sm:w-auto"
                            >
                                <Link
                                    to="/register"
                                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-accent hover:from-accent hover:to-secondary text-white px-8 py-4 rounded-full font-semibold text-lg shadow-neon-purple hover:shadow-neon-cyan transition-all duration-300 border border-white/10 w-full sm:w-auto"
                                >
                                    Register Your Company
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full sm:w-auto"
                            >
                                <Link
                                    to="/login"
                                    className="inline-flex items-center justify-center gap-2 bg-slate-900/5 dark:bg-white/5 hover:bg-slate-900/10 dark:hover:bg-white/10 text-slate-900 dark:text-white px-8 py-4 rounded-full font-semibold text-lg backdrop-blur-md transition-all duration-300 border border-slate-900/10 dark:border-white/20 hover:border-slate-900/20 dark:hover:border-white/40 shadow-sm w-full sm:w-auto"
                                >
                                    Login
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Right 3D Scene */}
                    <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[55%] h-[800px] pointer-events-none hidden lg:flex items-center justify-center z-0">
                        <Hero3D />
                    </div>
                </div>

                {/* Feature Cards */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        visible: { transition: { staggerChildren: 0.15 } },
                        hidden: {}
                    }}
                    className="grid md:grid-cols-3 gap-8 w-full mb-32 relative z-10"
                >
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                            }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="glass-card p-8 rounded-3xl border border-white/10 hover:border-accent/40 shadow-sm hover:shadow-neon-purple transition-all duration-500 overflow-hidden relative group bg-white/60 dark:bg-[#150E28]/60"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-secondary/5 dark:from-primary/5 dark:to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="w-14 h-14 rounded-2xl bg-white/80 dark:bg-[#0F0A1F]/50 flex items-center justify-center mb-6 border border-white/20 dark:border-white/10 group-hover:border-blue-500/30 dark:group-hover:border-secondary/30 group-hover:shadow-neon-cyan transition-all duration-500 relative z-10 shadow-sm">
                                {React.cloneElement(feature.icon, { className: 'w-7 h-7 text-blue-600 dark:text-secondary' })}
                            </div>
                            <h3 className="text-2xl font-semibold mb-3 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-secondary dark:group-hover:from-accent dark:group-hover:to-secondary transition-all relative z-10 text-slate-800 dark:text-white">{feature.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed relative z-10 group-hover:text-slate-700 dark:group-hover:text-slate-300">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Multi-Agent System Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full max-w-5xl text-center relative z-10"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-slate-900 dark:text-white">Powered by Multi-Agent Swarms</h2>
                    <p className="text-slate-600 dark:text-slate-400 font-light mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
                        Our specialized AI agents work in absolute parallel to uncover, verify, and synthesize intelligence faster than ever thought possible.
                    </p>

                    <div className="flex flex-wrap justify-center gap-6">
                        {agents.map((agent, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: agent.delay, type: "spring", stiffness: 100 }}
                                whileHover={{ scale: 1.05, y: -2 }}
                                className="flex items-center gap-3 glass-card bg-white/80 dark:bg-[#150E28]/50 px-6 py-4 rounded-full border border-white/20 dark:border-white/5 hover:border-blue-500/40 dark:hover:border-secondary/40 hover:shadow-neon-cyan transition-all duration-300 cursor-default group"
                            >
                                <div className="text-blue-600 dark:text-accent group-hover:text-blue-500 dark:group-hover:text-secondary transition-colors duration-300">
                                    {React.cloneElement(agent.icon, { className: 'w-5 h-5' })}
                                </div>
                                <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-300">{agent.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

            </main>
        </motion.div>
    );
}
