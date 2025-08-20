import React, { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ThemeToggle = () => {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
    );

    const isDark = theme === "dark";

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const handleToggle = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    // Animation variants
    const containerVariants = {
        light: { 
            backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(244, 114, 182, 0.1)",
            borderColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(244, 114, 182, 0.3)",
            boxShadow: isDark 
                ? "0 0 20px rgba(99, 102, 241, 0.3)" 
                : "0 0 20px rgba(244, 114, 182, 0.3)",
            transition: { duration: 0.5, ease: "easeInOut" }
        },
        dark: { 
            backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(244, 114, 182, 0.1)",
            borderColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(244, 114, 182, 0.3)",
            boxShadow: isDark 
                ? "0 0 20px rgba(99, 102, 241, 0.3)" 
                : "0 0 20px rgba(244, 114, 182, 0.3)",
            transition: { duration: 0.5, ease: "easeInOut" }
        }
    };

    const iconVariants = {
        hidden: { 
            opacity: 0, 
            scale: 0.5, 
            rotate: -180,
            transition: { duration: 0.3 }
        },
        visible: { 
            opacity: 1, 
            scale: 1, 
            rotate: 0,
            transition: { duration: 0.4, ease: "backOut" }
        },
        hover: { 
            scale: 1.1, 
            rotate: 15,
            transition: { duration: 0.2 }
        }
    };

    const glowVariants = {
        animate: {
            boxShadow: [
                `0 0 10px ${isDark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(244, 114, 182, 0.3)'}`,
                `0 0 25px ${isDark ? 'rgba(99, 102, 241, 0.6)' : 'rgba(244, 114, 182, 0.6)'}`,
                `0 0 10px ${isDark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(244, 114, 182, 0.3)'}`
            ],
            transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }
    };

    const backgroundParticles = Array.from({ length: 6 }, (_, i) => (
        <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
                isDark ? 'bg-indigo-400/40' : 'bg-pink-400/40'
            }`}
            style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
            }}
            animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 1.2, 0.5],
                x: [0, Math.random() * 20 - 10, 0],
                y: [0, Math.random() * 20 - 10, 0],
            }}
            transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
            }}
        />
    ));

    return (
        <motion.div
            className="relative group"
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
        >
            {/* Background Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
                {backgroundParticles}
            </div>

            {/* Main Toggle Button */}
            <motion.button
                onClick={handleToggle}
                className={`relative w-12 h-12 rounded-full border-2 backdrop-blur-md transition-all duration-500 ${
                    isDark 
                        ? 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30' 
                        : 'bg-white/70 border-pink-200/50 hover:bg-white/90 hover:border-pink-300/70'
                } focus:outline-none focus:ring-2 ${
                    isDark ? 'focus:ring-indigo-400/50' : 'focus:ring-pink-400/50'
                } overflow-hidden group-hover:shadow-xl`}
                variants={containerVariants}
                animate={theme}
                whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                }}
            >
                {/* Animated Background Gradient */}
                <motion.div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${
                        isDark 
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-500' 
                            : 'bg-gradient-to-br from-pink-500 to-rose-500'
                    }`}
                    animate={{
                        rotate: [0, 360],
                        scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />

                {/* Icon Container */}
                <div className="relative z-10 flex items-center justify-center w-full h-full">
                    <AnimatePresence mode="wait">
                        {isDark ? (
                            <motion.div
                                key="moon"
                                variants={iconVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                whileHover="hover"
                                className="flex items-center justify-center"
                            >
                                <FaMoon className={`w-5 h-5 ${
                                    isDark ? 'text-indigo-300' : 'text-slate-600'
                                } drop-shadow-lg`} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="sun"
                                variants={iconVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                whileHover="hover"
                                className="flex items-center justify-center"
                            >
                                <FaSun className="w-5 h-5 text-yellow-400 drop-shadow-lg" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Ripple Effect on Click */}
                <motion.div
                    className={`absolute inset-0 rounded-full ${
                        isDark ? 'bg-indigo-400/20' : 'bg-pink-400/20'
                    } opacity-0`}
                    whileTap={{ 
                        opacity: [0, 0.3, 0],
                        scale: [0, 1.5, 2],
                        transition: { duration: 0.6 }
                    }}
                />

                {/* Pulsing Ring */}
                <motion.div
                    className={`absolute inset-0 rounded-full border-2 ${
                        isDark ? 'border-indigo-400/30' : 'border-pink-400/30'
                    } opacity-0 group-hover:opacity-100`}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.button>

            {/* Floating Icons Animation */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
                <motion.div
                    className={`absolute -top-2 -right-2 w-3 h-3 ${
                        isDark ? 'text-indigo-400/40' : 'text-pink-400/40'
                    }`}
                    animate={{
                        y: [0, -8, 0],
                        opacity: [0.4, 0.8, 0.4],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    {isDark ? <FaMoon className="w-3 h-3" /> : <FaSun className="w-3 h-3" />}
                </motion.div>
                
                <motion.div
                    className={`absolute -bottom-2 -left-2 w-2 h-2 ${
                        isDark ? 'text-purple-400/40' : 'text-rose-400/40'
                    }`}
                    animate={{
                        y: [0, 6, 0],
                        opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                    {isDark ? <FaSun className="w-2 h-2" /> : <FaMoon className="w-2 h-2" />}
                </motion.div>
            </motion.div>

            {/* Glow Effect */}
            <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                variants={glowVariants}
                animate="animate"
            />

            {/* Tooltip */}
            <motion.div
                className={`absolute -bottom-10 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap pointer-events-none ${
                    isDark 
                        ? 'bg-gray-800/90 text-gray-200 border border-white/10' 
                        : 'bg-white/90 text-gray-700 border border-gray-200/50'
                } backdrop-blur-md shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300`}
                initial={{ y: 5, opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
            >
                Switch to {isDark ? 'Light' : 'Dark'} Mode
                <motion.div 
                    className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 ${
                        isDark ? 'bg-gray-800/90' : 'bg-white/90'
                    }`}
                />
            </motion.div>
        </motion.div>
    );
};

export default ThemeToggle;