import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import CustomCursor from '../CustomCursor';

export default function AppLayout() {
    return (
        <div className="min-h-screen flex w-full overflow-hidden bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-slate-50 cursor-none">
            <CustomCursor />
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
