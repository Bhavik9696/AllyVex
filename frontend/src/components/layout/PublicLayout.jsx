import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import CustomCursor from '../CustomCursor';
import ParticleBackground from '../ParticleBackground';

export default function PublicLayout() {
    return (
        <div className="min-h-screen bg-background-dark font-sans text-slate-100 overflow-hidden selection:bg-accent/30 relative transition-colors duration-300">
            <CustomCursor />
            <ParticleBackground />
            <Navbar />
            <main className="relative z-10">
                <Outlet />
            </main>
        </div>
    );
}
