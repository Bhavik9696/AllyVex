import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Hero3D() {
    const { scrollY } = useScroll();

    // Parallax effect: moves up slightly as user scrolls down
    const yTransform = useTransform(scrollY, [0, 800], [0, -150]);
    // Fade effect: fades out smoothly as user scrolls down
    const opacityTransform = useTransform(scrollY, [0, 600], [1, 0.1]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            style={{ y: yTransform, opacity: opacityTransform }}
            className="relative w-full h-full flex items-center justify-center pointer-events-auto"
        >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-gradient-radial from-blue-600/10 via-accent/5 to-transparent blur-[60px] rounded-full z-0" />

            <iframe
                src="https://my.spline.design/robotfollowcursorforlandingpage-7794bf38e25ea281ca10962c282e9633/"
                frameBorder="0"
                width="100%"
                height="100%"
                loading="lazy"
                title="Interactive 3D Robot AI"
                className="relative z-10 w-full h-full object-contain"
            ></iframe>
        </motion.div>
    );
}
