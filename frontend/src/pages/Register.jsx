import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

export default function RegisterPage() {
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        navigate('/login');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="min-h-screen bg-[#0F172A] pt-32 pb-12 px-6 flex flex-col items-center justify-center text-white"
        >
            <div className="w-full max-w-lg glass-card p-8 md:p-10 rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Create your account</h1>
                    <p className="text-slate-400">Start your journey with autonomous intelligence</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-slate-300">First Name</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] transition-all text-white placeholder-slate-500"
                                placeholder="John"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-slate-300">Last Name</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] transition-all text-white placeholder-slate-500"
                                placeholder="Doe"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-slate-300">Work Email</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] transition-all text-white placeholder-slate-500"
                            placeholder="john@company.com"
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

                    <button
                        type="submit"
                        className="w-full py-3 mt-6 rounded-xl bg-[#3B82F6] hover:bg-blue-500 text-white font-semibold transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] active:scale-[0.98]"
                    >
                        Create Account
                    </button>
                </form>

                <p className="text-center mt-8 text-sm text-slate-400">
                    Already have an account? <Link to="/login" className="text-[#3B82F6] hover:text-white font-medium transition-colors">Sign In</Link>
                </p>
            </div>
        </motion.div>
    );
}
