import React from 'react';
import { NavLink, Link } from 'react-router';
import { FaBook, FaUsers, FaPlusSquare, FaListAlt, FaFeatherAlt, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';
import { ImProfile } from 'react-icons/im';
import { FiSettings } from 'react-icons/fi';
import useRole from './../hooks/useRole';
import useAuth from './../hooks/useAuth';
import useUserProfile from './../hooks/useUserProfile';
import { RxDashboard } from "react-icons/rx";
import { IoAnalyticsSharp } from 'react-icons/io5';
import { FaShieldAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCheck } from 'react-icons/fa6';
import ThemeToggle from './../components/Shared/ThemeToggle';


const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
    const { logout } = useAuth();
    const { isAdmin, isContributor, isMember } = useRole();
    const { data: userProfile, isLoading: isProfileLoading } = useUserProfile();

    const navLinkClass = ({ isActive }) =>
        `flex items-center px-4 py-3 my-1 rounded-xl transition-all duration-300 hover:translate-x-1 hover:shadow-xl hover:ring-1 hover:ring-primary/20
         ${isActive
            ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md font-semibold'
            : 'hover:bg-base-200/50 text-base-content'}`;

    const adminLinks = (
        <>
            <li><NavLink to="/dashboard/admin-dashboard" className={navLinkClass}><RxDashboard size={20} className="mr-3" /> Dashboard</NavLink></li>
            <li><NavLink to="/dashboard/manage-users" className={navLinkClass}><FaUsers size={20} className="mr-3" /> Manage Users</NavLink></li>
            <li><NavLink to="/dashboard/manage-content" className={navLinkClass}><FaBook size={20} className="mr-3" /> Manage Content</NavLink></li>
            <li><NavLink to="/dashboard/community-moderation" className={navLinkClass}><FaShieldAlt size={20} className="mr-3" /> Moderation</NavLink></li>
            <li><NavLink to="/dashboard/manage-applications" className={navLinkClass}><FaUserCheck size={20} className="mr-3" /> Applications</NavLink></li>
        </>
    );
    const contributorLinks = (
        <>
            <li><NavLink to="/dashboard/contributor-dashboard" className={navLinkClass}><RxDashboard size={20} className="mr-3" /> Dashboard</NavLink></li>
            <li><NavLink to="/dashboard/add-content" className={navLinkClass}><FaPlusSquare size={20} className="mr-3" /> Add Content</NavLink></li>
            <li><NavLink to="/dashboard/my-content" className={navLinkClass}><FaListAlt size={20} className="mr-3" /> My Content</NavLink></li>
            <li><NavLink to="/dashboard/content-analytics" className={navLinkClass}><IoAnalyticsSharp size={20} className="mr-3" /> Analytics</NavLink></li>
        </>
    );
    const memberLinks = (
        <>
            <li><NavLink to="/dashboard/my-shelf" className={navLinkClass}><FaBook size={20} className="mr-3" /> My Shelf</NavLink></li>
            <li><NavLink to="/dashboard/my-activity" className={navLinkClass}><FaListAlt size={20} className="mr-3" /> My Activity</NavLink></li>
            <li><NavLink to="/dashboard/order-history" className={navLinkClass}><FaShoppingBag size={20} className="mr-3" /> Order History</NavLink></li>
        </>
    );

    const sidebarContent = (
        <>
            <div className="text-2xl font-bold px-6 py-4 flex items-center gap-2 border-b border-base-200/50">
                <FaFeatherAlt className="text-primary" size={24} /> Mind Over Myth
            </div>
            {isProfileLoading ? (
                <div className="flex justify-center my-8"><span className="loading loading-spinner text-primary"></span></div>
            ) : userProfile && (
                <motion.div 
                    className="flex flex-col items-center my-8 px-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="avatar online">
                        <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 shadow-md">
                            <img src={userProfile.image} alt={userProfile.name} />
                        </div>
                    </div>
                    <h2 className="mt-4 text-xl font-semibold">{userProfile.name}</h2>
                    <p className="text-sm text-base-content/60">{userProfile.email}</p>
                </motion.div>
            )}
            <ul className="menu flex-grow text-base px-4 space-y-1">
                {isAdmin && adminLinks}
                {isContributor && contributorLinks}
                {isMember && memberLinks}
                <div className="divider my-4"></div>
                <li><NavLink to="/dashboard/profile" className={navLinkClass}><ImProfile size={20} className="mr-3" /> Profile</NavLink></li>
                <li><NavLink to="/dashboard/settings" className={navLinkClass}><FiSettings size={20} className="mr-3" /> Settings</NavLink></li>
                <li><Link to="/" className={navLinkClass}><FaArrowLeft size={20} className="mr-3" /> Back to Home</Link></li>
            </ul>
            <div className="mt-auto px-6 py-4 border-t border-base-200/50 flex items-center justify-between">
                <button onClick={logout} className="btn btn-ghost text-base-content hover:bg-base-200 rounded-xl flex-1 mr-2">
                    Logout
                </button>
                <ThemeToggle />
            </div>
        </>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.aside
                className="hidden lg:flex flex-col h-screen w-72 fixed left-0 top-0 bg-base-100/95 backdrop-blur-xl shadow-2xl border-r border-base-200/50 overflow-y-auto"
                initial={{ x: -72 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                {sidebarContent}
            </motion.aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.aside
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="lg:hidden fixed top-0 left-0 h-full w-72 bg-base-100/95 backdrop-blur-xl shadow-2xl z-[200] overflow-y-auto"
                    >
                        <button
                            className="btn btn-ghost btn-circle absolute top-4 right-4 text-xl"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <FaArrowLeft />
                        </button>
                        {sidebarContent}
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;