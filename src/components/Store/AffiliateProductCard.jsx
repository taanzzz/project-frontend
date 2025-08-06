// 📁 File: src/components/Store/AffiliateProductCard.jsx

import React from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';

const AffiliateProductCard = ({ product }) => {
    const buttonText = `Buy on ${product.purchaseSource || 'Partner Site'}`;
    
    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <motion.div variants={cardVariants}>
            {/* ✅ Main Link wraps the entire card for internal navigation */}
            <Link 
                to={`/store/products/${product._id}`}
                className="card bg-base-100 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group flex flex-col h-full"
            >
                <figure className="relative">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-56 object-cover" />
                    <div className="absolute top-4 left-4 badge border-none text-white bg-gradient-to-r from-primary to-secondary">
                        Affiliate
                    </div>
                </figure>
                
                <div className="card-body p-6 flex flex-col flex-grow">
                    <h2 className="card-title font-bold text-xl h-14">{product.name}</h2>
                    <p className="text-base-content/70 text-sm flex-grow">{product.description}</p>
                    <p className="text-xs text-base-content/50 italic mt-4">
                        We earn a small commission if you buy from this link.
                    </p>
                    <div className="card-actions mt-4">
                        {/* ✅ External link is now just a button. onClick stops propagation. */}
                        <a 
                            href={product.affiliateUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn w-full border-none text-white bg-gradient-to-r from-primary to-secondary transform hover:scale-105 transition-transform"
                            onClick={(e) => e.stopPropagation()} // Prevents the Link behind it from firing
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