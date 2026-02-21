import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            });
        };

        const handleMouseOver = (e) => {
            if (e.target.closest('a, button, input, textarea, select')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    return (
        <>
            {/* Massive Background Spotlight track */}
            <motion.div
                className="fixed top-0 left-0 w-[1000px] h-[1000px] rounded-full pointer-events-none z-0 mix-blend-screen opacity-70"
                style={{
                    background: 'radial-gradient(circle, rgba(250,204,21,0.18) 0%, rgba(24,24,27,0.8) 45%, transparent 70%)'
                }}
                animate={{
                    x: mousePosition.x - 500,
                    y: mousePosition.y - 500,
                }}
                transition={{ type: "tween", ease: "backOut", duration: 0.8 }}
            />

            {/* Glowing Outer Aura (Cursor Glow) */}
            <motion.div
                className="fixed top-0 left-0 w-80 h-80 rounded-full bg-[#FACC15]/18 pointer-events-none z-[100] blur-[110px] mix-blend-screen"
                animate={{
                    x: mousePosition.x - 160,
                    y: mousePosition.y - 160,
                    scale: isHovering ? 1.5 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 28, mass: 0.5 }}
            />
        </>
    );
}
