// 📁 File: src/components/Store/StoreFooter.jsx

import React from 'react';
import { Link } from 'react-router';
import { FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaHandshake, FaStore } from "react-icons/fa6";
import { motion } from 'framer-motion';

const StoreFooter = () => {
    const logoUrl = 'https://res.cloudinary.com/dwkj2w1ds/image/upload/v1754430112/ChatGPT_Image_Jul_21_2025_02_09_35_PM_k1fju4.png';

    // Animated logo component using CSS mask
    const AnimatedLogo = ({ size = 'w-10 h-10' }) => (
        <div
            className={`relative ${size} bg-gradient-to-br from-primary to-secondary transition-all duration-500 ease-in-out group-hover:from-secondary group-hover:to-primary`}
            style={{
                maskImage: `url(${logoUrl})`,
                WebkitMaskImage: `url(${logoUrl})`, // For Safari compatibility
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center'
            }}
        ></div>
    );

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <motion.footer 
            className="bg-base-200 text-base-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={sectionVariants}
        >
            
            {/* --- Zone 1: Partnership CTA Section --- */}
            <div className="bg-base-100 p-8 sm:p-12 relative overflow-hidden">
                <img src={logoUrl} alt="Mind Over Myth background logo" className="absolute -right-20 -bottom-20 w-80 h-80 opacity-5 filter blur-sm"/>
                <div className="max-w-screen-lg mx-auto text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Collaborate With Us
                    </h2>
                    <p className="text-base-content/70 max-w-2xl mx-auto mb-8">
                        We believe in growth through partnership. Join us in our mission to spread mindfulness and philosophical wisdom.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div whileHover={{ y: -8, boxShadow: "0px 15px 30px -5px rgba(0,0,0,0.1)" }} className="bg-base-200/50 p-6 rounded-2xl text-left flex flex-col items-start shadow-lg">
                            <div className="bg-primary/10 p-3 rounded-full mb-4"><FaHandshake className="text-2xl text-primary" /></div>
                            <h3 className="text-xl font-bold">Become a Sponsor</h3>
                            <p className="text-base-content/70 mt-2 flex-grow">Feature your brand to our dedicated community of thinkers and creators.</p>
                            <Link to="/store/sponsorship" className="btn btn-outline btn-primary btn-sm mt-4">Learn More</Link>
                        </motion.div>
                        <motion.div whileHover={{ y: -8, boxShadow: "0px 15px 30px -5px rgba(0,0,0,0.1)" }} className="bg-base-200/50 p-6 rounded-2xl text-left flex flex-col items-start shadow-lg">
                            <div className="bg-secondary/10 p-3 rounded-full mb-4"><FaStore className="text-2xl text-secondary" /></div>
                            <h3 className="text-xl font-bold">Sell With Us</h3>
                            <p className="text-base-content/70 mt-2 flex-grow">Showcase your thoughtful products that align with our philosophy.</p>
                            <Link to="/store/sell-with-us" className="btn btn-outline btn-secondary btn-sm mt-4">Become a Partner</Link>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* --- Zone 2: Main Footer --- */}
            <div className="max-w-screen-xl mx-auto px-4 py-12 text-center">
                <motion.div className="flex flex-col items-center gap-4 group cursor-pointer" whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                    <AnimatedLogo size="w-20 h-20" />
                    <p className="text-2xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Mind Over Myth</p>
                    <p className="text-base-content/70 max-w-sm">Reimagining life through philosophy and design. Curated content and products for the modern thinker.</p>
                </motion.div>
                
                <div className="w-24 h-px bg-gradient-to-r from-primary to-secondary mx-auto my-8"></div>

                <nav className="flex justify-center items-center flex-wrap gap-x-8 gap-y-3 text-base-content/80 font-semibold">
                    <motion.div whileHover={{ scale: 1.1 }}><Link to="/about" className="link link-hover">About Us</Link></motion.div>
                    <motion.div whileHover={{ scale: 1.1 }}><Link to="/community" className="link link-hover">Community</Link></motion.div>
                    <motion.div whileHover={{ scale: 1.1 }}><Link to="/contact" className="link link-hover">Contact</Link></motion.div>
                    <motion.div whileHover={{ scale: 1.1 }}><Link to="/terms" className="link link-hover">Terms of Service</Link></motion.div>
                    <motion.div whileHover={{ scale: 1.1 }}><Link to="/privacy" className="link link-hover">Privacy Policy</Link></motion.div>
                </nav>

                <div className="flex justify-center gap-6 mt-8">
                   <motion.a href="#" className="text-base-content/60 hover:text-primary transition-colors" whileHover={{ scale: 1.2, y: -2 }}><FaTwitter className="text-2xl" /></motion.a>
                   <motion.a href="#" className="text-base-content/60 hover:text-primary transition-colors" whileHover={{ scale: 1.2, y: -2 }}><FaInstagram className="text-2xl" /></motion.a>
                   <motion.a href="#" className="text-base-content/60 hover:text-primary transition-colors" whileHover={{ scale: 1.2, y: -2 }}><FaLinkedinIn className="text-2xl" /></motion.a>
                </div>
            </div>

            {/* --- Zone 3: Sub-Footer --- */}
            <div className="bg-base-300/50 text-base-content/70 p-4">
                <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row justify-between items-center text-center gap-2">
                    <div className="flex items-center gap-2">
                        <p className="text-sm">
                            &copy; {new Date().getFullYear()} Mind Over Myth. All Rights Reserved.
                        </p>
                    </div>
                    <p className="text-sm">
                        Designed with Philosophy, Built with Code.
                    </p>
                </div>
            </div>
        </motion.footer>
    );
};

export default StoreFooter;