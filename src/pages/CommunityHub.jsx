// 📁 File: src/pages/CommunityHub.jsx

import React, { useState } from 'react';
import CreatePost from '../components/Community/CreatePost';
import NewsFeed from '../components/Community/NewsFeed';
import LeftSidebar from '../components/Community/LeftSidebar';
import RightSidebar from '../components/Community/RightSidebar';

// --- Icons for Mobile Header ---
import { FiMenu, FiUsers } from "react-icons/fi";


const CommunityHub = () => {
    // ✅ State to control the visibility of sidebars on mobile
    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

    return (
        <div className="bg-base-200 min-h-screen relative">
            
            {/* --- Mobile Header: Appears only on small screens --- */}
            <header className="sticky top-16 z-30 flex items-center justify-between p-2 bg-base-100/80 backdrop-blur-md lg:hidden shadow-sm">
                <button onClick={() => setIsLeftSidebarOpen(true)} className="btn btn-ghost btn-circle">
                    <FiMenu className="text-xl" />
                </button>
                <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Community Hub
                </h1>
                <button onClick={() => setIsRightSidebarOpen(true)} className="btn btn-ghost btn-circle">
                    <FiUsers className="text-xl" />
                </button>
            </header>

            <div className="max-w-screen-xl mx-auto px-4 py-6 sm:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* --- Left Sidebar --- */}
                    {/* On Desktop: Part of the grid */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <LeftSidebar />
                    </aside>
                    {/* On Mobile: Off-canvas Drawer */}
                    <div className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isLeftSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        <div className="absolute inset-0 bg-black/50" onClick={() => setIsLeftSidebarOpen(false)}></div>
                        <div className="relative w-80 h-full bg-base-100 shadow-xl">
                            <LeftSidebar />
                        </div>
                    </div>


                    {/* --- Main Content (Newsfeed) --- */}
                    <main className="lg:col-span-2">
                        <CreatePost />
                        <NewsFeed />
                    </main>


                    {/* --- Right Sidebar --- */}
                    {/* On Desktop: Part of the grid */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <RightSidebar />
                    </aside>
                    {/* On Mobile: Off-canvas Drawer */}
                    <div className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isRightSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                        <div className="absolute inset-0 bg-black/50" onClick={() => setIsRightSidebarOpen(false)}></div>
                        <div className="relative w-80 h-full bg-base-100 shadow-xl ml-auto">
                            <RightSidebar />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityHub;