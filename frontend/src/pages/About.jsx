import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-[#0F172A] pt-32 px-6 flex flex-col items-center selection:bg-accent/30 font-sans text-white"
        >
            <div className="max-w-4xl w-full text-center space-y-8">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                    About <span className="text-[#3B82F6]">AllyVex</span>
                </h1>
                <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
                    We are building the future of autonomous strategic intelligence for elite B2B sales teams.
                    Founded by a team of AI researchers and enterprise sales veterans.
                </p>

                <div className="glass p-8 rounded-3xl border border-white/10 mt-12 bg-white/5 backdrop-blur-xl text-left">
                    <h2 className="text-2xl font-semibold mb-4 text-white">Our Mission</h2>
                    <p className="text-slate-300 mb-6 leading-relaxed">
                        To eliminate the research phase of enterprise sales, allowing humans to focus entirely on building relationships and closing deals. Our multi-agent swarms do the heavy lifting in seconds, not hours.
                    </p>
                    <Link to="/register" className="inline-flex items-center gap-2 text-[#3B82F6] hover:text-white font-medium transition-colors group">
                        Join the revolution <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
