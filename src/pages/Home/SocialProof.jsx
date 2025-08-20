import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaQuoteLeft, FaRegCommentDots, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Custom hook for responsive animations
const useResponsiveAnimation = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkDevice = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkDevice();
        window.addEventListener('resize', checkDevice);
        return () => window.removeEventListener('resize', checkDevice);
    }, []);

    return isMobile;
};

// Animation variants
const getAnimationProps = (isMobile) => ({
    fadeInUp: {
        initial: isMobile ? { opacity: 0.8 } : { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: isMobile 
            ? { duration: 0.2, ease: 'linear' }
            : { duration: 0.8, ease: 'easeOut' }
    },
    fadeIn: {
        initial: isMobile ? { opacity: 0.9 } : { opacity: 0 },
        animate: { opacity: 1 },
        transition: isMobile 
            ? { duration: 0.15 }
            : { duration: 0.5 }
    },
    hover: isMobile ? {} : { scale: 1.02 },
    tap: isMobile ? {} : { scale: 0.98 }
});

// Star Rating Component
const StarRating = ({ rating }) => {
    const totalStars = 5;
    const stars = [];
    for (let i = 1; i <= totalStars; i++) {
        if (i <= rating) {
            stars.push(<FaStar key={i} />);
        } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
            stars.push(<FaStarHalfAlt key={i} />);
        } else {
            stars.push(<FaRegStar key={i} />);
        }
    }
    return <div className="flex items-center gap-1 text-amber-500">{stars}</div>;
};

// Review Skeleton Component
const ReviewSkeleton = ({ isDark, isMobile }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {[...Array(3)].map((_, i) => (
            <motion.div
                key={i}
                className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl ${
                    isMobile ? 'animate-pulse' : 'animate-pulse'
                } ${
                    isDark 
                        ? 'bg-white/10 border border-white/20' 
                        : 'bg-white/80 border border-pink-200/50 backdrop-blur-md'
                } shadow-xl`}
                initial={isMobile ? {} : { opacity: 0, scale: 0.9 }}
                animate={isMobile ? {} : { opacity: 1, scale: 1 }}
                transition={isMobile ? {} : { duration: 0.3, delay: i * 0.1 }}
            >
                <div className="flex items-center mb-4">
                    <div className={`w-12 sm:w-14 h-12 sm:h-14 rounded-full ${
                        isDark ? 'bg-gray-700' : 'bg-gray-200'
                    } mr-3 sm:mr-4`}></div>
                    <div className="flex-1">
                        <div className={`h-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded w-3/4 mb-2`}></div>
                        <div className={`h-3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/2`}></div>
                    </div>
                </div>
                <div className={`h-5 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/3 mb-4`}></div>
                <div className="space-y-2">
                    <div className={`h-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
                    <div className={`h-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded w-5/6`}></div>
                </div>
            </motion.div>
        ))}
    </div>
);

