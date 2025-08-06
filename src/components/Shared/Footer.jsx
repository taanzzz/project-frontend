// 📁 File: src/components/Shared/MainFooter.jsx

import React from 'react';
import { Link } from 'react-router';
import { FaHeart, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { motion } from 'framer-motion';

const Footer = () => {
    const logoUrl = 'https://res.cloudinary.com/dwkj2w1ds/image/upload/v1754430112/ChatGPT_Image_Jul_21_2025_02_09_35_PM_k1fju4.png';

    // Animated logo sub-component
    const AnimatedLogo = ({ size = 'w-10 h-10' }) => (
        <div
            className={`relative ${size} bg-gradient-to-br from-primary to-secondary transition-all duration-500 ease-in-out group-hover:from-secondary group-hover:to-primary`}
            style={{
                maskImage: `url(${logoUrl})`, WebkitMaskImage: `url(${logoUrl})`,
                maskSize: 'contain', WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center', WebkitMaskPosition: 'center'
            }}
        ></div>
    );

    return (
        <motion.footer 
            className="bg-base-100 text-base-content relative p-1"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1 }}
        >
            {/* Animated Gradient Border */}
            <div className="absolute inset-0 z-0 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent animate-gradient-xy"></div>
            
            <div className="relative z-10 bg-base-100 rounded-[15px] p-8 sm:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 text-center md:text-left">
                    
                    {/* Column 1 & 2: Branding, Links, and DONATION */}
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {/* Brand Info & Donation */}
                        <div className="sm:col-span-1 flex flex-col items-center md:items-start">
                           <AnimatedLogo size="w-16 h-16" />
                           <p className="font-bold text-lg mt-4">Mind Over Myth</p>
                           <p className="text-base-content/70 mt-2 text-sm">Philosophy & Design for the Modern Thinker.</p>
                           
                           {/* ✅ Donation CTA Added Here */}
                           <div className="mt-6 text-center md:text-left">
                                <h3 className="font-semibold text-primary">Support Our Mission</h3>
                                <p className="text-xs text-base-content/60 mt-1">Our platform is community-supported. Your contribution helps us grow.</p>
                                <Link to="/donate" className="btn btn-primary btn-xs mt-3">
                                    <FaHeart className="mr-1" /> Support Us
                                </Link>
                           </div>
                        </div>

                        {/* Explore Links */}
                        <nav className="flex flex-col gap-2">
                            <h6 className="footer-title">Explore</h6> 
                            <Link to="/community" className="link link-hover">Community</Link>
                            <Link to="/library" className="link link-hover">The Library</Link>
                            <Link to="/mindfulness" className="link link-hover">Mindfulness</Link>
                            <Link to="/gaming-zone" className="link link-hover">Gaming Zone</Link>
                        </nav> 
                        
                        {/* Connect Links */}
                        <nav className="flex flex-col gap-2">
                            <h6 className="footer-title">Connect</h6> 
                            <Link to="/about" className="link link-hover">About Us</Link>
                            <Link to="/store" className="link link-hover">Store</Link>
                            <Link to="/contact" className="link link-hover">Contact</Link>
                        </nav>
                    </div>

                    {/* Column 3: Partnership CTA */}
                    <div className="md:col-span-2 lg:col-span-5 bg-base-200/50 p-6 rounded-2xl">
                        <h6 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Grow With Us</h6>
                        <p className="text-sm text-base-content/70 my-3">
                            We offer unique opportunities for brands and sellers to connect with our dedicated and mindful audience.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                             <Link to="/sponsorship" className="btn btn-primary btn-sm flex-1">Become a Sponsor</Link>
                             <Link to="/sell-with-us" className="btn btn-secondary btn-outline btn-sm flex-1">Sell Your Products</Link>
                        </div>
                    </div>
                </div>

                {/* --- Sub-Footer --- */}
                <div className="mt-12 pt-8 border-t border-base-300/50 flex flex-col sm:flex-row justify-between items-center text-center gap-4">
                    <p className="text-sm text-base-content/70">&copy; {new Date().getFullYear()} Mind Over Myth. All Rights Reserved.</p>
                    <div className="flex justify-center gap-5 text-base-content/70">
                       <a href="#" className="hover:text-primary transition-colors"><FaTwitter className="text-xl" /></a>
                       <a href="#" className="hover:text-primary transition-colors"><FaInstagram className="text-xl" /></a>
                       <a href="#" className="hover:text-primary transition-colors"><FaLinkedinIn className="text-xl" /></a>
                    </div>
                </div>
            </div>
        </motion.footer>
    );
};

export default Footer;