import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="h-16 border-b border-slate-200 dark:border-slate-800 glass sticky top-0 z-40">
            <div className="h-full px-4 md:px-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {/* Mobile menu could go here */}
                </div>

                <div className="flex items-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </motion.button>

                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-accent to-blue-400 flex items-center justify-center text-white shadow-md cursor-pointer hover:shadow-lg transition-all">
                        <User size={16} />
                    </div>
                </div>
            </div>
        </nav>
    );
}