// Empty State Component
const EmptyState = ({ isDark, isMobile }) => {
    const animations = getAnimationProps(isMobile);
    
    return (
        <motion.div
            className={`text-center py-12 sm:py-16 px-4 sm:px-6 ${
                isDark 
                    ? 'bg-white/10 border border-white/20' 
                    : 'bg-white/80 border border-pink-200/50 backdrop-blur-md'
            } rounded-2xl sm:rounded-3xl shadow-xl`}
            {...animations.fadeInUp}
            whileInView={animations.fadeInUp.animate}
            viewport={{ once: true }}
        >
            <FaRegCommentDots className={`mx-auto text-4xl sm:text-5xl ${
                isDark ? 'text-gray-300' : 'text-gray-400'
            }`} />
            <h3 className={`mt-4 text-lg sm:text-xl font-semibold ${
                isDark ? 'text-gray-200' : 'text-gray-800'
            }`}>
                No Guest Reviews Yet
            </h3>
            <p className={`mt-1 text-sm sm:text-base ${
                isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
                Be the first to share your experience!
            </p>
        </motion.div>
    );
};

const ReviewSlider = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [currentSlide, setCurrentSlide] = useState(0);
    const isDark = theme === 'dark';
    const isMobile = useResponsiveAnimation();
    const animations = getAnimationProps(isMobile);

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

    const { data: socialProof, isLoading } = useQuery({
        queryKey: ['social-proof-data'],
        queryFn: async () => (await axiosSecure.get('/api/home/social-proof')).data
    });

    const reviews = socialProof?.testimonials || [];
    const totalUsers = socialProof?.stats?.totalUsers || 0;

    const slidesToShow = reviews.length >= 3 ? 3 : (reviews.length > 0 ? reviews.length : 1);

    const settings = {
        dots: true,
        infinite: reviews.length > slidesToShow,
        speed: isMobile ? 300 : 700,
        slidesToShow: slidesToShow,
        slidesToScroll: 1,
        autoplay: !isMobile,
        autoplaySpeed: 4000,
        pauseOnHover: !isMobile,
        arrows: false,
        afterChange: (current) => setCurrentSlide(current),
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: reviews.length >= 2 ? 2 : 1 } },
            { breakpoint: 768, settings: { slidesToShow: 1, speed: 300 } },
        ],
    };

    return (
        <div className={`relative py-16 sm:py-20 lg:py-24 overflow-hidden ${
            isDark 
                ? 'bg-gradient-to-b from-gray-900 to-indigo-950' 
                : 'bg-gradient-to-b from-pink-50 to-rose-50 bg-white/70 backdrop-blur-md'
        }`}>
            {/* Background Gradient Orbs - lighter on mobile */}
            <div className="absolute inset-0">
                <div className={`absolute top-0 left-1/4 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 ${
                    isDark ? 'bg-indigo-500/20 sm:bg-indigo-500/30' : 'bg-pink-400/10 sm:bg-pink-400/20'
                } rounded-full blur-2xl sm:blur-3xl ${isMobile ? '' : 'animate-pulse'}`}></div>
                <div className={`absolute bottom-0 right-1/4 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 ${
                    isDark ? 'bg-purple-500/20 sm:bg-purple-500/30' : 'bg-rose-400/10 sm:bg-rose-400/20'
                } rounded-full blur-2xl sm:blur-3xl ${isMobile ? '' : 'animate-pulse delay-1000'}`}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    className="text-center mb-12 sm:mb-16"
                    initial={isMobile ? { opacity: 0.8 } : { opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={isMobile 
                        ? { duration: 0.2 } 
                        : { duration: 0.8, ease: 'easeOut' }
                    }
                >
                    <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent ${
                        isDark 
                            ? 'bg-gradient-to-r from-indigo-400 to-purple-400' 
                            : 'bg-gradient-to-r from-pink-500 to-rose-500'
                    }`}>
                        What Our Guests Say
                    </h2>
                    <p className={`text-base sm:text-lg lg:text-xl ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                    } mt-3 sm:mt-4 max-w-2xl mx-auto px-4`}>
                        Hear from our vibrant community about their transformative experiences.
                    </p>
                </motion.div>

                {isLoading ? (
                    <ReviewSkeleton isDark={isDark} isMobile={isMobile} />
                ) : reviews.length === 0 ? (
                    <EmptyState isDark={isDark} isMobile={isMobile} />
                ) : (
                    <>
                        <style jsx>{`
                            .slick-dots {
                                bottom: -35px !important;
                            }
                            .slick-dots li {
                                margin: 0 3px;
                            }
                            .slick-dots li button:before {
                                font-size: ${isMobile ? '8px' : '10px'};
                                color: ${isDark 
                                    ? 'rgba(129, 140, 248, 0.3)' 
                                    : 'rgba(244, 114, 182, 0.3)'};
                                opacity: 1;
                                transition: ${isMobile ? 'none' : 'all 0.3s ease'};
                            }
                            .slick-dots li.slick-active button:before {
                                color: ${isDark 
                                    ? 'rgb(129, 140, 248)' 
                                    : 'rgb(244, 114, 182)'};
                                transform: ${isMobile ? 'none' : 'scale(1.5)'};
                            }
                        `}</style>
                        <Slider {...settings}>
                            {reviews.map((r, index) => (
                                <motion.div
                                    key={index}
                                    className="p-2 sm:p-3 lg:p-4 h-full"
                                    initial={isMobile 
                                        ? { opacity: 0.9 } 
                                        : { opacity: 0, y: 30 }
                                    }
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={isMobile 
                                        ? { duration: 0.2, delay: 0 } 
                                        : { duration: 0.5, delay: index * 0.1, ease: 'easeOut' }
                                    }
                                >
                                    <motion.div
                                        className={`card h-full flex flex-col transition-all ${
                                            isMobile ? 'duration-200' : 'duration-500'
                                        } ease-in-out border ${
                                            index === currentSlide
                                                ? `${isMobile ? '' : 'transform md:scale-105'} ${
                                                    isDark 
                                                        ? 'bg-white/15 border-indigo-500/50 shadow-2xl' 
                                                        : 'bg-white/90 border-pink-500/50 shadow-2xl'
                                                }`
                                                : `${
                                                    isDark 
                                                        ? 'bg-white/10 border-white/20' 
                                                        : 'bg-white/80 border-pink-200/50 backdrop-blur-md'
                                                } shadow-xl`
                                        } rounded-2xl sm:rounded-3xl overflow-hidden`}
                                        whileHover={animations.hover}
                                        whileTap={animations.tap}
                                    >
                                        <div className="card-body relative p-6 sm:p-8">
                                            <FaQuoteLeft className={`absolute top-4 right-4 text-3xl sm:text-4xl lg:text-5xl ${
                                                isDark ? 'text-indigo-500/10' : 'text-pink-500/10'
                                            }`} />
                                            <div className="flex items-center mb-4">
                                                <div className="avatar mr-3 sm:mr-4">
                                                    <div className={`w-12 sm:w-14 rounded-full ring-2 ring-offset-2 ${
                                                        isDark ? 'ring-offset-gray-900' : 'ring-offset-white'
                                                    } transition-colors ${isMobile ? 'duration-200' : 'duration-300'} ${
                                                        index === currentSlide
                                                            ? isDark
                                                                ? 'ring-indigo-400/50'
                                                                : 'ring-pink-400/50'
                                                            : 'ring-transparent'
                                                    }`}>
                                                        <img
                                                            src={r.authorInfo.avatar || `https://ui-avatars.com/api/?name=${r.authorInfo.name}&background=random`}
                                                            alt={r.authorInfo.name}
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className={`card-title text-base sm:text-lg font-bold ${
                                                        isDark ? 'text-gray-100' : 'text-gray-800'
                                                    }`}>
                                                        {r.authorInfo.name}
                                                    </h4>
                                                    <p className={`text-xs sm:text-sm ${
                                                        isDark ? 'text-gray-400' : 'text-gray-500'
                                                    }`}>
                                                        Guest
                                                    </p>
                                                </div>
                                            </div>
                                            {r.rating && (
                                                <div className="mb-3">
                                                    <StarRating rating={r.rating} />
                                                </div>
                                            )}
                                            <p className={`text-sm sm:text-base leading-relaxed italic ${
                                                isDark ? 'text-gray-300' : 'text-gray-600'
                                            }`}>
                                                <span className={`font-serif text-xl sm:text-2xl mr-1 ${
                                                    isDark ? 'text-indigo-400' : 'text-pink-600'
                                                }`}>"</span>
                                                {r.comment}
                                                <span className={`font-serif text-xl sm:text-2xl ml-1 ${
                                                    isDark ? 'text-indigo-400' : 'text-pink-600'
                                                }`}>"</span>
                                            </p>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </Slider>
                    </>
                )}

                <motion.div
                    className="mt-12 sm:mt-16 text-center"
                    initial={isMobile ? { opacity: 0.9 } : { opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={isMobile 
                        ? { duration: 0.2 } 
                        : { duration: 0.8, ease: 'easeOut' }
                    }
                >
                    <h3 className={`text-xl sm:text-2xl font-bold ${
                        isDark 
                            ? 'text-white' 
                            : 'bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent'
                    }`}>
                        Join <span className={`font-extrabold ${
                            isDark 
                                ? 'bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent' 
                                : 'bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent'
                        }`}>{totalUsers}+</span> Guests on Their Journey
                    </h3>
                </motion.div>
            </div>
        </div>
    );
};

export default ReviewSlider;