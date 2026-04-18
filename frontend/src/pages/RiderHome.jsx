import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAuth } from '../context/AuthContext';
import { Car, Search, MapPin, Navigation, Send, Clock, DollarSign, History, LogOut, User as UserIcon } from 'lucide-react';
import io from 'socket.io-client';
import axios from 'axios';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const socket = io('http://127.0.0.1:5000');

const RiderHome = () => {
  const { user, logout } = useAuth();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [rideStatus, setRideStatus] = useState(null);
  const [position, setPosition] = useState([17.3850, 78.4867]); // Default Hyderabad
  const [estimate, setEstimate] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setPosition([pos.coords.latitude, pos.coords.longitude]);
    });

    socket.on('rideAccepted', (data) => {
      setRideStatus('accepted');
      alert(`Driver assigned: ${data.driverId}`);
    });

    return () => socket.off('rideAccepted');
  }, []);

  const calculateEstimate = () => {
    // Simplified distance-based fare calculation
    const baseFare = 50;
    const distancePrice = 15; // Per km
    const mockDistance = Math.floor(Math.random() * 10) + 1; // 1-11 km
    const fare = baseFare + (mockDistance * distancePrice);
    setEstimate({ fare, distance: `${mockDistance} km`, time: `${mockDistance * 3} mins` });
  };

  const handleRequestRide = async () => {
    if (!pickup || !destination) return;
    setIsSearching(true);
    setRideStatus('searching');
    
    try {
      const res = await axios.post('http://127.0.0.1:5000/api/ride/request', {
        pickupLocation: { address: pickup, lat: position[0], lng: position[1] },
        dropLocation: { address: destination, lat: position[0] + 0.01, lng: position[1] + 0.01 },
        fare: estimate?.fare || 150
      });
      
      socket.emit('requestRide', {
        rideId: res.data._id,
        riderId: user.id,
        pickup,
        destination,
        fare: res.data.fare
      });
    } catch (err) {
      console.error('Ride request error:', err);
      setIsSearching(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 font-sans">
      {/* Navbar Upgrade */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-[1000] shadow-sm">
        <div className="flex items-center space-x-2">
          <Car className="text-rapido w-9 h-9" />
          <span className="text-2xl font-black tracking-tighter uppercase italic">RAPIDO <span className="text-primary tracking-normal not-italic font-bold">PRO</span></span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <button className="flex items-center space-x-2 text-gray-500 hover:text-primary font-bold transition-colors">
            <History size={20} /> <span>History</span>
          </button>
          <div className="h-8 w-[1px] bg-gray-200"></div>
          <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold ring-4 ring-blue-50">
              {user?.name?.[0]}
            </div>
            <span className="text-sm font-black text-gray-700">{user?.name}</span>
          </div>
          <button onClick={logout} className="text-gray-400 hover:text-red-500 transition-colors">
            <LogOut size={22} />
          </button>
        </div>
      </nav>
      
      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Booking Sidebar */}
        <div className="w-full md:w-[420px] bg-white p-8 shadow-2xl z-20 overflow-y-auto border-r border-gray-50">
          <header className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 leading-tight">Fastest Service <br/>In The City</h2>
            <p className="text-gray-400 font-medium mt-1">Book a ride in seconds.</p>
          </header>
          
          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute left-4 top-4 text-gray-300 group-focus-within:text-primary transition-colors">
                <MapPin size={22} />
              </div>
              <input 
                type="text"
                placeholder="Pickup Location"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-primary rounded-2xl outline-none transition-all font-bold placeholder:text-gray-300"
              />
              <div className="absolute left-[29px] top-12 w-0.5 h-10 border-l-2 border-dashed border-gray-200"></div>
            </div>
            
            <div className="relative group">
              <div className="absolute left-4 top-4 text-gray-300 group-focus-within:text-secondary transition-colors">
                <Navigation size={22} />
              </div>
              <input 
                type="text"
                placeholder="Search Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onBlur={calculateEstimate}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-secondary rounded-2xl outline-none transition-all font-bold placeholder:text-gray-300"
              />
            </div>

            {estimate && (
               <div className="bg-blue-50/50 rounded-3xl p-6 border-2 border-blue-100/50 space-y-4 animate-in slide-in-from-top-4 duration-500">
                  <div className="flex justify-between items-center text-sm font-black text-primary/60 uppercase tracking-widest">
                    <span>Fare Estimate</span>
                    <span>{estimate.distance}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white p-3 rounded-2xl shadow-sm text-primary">
                        <Car size={28} />
                      </div>
                      <div>
                        <p className="text-lg font-black text-gray-900 leading-none">Rapido Go</p>
                        <p className="text-xs text-gray-400 font-bold mt-1 flex items-center">
                          <Clock size={12} className="mr-1" /> {estimate.time} away
                        </p>
                      </div>
                    </div>
                    <p className="text-3xl font-black text-gray-900 tracking-tighter">₹{estimate.fare}</p>
                  </div>
               </div>
            )}
            
            <button 
              onClick={handleRequestRide}
              disabled={isSearching || !estimate}
              className={`w-full py-5 rounded-2xl font-black text-xl flex items-center justify-center space-x-3 transition-all transform active:scale-95 shadow-xl ${
                isSearching || !estimate 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
                : 'bg-uber text-white hover:bg-black shadow-blue-100 hover:shadow-2xl'
              }`}
            >
              {isSearching ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : <Send size={24} />}
              <span>{isSearching ? 'FINDING DRIVERS' : 'BOOK RAPIDO NOW'}</span>
            </button>
          </div>
          
          {rideStatus === 'accepted' && (
            <div className="mt-10 p-5 bg-emerald-50 border-2 border-emerald-100 rounded-3xl flex items-center space-x-5 animate-bounce">
              <div className="bg-emerald-500 p-3 rounded-2xl text-white shadow-lg shadow-emerald-200">
                <Car size={32} />
              </div>
              <div>
                <p className="font-black text-emerald-900 uppercase tracking-tighter text-sm">Driver Assigned!</p>
                <p className="text-xs text-emerald-600 font-bold">Toyota Fortuner • TS 09 EJ 1234</p>
              </div>
            </div>
          )}
        </div>

        {/* Map Area Integration */}
        <div className="flex-1 relative grayscale-[0.2] contrast-125">
          <MapContainer center={position} zoom={14} scrollWheelZoom={true} zoomControl={false} className="h-full w-full">
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup className="font-bold">You are here</Popup>
            </Marker>
            <MapUpdater center={position} />
          </MapContainer>
          
          {/* Floating Action Button */}
          <button 
            onClick={() => navigator.geolocation.getCurrentPosition(p => setPosition([p.coords.latitude, p.coords.longitude]))}
            className="absolute bottom-8 right-8 z-[1000] bg-white p-5 rounded-[2rem] shadow-2xl hover:scale-110 active:scale-95 transition-all text-primary border border-gray-100 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Navigation size={28} className="relative z-10" />
          </button>
        </div>
      </div>
    </div>
  );
};

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14);
  }, [center, map]);
  return null;
}

export default RiderHome;
