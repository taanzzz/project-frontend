// 📁 File: src/hooks/useRole.js

import { useContext } from "react";
import { AuthContext } from './../contexts/AuthProvider';


const useRole = () => {
    const { userRole, loading } = useContext(AuthContext);

    return {
        role: userRole,
        isRoleLoading: loading,
        isAdmin: userRole === 'Admin',
        isContributor: userRole === 'Contributor', 
        isMember: userRole === 'Member', 
    };
};
export default useRole;