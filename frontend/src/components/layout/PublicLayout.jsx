import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import CustomCursor from '../CustomCursor';
import ParticleBackground from '../ParticleBackground';

export default function PublicLayout() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-[#0F0A1F] font-sans text-slate-900 dark:text-white overflow-hidden selection:bg-[#3B82F6]/30 relative transition-colors duration-300">
            <CustomCursor />
            <Navbar />
            <main className="relative z-10">
                <Outlet />
            </main>
        </div>
    );
}
