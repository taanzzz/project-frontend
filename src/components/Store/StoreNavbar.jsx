import React from 'react';
// ✅ Using 'react-router-dom' for modern React projects
import { NavLink, Link } from 'react-router'; 
import { FaSearch, FaShoppingCart, FaHome, FaBookOpen, FaTshirt, FaPenFancy, FaArrowCircleLeft, FaShoppingBag } from 'react-icons/fa';
import UserProfile from '../Shared/UserProfile';
import useAuth from '../../hooks/useAuth';
import ThemeToggle from '../Shared/ThemeToggle';
import { useCart } from '../../Providers/CartProvider';
import { motion, AnimatePresence } from 'framer-motion';

const StoreNavbar = () => {
    const { user } = useAuth();
    const { totalItems } = useCart();

    // ✅ Enhanced NavLink classes for better theme compatibility and a more vibrant active state
    const navLinkClass = ({ isActive }) =>
        `p-4 rounded-full text-sm font-medium tracking-wide transition-all duration-300 transform hover:scale-110
         ${isActive
            ? 'bg-gradient-to-br from-primary to-secondary text-primary-content shadow-lg shadow-primary/40'
            : 'bg-base-200/60 text-base-content/70 hover:bg-gradient-to-br hover:from-primary hover:to-secondary hover:text-primary-content'}`;

    const navLinks = (
        <>
            <NavLink to="/store" end className={navLinkClass}>
                <FaHome size={22} />
            </NavLink>
            <NavLink to="/store/books" className={navLinkClass}>
                <FaBookOpen size={22} />
            </NavLink>
            <NavLink to="/store/affiliates" className={navLinkClass}>
                <FaTshirt size={22} />
            </NavLink>
            <NavLink to="/store/stationery" className={navLinkClass}>
                <FaPenFancy size={22} />
            </NavLink>
            <NavLink to="/store/bag" className={navLinkClass}>
                <FaShoppingBag size={22} />
            </NavLink>
            <NavLink to="/" className={navLinkClass}>
                <FaArrowCircleLeft size={22} />
            </NavLink>
        </>
    );

    return (
        <>
            <motion.header
                // ✅ Applying theme-aware background color via className
                className="fixed top-0 left-0 right-0 z-[100] bg-base-100/80"
                // ✅ Animating filter and shadow which are theme-agnostic
                animate={{
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
                <div className="navbar max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-20">
                    <div className="navbar-start">
    <Link
        to="/store"
        className="flex flex-nowrap items-center gap-3 text-lg sm:text-xl lg:text-2xl font-extrabold transition-all duration-300 hover:scale-105 whitespace-nowrap"
    >
        <img
            src="https://i.ibb.co/R4Sct8y4/book.png"
            alt="Mind Over Myth Store Logo"
            className="w-8 h-8 shrink-0"
        />
        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Mind Over Myth Store
        </span>
    </Link>
</div>
                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal px-1 gap-4">
                            {navLinks}
                        </ul>
                    </div>
                    <div className="navbar-end gap-2 sm:gap-4">
                        <AnimatePresence>
                            <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: "auto", opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                transition={{ duration: 0.4, ease: 'easeInOut' }}
                                // ✅ Theme-aware classes for the search bar
                                className="input h-10 bg-base-200 border-base-300 rounded-full shadow-sm hidden sm:flex items-center"
                            >
                                <FaSearch size={18} className="text-base-content/50 ml-3" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-32 h-full bg-transparent outline-none ml-2 text-base-content"
                                />
                            </motion.div>
                        </AnimatePresence>
                        <Link to="/store/cart" className="btn btn-ghost btn-circle hover:bg-base-200/60 transition-all duration-300 hover:scale-110">
                            <div className="indicator">
                                <FaShoppingCart size={24} />
                                {totalItems > 0 && <span className="badge badge-sm badge-primary indicator-item animate-pulse">{totalItems}</span>}
                            </div>
                        </Link>
                        <ThemeToggle />
                        {user ? (
                            <UserProfile />
                        ) : (
                            <Link to="/login" className="btn btn-sm text-white border-none bg-gradient-to-r from-primary to-secondary hover:brightness-125 shadow-md rounded-full px-5">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </motion.header>

            {/* Mobile bottom navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-base-100/90 backdrop-blur-xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-[100] block sm:hidden border-t border-base-300/50">
                <ul className="flex justify-around items-center p-2">
                    {navLinks}
                </ul>
            </div>
        </>
    );
};

export default StoreNavbar;