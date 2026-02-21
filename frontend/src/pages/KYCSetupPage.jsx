import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';

const steps = [
    { id: 'services', title: 'Services & Industries', fields: ['Services Offered', 'Target Industries'] },
    { id: 'target', title: 'Market & Deal Size', fields: ['Ideal Customer Size', 'Deal Size Range'] },
    { id: 'regions', title: 'Regions & Contacts', fields: ['Regions Targeted', 'Decision Makers'] }
];

export default function KYCSetupPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        services: '',
        industries: '',
        customerSize: '',
        dealSize: '',
        regions: '',
        decisionMakers: ''
    });
    const navigate = useNavigate();

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Submit and redirect
            navigate('/company');
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4 selection:bg-accent/30 font-sans">
            <div className="w-full max-w-xl">

                {/* Progress Bar Header */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
                        <span>Step {currentStep + 1} of {steps.length}</span>
                        <span className="text-accent">{steps[currentStep].title}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-accent"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                {/* Form Card */}
                <div className="glass-card p-8 md:p-10 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">
                                {steps[currentStep].title}
                            </h2>

                            <div className="space-y-5">
                                {currentStep === 0 && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Services Offered</label>
                                            <textarea
                                                rows="2"
                                                name="services"
                                                value={formData.services}
                                                onChange={handleChange}
                                                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all resize-none text-slate-800 dark:text-slate-100 placeholder-slate-400"
                                                placeholder="e.g. Cloud Security, Data Privacy Consulting"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Target Industries</label>
                                            <input
                                                type="text"
                                                name="industries"
                                                value={formData.industries}
                                                onChange={handleChange}
                                                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400"
                                                placeholder="e.g. Finance, Healthcare, B2B SaaS"
                                            />
                                        </div>
                                    </>
                                )}

                                {currentStep === 1 && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Ideal Customer Size</label>
                                            <select
                                                name="customerSize"
                                                value={formData.customerSize}
                                                onChange={handleChange}
                                                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-slate-800 dark:text-slate-100"
                                            >
                                                <option value="" disabled>Select company size</option>
                                                <option value="startup">Startup (1-50 employees)</option>
                                                <option value="midmarket">Mid-Market (51-500 employees)</option>
                                                <option value="enterprise">Enterprise (500+ employees)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Deal Size Range</label>
                                            <select
                                                name="dealSize"
                                                value={formData.dealSize}
                                                onChange={handleChange}
                                                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-slate-800 dark:text-slate-100"
                                            >
                                                <option value="" disabled>Select a range</option>
                                                <option value="10k-50k">$10k - $50k</option>
                                                <option value="50k-100k">$50k - $100k</option>
                                                <option value="100k-500k">$100k - $500k</option>
                                                <option value="500k+">$500k+</option>
                                            </select>
                                        </div>
                                    </>
                                )}

                                {currentStep === 2 && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Regions Targeted</label>
                                            <input
                                                type="text"
                                                name="regions"
                                                value={formData.regions}
                                                onChange={handleChange}
                                                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400"
                                                placeholder="e.g. North America, Western Europe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Decision Makers</label>
                                            <input
                                                type="text"
                                                name="decisionMakers"
                                                value={formData.decisionMakers}
                                                onChange={handleChange}
                                                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400"
                                                placeholder="e.g. VP Engineering, CISO"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Form Actions */}
                    <div className="mt-10 flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            className={`flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors ${currentStep === 0
                                ? 'opacity-0 pointer-events-none'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back
                        </button>

                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 bg-accent hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium shadow-md shadow-accent/20 transition-all active:scale-95"
                        >
                            {currentStep === steps.length - 1 ? (
                                <>
                                    Complete Setup
                                    <CheckCircle2 className="w-4 h-4" />
                                </>
                            ) : (
                                <>
                                    Continue
                                    <ChevronRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
