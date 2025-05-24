import React from 'react';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full bg-white shadow-md transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="flex flex-col items-center mt-4">
        <Link
          to="/"
          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
        >
          <HomeIcon />
          {isOpen && <span className="ml-2">Home</span>}
        </Link>
        <Link
          to="/profile"
          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
        >
          <PersonIcon />
          {isOpen && <span className="ml-2">Profile</span>}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;