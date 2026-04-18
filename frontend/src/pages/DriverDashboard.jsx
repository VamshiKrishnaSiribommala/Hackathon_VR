import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAuth } from '../context/AuthContext';
import { Car, MapPin, Navigation, ToggleLeft, ToggleRight, DollarSign, Activity, AlertCircle, Bell, LogOut, Check, X } from 'lucide-react';
import io from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:5001';

// Map icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const socket = io(BACKEND_URL);

const DriverDashboard = () => {
  const { user, logout } = useAuth();
  const [isOnline, setIsOnline] = useState(false);
  const [newRequest, setNewRequest] = useState(null);
  const [position, setPosition] = useState([17.3850, 78.4867]);
  const [stats, setStats] = useState({ totalRides: 12, earnings: 4750 });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setPosition([pos.coords.latitude, pos.coords.longitude]);
    });

    socket.emit('join', user.id);

    socket.on('newRideRequest', (data) => {
      if (isOnline) {
        setNewRequest(data);
        // Play notification sound if possible
      }
    });

    return () => {
      socket.off('newRideRequest');
    };
  }, [isOnline, user.id]);

  const handleAccept = () => {
    socket.emit('acceptRide', {
      rideId: newRequest.rideId,
      driverId: user.id,
      riderId: newRequest.riderId
    });
    setNewRequest(null);
    alert('Ride Accepted! Navigating to pickup...');
  };

  return (
    <div className="h-screen flex flex-col bg-[#0b0e11] text-white font-sans overflow-hidden">
      {/* Driver Top Bar */}
      <nav className="bg-[#1c1f26] border-b border-gray-800 px-6 py-4 flex justify-between items-center z-[1000]">
        <div className="flex items-center space-x-2">
          <Car className="text-rapido w-8 h-8" />
          <span className="text-xl font-black uppercase italic tracking-tighter">DRIVER <span className="text-rapido">PRO</span></span>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3 bg-gray-900/50 px-4 py-2 rounded-2xl border border-gray-800">
             <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20"></div>
             <span className="text-xs font-black uppercase tracking-widest text-emerald-500">System Live</span>
          </div>
          <button onClick={logout} className="text-gray-500 hover:text-red-500 transition-all">
            <LogOut size={22} />
          </button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col lg:flex-row relative">
        {/* Left Stats & Controls */}
        <div className="w-full lg:w-[400px] bg-[#111418] p-8 z-20 border-r border-gray-800 overflow-y-auto">
          <div className="flex items-center space-x-4 mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-rapido to-amber-500 rounded-[2rem] flex items-center justify-center text-[#0b0e11] shadow-2xl shadow-rapido/10">
              <UserIcon size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">{user?.name}</h1>
              <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">Verified Professional</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
             <div className="bg-[#1c1f26] p-5 rounded-3xl border border-gray-800/50 group hover:border-rapido/30 transition-all cursor-default">
                <DollarSign className="text-rapido mb-3" size={24} />
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Today Early</p>
                <p className="text-2xl font-black mt-1">₹{stats.earnings}</p>
             </div>
             <div className="bg-[#1c1f26] p-5 rounded-3xl border border-gray-800/50 group hover:border-emerald-500/30 transition-all cursor-default">
                <Activity className="text-emerald-500 mb-3" size={24} />
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Total Trips</p>
                <p className="text-2xl font-black mt-1">{stats.totalRides}</p>
             </div>
          </div>

          {/* Status Toggle Design */}
          <div className={`p-8 rounded-[2.5rem] transition-all duration-500 shadow-2xl flex flex-col items-center justify-center space-y-4 border-2 ${
            isOnline ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'
          }`}>
             <span className={`text-sm font-black uppercase tracking-[0.3em] ${isOnline ? 'text-emerald-500' : 'text-red-500'}`}>
               Current Status: {isOnline ? 'ONLINE' : 'OFFLINE'}
             </span>
             <button 
              onClick={async () => {
                const newStatus = isOnline ? 'offline' : 'online';
                try {
                  await axios.put(`${BACKEND_URL}/api/auth/status`, { 
                    status: newStatus,
                    location: { lat: position[0], lng: position[1] }
                  });
                  setIsOnline(!isOnline);
                } catch (err) {
                  alert('Failed to update status. Check backend connection.');
                }
              }}
              className="relative w-24 h-12 rounded-full transition-all duration-300"
             >
               <div className={`absolute inset-0 rounded-full transition-colors ${isOnline ? 'bg-emerald-500' : 'bg-gray-700'}`}></div>
               <div className={`absolute top-1 w-10 h-10 bg-white rounded-full transition-all transform flex items-center justify-center shadow-xl ${isOnline ? 'left-13 translate-x-12' : 'left-1'}`}>
                 {isOnline ? <Check className="text-emerald-500" size={20} /> : <X className="text-gray-700" size={20} />}
               </div>
             </button>
             <p className="text-[10px] text-gray-500 font-bold max-w-[200px] text-center uppercase tracking-wider">
               {isOnline ? 'Ready to pick up riders. Keep the app open.' : 'You will not receive any new ride requests.'}
             </p>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative grayscale-[0.8] contrast-125 invert-[0.9] brightness-75">
          <MapContainer center={position} zoom={14} className="h-full w-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={position}>
              <Popup>You are driving here</Popup>
            </Marker>
          </MapContainer>

          {/* New Request Modal Upgrade */}
          {newRequest && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2000] w-full max-w-sm px-4">
              <div className="bg-[#1c1f26] border-2 border-rapido p-8 rounded-[2.5rem] shadow-[0_0_50px_rgba(249,212,35,0.15)] animate-in zoom-in duration-300">
                <div className="flex items-center space-x-3 mb-6 bg-rapido/10 p-4 rounded-3xl border border-rapido/20">
                  <div className="p-3 bg-rapido text-[#0b0e11] rounded-2xl shadow-xl">
                    <Bell className="animate-swing" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tighter">New Request!</h2>
                    <p className="text-xs text-rapido font-bold uppercase tracking-widest">{newRequest.fare} INR • CASH</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1 p-2 bg-gray-800 rounded-lg"><MapPin size={16} /></div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Pickup</p>
                      <p className="font-bold text-gray-200">{newRequest.pickup}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="mt-1 p-2 bg-gray-800 rounded-lg"><Navigation size={16} /></div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Drop Off</p>
                      <p className="font-bold text-gray-200">{newRequest.destination}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setNewRequest(null)}
                    className="py-4 rounded-2xl bg-gray-800 text-gray-400 font-black tracking-widest hover:bg-gray-700 transition-all uppercase text-xs"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={handleAccept}
                    className="py-4 rounded-2xl bg-rapido text-[#0b0e11] font-black tracking-widest hover:scale-105 active:scale-95 transition-all uppercase text-xs shadow-xl shadow-rapido/10"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const UserIcon = ({ size }) => <Car size={size} />;

export default DriverDashboard;
