// 📁 File: src/components/Store/ProductCard.jsx

import React from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

const ProductCard = ({ product }) => {
    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <motion.div variants={cardVariants}>
            <Link to={`/store/products/${product._id}`} className="block group">
                {/* --- Main Card Container --- */}
                <div className="relative bg-base-100 rounded-2xl shadow-lg pt-40 p-6 text-center transition-all duration-300 ease-in-out h-96 group-hover:shadow-2xl">
                    
                    {/* --- Floating Product Image --- */}
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-4/5 transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-105">
                        <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                        />
                    </div>

                    {/* --- Text Content --- */}
                    <div className="relative">
                        {/* Product Name with Gradient */}
                        <h2 className="text-xl font-bold h-14 leading-tight bg-gradient-to-br from-base-content via-base-content/80 to-base-content/60 bg-clip-text text-transparent">
                            {product.name}
                        </h2>

                        {/* Price */}
                        <p className="font-semibold text-primary text-lg mt-2">
                            ${product.price.toFixed(2)}
                        </p>
                    </div>

                    {/* --- Hover Action Text --- */}
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-2 text-base-content/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>View Product</span>
                        <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;