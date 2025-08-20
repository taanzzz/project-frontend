// 📁 File: src/pages/Dashboard/Admin/ContentReviewModal.jsx

import React from 'react';
import { format } from 'date-fns';
import { FaBook, FaHeadphones, FaRegFilePdf, FaCheck, FaTimes, FaTrash } from 'react-icons/fa';

const ContentReviewModal = ({ item, isOpen, onClose, onAction }) => {
    if (!isOpen || !item) return null;

    return (
        <dialog open className="modal modal-open backdrop-blur-md">
            <div className="modal-box w-11/12 max-w-4xl">
                <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                <h3 className="font-bold text-2xl mb-4">{item.title}</h3>
                <p className="text-lg text-base-content/70 -mt-2 mb-4">by {item.author}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column: Cover & Details */}
                    <div className="md:col-span-1">
                        <img src={item.coverImage} alt={item.title} className="w-full rounded-lg shadow-lg mb-4"/>
                        <div className="text-sm space-y-2">
                            <p><strong>Contributor:</strong> {item.authorInfo.name}</p>
                            <p><strong>Category:</strong> {item.category}</p>
                            <p><strong>Submitted:</strong> {format(new Date(item.createdAt), 'dd MMM, yyyy')}</p>
                            <div className="flex flex-wrap gap-2">
                                {item.type?.map(t => <div key={t} className="badge badge-primary">{t}</div>)}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Content Preview & Actions */}
                    <div className="md:col-span-2">
                        <p className="font-semibold">Description:</p>
                        <p className="bg-base-200 p-3 rounded-lg mb-4">{item.description}</p>
                        
                        {item.flipbookEmbedCode && (
                            <>
                                <p className="font-semibold">Flipbook Preview:</p>
                                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                                    <iframe src={item.flipbookEmbedCode} width="100%" height="100%" allowFullScreen></iframe>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="modal-action mt-6 pt-4 border-t">
                    <button onClick={() => onAction('delete', item._id)} className="btn btn-error text-white"><FaTrash /> Delete</button>
                    <div className="flex-grow"></div>
                    <button onClick={() => onAction('rejected', item._id)} className="btn btn-warning">Reject</button>
                    <button onClick={() => onAction('approved', item._id)} className="btn btn-success">Approve</button>
                </div>
            </div>
        </dialog>
    );
};

export default ContentReviewModal;