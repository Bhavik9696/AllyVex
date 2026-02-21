import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        navigate('/kyc');
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen bg-background-dark pt-32 px-6 flex flex-col items-center justify-center text-slate-100"
        >
            <div className="w-full max-w-md glass-card p-8 md:p-10 rounded-3xl border border-white/10 backdrop-blur-xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">
                        <span className="bg-gradient-to-r from-blue-600 via-accent to-secondary bg-clip-text text-transparent">
                            Welcome Back
                        </span>
                    </h1>
                    <p className="text-slate-400">Sign in to your intelligence dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-slate-300">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all text-slate-100 placeholder-slate-500"
                            placeholder="you@company.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-slate-300">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all text-slate-100 placeholder-slate-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300 transition-colors">
                            <input type="checkbox" className="rounded border-slate-700 bg-slate-800 text-accent focus:ring-accent" />
                            Remember me
                        </label>
                        <a href="#" className="text-accent hover:text-white transition-colors">Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-blue-600 to-accent hover:from-accent hover:to-secondary text-white font-semibold transition-all shadow-neon-purple hover:shadow-neon-cyan active:scale-[0.98] border border-white/10"
                    >
                        Sign In
                    </button>
                </form>

                <p className="text-center mt-8 text-sm text-slate-400">
                    Don't have an account? <Link to="/register" className="text-accent hover:text-white font-medium transition-colors">Register</Link>
                </p>
            </div>
        </motion.div>
    );
}
