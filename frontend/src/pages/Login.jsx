import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        navigate('/dashboard');
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen bg-[#0F172A] pt-32 px-6 flex flex-col items-center justify-center text-white"
        >
            <div className="w-full max-w-md glass-card p-8 md:p-10 rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-slate-400">Sign in to your intelligence dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-slate-300">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] transition-all text-white placeholder-slate-500"
                            placeholder="you@company.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-slate-300">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] transition-all text-white placeholder-slate-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300 transition-colors">
                            <input type="checkbox" className="rounded border-slate-700 bg-slate-800 text-[#3B82F6] focus:ring-[#3B82F6]" />
                            Remember me
                        </label>
                        <a href="#" className="text-[#3B82F6] hover:text-blue-400 transition-colors">Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 mt-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] active:scale-[0.98]"
                    >
                        Sign In
                    </button>
                </form>

                <p className="text-center mt-8 text-sm text-slate-400">
                    Don't have an account? <Link to="/register" className="text-[#3B82F6] hover:text-white font-medium transition-colors">Register</Link>
                </p>
            </div>
        </motion.div>
    );
}
