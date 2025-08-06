import React, { useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { RiDashboardFill } from "react-icons/ri";
import { NavLink } from 'react-router'; 
import { AuthContext } from '../../contexts/AuthProvider';


const UserProfile = () => {
    const { user, logout } = useContext(AuthContext);
    const [open, setOpen] = useState(false);

    
    const timeoutRef = useRef(null);
    const [canHover, setCanHover] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(hover: hover)').matches;
    });
    useEffect(() => {
        const mq = window.matchMedia('(hover: hover)');
        const handler = (e) => setCanHover(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);
    const handleMouseEnter = () => canHover && (clearTimeout(timeoutRef.current), setOpen(true));
    const handleMouseLeave = () => canHover && (timeoutRef.current = setTimeout(() => setOpen(false), 300));
    const handleClick = () => !canHover && setOpen((prev) => !prev);
    

    if (!user) return null;

    const defaultPhoto = `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=0D9488&color=fff`;

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('👋 Successfully logged out!');
            setOpen(false);
        } catch (err) {
            toast.error('⚠️ Failed to logout!');
        }
    };

    const menuVariants = {
        hidden: { opacity: 0, scale: 0.95, y: -10 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } }
    };

    return (
        <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar" onClick={handleClick}>
                <div className="w-10 rounded-full ring-2 ring-offset-base-100 ring-offset-2 ring-primary/50 hover:ring-primary transition-all">
                    <img src={user.photoURL || defaultPhoto} alt="User profile" />
                </div>
            </label>

            <AnimatePresence>
                {open && (
                    <motion.ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content mt-3 z-[50] p-2 shadow-2xl bg-base-100 rounded-box w-60 absolute right-0 border border-base-300/20"
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    >
                        <li className="p-2 border-b border-base-300/50">
                            <div className="flex flex-col items-start pointer-events-none">
                                <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{user.displayName || 'Anonymous User'}</span>
                                <span className="text-xs text-base-content/70">{user.email}</span>
                            </div>
                        </li>
                        
                        
                        <li>
                            <NavLink to="/dashboard/profile" onClick={() => setOpen(false)} className="hover:text-primary">
                                <RiDashboardFill className="text-primary" />
                                Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <a onClick={handleLogout} className="text-error hover:bg-error/10">
                                <FaSignOutAlt />
                                Logout
                            </a>
                        </li>
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserProfile;