import { NavLink } from 'react-router';
import { RxDashboard } from "react-icons/rx";
import { FaBook, FaUser, FaCog } from "react-icons/fa";

const BottomTabBar = () => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-base-100/90 backdrop-blur-md border-t border-base-200/40 shadow-lg">
      <ul className="flex justify-around items-center py-2">
        <li>
          <NavLink to="/dashboard" className={({ isActive }) =>
            `btn btn-ghost btn-circle text-xl ${isActive ? 'text-primary' : 'text-base-content/70'}`
          }>
            <RxDashboard />
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/my-shelf" className={({ isActive }) =>
            `btn btn-ghost btn-circle text-xl ${isActive ? 'text-primary' : 'text-base-content/70'}`
          }>
            <FaBook />
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/profile" className={({ isActive }) =>
            `btn btn-ghost btn-circle text-xl ${isActive ? 'text-primary' : 'text-base-content/70'}`
          }>
            <FaUser />
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/settings" className={({ isActive }) =>
            `btn btn-ghost btn-circle text-xl ${isActive ? 'text-primary' : 'text-base-content/70'}`
          }>
            <FaCog />
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default BottomTabBar;