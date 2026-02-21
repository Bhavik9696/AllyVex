import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AnimatePresence } from 'framer-motion';

import AppLayout from './components/layout/AppLayout';
import PublicLayout from './components/layout/PublicLayout';

import LandingPage from './pages/LandingPage';
import AboutPage from './pages/About';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import KYCSetupPage from './pages/KYCSetupPage';
import DashboardPage from './pages/DashboardPage';
import AnalysisPage from './pages/AnalysisPage';

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Public Routes with Navbar */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>

                {/* Setup Flow */}
                <Route path="/kyc" element={<KYCSetupPage />} />

                {/* Dashboard Routes with Sidebar/TopNav */}
                <Route element={<AppLayout />}>
                    <Route path="/company" element={<DashboardPage />} />
                    <Route path="/intelligence" element={<AnalysisPage />} />
                </Route>
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <AnimatedRoutes />
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
