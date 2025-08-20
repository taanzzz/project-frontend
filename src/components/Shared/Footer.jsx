import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { FaHeart, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@react-hook/media-query';

const Footer = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const isDark = theme === 'dark';
    const isMobile = useMediaQuery('(max-width: 768px)');
    const logoUrl = 'https://res.cloudinary.com/dwkj2w1ds/image/upload/v1754430112/ChatGPT_Image_Jul_21_2025_02_09_35_PM_k1fju4.png';

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

    // Animated Logo Sub-Component
    const AnimatedLogo = ({ size = 'w-16 h-16' }) => (
        <motion.div
            className={`relative ${size} rounded-full overflow-hidden shadow-lg ${isDark ? 'bg-gradient-to-br from-indigo-600 to-purple-600 group-hover:from-purple-600 group-hover:to-indigo-600' : 'bg-gradient-to-br from-pink-600 to-rose-600 group-hover:from-rose-600 group-hover:to-pink-600'} transition-all duration-300`}
            style={{
                maskImage: `url(${logoUrl})`,
                WebkitMaskImage: `url(${logoUrl})`,
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center',
            }}
            whileHover={isMobile ? {} : { scale: 1.1, rotate: 360 }}
            whileTap={isMobile ? {} : { scale: 0.95 }}
            transition={isMobile ? {} : { duration: 0.5 }}
        ></motion.div>
    );

    // Card Variants for Animation
    const cardVariants = isMobile
        ? {
              hidden: { opacity: 0, y: 10, rotate: 0 },
              visible: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.3, ease: 'easeOut' } },
              hover: { scale: 1, rotate: 0, transition: { duration: 0.2 } }
          }
        : {
              hidden: { opacity: 0, y: 50, rotate: 5 },
              visible: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.8, ease: 'easeOut' } },
              hover: { scale: 1.05, rotate: -2, transition: { duration: 0.3 } }
          };

    return (
        <motion.footer
            className={`relative py-16 sm:py-24 overflow-hidden ${isDark ? 'bg-gradient-to-b from-gray-900 to-indigo-950' : 'bg-gradient-to-b from-pink-50 to-rose-50 bg-white/70 backdrop-blur-md'} min-h-[400px]`}
            initial={isMobile ? { opacity: 0 } : { opacity: 0 }}
            whileInView={isMobile ? { opacity: 1 } : { opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={isMobile ? { duration: 0.3 } : { duration: 1 }}
        >
            {/* Background Gradient Orbs */}
            <div className="absolute inset-0">
                {!isMobile && (
                    <>
                        <div className={`absolute top-0 left-1/4 w-96 h-96 ${isDark ? 'bg-indigo-500/30' : 'bg-pink-400/20'} rounded-full blur-3xl animate-pulse`}></div>
                        <div className={`absolute bottom-0 right-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/30' : 'bg-rose-400/20'} rounded-full blur-3xl animate-pulse delay-1000`}></div>
                    </>
                )}
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    className="text-center mb-12 sm:mb-16"
                    initial={isMobile ? { opacity: 0, y: -10 } : { opacity: 0, y: -30 }}
                    whileInView={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={isMobile ? { duration: 0.3, ease: 'easeOut' } : { duration: 0.8, ease: 'easeOut' }}
                >
                    <h2 className={`text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent text-shadow-sm ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}>
                        Stay Connected
                    </h2>
                    <p className={`text-lg sm:text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-4 max-w-2xl mx-auto`}>
                        Join our community, explore our offerings, and grow with us.
                    </p>
                </motion.div>

                {/* Card-Based Layout */}
                <div className="relative flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8">
                    {/* Brand Card */}
                    <motion.div
                        className={`w-full max-w-md ${isDark ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30 backdrop-blur-md hover:bg-white/90'} rounded-3xl p-8 border shadow-lg transform ${isMobile ? '' : 'lg:-rotate-3'} transition-all duration-300 ${isMobile ? '' : 'hover:scale-[1.02]'}`}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        whileHover="hover"
                        viewport={{ once: true, amount: 0.5 }}
                        transition={isMobile ? { delay: 0.1 } : { delay: 0.2 }}
                    >
                        <div className="flex flex-col items-center text-center">
                            <AnimatedLogo size="w-20 h-20" />
                            <h3 className={`text-2xl font-bold mt-6 bg-clip-text text-transparent text-shadow-sm ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}>Mind Over Myth</h3>
                            <p className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-2`}>Philosophy & Design for the Modern Thinker.</p>
                            <div className="mt-6">
                                <h4 className={`font-semibold ${isDark ? 'text-indigo-400' : 'text-pink-600'}`}>Support Our Mission</h4>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Your contribution fuels our community’s growth.</p>
                                <motion.div
                                    whileHover={isMobile ? {} : { scale: 1.05 }}
                                    whileTap={isMobile ? {} : { scale: 0.95 }}
                                    className="mt-4"
                                >
                                    <Link
                                        to="/donate"
                                        className={`btn btn-sm border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'} rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl ${isDark ? 'shadow-indigo-500/30' : 'shadow-pink-500/30'}`}
                                    >
                                        <FaHeart className="mr-2" /> Support Us
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Navigation Card */}
                    <motion.div
                        className={`w-full max-w-md ${isDark ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30 backdrop-blur-md hover:bg-white/90'} rounded-3xl p-8 border shadow-lg transform ${isMobile ? '' : 'lg:rotate-3'} transition-all duration-300 ${isMobile ? '' : 'hover:scale-[1.02]'}`}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        whileHover="hover"
                        viewport={{ once: true, amount: 0.5 }}
                        transition={isMobile ? { delay: 0.2 } : { delay: 0.4 }}
                    >
                        <div className="grid grid-cols-2 gap-6 sm:gap-8">
                            <nav className="flex flex-col gap-3 sm:gap-4">
                                <h6 className={`text-lg font-bold bg-clip-text text-transparent text-shadow-sm ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}>Explore</h6>
                                <Link to="/community" className={`text-base ${isDark ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-pink-600'} transition-colors`}>Community</Link>
                                <Link to="/library" className={`text-base ${isDark ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-pink-600'} transition-colors`}>The Library</Link>
                                <Link to="/mindfulness" className={`text-base ${isDark ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-pink-600'} transition-colors`}>Mindfulness</Link>
                                <Link to="/gaming-zone" className={`text-base ${isDark ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-pink-600'} transition-colors`}>Gaming Zone</Link>
                            </nav>
                            <nav className="flex flex-col gap-3 sm:gap-4">
                                <h6 className={`text-lg font-bold bg-clip-text text-transparent text-shadow-sm ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}>Connect</h6>
                                <Link to="/about" className={`text-base ${isDark ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-pink-600'} transition-colors`}>About Us</Link>
                                <Link to="/store" className={`text-base ${isDark ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-pink-600'} transition-colors`}>Store</Link>
                                <Link to="/contact" className={`text-base ${isDark ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-pink-600'} transition-colors`}>Contact</Link>
                            </nav>
                        </div>
                    </motion.div>

                    {/* Partnership Card */}
                    <motion.div
                        className={`w-full max-w-md ${isDark ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30 backdrop-blur-md hover:bg-white/90'} rounded-3xl p-8 border shadow-lg transform ${isMobile ? '' : 'lg:-rotate-3'} transition-all duration-300 ${isMobile ? '' : 'hover:scale-[1.02]'}`}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        whileHover="hover"
                        viewport={{ once: true, amount: 0.5 }}
                        transition={isMobile ? { delay: 0.3 } : { delay: 0.6 }}
                    >
                        <div className="flex flex-col items-center text-center">
                            <h6 className={`text-xl font-bold bg-clip-text text-transparent text-shadow-sm ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}>Grow With Us</h6>
                            <p className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-600'} my-3`}>Connect with our mindful audience through sponsorships or product sales.</p>
                            <div className="flex flex-col gap-3 w-full">
                                <motion.div
                                    whileHover={isMobile ? {} : { scale: 1.05 }}
                                    whileTap={isMobile ? {} : { scale: 0.95 }}
                                    className="mt-2"
                                >
                                    <Link
                                        to="/sponsorship"
                                        className={`btn btn-sm border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'} rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl ${isDark ? 'shadow-indigo-500/30' : 'shadow-pink-500/30'}`}
                                    >
                                        Become a Sponsor
                                    </Link>
                                </motion.div>
                                <motion.div
                                    whileHover={isMobile ? {} : { scale: 1.05 }}
                                    whileTap={isMobile ? {} : { scale: 0.95 }}
                                    className="mt-2"
                                >
                                    <Link
                                        to="/sell-with-us"
                                        className={`btn btn-sm btn-outline ${isDark ? 'border-indigo-500 text-indigo-400 hover:bg-indigo-500/20' : 'border-pink-500 text-pink-600 hover:bg-pink-500/20'} rounded-xl transition-all duration-300`}
                                    >
                                        Sell Your Products
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Sub-Footer */}
                <motion.div
                    className={`mt-12 sm:mt-16 pt-8 border-t ${isDark ? 'border-white/20' : 'border-pink-200/50'} flex flex-col sm:flex-row justify-between items-center text-center gap-4 sm:gap-6`}
                    initial={isMobile ? { opacity: 0, y: 10 } : { opacity: 0, y: 30 }}
                    whileInView={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={isMobile ? { duration: 0.3, ease: 'easeOut', delay: 0.4 } : { duration: 0.8, ease: 'easeOut', delay: 0.8 }}
                >
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>&copy; {new Date().getFullYear()} Mind Over Myth. All Rights Reserved.</p>
                    <div className="flex justify-center gap-5 sm:gap-6">
                        <a href="#" className={`${isDark ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-pink-600'} transition-colors`}><FaTwitter className="text-xl" /></a>
                        <a href="#" className={`${isDark ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-pink-600'} transition-colors`}><FaInstagram className="text-xl" /></a>
                        <a href="#" className={`${isDark ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-pink-600'} transition-colors`}><FaLinkedinIn className="text-xl" /></a>
                    </div>
                </motion.div>
            </div>
        </motion.footer>
    );
};

export default Footer;