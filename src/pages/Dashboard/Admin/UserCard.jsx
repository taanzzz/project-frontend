// 📁 File: src/pages/Dashboard/Admin/UserCard.jsx

import React from 'react';
import { FaUserShield, FaUserEdit, FaTrash, FaCrown } from 'react-icons/fa';
import { motion } from 'framer-motion';

const UserCard = ({ user, onChangeRole, onDeleteUser }) => {
    const roleColors = {
        Admin: 'badge-primary',
        Contributor: 'badge-secondary',
        Member: 'badge-accent',
    };

    return (
        <motion.div 
            className="card bg-base-100 shadow-xl"
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
            <div className="card-body items-center text-center">
                <div className="avatar">
                    <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img src={user.image} alt={user.name} />
                    </div>
                </div>
                <h2 className="card-title mt-4">{user.name}</h2>
                <p className="text-sm text-base-content/70">{user.email}</p>
                <div className={`badge ${roleColors[user.role]} mt-2`}>{user.role}</div>
                
                <div className="card-actions justify-center mt-4">
                    <div className="dropdown dropdown-top">
                        <label tabIndex={0} className="btn btn-primary btn-sm">Manage</label>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52">
                            <li><a onClick={() => onChangeRole(user, 'Admin')}><FaCrown /> Make Admin</a></li>
                            <li><a onClick={() => onChangeRole(user, 'Contributor')}><FaUserEdit /> Make Contributor</a></li>
                            <li><a onClick={() => onChangeRole(user, 'Member')}><FaUserShield /> Make Member</a></li>
                            <div className="divider my-1"></div>
                            <li><a onClick={() => onDeleteUser(user)} className="text-error"><FaTrash /> Delete User</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default UserCard;