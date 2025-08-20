import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaHeart, FaHandsHelping, FaCoffee, FaUsers, FaStar, FaServer, FaRocket, FaBookOpen, FaLightbulb, FaGlobe, FaBullhorn, FaHandshake, FaShieldAlt } from 'react-icons/fa';
import CountUp from 'react-countup';
import axiosSecure from './../api/Axios';
import { useMediaQuery } from '@react-hook/media-query';

const OurJourney = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [amount, setAmount] = useState(100);
    const isDark = theme === 'dark';
    const sponsorForm = useRef();
    const isMobile = useMediaQuery('(max-width: 768px)');
    
    const { register, handleSubmit, reset } = useForm();

    // ✅ Dynamic statistics load kora hocche
    const { data: stats } = useQuery({
        queryKey: ['platform-stats'],
        queryFn: async () => (await axiosSecure.get('/api/home/platform-stats')).data
    });

    // ✅ SSLCommerz donation-er jonno mutation
    const donationMutation = useMutation({
        mutationFn: (donationData) => axiosSecure.post('/api/payment/donate', donationData),
        onSuccess: (data) => {
            window.location.replace(data.data.url);
        },
        onError: () => toast.error("Could not initiate donation. Please try again.")
    });

    // Theme detection
    useEffect(() => {
        const observer = new MutationObserver(() => {
            setTheme(document.documentElement.getAttribute('data-theme') || 'light');
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        return () => observer.disconnect();
    }, []);

    const handleDonate = () => {
        donationMutation.mutate({ amount });
    };
    
    // ✅ Sponsor form submit korar jonno EmailJS
    const handleSponsorSubmit = (data) => {
        emailjs.sendForm(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID_SPONSOR,
            sponsorForm.current,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        )
        .then(() => {
            toast.success("Your sponsorship inquiry has been sent!");
            reset();
        }, (error) => {
            console.error("EmailJS Error:", error);
            toast.error("Failed to send inquiry. Please check your credentials.");
        });
    };

    // Animation variants
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

    const staggerContainer = isMobile
        ? {
              hidden: { opacity: 0 },
              visible: {
                  opacity: 1,
                  transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.05
                  }
              }
          }
        : {
              hidden: { opacity: 0 },
              visible: {
                  opacity: 1,
                  transition: {
                      staggerChildren: 0.2,
                      delayChildren: 0.1
                  }
              }
          };

    return (
        <div className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-b from-gray-900 via-indigo-950 to-gray-900' : 'bg-gradient-to-b from-pink-50 via-rose-50 to-pink-50'} min-h-screen`}>
            {/* Background Gradient Orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute top-20 left-1/4 w-96 h-96 ${isDark ? 'bg-indigo-500/20' : 'bg-pink-400/20'} rounded-full blur-3xl ${isMobile ? '' : 'animate-pulse'}`} />
                <div className={`absolute bottom-20 right-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/20' : 'bg-rose-400/20'} rounded-full blur-3xl ${isMobile ? '' : 'animate-pulse delay-1000'}`} />
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 ${isDark ? 'bg-cyan-500/10' : 'bg-orange-400/10'} rounded-full blur-3xl ${isMobile ? '' : 'animate-pulse delay-500'}`} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-24 sm:space-y-32">
                
                {/* Hero Section */}
                <motion.div
                    className="text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeUp}
                >
                    <motion.div 
                        className="inline-flex items-center gap-3 mb-8"
                        whileHover={isMobile ? {} : { scale: 1.05 }}
                        transition={isMobile ? {} : { type: 'spring', stiffness: 300 }}
                    >
                        <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-indigo-400' : 'bg-pink-500'} ${isMobile ? '' : 'animate-pulse'}`} />
                        <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-purple-400' : 'bg-rose-500'} ${isMobile ? '' : 'animate-pulse delay-200'}`} />
                        <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-cyan-400' : 'bg-orange-500'} ${isMobile ? '' : 'animate-pulse delay-400'}`} />
                    </motion.div>
                    
                    <h1 className={`text-4xl sm:text-6xl lg:text-8xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-indigo-400 via-purple-400 to-cyan-400' : 'from-pink-600 via-rose-600 to-orange-600'} drop-shadow-2xl tracking-tight`}>
                        Mind Over Myth
                    </h1>
                    
                    <p className={`text-lg sm:text-2xl lg:text-3xl ${isDark ? 'text-gray-300' : 'text-gray-700'} font-light max-w-4xl mx-auto leading-relaxed px-4`}>
                        একটি <span className={`font-bold ${isDark ? 'text-indigo-400' : 'text-pink-600'}`}>আবেগ</span>, 
                        <span className={`font-bold ${isDark ? 'text-purple-400' : 'text-rose-600'} mx-2`}>সংগ্রাম</span> ও 
                        <span className={`font-bold ${isDark ? 'text-cyan-400' : 'text-orange-600'}`}> উদ্দেশ্যের</span> অসাধারণ গল্প
                    </p>
                    
                    <motion.div
                        className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12"
                        initial={isMobile ? { opacity: 0, scale: 0.95 } : { opacity: 0, scale: 0.8 }}
                        whileInView={isMobile ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
                        transition={isMobile ? { delay: 0.2, duration: 0.3 } : { delay: 0.5, duration: 0.6 }}
                    >
                        <div className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-full ${isDark ? 'bg-white/10 border border-white/20' : 'bg-white/80 border border-pink-200/50'} backdrop-blur-md`}>
                            <FaUsers className={`${isDark ? 'text-indigo-400' : 'text-pink-500'}`} />
                            <span className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'} text-sm sm:text-base`}>
                                <CountUp end={stats?.totalUsers || 0} duration={3} enableScrollSpy />+ Active Readers
                            </span>
                        </div>
                        <div className={`flex items-center gap-2 px-6 py-3 rounded-full ${isDark ? 'bg-white/10' : 'bg-white/80'} backdrop-blur-md`}>
                            <FaStar className="text-amber-400" />
                            <span className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                <CountUp end={stats?.averageRating || 0} duration={3} decimals={1} enableScrollSpy /> Rating
                            </span>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Our Story Section */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={staggerContainer}
                    className="space-y-16 sm:space-y-24"
                >
                    {/* Beginning Story */}
                    <motion.div 
                        variants={fadeUp}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center"
                    >
                        <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
                            <div className="flex items-center gap-4">
                                <div className={`w-1 h-12 sm:h-16 rounded-full bg-gradient-to-b ${isDark ? 'from-indigo-500 to-purple-500' : 'from-pink-500 to-rose-500'}`} />
                                <h2 className={`text-3xl sm:text-4xl pb-8 lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-indigo-400 to-purple-400' : 'from-pink-600 to-rose-600'}`}>
                                    আমাদের শুরুর গল্প
                                </h2>
                            </div>
                            
                            <div className={`text-base sm:text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed space-y-4 sm:space-y-6`}>
                                <p className="text-justify">
                                    "Mind Over Myth"-এর জন্মটা ছিল,না শুধু একটি ওয়েবসাইট বানানোর পরিকল্পনা;
                                    এটি ছিল একটি <span className={`font-bold px-2 py-1 rounded-lg ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-pink-100 text-pink-700'}`}>স্বপ্ন</span> —
                                    এমন এক ডিজিটাল অভয়ারণ্য গড়ে তোলা,যেখানে জ্ঞান,চিন্তা ও আত্ম-অনুসন্ধান এক
                                    জায়গায় মিলিত হবে।
                                </p>
                                
                                <p className="text-justify">
                                    অসংখ্য নির্ঘুম রাত,অবিরাম পরিশ্রম এবং গভীর ভালোবাসা এই প্ল্যাটফর্মের জন্ম দিয়েছে।
                                    প্রতিটি লাইন কোড,প্রতিটি ডিজাইন এলিমেন্ট,প্রতিটি কন্টেন্ট—সবকিছুই তৈরি হয়েছে 
                                    একটি মাত্র লক্ষ্য নিয়ে: <span className={`font-bold ${isDark ? 'text-purple-400' : 'text-rose-600'}`}>আপনার মনের খাদ্য যোগানো</span>।
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3 sm:gap-4">
                                <div className={`flex items-center gap-3 px-4 py-2 rounded-full ${isDark ? 'bg-white/10' : 'bg-white/80'} backdrop-blur-md`}>
                                    <FaBookOpen className={`${isDark ? 'text-indigo-400' : 'text-pink-500'} text-sm sm:text-base`} />
                                    <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>50+ Premium Books</span>
                                </div>
                                <div className={`flex items-center gap-3 px-4 py-2 rounded-full ${isDark ? 'bg-white/10' : 'bg-white/80'} backdrop-blur-md`}>
                                    <FaLightbulb className={`${isDark ? 'text-purple-400' : 'text-rose-500'} text-sm sm:text-base`} />
                                    <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Mind-Opening Content</span>
                                </div>
                            </div>
                        </div>

                        <motion.div
                            className="relative group order-1 lg:order-2"
                            whileHover={isMobile ? {} : { scale: 1.02 }}
                            transition={isMobile ? {} : { type: 'spring', stiffness: 200 }}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? 'from-indigo-500/20 to-purple-500/20' : 'from-pink-500/20 to-rose-500/20'} rounded-2xl sm:rounded-3xl blur-2xl ${isMobile ? '' : 'group-hover:blur-3xl transition-all duration-500'}`} />
                            <img
                                src="https://res.cloudinary.com/dwkj2w1ds/image/upload/v1754985058/d26e4b2e159d429fe7ac8f586822c420_dyhimz.png"
                                alt="The beginning of a journey"
                                className={`relative rounded-2xl object-cover sm:rounded-3xl shadow-2xl w-full h-[500px] sm:h-[600px]  ring-2 ${isDark ? 'ring-white/20' : 'ring-pink-200/50'} ${isMobile ? '' : 'transition-all duration-500 group-hover:ring-4'}`}
                            />
                        </motion.div>
                    </motion.div>

                    {/* Current Challenges */}
                    <motion.div 
                        variants={fadeUp}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center"
                    >
                        <motion.div
                            className="relative group order-1 lg:order-2"
                            whileHover={isMobile ? {} : { scale: 1.02 }}
                            transition={isMobile ? {} : { type: 'spring', stiffness: 200 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl sm:rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
                            <img
                                src="https://res.cloudinary.com/dwkj2w1ds/image/upload/v1754984192/Pngtree_business_target_concept_design_people_5335877_vlfmnb.png"
                                alt="Facing challenges"
                                className="relative rounded-2xl object-cover sm:rounded-3xl shadow-2xl w-full h-[500px] sm:h-[600px]  ring-2 ring-red-200/50 transition-all duration-500 group-hover:ring-4"
                            />
                        </motion.div>

                        <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
                            <div className="flex items-center gap-4">
                                <div className="w-1 h-12 sm:h-16 rounded-full bg-gradient-to-b from-red-500 to-orange-500" />
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600">
                                    বর্তমান প্রতিবন্ধকতা
                                </h2>
                            </div>
                            
                            <div className={`text-base sm:text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed space-y-4 sm:space-y-6`}>
                                <p className="text-justify">
                                    একটি উচ্চমানের প্ল্যাটফর্ম চালিয়ে যাওয়া সহজ নয়—সার্ভারের খরচ,নতুন ফিচারের উন্নয়ন, 
                                    কন্টেন্ট কিউরেশন এবং ২৪/৭ রক্ষণাবেক্ষণ সবই আমাদের নিজস্ব সঞ্চয় থেকে পরিচালিত হচ্ছে।
                                </p>
                                
                                <p className="text-justify">
                                    এখনো কোনো <span className="font-bold px-2 py-1 rounded-lg bg-red-100 text-red-700">আর্থিক পৃষ্ঠপোষক</span> নেই।
                                    এই কারণেই অনিচ্ছাসত্ত্বেও কিছু বিজ্ঞাপন রাখতে হচ্ছে। প্রতিটি ক্লিকই আমাদের স্বপ্নের দিকে 
                                    একধাপ এগিয়ে নিয়ে যায়।
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-white/80'} backdrop-blur-md text-center`}>
                                    <FaServer className="text-xl sm:text-2xl text-red-500 mx-auto mb-2" />
                                    <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Monthly Server Cost</p>
                                    <p className="text-base sm:text-lg font-bold text-red-600">৳5,000</p>
                                </div>
                                <div className={`p-4 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-white/80'} backdrop-blur-md text-center`}>
                                    <FaRocket className="text-xl sm:text-2xl text-orange-500 mx-auto mb-2" />
                                    <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Development Hours</p>
                                    <p className="text-base sm:text-lg font-bold text-orange-600">10+ hrs/month</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Our Vision */}
                    <motion.div 
                        variants={fadeUp}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center"
                    >
                        <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
                            <div className="flex items-center gap-4">
                                <div className="w-1 h-12 sm:h-16 rounded-full bg-gradient-to-b from-emerald-500 to-teal-500" />
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
                                    আমাদের স্বপ্ন
                                </h2>
                            </div>
                            
                            <div className={`text-base sm:text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed space-y-4 sm:space-y-6`}>
                                <p className="text-justify">
                                    আমরা চাই "Mind Over Myth" হোক <span className="font-bold px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700">সম্পূর্ণ বিজ্ঞাপন-মুক্ত</span>
                                    —যেখানে ব্যবহারকারীর অভিজ্ঞতা হবে নির্ভেজাল, শান্তিময় এবং জ্ঞানভিত্তিক।
                                </p>
                                
                                <p className="text-justify">
                                    আমাদের ভিশন হল একটি <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>গ্লোবাল নলেজ প্ল্যাটফর্ম</span> 
                                    তৈরি করা যা শুধু বাংলাদেশ নয়, পুরো বিশ্বের বাংলা ভাষী মানুষদের কাছে পৌঁছাবে। 
                                    যখনই আমরা আর্থিকভাবে সচ্ছল হব, তখনই সব বিজ্ঞাপন সরিয়ে দিয়ে প্ল্যাটফর্মটিকে 
                                    আরও সুন্দর ও মুক্ত করে তুলব।
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-white/80'} backdrop-blur-md`}>
                                    <FaGlobe className="text-xl sm:text-2xl text-emerald-500 mb-2" />
                                    <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} text-sm sm:text-base`}>Global Reach</p>
                                    <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Worldwide Bengali community</p>
                                </div>
                                <div className={`p-4 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-white/80'} backdrop-blur-md`}>
                                    <FaHeart className="text-xl sm:text-2xl text-rose-500 mb-2" />
                                    <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} text-sm sm:text-base`}>Ad-Free Experience</p>
                                    <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Pure knowledge, no distractions</p>
                                </div>
                            </div>
                        </div>

                        <motion.div
                            className="relative group order-1 lg:order-2"
                            whileHover={isMobile ? {} : { scale: 1.02 }}
                            transition={isMobile ? {} : { type: 'spring', stiffness: 200 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl sm:rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
                            <img
                                src="https://res.cloudinary.com/dwkj2w1ds/image/upload/v1754985981/5b4526719654129f9ca8b53a51f79c1b_nuejtu.png"
                                alt="Our future vision"
                                className="relative rounded-2xl sm:rounded-3xl shadow-2xl w-full h-[500px] sm:h-[600px] object-cover ring-2 ring-emerald-200/50 transition-all duration-500 group-hover:ring-4"
                            />
                        </motion.div>
                    </motion.div>
                </motion.section>

                {/* Partnership Section */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeUp}
                    className={`p-8 sm:p-12 rounded-2xl sm:rounded-3xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white/80 border border-pink-200/50'} backdrop-blur-md shadow-2xl`}
                >
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className={`text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-indigo-400 to-purple-400' : 'from-pink-600 to-rose-600'}`}>
                            Why Partner With Us?
                        </h2>
                        <p className={`text-lg sm:text-xl ${isDark ? 'text-gray-300' : 'text-gray-700'} max-w-3xl mx-auto`}>
                            Connect with a dedicated community of thinkers, creators, and mindful individuals
                        </p>
                    </div>

                    <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                        variants={staggerContainer}
                    >
                        <motion.div 
                            variants={fadeUp}
                            className={`p-6 sm:p-8 rounded-2xl ${isDark ? 'bg-white/10' : 'bg-white/90'} backdrop-blur-md text-center group ${isMobile ? '' : 'hover:scale-105 transition-all duration-300'}`}
                            whileHover={isMobile ? {} : { y: -10 }}
                        >
                            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ${isDark ? 'bg-indigo-500/20' : 'bg-pink-100'} flex items-center justify-center mx-auto mb-6 ${isMobile ? '' : 'group-hover:scale-110 transition-all duration-300'}`}>
                                <FaUsers className={`text-2xl sm:text-3xl ${isDark ? 'text-indigo-400' : 'text-pink-600'}`} />
                            </div>
                            <h3 className={`text-xl sm:text-2xl font-bold mb-4 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Engaged Audience</h3>
                            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed text-sm sm:text-base`}>
                                Reach a highly engaged audience passionate about personal growth, philosophy, and mindfulness
                            </p>
                        </motion.div>

                        <motion.div 
                            variants={fadeUp}
                            className={`p-6 sm:p-8 rounded-2xl ${isDark ? 'bg-white/10' : 'bg-white/90'} backdrop-blur-md text-center group ${isMobile ? '' : 'hover:scale-105 transition-all duration-300'}`}
                            whileHover={isMobile ? {} : { y: -10 }}
                        >
                            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ${isDark ? 'bg-purple-500/20' : 'bg-rose-100'} flex items-center justify-center mx-auto mb-6 ${isMobile ? '' : 'group-hover:scale-110 transition-all duration-300'}`}>
                                <FaHandshake className={`text-2xl sm:text-3xl ${isDark ? 'text-purple-400' : 'text-rose-600'}`} />
                            </div>
                            <h3 className={`text-xl sm:text-2xl font-bold mb-4 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Brand Alignment</h3>
                            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed text-sm sm:text-base`}>
                                Align your brand with positive values like wisdom, intentional living, and intellectual curiosity
                            </p>
                        </motion.div>

                        <motion.div 
                            variants={fadeUp}
                            className={`p-6 sm:p-8 rounded-2xl ${isDark ? 'bg-white/10' : 'bg-white/90'} backdrop-blur-md text-center group ${isMobile ? '' : 'hover:scale-105 transition-all duration-300'} sm:col-span-2 lg:col-span-1`}
                            whileHover={isMobile ? {} : { y: -10 }}
                        >
                            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ${isDark ? 'bg-cyan-500/20' : 'bg-orange-100'} flex items-center justify-center mx-auto mb-6 ${isMobile ? '' : 'group-hover:scale-110 transition-all duration-300'}`}>
                                <FaBullhorn className={`text-2xl sm:text-3xl ${isDark ? 'text-cyan-400' : 'text-orange-600'}`} />
                            </div>
                            <h3 className={`text-xl sm:text-2xl font-bold mb-4 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Positive Impact</h3>
                            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed text-sm sm:text-base`}>
                                Support a platform that provides valuable content and helps individuals lead more thoughtful lives
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.section>

                {/* Support Section */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeUp}
                    className={`p-8 sm:p-12 rounded-2xl sm:rounded-3xl ${isDark ? 'bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-white/10' : 'bg-gradient-to-br from-pink-100 to-rose-100 border border-pink-200'} backdrop-blur-md shadow-2xl text-center`}
                >
                    <motion.div
                        className="mb-12"
                        whileHover={isMobile ? {} : { scale: 1.05 }}
                        transition={isMobile ? {} : { type: 'spring', stiffness: 300 }}
                    >
                        <FaHeart className={`text-5xl sm:text-6xl mx-auto mb-6 ${isDark ? 'text-indigo-400' : 'text-pink-600'}`} />
                        <h2 className={`text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-indigo-400 to-purple-400' : 'from-pink-600 to-rose-600'}`}>
                            আমাদের যাত্রার অংশ হোন
                        </h2>
                        <p className={`text-lg sm:text-xl ${isDark ? 'text-gray-300' : 'text-gray-700'} max-w-4xl mx-auto leading-relaxed`}>
                            আপনি যদি আমাদের মিশনে বিশ্বাস করেন, তাহলে আপনার ছোট্ট একটি সহায়তাও আমাদের জন্য বিশাল
                            প্রেরণা হয়ে উঠবে। আপনার সমর্থনে এই প্ল্যাটফর্ম হবে আরও বড়, সুন্দর এবং সবার জন্য উন্মুক্ত।
                        </p>
                    </motion.div>

                    {/* Donation Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
                        {/* Sponsorship */}
                        <motion.div
                            className={`p-6 sm:p-8 rounded-2xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white/80 border border-pink-200/50'} backdrop-blur-md`}
                            whileHover={isMobile ? {} : { scale: 1.02 }}
                        >
                            <FaHandsHelping className={`text-3xl sm:text-4xl mx-auto mb-6 ${isDark ? 'text-indigo-400' : 'text-pink-600'}`} />
                            <h3 className={`text-xl sm:text-2xl font-bold mb-4 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                                Become Our Sponsor
                            </h3>
                            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6 text-sm sm:text-base`}>
                                Partner with us for long-term growth and mutual success
                            </p>
                            
                            <form ref={sponsorForm} onSubmit={handleSubmit(handleSponsorSubmit)} className="space-y-4 mb-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input 
                                        type="text" 
                                        placeholder="Your Name" 
                                        {...register("from_name", { required: true })}
                                        className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800/50 border-white/20 text-gray-300 placeholder:text-gray-500' : 'bg-white/80 border-pink-200/50 text-gray-700 placeholder:text-gray-500'} backdrop-blur-md focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300`}
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Company Name" 
                                        {...register("company_name")}
                                        className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800/50 border-white/20 text-gray-300 placeholder:text-gray-500' : 'bg-white/80 border-pink-200/50 text-gray-700 placeholder:text-gray-500'} backdrop-blur-md focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300`}
                                    />
                                </div>
                                <input 
                                    type="email" 
                                    placeholder="Email Address" 
                                    {...register("from_email", { required: true })}
                                    className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800/50 border-white/20 text-gray-300 placeholder:text-gray-500' : 'bg-white/80 border-pink-200/50 text-gray-700 placeholder:text-gray-500'} backdrop-blur-md focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300`}
                                />
                                <textarea 
                                    {...register("message", { required: true })}
                                    className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800/50 border-white/20 text-gray-300 placeholder:text-gray-500' : 'bg-white/80 border-pink-200/50 text-gray-700 placeholder:text-gray-500'} backdrop-blur-md focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300`}
                                    placeholder="Tell us about your brand and partnership ideas..."
                                    rows={4}
                                />
                            </form>
                            
                            <motion.button
                                type="submit"
                                className={`w-full py-3 sm:py-4 px-6 rounded-xl font-bold text-white border-none ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-pink-500/30'} transition-all duration-300`}
                                whileHover={isMobile ? {} : { scale: 1.05 }}
                                whileTap={isMobile ? {} : { scale: 0.95 }}
                                onClick={handleSubmit(handleSponsorSubmit)}
                            >
                                <FaHandsHelping className="inline mr-2" />
                                আমাদের মিশনে যুক্ত হোন
                            </motion.button>
                        </motion.div>

                        {/* Donation */}
                        <motion.div
                            className={`p-6 sm:p-8 rounded-2xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white/80 border border-pink-200/50'} backdrop-blur-md`}
                            whileHover={isMobile ? {} : { scale: 1.02 }}
                        >
                            <FaCoffee className={`text-3xl sm:text-4xl mx-auto mb-6 ${isDark ? 'text-purple-400' : 'text-rose-600'}`} />
                            <h3 className={`text-xl sm:text-2xl font-bold mb-4 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                                Support With Coffee
                            </h3>
                            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6 text-sm sm:text-base`}>
                                Your small contribution helps us keep the platform running and ad-free
                            </p>

                            <div className="space-y-6">
                                <div>
                                    <p className={`font-semibold mb-4 ${isDark ? 'text-gray-200' : 'text-gray-700'} text-sm sm:text-base`}>
                                        Choose a donation amount (BDT):
                                    </p>
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                        {[100, 300, 500].map((value) => (
                                            <motion.button
                                                key={value}
                                                onClick={() => setAmount(value)}
                                                className={`py-2 sm:py-3 px-2 sm:px-4 rounded-xl font-bold transition-all duration-300 text-sm sm:text-base ${
                                                    amount === value
                                                        ? isDark 
                                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                                            : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white'
                                                        : isDark
                                                            ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                                whileHover={isMobile ? {} : { scale: 1.05 }}
                                                whileTap={isMobile ? {} : { scale: 0.95 }}
                                            >
                                                {value} ৳
                                            </motion.button>
                                        ))}
                                    </div>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800/50 border-white/20 text-gray-300' : 'bg-white/80 border-pink-200/50 text-gray-700'} backdrop-blur-md focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-purple-500' : 'focus:ring-rose-500'} transition-all duration-300`}
                                        placeholder="Custom amount"
                                    />
                                </div>

                                <motion.button
                                    onClick={handleDonate}
                                    disabled={donationMutation.isLoading}
                                    className={`w-full py-3 sm:py-4 px-6 rounded-xl font-bold text-white border-none ${isDark ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-rose-500/30'} transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                                    whileHover={isMobile ? {} : { scale: donationMutation.isLoading ? 1 : 1.05 }}
                                    whileTap={isMobile ? {} : { scale: donationMutation.isLoading ? 1 : 0.95 }}
                                >
                                    <FaCoffee className="inline mr-2" />
                                    {donationMutation.isLoading ? 'Processing...' : `Donate ${amount} BDT`}
                                </motion.button>
                            </div>

                            <div className="mt-6 text-center">
                                <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                    Secure payment powered by SSL Commerz
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Impact Stats */}
                    <motion.div
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-16"
                        initial={isMobile ? { opacity: 0, y: 10 } : { opacity: 0, y: 30 }}
                        whileInView={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                        transition={isMobile ? { delay: 0.2, duration: 0.3 } : { delay: 0.5, duration: 0.8 }}
                    >
                        <div className="text-center">
                            <div className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-indigo-400' : 'text-pink-600'}`}>
                                <CountUp end={stats?.totalUsers || 10000} duration={3} enableScrollSpy />+
                            </div>
                            <div className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Active Readers</div>
                        </div>
                        <div className="text-center">
                            <div className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-purple-400' : 'text-rose-600'}`}>500+</div>
                            <div className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Premium Books</div>
                        </div>
                        <div className="text-center">
                            <div className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-cyan-400' : 'text-orange-600'}`}>24/7</div>
                            <div className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Availability</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-emerald-600">Ad-Free</div>
                            <div className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Future Goal</div>
                        </div>
                    </motion.div>
                </motion.section>

                {/* Final Call to Action */}
                <motion.div
                    className="text-center"
                    initial={isMobile ? { opacity: 0, scale: 0.95 } : { opacity: 0, scale: 0.9 }}
                    whileInView={isMobile ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={isMobile ? { duration: 0.3, ease: 'easeOut' } : { duration: 0.8, ease: 'easeOut' }}
                >
                    <motion.p
                        className={`text-lg sm:text-2xl ${isDark ? 'text-gray-300' : 'text-gray-700'} font-light max-w-4xl mx-auto leading-relaxed px-4`}
                        whileHover={isMobile ? {} : { scale: 1.02 }}
                        transition={isMobile ? {} : { type: 'spring', stiffness: 300 }}
                    >
                        আপনার সাথে থাকার অপেক্ষায়, আমরা এগিয়ে চলেছি একটি 
                        <span className={`font-bold mx-2 ${isDark ? 'text-indigo-400' : 'text-pink-600'}`}>উন্নত ভবিষ্যতের</span>
                        দিকে। আমাদের এই যাত্রায় আপনিও অংশীদার হন।
                    </motion.p>
                    
                    <motion.div
                        className="flex justify-center items-center gap-3 mt-8"
                        initial={isMobile ? { opacity: 0, y: 10 } : { opacity: 0, y: 20 }}
                        whileInView={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                        transition={isMobile ? { delay: 0.1, duration: 0.3 } : { delay: 0.3, duration: 0.6 }}
                    >
                        <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-indigo-400' : 'bg-pink-500'} ${isMobile ? '' : 'animate-pulse'}`} />
                        <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-purple-400' : 'bg-rose-500'} ${isMobile ? '' : 'animate-pulse delay-200'}`} />
                        <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-cyan-400' : 'bg-orange-500'} ${isMobile ? '' : 'animate-pulse delay-400'}`} />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default OurJourney;