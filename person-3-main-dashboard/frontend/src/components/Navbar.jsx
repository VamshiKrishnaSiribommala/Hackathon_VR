import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, BarChart3, Users, Settings, LogOut, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-slate-900 text-white p-4 shadow-xl flex justify-between items-center border-b border-indigo-500/30">
      <div className="flex items-center space-x-2">
        <Car className="text-indigo-400 w-8 h-8" />
        <span className="text-lg font-black tracking-widest uppercase">Admin <span className="text-indigo-400">Control</span></span>
      </div>
      
      <div className="hidden md:flex space-x-8 items-center">
        <Link to="/adminDashboard" className="hover:text-indigo-400 transition-colors flex items-center space-x-2 font-semibold">
          <BarChart3 size={18} /> <span>Analytics</span>
        </Link>
        <Link to="/adminDashboard" className="hover:text-indigo-400 transition-colors flex items-center space-x-2 font-semibold text-slate-400">
          <Users size={18} /> <span>Users</span>
        </Link>
        <div className="flex items-center space-x-2 bg-slate-800 px-4 py-1.5 rounded-lg border border-slate-700">
          <ShieldCheck size={18} className="text-indigo-400" />
          <span className="text-sm font-bold tracking-tight">Vamshi (SuperAdmin)</span>
        </div>
        <button onClick={() => navigate('/')} className="text-slate-500 hover:text-white transition-all">
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
