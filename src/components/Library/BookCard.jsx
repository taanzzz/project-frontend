// 📁 File: src/components/Library/BookCard.jsx

import React from 'react';
import { Link } from 'react-router';
import { FaBookmark, FaRegBookmark, FaStar, FaHeadphones } from "react-icons/fa";

const BookCard = ({ book, onPlayAudio, onToggleBookmark, isBookmarked }) => (
    // Gradient border wrapper
    <div className="p-px bg-gradient-to-br from-base-300 to-base-300 hover:from-primary hover:to-secondary rounded-2xl transition-all duration-300 h-full">
        <div className="card bg-base-100 h-full rounded-[15px] shadow-lg transition-all duration-300 group">
            <figure className="h-64 relative">
                <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                     <Link to={`/library/item/${book._id}`} className="btn btn-sm border-none text-white bg-gradient-to-r from-primary to-secondary">View Details</Link>
                     {book.audioUrl && (
                        <button 
                            onClick={(e) => { e.preventDefault(); onPlayAudio(book); }} 
                            className="btn btn-sm btn-circle bg-secondary text-secondary-content"
                        >
                            <FaHeadphones />
                        </button>
                    )}
                </div>
                <div className="absolute top-3 right-3">
                    <button 
                        onClick={(e) => { e.preventDefault(); onToggleBookmark(book._id); }} 
                        className="btn btn-circle btn-sm bg-base-100/50 backdrop-blur-md text-white border-none"
                    >
                        {isBookmarked ? <FaBookmark className='text-secondary' /> : <FaRegBookmark />}
                    </button>
                </div>
            </figure>
            <div className="card-body p-4 justify-between">
                <div>
                    <h2 className="card-title h-14 text-base-content leading-tight">{book.title}</h2>
                    <p className="text-sm text-base-content/70">{book.author}</p>
                </div>
                <div className="flex items-center gap-1.5 text-amber-500 mt-2">
                    <FaStar /> 
                    <span className="font-bold text-base-content">
                        {book.averageRating ? book.averageRating.toFixed(1) : 'New'}
                    </span> 
                    <span className="text-xs text-base-content/50">
                        ({book.reviewCount || 0} Reviews)
                    </span>
                </div>
            </div>
        </div>
    </div>
);

export default BookCard;