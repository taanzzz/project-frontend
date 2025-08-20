import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../../api/Axios';
import { toast } from 'react-toastify';
import { FaPlus, FaStickyNote, FaQuoteLeft, FaThumbtack } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';

const BookNotes = ({ bookId }) => {
    const queryClient = useQueryClient();
    const [text, setText] = useState('');
    const [type, setType] = useState('note');
    const { data: notes = [], isLoading } = useQuery({
        queryKey: ['notes', bookId],
        queryFn: async () => (await axiosSecure.get(`/api/notes/${bookId}`)).data,
        enabled: !!bookId
    });
    const mutation = useMutation({
        mutationFn: (newNote) => axiosSecure.post('/api/notes', newNote),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes', bookId] });
            setText('');
            toast.success("Note added successfully!");
        }
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        mutation.mutate({ contentId: bookId, text, type });
    };

    // Filter out "Completed" notes
    const filteredNotes = notes.filter(note => note.text !== 'Completed' && (note.type === 'note' || note.type === 'quote'));

    return (
        <div className="p-6 bg-base-100/50 backdrop-blur-lg border border-base-300/20 rounded-2xl shadow-xl">
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                <FaStickyNote /> 
                My Notes & Highlights
            </h4>
            
            <div className="space-y-4 max-h-56 overflow-y-auto mb-4 pr-2 custom-scrollbar">
                {isLoading ? (
                    <div className="flex justify-center p-4"><span className="loading loading-dots loading-md"></span></div>
                ) : (
                    <AnimatePresence>
                        {filteredNotes.map(note => (
                            <motion.div 
                                key={note._id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            >
                                {note.type === 'quote' ? (
                                    <div className="p-4 bg-base-100 rounded-lg border-l-4 border-secondary shadow-sm">
                                        <p className="italic text-base-content/90 flex gap-3">
                                            <FaQuoteLeft className="text-secondary/50 flex-shrink-0" />
                                            <span>"{note.text}"</span>
                                        </p>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg shadow-sm transform -rotate-2">
                                        <p className="text-yellow-800 dark:text-yellow-200 flex gap-3">
                                            <FaThumbtack className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
                                            <span>{note.text}</span>
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
                
                {!isLoading && filteredNotes.length === 0 && (
                    <p className="text-center text-sm text-base-content/60 py-8">No notes for this book yet. Add your first thought!</p>
                )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-3 pt-4 border-t border-base-300/20">
                <textarea 
                    value={text} 
                    onChange={(e) => setText(e.target.value)}
                    className="textarea w-full bg-base-200/50 border-2 border-base-300/50 focus:border-primary focus:ring-primary/50" 
                    placeholder="Add a new note or a favorite quote..." 
                    rows={3}
                />
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                    <div className="join">
                        <button type="button" onClick={() => setType('note')} className={`btn join-item btn-sm ${type === 'note' ? 'btn-primary' : 'btn-ghost'}`}>
                            <FaStickyNote /> Note
                        </button>
                        <button type="button" onClick={() => setType('quote')} className={`btn join-item btn-sm ${type === 'quote' ? 'btn-primary' : 'btn-ghost'}`}>
                            <FaQuoteLeft /> Quote
                        </button>
                    </div>
                    <button type="submit" className="btn btn-sm border-none text-white bg-gradient-to-r from-primary to-secondary rounded-full w-full sm:w-auto" disabled={mutation.isLoading}>
                        {mutation.isLoading ? <span className="loading loading-spinner-xs"></span> : <><FaPlus className="mr-1" /> Add Note</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookNotes;