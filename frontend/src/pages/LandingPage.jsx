import React, { useEffect, useState, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Brain,
  Shield,
  Zap,
  Search,
  Globe,
  MessageSquare,
} from "lucide-react";

// Lazy load heavy 3D component
const Hero3D = lazy(() => import("../components/Hero3D"));

const features = [
  {
    icon: <Brain className="w-6 h-6 text-accent" />,
    title: "Autonomous Research",
    description:
      "AI agents crawl the web to build a comprehensive dossier on any target company in seconds.",
  },
  {
    icon: <Shield className="w-6 h-6 text-success" />,
    title: "Clear Verdicts",
    description:
      "Get a definitive Strong, Medium, or Weak verdict on the prospect with high confidence.",
  },
  {
    icon: <Zap className="w-6 h-6 text-warning" />,
    title: "Instant Outreach",
    description:
      "Generates hyper-personalized draft emails targeted exactly at the right decision-maker.",
  },
];

const agents = [
  { icon: <Globe />, name: "Web Scraper Agent", delay: 0 },
  { icon: <Search />, name: "Signal Detector", delay: 0.2 },
  { icon: <Brain />, name: "Strategic Analyzer", delay: 0.4 },
  { icon: <MessageSquare />, name: "Copywriter Agent", delay: 0.6 },
];

export default function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // ✅ Delayed mouse tracking for faster initial render
  useEffect(() => {
    let handleMouseMove;

    const timeout = setTimeout(() => {
      handleMouseMove = (e) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = (e.clientY / window.innerHeight) * 2 - 1;
        setMousePos({ x, y });
      };

      window.addEventListener("mousemove", handleMouseMove);
    }, 600);

    return () => {
      clearTimeout(timeout);
      if (handleMouseMove) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <motion.div
      initial={false} // lighter than fade-in
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-transparent overflow-hidden relative selection:bg-accent/30 text-slate-900 dark:text-slate-50 font-sans"
    >
      {/* Background Animated Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            x: mousePos.x * -60,
            y: mousePos.y * -60,
          }}
          transition={{ type: "spring", stiffness: 40, damping: 20 }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-radial from-primary/20 to-transparent blur-[120px]"
        />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-32 flex flex-col items-center">
        {/* Hero Section */}
        <div className="relative w-full mb-32 mt-10 flex flex-col lg:flex-row items-center justify-between min-h-[60vh]">
          {/* Left Content */}
          <div className="text-left max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 dark:bg-primary/10 text-blue-600 dark:text-secondary text-sm font-semibold mb-8 border border-blue-600/20 dark:border-secondary/20 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-secondary animate-pulse" />
              AllyVex Intelligence is Live
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-tight">
              Beyond the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-accent to-secondary">
                Search Bar
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300/80 mb-10 max-w-xl font-light">
              Autonomous Strategic Intelligence for B2B Sales. Stop researching,
              start closing with our premium AI swarm.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/war-room"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300"
              >
                Launch War Room
                <ChevronRight className="w-5 h-5" />
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-accent text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300"
              >
                Register Your Company
                <ChevronRight className="w-5 h-5" />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center bg-slate-900/5 dark:bg-white/5 px-8 py-4 rounded-full font-semibold text-lg border border-slate-900/10 dark:border-white/20"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Right 3D Scene (Lazy Loaded) */}
          <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[55%] h-[800px] pointer-events-none hidden lg:flex items-center justify-center z-0">
            <Suspense fallback={null}>
              <Hero3D />
            </Suspense>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 w-full mb-32">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="glass-card p-8 rounded-3xl border border-white/10 transition-all duration-300 bg-white/60 dark:bg-[#150E28]/60"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/80 dark:bg-[#0F0A1F]/50 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Agents Section */}
        <div className="w-full max-w-5xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Powered by Multi-Agent Swarms
          </h2>

          <div className="flex flex-wrap justify-center gap-6">
            {agents.map((agent, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-6 py-4 rounded-full border border-white/20 bg-white/80 dark:bg-[#150E28]/50"
              >
                {agent.icon}
                <span>{agent.name}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </motion.div>
  );
}
