import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaArrowRight } from "react-icons/fa";
import { useMediaQuery } from '@react-hook/media-query';

const HeroSection = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const { scrollYProgress } = useScroll();
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Sync theme with localStorage and data-theme
    useEffect(() => {
        const handleStorageChange = () => {
            setTheme(localStorage.getItem('theme') || 'light');
        };

        window.addEventListener('storage', handleStorageChange);
        const observer = new MutationObserver(() => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            setTheme(currentTheme);
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            observer.disconnect();
        };
    }, []);

    const textOpacity = useTransform(scrollYProgress, [0, 0.15], isMobile ? [1, 1] : [1, 0]);
    const textY = useTransform(scrollYProgress, [0, 0.15], isMobile ? [0, 0] : [0, -100]);
    const lottieScale = useTransform(scrollYProgress, [0, 0.2], isMobile ? [1, 1] : [1, 1.5]);

    // Word-by-word animation
    const title = "Mind Over Myth";
    const titleWords = title.split(" ");

    const titleContainerVariants = isMobile
        ? {
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.3 } }
          }
        : {
              hidden: { opacity: 0 },
              visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15, delayChildren: 0.2 }
              }
          };

    const wordVariants = isMobile
        ? {
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.2 } }
          }
        : {
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
          };

    const isDark = theme === 'dark';

    return (
        <div className={`hero relative overflow-hidden 
            ${isDark ? 'bg-gradient-to-b from-indigo-950 to-purple-950 bg-black/10' : 'bg-gradient-to-b from-rose-50 to-pink-50 bg-white/80'} 
            backdrop-blur-lg
            min-h-[50vh] sm:min-h-screen
        `}>
            
            {/* Image Background */}
            <motion.div 
                className="absolute inset-0 w-full h-full z-0 flex items-center justify-center opacity-20 dark:opacity-10"
                style={{ scale: lottieScale }}
                animate={isMobile ? {} : { y: [0, -10, 0] }}
                transition={isMobile ? {} : { duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            >
                <img
                    src="https://res.cloudinary.com/dwkj2w1ds/image/upload/v1755154645/undraw_team-work_i1f3_mbjyae.png"
                    alt="Team Collaboration Illustration"
                    className="w-[120%] h-[120%] sm:object-cover md:w-[120%] md:h-[120%] lg:w-[150%] lg:h-[150%] max-w-none max-h-none"
                    loading="lazy"
                />
            </motion.div>
            
            <div className={`hero-overlay bg-gradient-to-t ${isDark ? 'from-indigo-950/80 via-indigo-950/60 to-transparent' : 'from-rose-50/80 via-rose-50/60 to-transparent'}`}></div>

            {/* Animated Content */}
            <motion.div 
                className="hero-content text-center text-neutral-content z-10 px-4 sm:px-6 lg:px-8"
                style={{ opacity: textOpacity, y: textY }}
            >
                <div className="max-w-xl sm:max-w-2xl lg:max-w-4xl mx-auto">
                    {/* H1 with Word-by-Word Animation & Gradient */}
                    <motion.h1 
                        className={`mb-4 sm:mb-6 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-shadow-xl bg-clip-text text-transparent relative ${isDark ? 'bg-gradient-to-r from-indigo-300 to-purple-300 shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'bg-gradient-to-r from-pink-400 to-rose-400 shadow-[0_0_20px_rgba(244,114,182,0.4)] after:content-[""] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-1 after:bg-gradient-to-r after:from-pink-400 after:to-rose-400 after:opacity-60 after:blur-md'}`}
                        style={{ color: isDark ? '#A5B4FC' : '#EC4899', WebkitBackgroundClip: 'text' }}
                        variants={titleContainerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {titleWords.map((word, index) => (
                            <motion.span
                                key={index}
                                variants={wordVariants}
                                className="inline-block mr-2 sm:mr-4"
                                whileHover={isMobile ? {} : { scale: 1.05 }}
                                animate={isMobile ? {} : { scale: [1, 1.1, 1], rotate: [0, 2, -2, 0], opacity: [1, 0.8, 1] }}
                                transition={isMobile ? {} : { duration: 2, repeat: Infinity, repeatType: "mirror", delay: index * 0.2 }}
                            >
                                {word}
                            </motion.span>
                        ))}
                    </motion.h1>
                    
                    <motion.p 
                        className={`mb-4 sm:mb-8 text-base sm:text-lg md:text-xl lg:text-2xl ${isDark ? 'text-gray-200' : 'text-gray-700'} max-w-md sm:max-w-lg md:max-w-xl mx-auto leading-relaxed`}
                        initial={isMobile ? { opacity: 0 } : { opacity: 0 }}
                        animate={isMobile ? { opacity: 1 } : { opacity: 1 }}
                        transition={isMobile ? { duration: 0.3, delay: 0.3 } : { duration: 0.8, delay: 0.8 }}
                    >
                        Uncover profound insights and connect with a community dedicated to mindful living and philosophical exploration. Your journey to clarity begins here.
                    </motion.p>
                    
                    <motion.div
                        initial={isMobile ? { opacity: 0, y: 10 } : { opacity: 0, y: 20 }}
                        animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                        transition={isMobile ? { duration: 0.3, delay: 0.4, ease: "easeOut" } : { duration: 0.8, delay: 1, ease: "easeOut" }}
                    >
                        <Link 
                            to="/library" 
                            className={`btn btn-lg border-none text-white bg-gradient-to-r rounded-2xl ${isDark ? 'from-indigo-500 to-purple-500 shadow-indigo-500/40 hover:from-indigo-600 hover:to-purple-600 shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_20px_rgba(99,102,241,0.6)]' : 'from-pink-600 to-rose-600 shadow-pink-600/40 hover:from-pink-700 hover:to-rose-700 shadow-[0_0_15px_rgba(244,114,182,0.4)] hover:shadow-[0_0_20px_rgba(244,114,182,0.6)]'} group shadow-xl transform ${isMobile ? '' : 'hover:scale-105'} transition-transform duration-300`}
                        >
                            Start Your Journey 
                            <FaArrowRight className={`transition-transform duration-300 ${isMobile ? '' : 'group-hover:translate-x-1'}`} />
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default HeroSection;