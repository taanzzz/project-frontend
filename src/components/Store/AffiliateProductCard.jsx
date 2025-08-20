import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';

const AffiliateProductCard = ({ product }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const isDark = theme === 'dark';
    const buttonText = `Buy on ${product.purchaseSource || 'Partner Site'}`;

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

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <motion.div
            variants={cardVariants}
            className={`card ${isDark ? 'bg-gray-900/95 border-white/20' : 'bg-white/95 border-pink-200/50'} backdrop-blur-md rounded-3xl shadow-lg ${isDark ? 'shadow-indigo-500/30' : 'shadow-pink-500/30'} transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group flex flex-col h-full`}
        >
            <Link
                to={`/store/products/${product._id}`}
                className="flex flex-col h-full"
            >
                <figure className="relative">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-56 object-cover rounded-t-3xl"
                    />
                    <div className={`absolute top-4 left-4 badge border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500'} rounded-lg px-3 py-1 text-sm font-semibold shadow-sm`}>
                        Affiliate
                    </div>
                </figure>
                
                <div className="card-body p-6 flex flex-col flex-grow">
                    <h2 className={`card-title font-bold text-xl h-14 ${isDark ? 'text-gray-100' : 'text-gray-600'}`}>
                        {product.name}
                    </h2>
                    <p className={`text-sm flex-grow ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {product.description}
                    </p>
                    <p className={`text-xs italic mt-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        We earn a small commission if you buy from this link.
                    </p>
                    <div className="card-actions mt-4">
                        <a
                            href={product.affiliateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`btn w-full border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'} rounded-xl shadow-lg ${isDark ? 'shadow-indigo-500/30' : 'shadow-pink-500/30'} hover:shadow-xl transition-all duration-300`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {buttonText}
                        </a>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default AffiliateProductCard;