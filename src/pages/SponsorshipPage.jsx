// 📁 File: src/pages/SponsorshipPage.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { FaBullhorn, FaUsers, FaHandshake } from 'react-icons/fa';

const SponsorshipPage = () => {
    
    const featureVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <div className="bg-base-200">
            {/* --- Hero Section --- */}
            <div className="relative bg-base-100 pt-32 pb-20 text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm"></div>
                <div className="relative max-w-3xl mx-auto px-4">
                    <motion.h1 
                        className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Partner With Us
                    </motion.h1>
                    <motion.p 
                        className="mt-4 text-lg text-base-content/80"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Connect with a dedicated community of thinkers, creators, and mindful individuals. Let's create value together.
                    </motion.p>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-4 py-16 space-y-20">
                {/* --- Why Sponsor Us Section --- */}
                <section>
                    <h2 className="text-4xl font-bold text-center mb-12">Why Sponsor Mind Over Myth?</h2>
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ staggerChildren: 0.2 }}
                    >
                        <motion.div variants={featureVariants} className="bg-base-100 p-8 rounded-2xl shadow-lg text-center">
                            <FaUsers className="text-4xl text-primary mx-auto mb-4" />
                            <h3 className="text-xl font-bold">Engaged Audience</h3>
                            <p className="text-base-content/70 mt-2">Reach a highly engaged audience passionate about personal growth, philosophy, and mindfulness.</p>
                        </motion.div>
                        <motion.div variants={featureVariants} className="bg-base-100 p-8 rounded-2xl shadow-lg text-center">
                            <FaHandshake className="text-4xl text-secondary mx-auto mb-4" />
                            <h3 className="text-xl font-bold">Brand Alignment</h3>
                            <p className="text-base-content/70 mt-2">Align your brand with positive values like wisdom, intentional living, and intellectual curiosity.</p>
                        </motion.div>
                        <motion.div variants={featureVariants} className="bg-base-100 p-8 rounded-2xl shadow-lg text-center">
                            <FaBullhorn className="text-4xl text-accent mx-auto mb-4" />
                            <h3 className="text-xl font-bold">Positive Impact</h3>
                            <p className="text-base-content/70 mt-2">Support a platform that provides valuable content and helps individuals lead more thoughtful lives.</p>
                        </motion.div>
                    </motion.div>
                </section>

                {/* --- Contact Form Section --- */}
                <section className="bg-base-100 p-8 sm:p-12 rounded-2xl shadow-xl">
                    <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Let's Get in Touch</h2>
                    <form className="max-w-xl mx-auto space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <input type="text" placeholder="Your Name" className="input input-bordered w-full" />
                            <input type="text" placeholder="Company Name" className="input input-bordered w-full" />
                        </div>
                        <input type="email" placeholder="Email Address" className="input input-bordered w-full" />
                        <textarea className="textarea textarea-bordered w-full" placeholder="Tell us about your brand and what you have in mind..." rows="5"></textarea>
                        <button type="submit" className="btn btn-primary btn-block bg-gradient-to-r from-primary to-secondary text-white border-none">Submit Inquiry</button>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default SponsorshipPage;