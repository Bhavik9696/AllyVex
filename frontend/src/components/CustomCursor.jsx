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
                className="fixed top-0 left-0 w-[1000px] h-[1000px] rounded-full pointer-events-none z-0 mix-blend-screen opacity-60"
                style={{
                    background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, rgba(0,245,212,0.05) 40%, transparent 70%)'
                }}
                animate={{
                    x: mousePosition.x - 500,
                    y: mousePosition.y - 500,
                }}
                transition={{ type: "tween", ease: "backOut", duration: 0.8 }}
            />

            {/* Glowing Outer Aura (Cursor Glow) */}
            <motion.div
                className="fixed top-0 left-0 w-16 h-16 rounded-full bg-[#00F5D4]/40 pointer-events-none z-[100] blur-xl mix-blend-screen"
                animate={{
                    x: mousePosition.x - 32,
                    y: mousePosition.y - 32,
                    scale: isHovering ? 2 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 28, mass: 0.5 }}
            />
        </>
    );
}
