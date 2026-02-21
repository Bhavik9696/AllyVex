import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, FileSearch, History, Settings, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/analysis/new', icon: FileSearch, label: 'New Analysis' },
    { path: '/dashboard', icon: History, label: 'Recent Searches' },
    { path: '/dashboard', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <motion.aside
            className={cn(
                "hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 glass transition-all duration-300 z-50",
                collapsed ? "w-20" : "w-64"
            )}
        >
            <div className="h-16 flex items-center px-4 justify-between border-b border-slate-200 dark:border-slate-800">
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 text-accent font-bold text-xl tracking-tight"
                    >
                        <Activity className="h-6 w-6" />
                        AllyVex
                    </motion.div>
                )}
                {collapsed && (
                    <div className="mx-auto text-accent">
                        <Activity className="h-6 w-6" />
                    </div>
                )}
            </div>

            <div className="flex-1 py-6 px-3 flex flex-col gap-2">
                {navItems.map((item, idx) => (
                    <NavLink
                        key={idx}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
                                isActive
                                    ? "bg-accent/10 text-accent"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                            )
                        }
                    >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {!collapsed && (
                            <span className="font-medium truncate">{item.label}</span>
                        )}
                    </NavLink>
                ))}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-center">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>
        </motion.aside>
    );
}
