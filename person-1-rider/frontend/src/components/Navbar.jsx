import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Map as MapIcon, History, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const userName = "Vamshi"; // Mock

  return (
    <nav className="bg-uber text-white p-4 shadow-lg flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Car className="text-rapido w-8 h-8" />
        <span className="text-xl font-bold tracking-tight">RAPIDO <span className="text-rapido">CLONE</span></span>
      </div>
      
      <div className="hidden md:flex space-x-6 items-center">
        <Link to="/riderHome" className="hover:text-rapido flex items-center space-x-1">
          <MapIcon size={18} /> <span>Book Ride</span>
        </Link>
        <Link to="/riderHistory" className="hover:text-rapido flex items-center space-x-1">
          <History size={18} /> <span>History</span>
        </Link>
        <div className="flex items-center space-x-2 bg-gray-800 px-3 py-1 rounded-full">
          <User size={16} className="text-rapido" />
          <span className="text-sm font-medium">{userName}</span>
        </div>
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white">
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
