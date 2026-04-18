import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Car, CreditCard, Activity, TrendingUp, ShieldCheck, AlertCircle, CheckCircle, XCircle, Search, MoreVertical, Map as MapIcon } from 'lucide-react';
import axios from 'axios';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, pendingDrivers: 0, activeRides: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const usersRes = await axios.get('http://127.0.0.1:5000/api/admin/users');
      setUsers(usersRes.data);
      
      const statsRes = await axios.get('http://127.0.0.1:5000/api/admin/stats');
      setStats(statsRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const approveDriver = async (id) => {
    try {
      await axios.put(`http://127.0.0.1:5000/api/admin/approve-driver/${id}`);
      fetchData();
    } catch (err) {
      alert('Approval failed');
    }
  };

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-100' },
    { title: 'Pending Approval', value: stats.pendingDrivers, icon: ShieldCheck, color: 'text-amber-500', bg: 'bg-amber-100' },
    { title: 'Live Rides', value: stats.activeRides, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-100' },
    { title: 'Net Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: CreditCard, color: 'text-indigo-500', bg: 'bg-indigo-100' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Admin Navbar */}
      <nav className="bg-slate-900 text-white px-8 py-5 flex justify-between items-center shadow-xl z-50">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-500 p-2 rounded-xl text-white">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter italic">ADMIN <span className="text-indigo-400 not-italic">CONSOLE</span></h1>
        </div>
        
        <div className="flex items-center space-x-6 text-sm font-bold">
          <div className="flex items-center space-x-2 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-slate-300 uppercase tracking-widest text-[10px]">Root Access</span>
          </div>
          <button onClick={logout} className="text-slate-400 hover:text-white transition-all uppercase text-xs tracking-widest font-black">Sign Out</button>
        </div>
      </nav>

      <main className="p-8 space-y-10 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">System Control Center</h2>
            <p className="text-slate-500 font-medium">Real-time moderation and financial analytics.</p>
          </div>
          <button onClick={fetchData} className="px-6 py-3 bg-white border-2 border-slate-200 rounded-2xl font-black text-slate-700 hover:border-indigo-500 hover:text-indigo-500 transition-all shadow-sm">
            REFRESH METRICS
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statCards.map((card, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white hover:border-indigo-100 transition-all group overflow-hidden relative">
              <div className="absolute -right-4 -bottom-4 opacity-5 text-indigo-900 group-hover:scale-125 transition-transform duration-700">
                <card.icon size={120} />
              </div>
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{card.title}</p>
                  <h3 className="text-3xl font-black text-slate-900">{card.value}</h3>
                </div>
                <div className={`${card.bg} ${card.color} p-4 rounded-2xl shadow-inner`}>
                  <card.icon size={24} />
                </div>
              </div>
              <div className="mt-6 flex items-center text-xs text-emerald-500 font-bold relative z-10">
                <TrendingUp size={14} className="mr-1" />
                <span>+14.2% Growth</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* User Moderation Table */}
          <div className="xl:col-span-2 bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100 flex flex-col">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">User Moderation</h3>
              <div className="flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-xl text-slate-400">
                <Search size={18} />
                <input type="text" placeholder="Search accounts..." className="bg-transparent text-sm font-bold outline-none placeholder:text-slate-300" />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identity</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Role</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-black uppercase">{u.name[0]}</div>
                          <div>
                            <p className="font-black text-slate-800 text-sm leading-none mb-1">{u.name}</p>
                            <p className="text-xs text-slate-400 font-medium">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                          u.role === 'admin' ? 'bg-indigo-100 text-indigo-600' :
                          u.role === 'driver' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-6">
                        {u.role === 'driver' ? (
                          u.isApproved ? 
                            <span className="flex items-center space-x-1 text-emerald-500 font-bold text-xs"><CheckCircle size={14}/> <span>Verified</span></span> :
                            <span className="flex items-center space-x-1 text-amber-500 font-bold text-xs uppercase tracking-tighter"><AlertCircle size={14}/> <span>Pending Approval</span></span>
                        ) : <span className="text-slate-300 font-bold text-xs">Standard</span>}
                      </td>
                      <td className="p-6">
                        {u.role === 'driver' && !u.isApproved && (
                          <button 
                            onClick={() => approveDriver(u._id)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-indigo-100"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Map View Integration */}
          <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-2 flex flex-col h-[600px] xl:h-auto">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
               <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                 <MapIcon className="text-indigo-500" size={20} />
                 <span className="uppercase tracking-tighter">Live Fleet View</span>
               </h3>
               <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                  <span className="text-[10px] font-black text-emerald-600 uppercase">Tracking</span>
               </div>
            </div>
            <div className="flex-1 rounded-[2.5rem] overflow-hidden m-4 border-2 border-slate-50 grayscale contrast-125">
              <MapContainer center={[17.3850, 78.4867]} zoom={13} className="h-full w-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <CircleMarker center={[17.3850, 78.4867]} radius={15} pathOptions={{ color: '#6366f1', fillColor: '#6366f1', fillOpacity: 0.2 }}>
                   <CircleMarker center={[17.3850, 78.4867]} radius={6} pathOptions={{ color: '#6366f1', fillColor: '#6366f1', fillOpacity: 0.8 }} />
                </CircleMarker>
              </MapContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
