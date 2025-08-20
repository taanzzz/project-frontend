import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft, FaArrowRight, FaBookOpen, FaHeart, FaUsers } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay, Navigation } from 'swiper/modules';
import { useMediaQuery } from '@react-hook/media-query';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import axiosSecure from './../api/Axios';
import LoadingSpinner from './Shared/LoadingSpinner';

// --- Library Card ---
const LibraryCard = ({ item, isDark }) => (
    <motion.div 
        className="w-full h-full group overflow-hidden rounded-2xl sm:rounded-3xl relative block shadow-2xl"
        whileHover={{ y: -10, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
        {/* Background Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? 'from-indigo-500/20 to-purple-500/20' : 'from-pink-500/20 to-rose-500/20'} rounded-2xl sm:rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-0 group-hover:opacity-100`} />
        
        <div className={`relative w-full h-full bg-gradient-to-br ${isDark ? 'from-gray-900/95 via-indigo-950/95 to-purple-900/95' : 'from-white/95 via-pink-50/95 to-rose-50/95'} backdrop-blur-md rounded-2xl sm:rounded-3xl border ${isDark ? 'border-white/10' : 'border-pink-200/50'}`}>
            <img 
                src={item.coverImage || 'https://i.imgur.com/placeholder-book.jpg'} 
                alt={item.title} 
                className="w-full h-3/5 object-cover transition-transform duration-500 group-hover:scale-105 rounded-t-2xl sm:rounded-t-3xl"
            />
            
            {item.averageRating > 0 && (
                <motion.div 
                    className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                >
                    <FaStar className="text-xs" />
                    <span>{item.averageRating.toFixed(1)}</span>
                </motion.div>
            )}
            
            <div className="p-6 space-y-4 flex flex-col justify-between h-2/5">
                <div>
                    <h3 className={`text-lg sm:text-xl font-bold leading-tight mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                        <FaBookOpen className={`text-sm ${isDark ? 'text-indigo-400' : 'text-pink-500'}`} />
                        <span className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Premium Literature
                        </span>
                    </div>
                </div>
                
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link 
                        to={`/library/item/${item._id}`} 
                        className={`inline-flex items-center gap-2 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-300 shadow-lg ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white hover:shadow-indigo-500/30' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white hover:shadow-rose-500/30'} hover:shadow-xl`}
                    >
                        <FaBookOpen className="text-xs" />
                        Explore Book
                        <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                </motion.div>
            </div>
        </div>
    </motion.div>
);

// --- Mindfulness Card ---
const MindfulnessCard = ({ item, isDark }) => (
    <motion.div 
        className="w-full h-full group overflow-hidden rounded-2xl sm:rounded-3xl relative block shadow-2xl"
        whileHover={{ y: -10, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
        {/* Background Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? 'from-purple-500/20 to-cyan-500/20' : 'from-rose-500/20 to-orange-500/20'} rounded-2xl sm:rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-0 group-hover:opacity-100`} />
        
        <div className={`relative w-full h-full bg-gradient-to-br ${isDark ? 'from-gray-900/95 via-purple-950/95 to-cyan-900/95' : 'from-white/95 via-rose-50/95 to-orange-50/95'} backdrop-blur-md rounded-2xl sm:rounded-3xl border ${isDark ? 'border-white/10' : 'border-rose-200/50'}`}>
            <img 
                src={item.thumbnailUrl || 'https://i.imgur.com/placeholder-mindfulness.jpg'} 
                alt={item.title} 
                className="w-full h-3/5 object-cover transition-transform duration-500 group-hover:scale-105 rounded-t-2xl sm:rounded-t-3xl"
            />
            
            <div className={`absolute top-0 left-0 w-full h-3/5 bg-gradient-to-t ${isDark ? 'from-black/40 to-transparent' : 'from-black/30 to-transparent'} rounded-t-2xl sm:rounded-t-3xl`} />
            
            <div className="p-6 space-y-4 flex flex-col justify-between h-2/5">
                <div>
                    <h3 className={`text-lg sm:text-xl font-bold leading-tight mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                        <FaHeart className={`text-sm ${isDark ? 'text-purple-400' : 'text-rose-500'}`} />
                        <span className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Mindfulness Session
                        </span>
                    </div>
                </div>
                
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link 
                        to={`/mindfulness-zone`} 
                        className={`inline-flex items-center gap-2 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-300 shadow-lg ${isDark ? 'bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white hover:shadow-purple-500/30' : 'bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white hover:shadow-rose-500/30'} hover:shadow-xl`}
                    >
                        <FaHeart className="text-xs" />
                        Start Session
                        <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                </motion.div>
            </div>
        </div>
    </motion.div>
);

// --- Community Card ---
const CommunityCard = ({ item, isDark }) => (
    <motion.div 
        className={`w-full h-full flex flex-col p-6 sm:p-8 rounded-2xl sm:rounded-3xl transition-all duration-300 shadow-2xl ${isDark ? 'bg-gradient-to-br from-gray-900/95 via-indigo-950/95 to-gray-900/95 border border-white/10' : 'bg-gradient-to-br from-white/95 via-pink-50/95 to-white/95 border border-pink-200/50'} backdrop-blur-md group hover:scale-[1.02] hover:shadow-3xl`}
        whileHover={{ y: -10 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
        {/* Background Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? 'from-indigo-500/10 to-purple-500/10' : 'from-pink-500/10 to-rose-500/10'} rounded-2xl sm:rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-0 group-hover:opacity-100`} />
        
        <div className="relative z-10 flex items-center gap-4 mb-6">
            <motion.img 
                src={item.authorInfo?.avatar || 'https://i.imgur.com/avatar-placeholder.jpg'} 
                alt={item.authorInfo?.name || 'Author'} 
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-3 shadow-lg ${isDark ? 'border-indigo-400/50' : 'border-pink-300/50'}`}
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400 }}
            />
            <div className="flex-1">
                <h4 className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {item.authorInfo?.name || 'Unknown Author'}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                    <FaUsers className={`text-xs ${isDark ? 'text-indigo-400' : 'text-pink-500'}`} />
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Community Discussion
                    </p>
                </div>
            </div>
        </div>
        
        <div className="flex-grow relative z-10 mb-6">
            <FaQuoteLeft className={`mb-3 text-lg ${isDark ? 'text-indigo-400/70' : 'text-pink-400/70'}`} />
            <p className={`text-sm sm:text-base line-clamp-5 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {item.content}
            </p>
        </div>
        
        <motion.div
            className="relative z-10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <Link 
                to={`/post/${item._id}`} 
                className={`inline-flex items-center gap-2 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-300 shadow-lg ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white hover:shadow-indigo-500/30' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white hover:shadow-pink-500/30'} hover:shadow-xl ml-auto`}
            >
                Join Discussion
                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
        </motion.div>
    </motion.div>
);

// --- Card Dispatcher ---
const FeaturedCard = ({ item, isDark }) => {
    switch (item.category) {
        case 'Library': return <LibraryCard item={item} isDark={isDark} />;
        case 'Mindfulness': return <MindfulnessCard item={item} isDark={isDark} />;
        case 'Community': return <CommunityCard item={item} isDark={isDark} />;
        default: return null;
    }
};

// --- Main Carousel Component ---
const FeaturedContentCarousel = () => {
    const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'light');
    const isDark = theme === 'dark';
    const isMobile = useMediaQuery('(max-width: 768px)');

    React.useEffect(() => {
        const observer = new MutationObserver(() => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            setTheme(currentTheme);
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        return () => observer.disconnect();
    }, []);

    const { data: featuredContent = [], isLoading } = useQuery({
        queryKey: ['featured-content'],
        queryFn: async () => (await axiosSecure.get('/api/home/featured')).data
    });

    const fadeUp = isMobile
        ? {
              hidden: { opacity: 0, y: 10 },
              visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.3, ease: 'easeOut' }
              }
          }
        : {
              hidden: { opacity: 0, y: 50 },
              visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.8, ease: 'easeOut' }
              }
          };

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-b from-gray-900 via-indigo-950 to-gray-900' : 'bg-gradient-to-b from-pink-50 via-rose-50 to-pink-50'} py-16 sm:py-24`}>
            {/* Background Gradient Orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute top-20 left-1/4 w-96 h-96 ${isDark ? 'bg-indigo-500/20' : 'bg-pink-400/20'} rounded-full blur-3xl ${isMobile ? '' : 'animate-pulse'}`} />
                <div className={`absolute bottom-20 right-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/20' : 'bg-rose-400/20'} rounded-full blur-3xl ${isMobile ? '' : 'animate-pulse delay-1000'}`} />
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 ${isDark ? 'bg-cyan-500/10' : 'bg-orange-400/10'} rounded-full blur-3xl ${isMobile ? '' : 'animate-pulse delay-500'}`} />
            </div>

            {/* Custom Swiper Styles */}
            <style>
                {`
                    .swiper-button-next, .swiper-button-prev {
                        --swiper-navigation-size: 22px;
                        width: 50px;
                        height: 50px;
                        background: ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)'};
                        border-radius: 50%;
                        color: ${isDark ? '#a5b4fc' : '#f43f5e'};
                        transition: all 0.3s ease;
                        backdrop-filter: blur(10px);
                        border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(244, 63, 94, 0.1)'};
                    }
                    .swiper-button-next:hover, .swiper-button-prev:hover {
                        background: ${isDark ? 'rgba(165, 180, 252, 0.2)' : 'rgba(244, 63, 94, 0.1)'};
                        transform: scale(1.1);
                        box-shadow: ${isDark ? '0 10px 25px rgba(165, 180, 252, 0.3)' : '0 10px 25px rgba(244, 63, 94, 0.3)'};
                    }
                    .swiper-pagination-bullet {
                        width: 12px;
                        height: 12px;
                        background: ${isDark ? 'rgba(165, 180, 252, 0.4)' : 'rgba(244, 63, 94, 0.4)'};
                        opacity: 1;
                        transition: all 0.3s ease;
                    }
                    .swiper-pagination-bullet-active {
                        background: ${isDark ? '#a5b4fc' : '#f43f5e'};
                        transform: scale(1.3);
                        box-shadow: ${isDark ? '0 4px 12px rgba(165, 180, 252, 0.5)' : '0 4px 12px rgba(244, 63, 94, 0.5)'};
                    }
                `}
            </style>
            
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div 
                    className="text-center mb-12 sm:mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeUp}
                >
                    <motion.div 
                        className="inline-flex items-center gap-3 mb-6"
                        whileHover={isMobile ? {} : { scale: 1.05 }}
                        transition={isMobile ? {} : { type: 'spring', stiffness: 300 }}
                    >
                        <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-indigo-400' : 'bg-pink-500'} ${isMobile ? '' : 'animate-pulse'}`} />
                        <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-purple-400' : 'bg-rose-500'} ${isMobile ? '' : 'animate-pulse delay-200'}`} />
                        <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-cyan-400' : 'bg-orange-500'} ${isMobile ? '' : 'animate-pulse delay-400'}`} />
                    </motion.div>

                    <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-indigo-400 via-purple-400 to-cyan-400' : 'from-pink-600 via-rose-600 to-orange-600'} drop-shadow-2xl tracking-tight`}>
                        Discover Our Universe
                    </h2>
                    <p className={`text-lg sm:text-xl lg:text-2xl ${isDark ? 'text-gray-300' : 'text-gray-700'} font-light max-w-3xl mx-auto leading-relaxed px-4`}>
                        Highlights from our <span className={`font-bold ${isDark ? 'text-indigo-400' : 'text-pink-600'}`}>library</span>, 
                        <span className={`font-bold ${isDark ? 'text-purple-400' : 'text-rose-600'} mx-2`}>mindfulness zone</span>, and 
                        <span className={`font-bold ${isDark ? 'text-cyan-400' : 'text-orange-600'}`}> community discussions</span>
                    </p>
                </motion.div>
                
                <motion.div
                    initial={isMobile ? { opacity: 0, scale: 0.95 } : { opacity: 0, scale: 0.9 }}
                    whileInView={isMobile ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={isMobile ? { delay: 0.2, duration: 0.4 } : { delay: 0.5, duration: 0.8 }}
                >
                    <Swiper
                        effect={'coverflow'}
                        grabCursor={true}
                        centeredSlides={true}
                        loop={true}
                        autoplay={{ 
                            delay: 4000, 
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true 
                        }}
                        coverflowEffect={{ 
                            rotate: 0, 
                            stretch: 80, 
                            depth: 200, 
                            modifier: 1, 
                            slideShadows: false 
                        }}
                        pagination={{ 
                            clickable: true,
                            dynamicBullets: true 
                        }}
                        navigation={true}
                        modules={[EffectCoverflow, Pagination, Autoplay, Navigation]}
                        className="!pb-16 sm:!pb-20"
                        slidesPerView={1.1}
                        spaceBetween={20}
                        breakpoints={{
                            480: { slidesPerView: 1.2, spaceBetween: 20 },
                            640: { slidesPerView: 2, spaceBetween: 30 },
                            1024: { slidesPerView: 3, spaceBetween: 40 },
                            1280: { slidesPerView: 3.2, spaceBetween: 50 },
                        }}
                    >
                        {featuredContent.map((item, index) => (
                            <SwiperSlide key={item._id} className="h-[450px] sm:h-[500px]">
                                <motion.div
                                    initial={isMobile ? { opacity: 0, y: 20 } : { opacity: 0, y: 50 }}
                                    whileInView={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={isMobile ? 
                                        { delay: index * 0.1, duration: 0.3 } : 
                                        { delay: index * 0.2, duration: 0.6 }
                                    }
                                    className="h-full"
                                >
                                    <FeaturedCard item={item} isDark={isDark} />
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </motion.div>
            </div>
        </div>
    );
};

export default FeaturedContentCarousel;