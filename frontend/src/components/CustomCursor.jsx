import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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
            {/* Core Cursor Dot */}
            <motion.div
                className="fixed top-0 left-0 w-4 h-4 rounded-full bg-accent pointer-events-none z-[100] mix-blend-screen"
                animate={{
                    x: mousePosition.x - 8,
                    y: mousePosition.y - 8,
                    scale: isHovering ? 1.5 : 1,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
            />

            {/* Glowing Outer Aura */}
            <motion.div
                className="fixed top-0 left-0 w-32 h-32 rounded-full bg-secondary/20 pointer-events-none z-[99] blur-2xl mix-blend-screen"
                animate={{
                    x: mousePosition.x - 64,
                    y: mousePosition.y - 64,
                    scale: isHovering ? 1.5 : 1,
                }}
                transition={{ type: "spring", stiffness: 250, damping: 35, mass: 0.8 }}
            />
        </>
    );
}
