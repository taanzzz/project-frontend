// 📁 File: src/pages/Dashboard/Member/MyShelf.jsx

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../../api/Axios';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import { Link } from 'react-router';
import { FaThLarge, FaList, FaFilter, FaStickyNote, FaFire, FaBook, FaCheckCircle, FaBullseye } from "react-icons/fa";
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { toast } from 'react-toastify';
import BookNotes from './BookNotes';
import useUserProfile from '../../../hooks/useUserProfile';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- BookRow ---
const BookRow = ({ book, onMarkAsRead, isRead }) => {
    const [showNotes, setShowNotes] = useState(false);
    return (
        <div className="bg-base-100 rounded-lg shadow transition-all">
            <div className="flex items-center p-4">
                <img src={book.coverImage} alt={book.title} className="w-12 h-16 object-cover rounded mr-4" />
                <div className="flex-grow">
                    <Link to={`/library/item/${book._id}`} className="hover:underline"><p className="font-bold">{book.title}</p></Link>
                    <p className="text-sm text-base-content/70">{book.author}</p>
                </div>
                <div className="flex flex-col items-end gap-2 ml-4">
                    <div className="badge badge-outline">{book.category}</div>
                    {isRead ? (
                        <div className="flex items-center gap-1 text-success text-sm font-semibold"><FaCheckCircle /> Read</div>
                    ) : (
                        <button onClick={() => onMarkAsRead(book._id)} className="btn btn-primary btn-xs">Mark as Read</button>
                    )}
                </div>
            </div>
            <div className="px-4 pb-2 text-right border-t border-base-200 pt-2">
                <button onClick={() => setShowNotes(!showNotes)} className="btn btn-ghost btn-xs"><FaStickyNote /> {showNotes ? 'Hide Notes' : 'Show Notes'}</button>
            </div>
            {showNotes && <BookNotes bookId={book._id} />}
        </div>
    );
};

// --- Book3D ---
const Book3D = ({ book, onMarkAsRead, isRead }) => {
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
        <div className="relative group">
            <Link to={`/library/item/${book._id}`}><div className="book-3d"><img src={book.coverImage} alt={book.title} className="book-cover" /></div></Link>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowNotes(!showNotes); }} className="btn btn-primary btn-xs"><FaStickyNote /> Notes</button>
                {!isRead && <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onMarkAsRead(book._id); }} className="btn btn-secondary btn-xs"><FaCheckCircle /> Mark Read</button>}
            </div>
            {isRead && <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 badge badge-success gap-1 opacity-0 group-hover:opacity-100"><FaCheckCircle /> Read</div>}
            {showNotes && <div ref={notesRef} className="absolute top-full left-0 w-64 mt-2 z-20"><BookNotes bookId={book._id} /></div>}
        </div>
    );
};


