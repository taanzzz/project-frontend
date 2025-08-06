// 📁 File: src/components/Community/CommentSection.jsx

import React, { useState, useEffect } from 'react';
import { FaRegCommentDots } from "react-icons/fa"; // Using a slightly different icon for a modern look
import CommentModal from './CommentModal';

const CommentSection = ({ post, highlightedCommentId }) => { 
    const [isModalOpen, setIsModalOpen] = useState(false);

    // This logic remains unchanged: automatically opens the modal if a specific comment is highlighted.
    useEffect(() => {
        if (highlightedCommentId) {
            setIsModalOpen(true);
        }
    }, [highlightedCommentId]);
    
    return (
        <div className="w-full flex justify-end">
            <button 
                onClick={() => setIsModalOpen(true)} 
                className="flex items-center gap-1.5 p-2 rounded-full transition-all duration-300 group bg-transparent hover:bg-base-300/50"
                aria-label="View or add comments"
            >
                <FaRegCommentDots className="text-xl text-base-content/50 transition-colors duration-300 group-hover:text-base-content" />
            </button>
            
            {/* The modal is only rendered in the DOM when it's supposed to be open, improving performance. */}
            {isModalOpen && (
                <CommentModal 
                    post={post} 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    highlightedCommentId={highlightedCommentId} 
                />
            )}
        </div>
    );
};

export default CommentSection;