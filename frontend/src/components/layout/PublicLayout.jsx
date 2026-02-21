import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import CustomCursor from '../CustomCursor';
import ParticleBackground from '../ParticleBackground';

export default function PublicLayout() {
    return (
        <div className="min-h-screen bg-[#0F172A] font-sans text-white overflow-hidden selection:bg-[#3B82F6]/30 cursor-none relative">
            <CustomCursor />
            <ParticleBackground />
            <Navbar />
            <main className="relative z-10">
                <Outlet />
            </main>
        </div>
    );
}
