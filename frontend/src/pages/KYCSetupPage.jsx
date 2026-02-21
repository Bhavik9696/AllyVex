import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, CheckCircle2, Loader2, Globe } from 'lucide-react';
import { submitKYC } from '../services/api';

const steps = [
    { id: 'basics', title: 'Company Basics', fields: ['Company Website URL', 'Company Name', 'Industry'] },
    { id: 'offering', title: 'Services & Offering', fields: ['Services Offered'] },
    { id: 'market', title: 'Target Market', fields: ['Target Market', 'Deal Size Range'] }
];

export default function KYCSetupPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        url: '',
        companyName: '',
        industry: '',
        services: '',
        targetMarket: '',
        dealSize: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleNext = async () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setIsSubmitting(true);
            try {
                await submitKYC(formData);
                navigate('/company');
            } catch (err) {
                console.error(err);
                setIsSubmitting(false);
            }
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

                    {/* Loading Overlay */}
                    <AnimatePresence>
                        {isSubmitting && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-50 bg-white/80 dark:bg-[#0F0A1F]/80 backdrop-blur-sm flex flex-col items-center justify-center border border-accent/20"
                            >
                                <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Scraping Website...</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 text-center max-w-[250px]">
                                    Extracting documents and generating company intelligence profile.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

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
                                            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Company Website URL <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                                    <Globe className="w-5 h-5" />
                                                </div>
                                                <input
                                                    type="url"
                                                    name="url"
                                                    required
                                                    value={formData.url}
                                                    onChange={handleChange}
                                                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400"
                                                    placeholder="https://example.com"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Company Name</label>
                                                <input
                                                    type="text"
                                                    name="companyName"
                                                    value={formData.companyName}
                                                    onChange={handleChange}
                                                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400"
                                                    placeholder="e.g. Acme Corp"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Industry</label>
                                                <input
                                                    type="text"
                                                    name="industry"
                                                    value={formData.industry}
                                                    onChange={handleChange}
                                                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400"
                                                    placeholder="e.g. Enterprise Software"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {currentStep === 1 && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Services Offered</label>
                                            <textarea
                                                rows="3"
                                                name="services"
                                                value={formData.services}
                                                onChange={handleChange}
                                                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all resize-none text-slate-800 dark:text-slate-100 placeholder-slate-400"
                                                placeholder="e.g. Cloud Security, Data Privacy Consulting"
                                            />
                                        </div>
                                    </>
                                )}

                                {currentStep === 2 && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Target Market</label>
                                            <input
                                                type="text"
                                                name="targetMarket"
                                                value={formData.targetMarket}
                                                onChange={handleChange}
                                                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400"
                                                placeholder="e.g. North American Fortune 500s"
                                            />
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
                            disabled={isSubmitting || (currentStep === 0 && !formData.url)}
                            className="flex items-center gap-2 bg-accent hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-medium shadow-md shadow-accent/20 transition-all active:scale-95"
                        >
                            {currentStep === steps.length - 1 ? (
                                isSubmitting ? (
                                    <>
                                        Processing Profile
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    </>
                                ) : (
                                    <>
                                        Complete Setup
                                        <CheckCircle2 className="w-4 h-4" />
                                    </>
                                )
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
