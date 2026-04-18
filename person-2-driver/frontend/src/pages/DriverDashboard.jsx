import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Bell, MapPin, Navigation, Check, X, Shield, Globe } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client';

const socket = io('http://localhost:5001'); // Connecting to the main socket hub (port 5001)

const DriverDashboard = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [newRequest, setNewRequest] = useState(null);
  const [position, setPosition] = useState([17.3850, 78.4867]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setPosition([pos.coords.latitude, pos.coords.longitude]);
    });

    socket.on('newRideRequest', (rideData) => {
      if (isOnline) {
        setNewRequest(rideData);
        // Play notification sound here in real app
      }
    });

    return () => socket.off('newRideRequest');
  }, [isOnline]);

  const handleAccept = () => {
    socket.emit('acceptRide', { 
      rideId: "ride_" + Date.now(), 
      driverId: "driver_sam", 
      riderId: newRequest.riderId 
    });
    alert("Ride Accepted! Navigating to pickup...");
    setNewRequest(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <Navbar />
      
      <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
        {/* Driver Control Panel */}
        <div className="w-full md:w-96 bg-black p-6 shadow-2xl z-10 border-r border-gray-800 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Status</h2>
            <button 
              onClick={() => setIsOnline(!isOnline)}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                isOnline ? 'bg-success text-white shadow-lg shadow-green-900/40' : 'bg-gray-800 text-gray-400'
              }`}
            >
              {isOnline ? 'ONLINE' : 'GO ONLINE'}
            </button>
          </div>

          {!isOnline && (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-60">
              <Globe size={64} className="text-gray-700 animate-pulse" />
              <p className="text-gray-500">You are currently offline. Go online to start receiving ride requests.</p>
            </div>
          )}

          {isOnline && !newRequest && (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary blur-3xl opacity-20 animate-pulse"></div>
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center animate-bounce">
                  <Bell size={24} className="text-primary" />
                </div>
              </div>
              <p className="text-gray-400 font-medium tracking-wide">Waiting for requests...</p>
            </div>
          )}

          {newRequest && (
            <div className="flex-1 space-y-6">
              <div className="bg-gray-800 rounded-2xl p-5 border border-primary/30 shadow-2xl animate-in slide-in-from-bottom-5">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded">NEW REQUEST</span>
                  <span className="font-bold text-xl text-rapido">₹145.00</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin size={18} className="text-gray-500 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Pickup</p>
                      <p className="text-sm font-medium">{newRequest.pickup}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Navigation size={18} className="text-primary mt-1" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Destination</p>
                      <p className="text-sm font-medium">{newRequest.destination}</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button 
                    onClick={() => setNewRequest(null)}
                    className="flex-1 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 transition-colors flex items-center justify-center"
                  >
                    <X size={20} />
                  </button>
                  <button 
                    onClick={handleAccept}
                    className="flex-[3] py-3 rounded-xl bg-primary hover:bg-blue-600 font-bold flex items-center justify-center space-x-2 shadow-lg shadow-blue-900/40"
                  >
                    <Check size={20} />
                    <span>ACCEPT RIDE</span>
                  </button>
                </div>
              </div>
              
              <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800 flex items-center space-x-3">
                <Shield size={20} className="text-success" />
                <p className="text-xs text-gray-400">Your safety is our priority. Follow all traffic rules.</p>
              </div>
            </div>
          )}
        </div>

        {/* Map Area */}
        <div className="flex-1 relative grayscale-[0.8] contrast-125 invert-[0.9] opacity-80">
          <MapContainer center={position} zoom={13} scrollWheelZoom={true} zoomControl={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} />
            <MapUpdater center={position} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

export default DriverDashboard;
