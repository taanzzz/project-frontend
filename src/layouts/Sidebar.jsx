// 📁 File: src/layouts/Sidebar.jsx
import React, { useContext } from 'react';
import { NavLink } from 'react-router'; // <-- সমাধান: react-router-dom হবে
import { FaBook, FaUsers, FaPlusSquare, FaListAlt, FaFeatherAlt } from 'react-icons/fa';
import { ImProfile } from 'react-icons/im';
import useRole from './../hooks/useRole';
import { AuthContext } from './../contexts/AuthProvider';


const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const { isAdmin, isContributor, isMember } = useRole(); // <-- সমাধান: isContributor ব্যবহার

    const navLinkClass = ({ isActive }) => 
        `flex items-center px-4 py-3 my-1 rounded-lg transition-colors duration-300 ${
            isActive ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' : 'hover:bg-base-300'
        }`;

    const adminLinks = <>
        <li><NavLink to="/dashboard/manage-users" className={navLinkClass}><FaUsers /> Manage Users</NavLink></li>
        <li><NavLink to="/dashboard/manage-content" className={navLinkClass}><FaBook /> Manage Content</NavLink></li>
    </>;
    const contributorLinks = <>
        <li><NavLink to="/dashboard/add-content" className={navLinkClass}><FaPlusSquare /> Add Content</NavLink></li>
        <li><NavLink to="/dashboard/my-content" className={navLinkClass}><FaListAlt /> My Content</NavLink></li>
    </>;
    const memberLinks = <>
        <li><NavLink to="/dashboard/bookmarks" className={navLinkClass}><FaBook /> My Bookmarks</NavLink></li>
        <li><NavLink to="/dashboard/my-shelf" className={navLinkClass}><FaBook /> My Shelf</NavLink></li>
    </>;

    return (
        <div className="flex flex-col h-full p-4 w-64 bg-base-200 text-base-content">
            <div className="text-2xl font-bold p-4 flex items-center gap-2"><FaFeatherAlt className="text-primary"/> Mind Over Myth</div>
            <div className="flex flex-col items-center mt-6 mb-8">
                <div className="avatar"><div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2"><img src={user?.photoURL} alt={user?.displayName} /></div></div>
                <h2 className="mt-4 text-xl font-semibold">{user?.displayName}</h2>
                <p className="text-sm text-base-content/70">{user?.email}</p>
            </div>
            
            <ul className="menu flex-grow text-base">
                {isAdmin && adminLinks}
                {isContributor && contributorLinks} {/* <-- সমাধান: isContributor ব্যবহার */}
                {isMember && memberLinks}
                <div className="divider"></div>
                <li><NavLink to="/dashboard/profile" className={navLinkClass}><ImProfile /> Profile</NavLink></li>
            </ul>
            
            <div className="mt-auto">
                <button onClick={logout} className="btn btn-ghost w-full">Logout</button>
            </div>
        </div>
    );
};
export default Sidebar;