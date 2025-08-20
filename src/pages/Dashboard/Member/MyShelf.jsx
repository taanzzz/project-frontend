import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../../api/Axios';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import { Link } from 'react-router';
import { FaThLarge, FaList, FaFilter, FaStickyNote, FaFire, FaBook, FaCheckCircle, FaBullseye, FaEdit, FaPlus, FaQuoteLeft, FaThumbtack } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { toast } from 'react-toastify';
import useUserProfile from '../../../hooks/useUserProfile';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- BookNotes Component (Unchanged) ---
const BookNotes = ({ bookId, isDark }) => {
    // This component's logic remains exactly the same as the last version.
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

    const filteredNotes = notes.filter(note => note.text !== 'Completed' && (note.type === 'note' || note.type === 'quote'));

    return (
        <motion.div
            className={`p-6 ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30'} backdrop-blur-xl border rounded-3xl shadow-lg`}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
        >
            <h4 className={`font-bold text-lg mb-4 flex items-center gap-2 bg-gradient-to-r ${isDark ? 'from-indigo-400 to-purple-400' : 'from-pink-500 to-rose-500'} bg-clip-text text-transparent`}>
                <FaStickyNote /> My Notes & Highlights
            </h4>
            <div className="space-y-4 max-h-56 overflow-y-auto mb-4 pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: isDark ? '#4f46e5 #374151' : '#ec4899 #f3f4f6' }}>
                {isLoading ? (
                    <div className="flex justify-center p-4"><span className={`loading loading-dots loading-md ${isDark ? 'text-indigo-400' : 'text-pink-500'}`}></span></div>
                ) : (
                    <AnimatePresence>
                        {filteredNotes.map(note => (
                            <motion.div key={note._id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
                                {note.type === 'quote' ? (
                                    <div className={`p-4 ${isDark ? 'bg-white/5 border-l-indigo-400' : 'bg-white/60 border-l-pink-400'} backdrop-blur-md rounded-xl border-l-4 shadow-sm`}>
                                        <p className={`italic ${isDark ? 'text-gray-300' : 'text-gray-700'} flex gap-3`}><FaQuoteLeft className={`${isDark ? 'text-indigo-400/50' : 'text-pink-400/50'} flex-shrink-0`} /><span>"{note.text}"</span></p>
                                    </div>
                                ) : (
                                    <div className={`p-4 ${isDark ? 'bg-yellow-900/30 border border-yellow-600/30' : 'bg-yellow-50/80 border border-yellow-200/50'} backdrop-blur-md rounded-xl shadow-sm transform hover:rotate-1 transition-transform`}>
                                        <p className={`${isDark ? 'text-yellow-200' : 'text-yellow-800'} flex gap-3`}><FaThumbtack className={`${isDark ? 'text-yellow-400' : 'text-yellow-600'} flex-shrink-0 mt-1`} /><span>{note.text}</span></p>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
                {!isLoading && filteredNotes.length === 0 && (<p className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} py-8`}>No notes for this book yet. Add your first thought!</p>)}
            </div>
            <form onSubmit={handleSubmit} className={`space-y-3 pt-4 border-t ${isDark ? 'border-white/20' : 'border-pink-200/50'}`}>
                <textarea value={text} onChange={(e) => setText(e.target.value)} className={`textarea w-full ${isDark ? 'bg-gray-800/50 text-gray-300 border-white/20' : 'bg-white/80 text-gray-600 border-pink-200/50'} backdrop-blur-md rounded-xl p-4 text-lg placeholder:${isDark ? 'text-gray-400' : 'text-gray-500'} focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300`} placeholder="Add a new note or a favorite quote..." rows={3}/>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button type="button" onClick={() => setType('note')} className={`btn btn-sm flex-1 sm:flex-none rounded-xl border-none ${type === 'note' ? (isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white') : (isDark ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-white/60 text-gray-600 hover:bg-white/80')}`}><FaStickyNote /> Note</button>
                        <button type="button" onClick={() => setType('quote')} className={`btn btn-sm flex-1 sm:flex-none rounded-xl border-none ${type === 'quote' ? (isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white') : (isDark ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-white/60 text-gray-600 hover:bg-white/80')}`}><FaQuoteLeft /> Quote</button>
                    </div>
                    <motion.button type="submit" className={`btn btn-sm border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-pink-500/30 hover:from-pink-600 hover:to-rose-600'} rounded-xl w-full sm:w-auto transition-all duration-300`} disabled={mutation.isLoading} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        {mutation.isLoading ? <span className="loading loading-spinner-xs"></span> : <><FaPlus className="mr-1" /> Add Note</>}
                    </motion.button>
                </div>
            </form>
        </motion.div>
    );
};

// --- BookRow Component for List View (Unchanged) ---
const BookRow = ({ book, onMarkAsRead, isRead, isDark }) => {
    const [showNotes, setShowNotes] = useState(false);

    return (
        <motion.div
            layout
            className={`${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30'} backdrop-blur-md border rounded-3xl shadow-lg hover:scale-[1.01] transition-all duration-300`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center p-6 gap-4">
                {/* Book cover */}
                <motion.img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-16 h-24 sm:w-20 sm:h-28 object-cover rounded-xl shadow-lg flex-shrink-0 mx-auto sm:mx-0"
                    whileHover={{ scale: 1.05, rotateY: 5 }}
                    transition={{ duration: 0.3 }}
                />

                {/* Book details */}
                <div className="flex-grow text-center sm:text-left">
                    <Link to={`/library/item/${book._id}`} className="hover:underline">
                        <p className={`font-bold text-lg sm:text-xl ${isDark ? 'text-gray-100' : 'text-gray-800'} hover:bg-gradient-to-r ${isDark ? 'hover:from-indigo-400 hover:to-purple-400' : 'hover:from-pink-500 hover:to-rose-500'} hover:bg-clip-text hover:text-transparent transition-all duration-300`}>
                            {book.title}
                        </p>
                    </Link>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                        {book.author}
                    </p>
                    <div className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}>
                        {book.category}
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    {/* Notes button first */}
                    <motion.button
                        onClick={() => setShowNotes(!showNotes)}
                        className={`btn btn-sm btn-ghost rounded-xl ${isDark ? 'text-gray-300 hover:bg-white/20' : 'text-gray-600 hover:bg-white/90'} w-full sm:w-auto`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaStickyNote /> {showNotes ? 'Hide Notes' : 'Notes'}
                    </motion.button>

                    {/* Completed / Mark as Read — always after Notes in DOM */}
                    <AnimatePresence mode="wait">
                        {isRead ? (
                            <motion.div
                                key="completed"
                                className={`flex items-center gap-2 ${isDark ? 'text-green-400' : 'text-green-600'} font-semibold text-sm sm:text-base order-last sm:order-none`}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                            >
                                <FaCheckCircle /> Completed
                            </motion.div>
                        ) : (
                            <motion.button
                                key="mark-as-read"
                                onClick={() => onMarkAsRead(book._id)}
                                className={`btn btn-sm border-none text-white ${isDark ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'} rounded-xl transition-all duration-300 w-full sm:w-auto`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                            >
                                Mark as Read
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Notes section */}
            <AnimatePresence>
                {showNotes && (
                    <motion.div
                        className="px-6 pb-6"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <BookNotes bookId={book._id} isDark={isDark} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};


// --- Book3D Component (Unchanged) ---
// --- Book3D Component (FIXED CODE) ---
// এই কম্পোনেন্টের কোডটি প্রতিস্থাপন করুন।
const Book3D = ({ book, onMarkAsRead, isRead, isDark }) => {
    const [showNotes, setShowNotes] = useState(false);
    const notesRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notesRef.current && !notesRef.current.contains(event.target)) {
                setShowNotes(false);
            }
        };
        if (showNotes) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showNotes]);

    return (
        <div className="relative group h-full w-full flex items-center justify-center">
            <div className="book-3d" data-theme={isDark ? 'dark' : 'light'}>
                <Link to={`/library/item/${book._id}`}>
                    <img src={book.coverImage} alt={book.title} className="book-cover" />
                </Link>
            </div>

            {/* --- FIX START --- */}
            {/*
                সমস্যা সমাধানের জন্য এখানে একটিমাত্র কন্টেইনার ব্যবহার করা হয়েছে।
                - `isRead` সত্য হলে, Notes বাটন ও Completed ব্যাজ flex-col দিয়ে উল্লম্বভাবে সাজানো হয়েছে।
                - `isRead` মিথ্যা হলে, বাটনগুলো flex-row দিয়ে পাশাপাশি দেখানো হয়েছে।
                - `-bottom-16` ব্যবহার করে নিচে যথেষ্ট জায়গা তৈরি করা হয়েছে।
            */}
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-max flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                {isRead ? (
                    // বই পড়া হয়ে গেলে এই লেআউট দেখানো হবে (উল্লম্ব)
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowNotes(true); }}
                            className={`btn btn-circle btn-sm border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500'} shadow-lg`}
                            title="View Notes"
                        >
                            <FaStickyNote />
                        </button>
                        <div className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                            <FaCheckCircle /> Completed
                        </div>
                    </>
                ) : (
                    // বই পড়া না হলে এই লেআউট দেখানো হবে (পাশাপাশি)
                    <div className="flex flex-row gap-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowNotes(true); }}
                            className={`btn btn-circle btn-sm border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500'} shadow-lg`}
                            title="View Notes"
                        >
                            <FaStickyNote />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onMarkAsRead(book._id); }}
                            className="btn btn-circle btn-sm border-none text-white bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg"
                            title="Mark as Read"
                        >
                            <FaCheckCircle />
                        </button>
                    </div>
                )}
            </div>
            {/* --- FIX END --- */}

            <AnimatePresence>
                {showNotes && (
                    <motion.div ref={notesRef} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNotes(false)}>
                        <motion.div className="w-full max-w-md" initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()}>
                            <BookNotes bookId={book._id} isDark={isDark} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const MyShelf = () => {
    // --- All hooks and logic remain 100% unchanged ---
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') return localStorage.getItem('theme') || document.documentElement.getAttribute('data-theme') || 'light';
        return 'light';
    });
    const isDark = theme === 'dark';

    useEffect(() => {
        const handleThemeChange = () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || localStorage.getItem('theme') || 'light';
            setTheme(currentTheme);
        };
        const observer = new MutationObserver(handleThemeChange);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        window.addEventListener('storage', handleThemeChange);
        handleThemeChange(); // Initial check
        return () => { observer.disconnect(); window.removeEventListener('storage', handleThemeChange); };
    }, []);

    const [viewMode, setViewMode] = useState('grid');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [newGoal, setNewGoal] = useState(30);
    const queryClient = useQueryClient();
    const { data: bookmarkedBooks = [], isLoading: booksLoading } = useQuery({ queryKey: ['my-bookmarks-details'], queryFn: async () => (await axiosSecure.get('/api/bookmarks')).data });
    const { data: userProfile, isLoading: profileLoading, refetch: refetchProfile } = useUserProfile();
    const markAsReadMutation = useMutation({ mutationFn: (bookId) => axiosSecure.post('/api/users/mark-as-read', { contentId: bookId }), onSuccess: () => { toast.success('Congratulations! Book marked as read.'); refetchProfile(); }, onError: (error) => toast.error(error.response?.data?.message || 'Could not mark as read.') });
    const goalMutation = useMutation({ mutationFn: (target) => axiosSecure.patch('/api/users/reading-goal', { target }), onSuccess: () => { toast.success("Reading goal updated!"); refetchProfile(); setIsGoalModalOpen(false); }, onError: () => toast.error("Failed to update goal.") });
    const handleMarkAsRead = (bookId) => { markAsReadMutation.mutate(bookId); };
    const handleSetGoal = (e) => { e.preventDefault(); goalMutation.mutate(newGoal); };
    const categories = useMemo(() => ['All', ...new Set(bookmarkedBooks.map(book => book.category || 'Uncategorized'))], [bookmarkedBooks]);
    const filteredAndSortedBooks = useMemo(() => {
        let books = [...bookmarkedBooks];
        if (selectedCategory !== 'All') books = books.filter(book => (book.category || 'Uncategorized') === selectedCategory);
        if (sortBy === 'newest') books.sort((a, b) => new Date(b.bookmarkedAt || 0) - new Date(a.bookmarkedAt || 0));
        else if (sortBy === 'oldest') books.sort((a, b) => new Date(a.bookmarkedAt || 0) - new Date(b.bookmarkedAt || 0));
        else if (sortBy === 'title') books.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        return books;
    }, [bookmarkedBooks, selectedCategory, sortBy]);
    
    const readingGoal = userProfile?.readingGoal || { target: 30, completed: 0 };
    const goalProgress = Math.round((readingGoal.completed / (readingGoal.target || 1)) * 100);
    const readingStreak = userProfile?.readingStreak || { current: 0 };
    const categoryStats = useMemo(() => bookmarkedBooks.reduce((acc, book) => { const cat = book.category || 'Uncategorized'; acc[cat] = (acc[cat] || 0) + 1; return acc; }, {}), [bookmarkedBooks]);
    const chartData = { labels: Object.keys(categoryStats), datasets: [{ label: 'Books by Category', data: Object.values(categoryStats), backgroundColor: isDark ? ['#6366f1', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444'] : ['#ec4899', '#f43f5e', '#06b6d4', '#f59e0b', '#8b5cf6'], borderRadius: 8, borderWidth: 0 }] };
    const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { ticks: { color: isDark ? '#9ca3af' : '#6b7280' }, grid: { color: isDark ? '#374151' : '#f3f4f6' } }, x: { ticks: { color: isDark ? '#9ca3af' : '#6b7280' }, grid: { color: isDark ? '#374151' : '#f3f4f6' } } } };

    useEffect(() => { if (userProfile?.readingGoal?.target) { setNewGoal(userProfile.readingGoal.target); } }, [userProfile]);

    if (booksLoading || profileLoading) return <LoadingSpinner />;

    return (
        <>
            {/* FIX: CSS updated to handle different book sizes for different devices. */}
            <style jsx global>{`
                .bookshelf-container {
                    perspective: 1200px;
                }
                .book-3d {
                    position: relative;
                    transform-style: preserve-3d;
                    transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    cursor: pointer;
                    /* Default size for small devices */
                    width: 138px;
                    height: 200px;
                }
                .book-3d:hover {
                    transform: rotateY(-30deg) translateZ(15px) scale(1.05);
                }
                .book-3d .book-cover {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 2px 4px 4px 2px;
                }
                .book-3d[data-theme='light'] .book-cover { box-shadow: 5px 5px 25px rgba(0, 0, 0, 0.3); }
                .book-3d[data-theme='dark'] .book-cover { box-shadow: 5px 5px 30px rgba(0, 0, 0, 0.6); }
                .book-3d::before {
                    content: '';
                    position: absolute;
                    height: 100%;
                    top: 0;
                    left: 0;
                    transform: translateX(-100%) rotateY(90deg);
                    transform-origin: left;
                    border-radius: 4px 0 0 4px;
                    /* Spine width for small devices */
                    width: 22px;
                }
                .book-3d[data-theme='light']::before {
                    background: linear-gradient(to right, #e0c8a0, #bfae8f);
                    box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
                }
                .book-3d[data-theme='dark']::before {
                    background: linear-gradient(to right, #4a4a4a, #2a2a2a);
                    box-shadow: inset 0 0 8px rgba(0,0,0,0.5);
                }
                /* For sm screens and up, use the larger book size */
                @media (min-width: 640px) {
                    .book-3d {
                        width: 176px;
                        height: 256px;
                    }
                    .book-3d::before {
                        width: 28px;
                    }
                }
            `}</style>

            <div className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-b from-gray-900 via-indigo-950 to-gray-900' : 'bg-gradient-to-b from-pink-50 via-rose-50 to-pink-50'} min-h-screen`}>
                <div className="absolute inset-0"><div className={`absolute top-20 left-1/4 w-96 h-96 ${isDark ? 'bg-indigo-500/20' : 'bg-pink-400/15'} rounded-full blur-3xl animate-pulse`} /><div className={`absolute bottom-20 right-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/20' : 'bg-rose-400/15'} rounded-full blur-3xl animate-pulse delay-1000`} /><div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 ${isDark ? 'bg-blue-500/15' : 'bg-orange-400/10'} rounded-full blur-3xl animate-pulse delay-2000`} /></div>
                <div className="relative z-10 p-4 sm:p-6">
                    {/* Header */}
                    <motion.div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
                        <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r ${isDark ? 'from-indigo-400 to-purple-400' : 'from-pink-500 to-rose-500'} bg-clip-text text-transparent`}>My Reading Dashboard</h1>
                        <motion.div className={`flex items-center gap-1 p-1 ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/70 border-pink-200/50'} backdrop-blur-md border rounded-full shadow-lg`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}>
                            <motion.button onClick={() => setViewMode('grid')} className={`btn btn-sm rounded-full border-none ${viewMode === 'grid' ? (isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-pink-500/30') : (isDark ? 'bg-transparent text-gray-300 hover:bg-white/10' : 'bg-transparent text-gray-600 hover:bg-white/60')}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><FaThLarge /> Shelf</motion.button>
                            <motion.button onClick={() => setViewMode('list')} className={`btn btn-sm rounded-full border-none ${viewMode === 'list' ? (isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-pink-500/30') : (isDark ? 'bg-transparent text-gray-300 hover:bg-white/10' : 'bg-transparent text-gray-600 hover:bg-white/60')}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><FaList /> List</motion.button>
                        </motion.div>
                    </motion.div>
                    {/* Stats Dashboard */}
                    <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}>
                        <motion.div className={`${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30'} backdrop-blur-md border shadow-lg rounded-3xl p-6 flex flex-col items-center justify-center relative sm:col-span-2 lg:col-span-1 lg:row-span-2`} whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}><motion.button onClick={() => setIsGoalModalOpen(true)} className={`btn btn-ghost btn-circle btn-sm absolute top-3 right-3 ${isDark ? 'text-gray-300 hover:bg-white/20' : 'text-gray-600 hover:bg-white/60'}`} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}><FaEdit /></motion.button><div className="w-32 h-32 sm:w-36 sm:h-36 mb-4"><CircularProgressbar value={goalProgress} text={`${goalProgress}%`} styles={buildStyles({ pathColor: isDark ? '#6366f1' : '#ec4899', textColor: isDark ? '#6366f1' : '#ec4899', trailColor: isDark ? '#374151' : '#f3f4f6', textSize: '16px' })} /></div><div className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}><p className="text-sm font-medium opacity-70 mb-1">Yearly Reading Goal</p><p className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{readingGoal.completed} / {readingGoal.target}</p></div></motion.div>
                        <motion.div className={`${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30'} backdrop-blur-md border shadow-lg rounded-3xl p-6`} whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}><div className="flex items-center justify-between mb-2"><div className={`p-3 rounded-2xl ${isDark ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20' : 'bg-gradient-to-br from-pink-500/20 to-rose-500/20'}`}><FaBook className={`w-6 h-6 ${isDark ? 'text-indigo-400' : 'text-pink-500'}`} /></div></div><p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Books on Shelf</p><p className={`text-3xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{bookmarkedBooks.length}</p></motion.div>
                        <motion.div className={`${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30'} backdrop-blur-md border shadow-lg rounded-3xl p-6`} whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}><div className="flex items-center justify-between mb-2"><div className={`p-3 rounded-2xl ${isDark ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20' : 'bg-gradient-to-br from-orange-500/20 to-red-500/20'}`}><FaFire className="w-6 h-6 text-orange-500" /></div></div><p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Reading Streak</p><p className={`text-3xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{readingStreak.current} <span className="text-lg">Days</span></p></motion.div>
                        <motion.div className={`${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30'} backdrop-blur-md border shadow-lg rounded-3xl p-4 sm:p-6 sm:col-span-2 lg:col-span-2`} whileHover={{ scale: 1.01 }} transition={{ duration: 0.3 }}><p className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>Category Breakdown</p><div style={{ height: '160px' }}><Bar data={chartData} options={chartOptions} /></div></motion.div>
                    </motion.div>
                    {/* Filters and Controls */}
                    <motion.div className={`${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30'} backdrop-blur-md border p-4 sm:p-6 rounded-3xl shadow-lg mb-8 sticky top-4 z-30`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}>
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"><div className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}><FaFilter className={isDark ? 'text-indigo-400' : 'text-pink-500'} /> <span className="font-semibold">Filter & Sort:</span></div><div className="flex flex-wrap gap-2 max-w-full overflow-x-auto">{categories.map(cat => (<motion.button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${selectedCategory === cat ? (isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-pink-500/30') : (isDark ? 'bg-white/5 text-gray-300 hover:bg-white/10' : 'bg-white/60 text-gray-600 hover:bg-white/80')}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>{cat}</motion.button>))}</div><select className={`select select-bordered border-none rounded-xl ${isDark ? 'bg-white/10 text-gray-300 border-white/20' : 'bg-white/80 text-gray-600 border-pink-200/50'} backdrop-blur-md focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'}`} value={sortBy} onChange={(e) => setSortBy(e.target.value)}><option value="newest">Newest First</option><option value="oldest">Oldest First</option><option value="title">By Title (A-Z)</option></select></div>
                    </motion.div>
                    {/* Books Display */}
                    {filteredAndSortedBooks.length > 0 ? (
                        viewMode === 'grid' ? (
                            <motion.div
                                className="bookshelf-container grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 sm:gap-x-8 gap-y-24 justify-items-center py-12"
                                variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                                initial="hidden"
                                animate="visible"
                            >
                               {filteredAndSortedBooks.map((book) => (
                                    // FIX: Responsive size for the book container div
                                    <motion.div 
                                        key={book._id} 
                                        className="h-[200px] w-[138px] sm:h-[256px] sm:w-[176px]"
                                        variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                                    >
                                         <Book3D book={book} onMarkAsRead={handleMarkAsRead} isRead={userProfile?.readBooks?.includes(book._id)} isDark={isDark} />
                                     </motion.div>
                               ))}
                            </motion.div>
                        ) : (
                            <motion.div className="space-y-4 sm:space-y-6" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
                                {filteredAndSortedBooks.map((book) => (<BookRow key={book._id} book={book} onMarkAsRead={handleMarkAsRead} isRead={userProfile?.readBooks?.includes(book._id)} isDark={isDark}/>))}
                            </motion.div>
                        )
                    ) : (
                        <motion.div className={`text-center py-20 ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30'} backdrop-blur-md border rounded-3xl shadow-lg`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
                            <motion.div className={`w-20 h-20 mx-auto mb-6 rounded-full ${isDark ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20' : 'bg-gradient-to-br from-pink-500/20 to-rose-500/20'} flex items-center justify-center`} animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}><FaBook className={`w-8 h-8 ${isDark ? 'text-indigo-400' : 'text-pink-500'}`} /></motion.div>
                            <p className={`text-xl font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Your shelf for this category is empty.</p>
                            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Discover amazing books and build your personal library!</p>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Link to="/library" className={`btn btn-lg border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-pink-500/30 hover:from-pink-600 hover:to-rose-600'} rounded-xl transition-all duration-300`}><FaBook className="mr-2" /> Explore & Add Books</Link></motion.div>
                        </motion.div>
                    )}
                    {/* Goal Setting Modal */}
                    <AnimatePresence>
                        {isGoalModalOpen && (<motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div className={`${isDark ? 'bg-gray-800 border-white/20' : 'bg-white border-pink-200/50'} backdrop-blur-xl border rounded-3xl shadow-2xl p-8 w-full max-w-md`} initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}><h3 className={`font-bold text-2xl mb-6 bg-gradient-to-r ${isDark ? 'from-indigo-400 to-purple-400' : 'from-pink-500 to-rose-500'} bg-clip-text text-transparent`}>Set Your Yearly Reading Goal</h3><form onSubmit={handleSetGoal}><div className="mb-6"><label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>How many books do you aim to read this year?</label><input type="number" value={newGoal} onChange={(e) => setNewGoal(e.target.value)} className={`w-full px-4 py-3 ${isDark ? 'bg-gray-700/50 text-gray-300 border-white/20' : 'bg-white/80 text-gray-600 border-pink-200/50'} backdrop-blur-md border rounded-xl text-lg focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300`} min="1" placeholder="30"/></div><div className="flex gap-3"><motion.button type="button" className={`btn flex-1 border-none ${isDark ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-white/60 text-gray-600 hover:bg-white/80'} rounded-xl`} onClick={() => setIsGoalModalOpen(false)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Cancel</motion.button><motion.button type="submit" className={`btn flex-1 border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-pink-500/30 hover:from-pink-600 hover:to-rose-600'} rounded-xl transition-all duration-300`} disabled={goalMutation.isLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>{goalMutation.isLoading ? (<span className="loading loading-spinner-sm"></span>) : (<><FaBullseye className="mr-2" />Set Goal</>)}</motion.button></div></form></motion.div></motion.div>)}
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
};

export default MyShelf;