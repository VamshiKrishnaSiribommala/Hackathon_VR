import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Navbar from '../components/Navbar';
import { Search, MapPin, Navigation, Send } from 'lucide-react';
import io from 'socket.io-client';

// Fix for default marker icons in Leaflet + React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const socket = io('http://localhost:5001');

const RiderHome = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [rideStatus, setRideStatus] = useState(null);
  const [position, setPosition] = useState([17.3850, 78.4867]); // Default Hyderabad coords

  useEffect(() => {
    // Get user location
    navigator.geolocation.getCurrentPosition((pos) => {
      setPosition([pos.coords.latitude, pos.coords.longitude]);
    });

    socket.on('rideAccepted', (data) => {
      setRideStatus('accepted');
      alert(`Ride accepted by driver: ${data.driverId}`);
    });

    return () => socket.off('rideAccepted');
  }, []);

  const handleBookRide = () => {
    if (!pickup || !destination) return alert("Please enter pickup and destination");
    setIsSearching(true);
    setRideStatus('searching');
    
    const rideData = {
      riderId: "rider_123", // Mock
      pickup,
      destination,
      location: position
    };
    
    socket.emit('requestRide', rideData);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Sidebar Controls */}
        <div className="w-full md:w-96 bg-white p-6 shadow-xl z-10 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6 text-uber">Where to?</h2>
          
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <MapPin size={18} />
              </div>
              <input 
                type="text"
                placeholder="Pickup Location"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
              />
              <div className="absolute left-5 top-10 w-0.5 h-6 bg-gray-300"></div>
            </div>
            
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <Navigation size={18} className="text-primary" />
              </div>
              <input 
                type="text"
                placeholder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
            
            <button 
              onClick={handleBookRide}
              disabled={isSearching}
              className={`w-full py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center space-x-2 ${
                isSearching ? 'bg-gray-400 cursor-not-allowed' : 'bg-uber text-white hover:bg-black active:scale-95'
              }`}
            >
              {isSearching ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Send size={20} />}
              <span>{isSearching ? 'Looking for Drivers...' : 'Request Ride'}</span>
            </button>
          </div>
          
          {rideStatus === 'accepted' && (
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-4">
              <div className="bg-green-500 p-2 rounded-full text-white">
                <Car size={24} />
              </div>
              <div>
                <p className="font-bold text-green-800">Driver is arriving!</p>
                <p className="text-sm text-green-600">White Toyota • TS 09 EJ 1234</p>
              </div>
            </div>
          )}
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          <MapContainer center={position} zoom={13} scrollWheelZoom={true} zoomControl={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>You are here</Popup>
            </Marker>
            <MapUpdater center={position} />
          </MapContainer>
          
          {/* Floating Controls */}
          <div className="absolute bottom-10 right-10 z-[1000] space-y-2">
            <button 
              onClick={() => navigator.geolocation.getCurrentPosition(p => setPosition([p.coords.latitude, p.coords.longitude]))}
              className="bg-white p-4 rounded-full shadow-2xl hover:bg-gray-100 transition-all text-primary"
            >
              <Navigation size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper to update map center when position changes
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

export default RiderHome;
