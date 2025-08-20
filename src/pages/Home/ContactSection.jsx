import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaEnvelope, FaUser, FaCommentDots, FaHeart, FaBell } from 'react-icons/fa';
import { useMediaQuery } from '@react-hook/media-query';

const ContactSection = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const isDark = theme === 'dark';
    const isMobile = useMediaQuery('(max-width: 768px)');

    const contactForm = useRef();
    const newsletterForm = useRef();

    const { register: registerContact, handleSubmit: handleContactSubmit, reset: resetContact, formState: { isSubmitting: isContactSubmitting } } = useForm();
    const { register: registerNewsletter, handleSubmit: handleNewsletterSubmit, reset: resetNewsletter, formState: { isSubmitting: isNewsletterSubmitting } } = useForm();

    useEffect(() => {
        const observer = new MutationObserver(() => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            setTheme(currentTheme);
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        return () => observer.disconnect();
    }, []);

    const sendContactEmail = (data) => {
        return emailjs.sendForm(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CONTACT,
            contactForm.current,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        )
        .then(() => {
            toast.success("Message sent successfully!");
            resetContact();
        }, (error) => {
            console.error("EmailJS Contact Error:", error);
            toast.error("Failed to send message. Please check credentials.");
        });
    };

    const sendNewsletterEmail = (data) => {
        return emailjs.sendForm(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID_NEWSLETTER,
            newsletterForm.current,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        )
        .then(() => {
            toast.success("Thank you for subscribing!");
            resetNewsletter();
        }, (error) => {
            console.error("EmailJS Newsletter Error:", error);
            toast.error("Failed to subscribe. Please check credentials.");
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
        <div className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-b from-gray-900 via-indigo-950 to-gray-900' : 'bg-gradient-to-b from-pink-50 via-rose-50 to-pink-50'} py-16 sm:py-24`}>
            {/* Background Gradient Orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute top-20 left-1/4 w-96 h-96 ${isDark ? 'bg-indigo-500/20' : 'bg-pink-400/20'} rounded-full blur-3xl ${isMobile ? '' : 'animate-pulse'}`} />
                <div className={`absolute bottom-20 right-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/20' : 'bg-rose-400/20'} rounded-full blur-3xl ${isMobile ? '' : 'animate-pulse delay-1000'}`} />
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 ${isDark ? 'bg-cyan-500/10' : 'bg-orange-400/10'} rounded-full blur-3xl ${isMobile ? '' : 'animate-pulse delay-500'}`} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
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
                        Connect With Us
                    </h2>
                    <p className={`text-lg sm:text-xl lg:text-2xl ${isDark ? 'text-gray-300' : 'text-gray-700'} font-light max-w-3xl mx-auto leading-relaxed px-4`}>
                        Reach out with your <span className={`font-bold ${isDark ? 'text-indigo-400' : 'text-pink-600'}`}>questions</span> or join our 
                        <span className={`font-bold ${isDark ? 'text-purple-400' : 'text-rose-600'} mx-2`}>community</span> for 
                        <span className={`font-bold ${isDark ? 'text-cyan-400' : 'text-orange-600'}`}> exclusive insights</span>
                    </p>
                </motion.div>

                {/* Main Content */}
                <motion.div 
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={staggerContainer}
                >
                    {/* Contact Form */}
                    <motion.div
                        variants={fadeUp}
                        className={`p-8 sm:p-12 rounded-2xl sm:rounded-3xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white/80 border border-pink-200/50'} backdrop-blur-md shadow-2xl group hover:scale-[1.02] transition-all duration-300`}
                        whileHover={isMobile ? {} : { y: -5 }}
                    >
                        {/* Background Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? 'from-indigo-500/10 to-purple-500/10' : 'from-pink-500/10 to-rose-500/10'} rounded-2xl sm:rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-0 group-hover:opacity-100`} />
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ${isDark ? 'bg-indigo-500/20' : 'bg-pink-100'} flex items-center justify-center`}>
                                    <FaEnvelope className={`text-xl sm:text-2xl ${isDark ? 'text-indigo-400' : 'text-pink-600'}`} />
                                </div>
                                <div>
                                    <h3 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                        Get in Touch
                                    </h3>
                                    <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        We'd love to hear from you
                                    </p>
                                </div>
                            </div>
                            
                            <p className={`text-base sm:text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-8 leading-relaxed`}>
                                Have a question or a proposal? Share your thoughts with us and we'll get back to you soon.
                            </p>
                            
                            <form ref={contactForm} onSubmit={handleContactSubmit(sendContactEmail)} className="space-y-6">
                                <motion.div 
                                    className="relative"
                                    whileFocus={{ scale: 1.02 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FaUser className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-sm ${isDark ? 'text-indigo-400/70' : 'text-pink-500/70'}`} />
                                    <input 
                                        type="text" 
                                        placeholder="Your Name" 
                                        className={`w-full pl-12 pr-4 py-4 rounded-xl border ${isDark ? 'bg-gray-800/50 border-white/20 text-gray-300 placeholder:text-gray-500 focus:border-indigo-500 focus:ring-indigo-500/30' : 'bg-white/80 border-pink-200/50 text-gray-700 placeholder:text-gray-500 focus:border-pink-500 focus:ring-pink-500/30'} backdrop-blur-md focus:outline-none focus:ring-2 transition-all duration-300`}
                                        {...registerContact("from_name", { required: true })}
                                    />
                                </motion.div>

                                <motion.div 
                                    className="relative"
                                    whileFocus={{ scale: 1.02 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FaEnvelope className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-sm ${isDark ? 'text-indigo-400/70' : 'text-pink-500/70'}`} />
                                    <input 
                                        type="email" 
                                        placeholder="Your Email" 
                                        className={`w-full pl-12 pr-4 py-4 rounded-xl border ${isDark ? 'bg-gray-800/50 border-white/20 text-gray-300 placeholder:text-gray-500 focus:border-indigo-500 focus:ring-indigo-500/30' : 'bg-white/80 border-pink-200/50 text-gray-700 placeholder:text-gray-500 focus:border-pink-500 focus:ring-pink-500/30'} backdrop-blur-md focus:outline-none focus:ring-2 transition-all duration-300`}
                                        {...registerContact("from_email", { required: true })}
                                    />
                                </motion.div>

                                <motion.div 
                                    className="relative"
                                    whileFocus={{ scale: 1.02 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FaCommentDots className={`absolute left-4 top-4 text-sm ${isDark ? 'text-indigo-400/70' : 'text-pink-500/70'}`} />
                                    <textarea 
                                        className={`w-full pl-12 pr-4 py-4 rounded-xl border resize-none ${isDark ? 'bg-gray-800/50 border-white/20 text-gray-300 placeholder:text-gray-500 focus:border-indigo-500 focus:ring-indigo-500/30' : 'bg-white/80 border-pink-200/50 text-gray-700 placeholder:text-gray-500 focus:border-pink-500 focus:ring-pink-500/30'} backdrop-blur-md focus:outline-none focus:ring-2 transition-all duration-300`}
                                        rows="4" 
                                        placeholder="Your Message" 
                                        {...registerContact("message", { required: true })}
                                    />
                                </motion.div>

                                <motion.button 
                                    type="submit" 
                                    className={`w-full py-4 px-6 rounded-xl font-bold text-white border-none ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-indigo-500/30' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-pink-500/30'} transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3`}
                                    disabled={isContactSubmitting}
                                    whileHover={isMobile ? {} : { scale: isContactSubmitting ? 1 : 1.05 }}
                                    whileTap={isMobile ? {} : { scale: isContactSubmitting ? 1 : 0.95 }}
                                >
                                    {isContactSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <FaPaperPlane className="text-sm" />
                                            Send Message
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Newsletter Signup */}
                    <motion.div
                        variants={fadeUp}
                        className={`p-8 sm:p-12 rounded-2xl sm:rounded-3xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white/80 border border-pink-200/50'} backdrop-blur-md shadow-2xl group hover:scale-[1.02] transition-all duration-300`}
                        whileHover={isMobile ? {} : { y: -5 }}
                    >
                        {/* Background Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? 'from-purple-500/10 to-cyan-500/10' : 'from-rose-500/10 to-orange-500/10'} rounded-2xl sm:rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-0 group-hover:opacity-100`} />
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ${isDark ? 'bg-purple-500/20' : 'bg-rose-100'} flex items-center justify-center`}>
                                    <FaBell className={`text-xl sm:text-2xl ${isDark ? 'text-purple-400' : 'text-rose-600'}`} />
                                </div>
                                <div>
                                    <h3 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                        Join the Inner Circle
                                    </h3>
                                    <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Exclusive insights await
                                    </p>
                                </div>
                            </div>
                            
                            <p className={`text-base sm:text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-8 leading-relaxed`}>
                                Get weekly insights, book recommendations, and community highlights delivered straight to your inbox.
                            </p>

                            {/* Benefits List */}
                            <div className="space-y-3 mb-8">
                                {[
                                    { icon: FaHeart, text: "Weekly mindfulness tips" },
                                    { icon: FaEnvelope, text: "Premium book recommendations" },
                                    { icon: FaUser, text: "Community highlights" }
                                ].map((benefit, index) => (
                                    <motion.div 
                                        key={index}
                                        className="flex items-center gap-3"
                                        initial={isMobile ? { opacity: 0, x: -10 } : { opacity: 0, x: -20 }}
                                        whileInView={isMobile ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
                                        transition={isMobile ? { delay: index * 0.1, duration: 0.2 } : { delay: index * 0.2, duration: 0.4 }}
                                    >
                                        <benefit.icon className={`text-sm ${isDark ? 'text-purple-400' : 'text-rose-500'}`} />
                                        <span className={`text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {benefit.text}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                            
                            <form ref={newsletterForm} onSubmit={handleNewsletterSubmit(sendNewsletterEmail)} className="space-y-4">
                                <motion.div 
                                    className="relative"
                                    whileFocus={{ scale: 1.02 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FaEnvelope className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-sm ${isDark ? 'text-purple-400/70' : 'text-rose-500/70'}`} />
                                    <input 
                                        type="email" 
                                        placeholder="your-email@address.com" 
                                        className={`w-full pl-12 pr-4 py-4 rounded-xl border ${isDark ? 'bg-gray-800/50 border-white/20 text-gray-300 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/30' : 'bg-white/80 border-rose-200/50 text-gray-700 placeholder:text-gray-500 focus:border-rose-500 focus:ring-rose-500/30'} backdrop-blur-md focus:outline-none focus:ring-2 transition-all duration-300`}
                                        {...registerNewsletter("user_email", { required: true })}
                                    />
                                </motion.div>

                                <motion.button 
                                    type="submit" 
                                    className={`w-full py-4 px-6 rounded-xl font-bold text-white border-none ${isDark ? 'bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 shadow-purple-500/30' : 'bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 shadow-rose-500/30'} transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3`}
                                    disabled={isNewsletterSubmitting}
                                    whileHover={isMobile ? {} : { scale: isNewsletterSubmitting ? 1 : 1.05 }}
                                    whileTap={isMobile ? {} : { scale: isNewsletterSubmitting ? 1 : 0.95 }}
                                >
                                    {isNewsletterSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                            Subscribing...
                                        </>
                                    ) : (
                                        <>
                                            <FaPaperPlane className="text-sm" />
                                            Join Our Community
                                        </>
                                    )}
                                </motion.button>
                            </form>

                            <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'} text-center mt-4`}>
                                No spam, unsubscribe at any time
                            </p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    className="text-center mt-16 sm:mt-20"
                    initial={isMobile ? { opacity: 0, scale: 0.95 } : { opacity: 0, scale: 0.9 }}
                    whileInView={isMobile ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={isMobile ? { duration: 0.3, ease: 'easeOut' } : { duration: 0.8, ease: 'easeOut' }}
                >
                    <motion.p
                        className={`text-lg sm:text-xl ${isDark ? 'text-gray-300' : 'text-gray-700'} font-light max-w-3xl mx-auto leading-relaxed px-4`}
                        whileHover={isMobile ? {} : { scale: 1.02 }}
                        transition={isMobile ? {} : { type: 'spring', stiffness: 300 }}
                    >
                        We believe in building <span className={`font-bold mx-2 ${isDark ? 'text-indigo-400' : 'text-pink-600'}`}>meaningful connections</span>
                        through thoughtful conversations and shared wisdom.
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

export default ContactSection;