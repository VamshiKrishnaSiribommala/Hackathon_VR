import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, LayoutDashboard, DollarSign, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const driverName = "Driver Sam"; // Mock

  return (
    <nav className="bg-black text-white p-4 shadow-lg flex justify-between items-center border-b border-gray-800">
      <div className="flex items-center space-x-2">
        <Car className="text-rapido w-8 h-8" />
        <span className="text-xl font-bold tracking-tight uppercase">Driver <span className="text-rapido">Port</span></span>
      </div>
      
      <div className="hidden md:flex space-x-6 items-center">
        <Link to="/driverDashboard" className="hover:text-rapido flex items-center space-x-1">
          <LayoutDashboard size={18} /> <span>Dashboard</span>
        </Link>
        <Link to="/driverEarnings" className="hover:text-rapido flex items-center space-x-1">
          <DollarSign size={18} /> <span>Earnings</span>
        </Link>
        <div className="flex items-center space-x-2 bg-gray-900 px-3 py-1 rounded-full border border-gray-700">
          <User size={16} className="text-rapido" />
          <span className="text-sm font-medium">{driverName}</span>
        </div>
        <button onClick={() => navigate('/')} className="text-gray-500 hover:text-white transition-colors">
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
