import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const navLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Login', path: '/login' }
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious();
        if (latest > 50) {
            setScrolled(true);
            if (latest > previous && latest > 150) {
                setHidden(true); // Hide when scrolling down
            } else {
                setHidden(false); // Show when scrolling up
            }
        } else {
            setScrolled(false);
            setHidden(false);
        }
    });

    return (
        <motion.nav
            variants={{
                visible: { y: 0, opacity: 1 },
                hidden: { y: "-100%", opacity: 0 }
            }}
            initial="visible"
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className={`fixed top-0 w-full z-50 transition-colors duration-500 ${scrolled
                ? 'bg-white/80 dark:bg-[#0F0A1F]/80 backdrop-blur-xl border-b border-slate-200 shadow-sm dark:border-white/10 dark:shadow-md'
                : 'bg-transparent border-b border-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold tracking-tight z-50 flex items-center gap-1 group">
                    <span className="text-slate-900 dark:text-white transition-colors">Ally</span>
                    <span className="text-[#3B82F6] dark:text-[#3B82F6] transition-colors">Vex</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`relative group text-sm font-medium transition-colors py-2 ${isActive ? 'text-[#3B82F6] dark:text-white' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                                    }`}
                            >
                                {link.name}
                                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full ${isActive ? 'w-full shadow-neon-cyan' : ''}`} />
                            </Link>
                        );
                    })}

                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 15 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 dark:hover:text-white transition-colors"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </motion.button>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            to="/register"
                            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-accent text-white font-semibold text-sm transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] border border-white/10"
                        >
                            Register
                        </Link>
                    </motion.div>
                </div>

                {/* Mobile Toggle */}
                <div className="flex items-center gap-4 md:hidden">
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 15 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-slate-600 dark:text-slate-300"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </motion.button>
                    <button
                        className="text-slate-900 dark:text-white z-50 p-2"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-0 top-0 right-0 w-full h-screen bg-white/95 dark:bg-[#0F0A1F]/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-8"
                        >
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className="text-2xl font-semibold text-slate-800 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                to="/register"
                                onClick={() => setIsOpen(false)}
                                className="mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-accent text-white font-bold text-xl shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-white/10"
                            >
                                Register
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
}
