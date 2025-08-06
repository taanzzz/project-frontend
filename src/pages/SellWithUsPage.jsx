// 📁 File: src/pages/SellWithUsPage.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiSend, FiEdit } from "react-icons/fi";

const SellWithUsPage = () => {

    const stepVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div className="bg-base-200">
            {/* --- Hero Section --- */}
            <div className="relative bg-base-100 pt-32 pb-20 text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-accent/10 backdrop-blur-sm"></div>
                <div className="relative max-w-3xl mx-auto px-4">
                    <motion.h1 
                        className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Sell With Us
                    </motion.h1>
                    <motion.p 
                        className="mt-4 text-lg text-base-content/80"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Showcase your thoughtful products to our curated community. We are looking for partners who share our ethos.
                    </motion.p>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-4 py-16 space-y-20">
                {/* --- How It Works Section --- */}
                <section>
                    <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ staggerChildren: 0.3 }}
                    >
                        <motion.div variants={stepVariants} className="text-center">
                            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center bg-primary/10 text-primary mb-4">
                                <FiEdit className="text-4xl" />
                            </div>
                            <h3 className="text-xl font-bold">1. Apply</h3>
                            <p className="text-base-content/70 mt-2">Fill out the form below with details about your brand and products.</p>
                        </motion.div>
                        <motion.div variants={stepVariants} className="text-center">
                            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center bg-secondary/10 text-secondary mb-4">
                                <FiCheckCircle className="text-4xl" />
                            </div>
                            <h3 className="text-xl font-bold">2. Curation & Review</h3>
                            <p className="text-base-content/70 mt-2">Our team will review your application to ensure it aligns with our philosophy and quality standards.</p>
                        </motion.div>
                        <motion.div variants={stepVariants} className="text-center">
                            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center bg-accent/10 text-accent mb-4">
                                <FiSend className="text-4xl" />
                            </div>
                            <h3 className="text-xl font-bold">3. Get Featured</h3>
                            <p className="text-base-content/70 mt-2">Once approved, your products will be featured in our store and promoted to our community.</p>
                        </motion.div>
                    </motion.div>
                </section>

                {/* --- Application Form Section --- */}
                <section className="bg-base-100 p-8 sm:p-12 rounded-2xl shadow-xl">
                    <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Application Form</h2>
                    <form className="max-w-xl mx-auto space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <input type="text" placeholder="Your Name" className="input input-bordered w-full" />
                            <input type="text" placeholder="Brand Name" className="input input-bordered w-full" />
                        </div>
                        <input type="email" placeholder="Email Address" className="input input-bordered w-full" />
                        <input type="url" placeholder="Link to your Store / Portfolio" className="input input-bordered w-full" />
                        <textarea className="textarea textarea-bordered w-full" placeholder="Briefly describe your brand and why you'd be a good fit for Mind Over Myth..." rows="5"></textarea>
                        <button type="submit" className="btn btn-secondary btn-block bg-gradient-to-r from-secondary to-accent text-white border-none">Apply Now</button>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default SellWithUsPage;