const MyShelf = () => {
    const [viewMode, setViewMode] = useState('grid');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [newGoal, setNewGoal] = useState(30);
    const queryClient = useQueryClient();
    
    const { data: bookmarkedBooks = [], isLoading: booksLoading } = useQuery({
        queryKey: ['my-bookmarks-details'],
        queryFn: async () => (await axiosSecure.get('/api/bookmarks')).data,
    });

    const { data: userProfile, isLoading: profileLoading, refetch: refetchProfile } = useUserProfile();

    const markAsReadMutation = useMutation({
        mutationFn: (bookId) => axiosSecure.post('/api/users/mark-as-read', { contentId: bookId }),
        onSuccess: () => {
            toast.success('Congratulations! Book marked as read.');
            refetchProfile();
        },
        onError: (error) => toast.error(error.response?.data?.message || 'Could not mark as read.'),
    });

    const goalMutation = useMutation({
        mutationFn: (target) => axiosSecure.patch('/api/users/reading-goal', { target }),
        onSuccess: () => {
            toast.success("Reading goal updated!");
            refetchProfile();
            setIsGoalModalOpen(false);
        },
        onError: () => toast.error("Failed to update goal.")
    });

    const handleMarkAsRead = (bookId) => {
        markAsReadMutation.mutate(bookId);
    };
    
    const handleSetGoal = (e) => {
        e.preventDefault();
        goalMutation.mutate(newGoal);
    };

    const categories = useMemo(() => ['All', ...new Set(bookmarkedBooks.map(book => book.category || 'Uncategorized'))], [bookmarkedBooks]);
    
    const filteredAndSortedBooks = useMemo(() => {
        let books = [...bookmarkedBooks];
        if (selectedCategory !== 'All') books = books.filter(book => (book.category || '').toLowerCase() === selectedCategory.toLowerCase());
        if (sortBy === 'newest') books.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        else if (sortBy === 'oldest') books.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        else if (sortBy === 'title') books.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        return books;
    }, [bookmarkedBooks, selectedCategory, sortBy]);

    const shelves = Array.from({ length: Math.ceil(filteredAndSortedBooks.length / 5) }, (_, i) => filteredAndSortedBooks.slice(i * 5, i * 5 + 5));
    
    const readingGoal = userProfile?.readingGoal || { target: 30, completed: 0 };
    const goalProgress = Math.round((readingGoal.completed / (readingGoal.target || 1)) * 100);
    const readingStreak = userProfile?.readingStreak || { current: 0 };

    // Chart data calculation
    const categoryStats = useMemo(() => {
        return bookmarkedBooks.reduce((acc, book) => {
            const cat = book.category || 'Uncategorized';
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {});
    }, [bookmarkedBooks]);

    const chartData = {
        labels: Object.keys(categoryStats),
        datasets: [{
            label: 'Books by Category',
            data: Object.values(categoryStats),
            backgroundColor: ['#7209b7', '#f72585', '#4cc9f0', '#f48c06', '#3a0ca3'],
            borderRadius: 5,
        }],
    };

    const chartOptions = {
        responsive: true, 
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { ticks: { color: '#A0A0A0' } }, x: { ticks: { color: '#A0A0A0' } } },
    };

    useEffect(() => {
        if (userProfile?.readingGoal?.target) {
            setNewGoal(userProfile.readingGoal.target);
        }
    }, [userProfile]);

    if (booksLoading || profileLoading) return <LoadingSpinner />;

    return (
        <div className="p-4 sm:p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">My Reading Dashboard</h1>
                <div className="flex items-center gap-2 p-1 bg-base-300 rounded-lg">
                    <button onClick={() => setViewMode('grid')} className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'}`}><FaThLarge /> Shelf View</button>
                    <button onClick={() => setViewMode('list')} className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}><FaList /> List View</button>
                </div>
            </div>
            
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="stat bg-base-100 shadow-xl rounded-2xl flex flex-col items-center justify-center p-6 relative">
                    <button onClick={() => setIsGoalModalOpen(true)} className="btn btn-ghost btn-circle btn-sm absolute top-2 right-2"><FaBullseye /></button>
                    <div style={{ width: 120, height: 120 }}><CircularProgressbar value={goalProgress} text={`${goalProgress}%`} styles={buildStyles({ textColor: 'hsl(var(--p))', pathColor: `hsl(var(--p))`, trailColor: 'hsl(var(--b3))' })} /></div>
                    <div className="stat-title mt-4">Yearly Reading Goal</div>
                    <div className="stat-value text-2xl">{readingGoal.completed} / {readingGoal.target} books</div>
                </div>
                <div className="stat bg-base-100 shadow-xl rounded-2xl">
                    <div className="stat-figure text-secondary"><FaBook className="inline-block w-8 h-8"/></div>
                    <div className="stat-title">Books on Shelf</div>
                    <div className="stat-value text-secondary">{bookmarkedBooks.length}</div>
                </div>
                <div className="stat bg-base-100 shadow-xl rounded-2xl">
                    <div className="stat-figure text-accent"><FaFire className="inline-block w-8 h-8"/></div>
                    <div className="stat-title">Reading Streak</div>
                    <div className="stat-value text-accent">{readingStreak.current} Days</div>
                </div>
            </motion.div>
            
            <motion.div className="stat bg-base-100 shadow rounded-2xl col-span-1 md:col-span-3 mb-12" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="stat-title p-4">Category Breakdown</div>
                <div className="h-40 p-4"><Bar data={chartData} options={chartOptions} /></div>
            </motion.div>

            <div className="bg-base-100 p-4 rounded-2xl shadow-md mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2"><FaFilter className="text-primary" /> <span className="font-semibold">Filter by:</span></div>
                <div className="tabs tabs-boxed">{categories.map(cat => <a key={cat} className={`tab ${selectedCategory === cat ? 'tab-active' : ''}`} onClick={() => setSelectedCategory(cat)}>{cat}</a>)}</div>
                <div><select className="select select-bordered" value={sortBy} onChange={(e) => setSortBy(e.target.value)}><option value="newest">Sort: Newest</option><option value="oldest">Sort: Oldest</option><option value="title">Sort: Title (A-Z)</option></select></div>
            </div>

            {filteredAndSortedBooks.length > 0 ? (
                viewMode === 'grid' ? (
                    <div className="bg-base-100 p-8 rounded-lg shadow-inner" style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/wood-pattern.png)' }}>
                        <motion.div className="space-y-12" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.2 } } }}>
                            {shelves.map((shelfBooks, index) => (
                                <motion.div key={index} className="relative flex justify-center items-end gap-10 h-80" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                                    {shelfBooks.map(book => (
                                        <motion.div key={book._id} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
                                            <Book3D book={book} onMarkAsRead={handleMarkAsRead} isRead={userProfile?.readBooks?.includes(book._id)} />
                                        </motion.div>
                                    ))}
                                    <div className="absolute bottom-0 w-full h-4 bg-gray-800 rounded shadow-[0_5px_10px_rgba(0,0,0,0.4)]"></div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                ) : (
                    <motion.div className="space-y-4" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
                        {filteredAndSortedBooks.map(book => (
                            <motion.div key={book._id} variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}>
                                <BookRow book={book} onMarkAsRead={handleMarkAsRead} isRead={userProfile?.readBooks?.includes(book._id)} />
                            </motion.div>
                        ))}
                    </motion.div>
                )
            ) : (
                <div className="text-center py-16"><p className="text-xl">Your shelf is empty.</p><Link to="/library" className="btn btn-primary mt-4">Explore Books</Link></div>
            )}

            <dialog open={isGoalModalOpen} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Set Your Yearly Reading Goal</h3>
                    <form onSubmit={handleSetGoal}>
                        <div className="form-control py-4">
                            <label className="label"><span className="label-text">How many books do you want to read this year?</span></label>
                            <input type="number" value={newGoal} onChange={(e) => setNewGoal(e.target.value)} className="input input-bordered" min="1" />
                        </div>
                        <div className="modal-action">
                            <button type="button" className="btn" onClick={() => setIsGoalModalOpen(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={goalMutation.isLoading}>
                                {goalMutation.isLoading ? 'Saving...' : 'Set Goal'}
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default MyShelf;