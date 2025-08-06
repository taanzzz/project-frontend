// 📁 File: src/pages/Dashboard/Member/BookNotes.jsx

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../../api/Axios';
import { toast } from 'react-toastify';
import { FaPlus, FaStickyNote, FaQuoteLeft } from "react-icons/fa";

const BookNotes = ({ bookId }) => {
    const queryClient = useQueryClient();
    const [text, setText] = useState('');
    const [type, setType] = useState('note'); // 'note' or 'quote'

    const { data: notes = [], isLoading } = useQuery({
        queryKey: ['notes', bookId],
        queryFn: async () => (await axiosSecure.get(`/api/notes/${bookId}`)).data,
        enabled: !!bookId,
    });

    const mutation = useMutation({
        mutationFn: (newNote) => axiosSecure.post('/api/notes', newNote),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes', bookId] });
            setText('');
            toast.success("Successfully added!");
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        mutation.mutate({ contentId: bookId, text, type });
    };

    return (
        <div className="mt-4 p-4 bg-base-200/50 rounded-lg">
            <h4 className="font-bold mb-4">My Notes & Highlights</h4>
            {/* নোট এবং উক্তি দেখানোর জায়গা */}
            <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                {notes.map(note => (
                    <div key={note._id} className="flex gap-3 text-sm">
                        {note.type === 'quote' ? <FaQuoteLeft className="mt-1" /> : <FaStickyNote className="mt-1" />}
                        <p className="flex-grow italic">"{note.text}"</p>
                    </div>
                ))}
            </div>
            {/* নতুন নোট/উক্তি যোগ করার ফর্ম */}
            <form onSubmit={handleSubmit} className="space-y-2">
                <textarea 
                    value={text} 
                    onChange={(e) => setText(e.target.value)}
                    className="textarea textarea-bordered w-full" 
                    placeholder="Add a new note or a favorite quote..." 
                    rows={2}
                />
                <div className="flex justify-between items-center">
                    <div className="join">
                        <button type="button" onClick={() => setType('note')} className={`btn join-item btn-xs ${type === 'note' ? 'btn-primary' : ''}`}>Note</button>
                        <button type="button" onClick={() => setType('quote')} className={`btn join-item btn-xs ${type === 'quote' ? 'btn-primary' : ''}`}>Quote</button>
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm">
                        <FaPlus /> Add
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookNotes;