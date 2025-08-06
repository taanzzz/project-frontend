// 📁 File: src/components/Store/CategoryCard.jsx

import React from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';

const CategoryCard = ({ category }) => {
    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <motion.div variants={cardVariants}>
            <Link to={category.link} className="card h-80 bg-base-100 shadow-xl group relative block overflow-hidden rounded-2xl">
                
                {/* Background Image with Parallax-like Hover Effect */}
                <motion.img 
                    src={category.imageUrl} 
                    alt={category.name} 
                    className="absolute inset-0 w-full h-full object-cover"
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
                
                {/* Glassmorphic Panel for Text */}
                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-xl bg-base-100/30 backdrop-blur-lg border border-white/20 shadow-2xl">
                    <h2 className="card-title text-4xl font-black tracking-tighter text-center justify-center">
                        <span className="bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent drop-shadow-lg">
                            {category.name}
                        </span>
                    </h2>
                </div>

            </Link>
        </motion.div>
    );
};

export default CategoryCard;