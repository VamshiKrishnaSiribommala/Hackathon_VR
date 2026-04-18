import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Users, Car, CreditCard, Activity, TrendingUp, AlertCircle, Map as MapIcon } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client';

const socket = io('http://localhost:5003');

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 1250,
    activeRides: 12,
    completedRides: 450,
    revenue: 67500
  });

  useEffect(() => {
    socket.on('adminStats', (data) => {
      setStats(data);
    });
    return () => socket.off('adminStats');
  }, []);

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Active Rides', value: stats.activeRides, icon: Car, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { title: 'Completed', value: stats.completedRides, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: CreditCard, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  ];

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-200">
      <Navbar />
      
      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">System Overview</h1>
            <p className="text-slate-400">Real-time performance metrics and fleet distribution.</p>
          </div>
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-medium text-emerald-500">System Live</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-indigo-500/50 transition-all group">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">{card.title}</p>
                  <h3 className="text-3xl font-black text-white">{card.value}</h3>
                </div>
                <div className={`${card.bg} ${card.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                  <card.icon size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-emerald-500 font-bold">
                <TrendingUp size={14} className="mr-1" />
                <span>+12% from yesterday</span>
              </div>
            </div>
          ))}
        </div>

        {/* Fleet Distribution Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden h-[500px] relative shadow-2xl">
            <div className="absolute top-6 left-6 z-[1000] bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700 flex items-center space-x-2">
              <MapIcon size={18} className="text-indigo-400" />
              <span className="text-sm font-bold uppercase tracking-tight">Fleet Distribution</span>
            </div>
            <MapContainer center={[17.3850, 78.4867]} zoom={11} scrollWheelZoom={false} className="grayscale contrast-125 invert opacity-80 h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <CircleMarker center={[17.385, 78.486]} radius={20} pathOptions={{ color: '#6366f1', fillColor: '#6366f1', fillOpacity: 0.2 }}>
                <CircleMarker center={[17.385, 78.486]} radius={5} pathOptions={{ color: '#6366f1', fillColor: '#6366f1', fillOpacity: 1 }} />
              </CircleMarker>
            </MapContainer>
          </div>

          {/* Activity Feed */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col h-[500px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center space-x-2">
                <AlertCircle size={20} className="text-amber-500" />
                <span>Live Feed</span>
              </h2>
              <button className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-widest">Clear</button>
            </div>
            
            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-start space-x-4 p-3 hover:bg-slate-800/50 rounded-xl border border-transparent hover:border-slate-800 transition-all cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-200">Ride #{item}2405 Completed</p>
                    <p className="text-xs text-slate-500">Kukatpally → Gachibowli • ₹185.00</p>
                  </div>
                  <span className="text-[10px] text-slate-600 font-bold whitespace-nowrap">2m ago</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
