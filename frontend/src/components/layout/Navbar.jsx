import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="h-16 border-b border-slate-200 dark:border-white/5 glass sticky top-0 z-40 transition-all duration-300">
            <div className="h-full px-4 md:px-6 flex items-center justify-between">
                <div className="flex items-center gap-2 opacity-0">
                    {/* Placeholder for alignment */}
                </div>

                <div className="flex items-center gap-5">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 dark:hover:text-white transition-colors duration-300"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </motion.button>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary via-accent to-secondary flex items-center justify-center text-white cursor-pointer shadow-neon-cyan hover:shadow-neon-purple border border-white/20 transition-all duration-300"
                    >
                        <User size={18} />
                    </motion.div>
                </div>
            </div>
        </nav>
    );
}
