import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { Bell, MapPin, Navigation, Check, X, Shield, Globe } from 'lucide-react';

const DriverDashboard = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [rides, setRides] = useState([]);
  const [acceptedRide, setAcceptedRide] = useState(null);
  const [driverLocation, setDriverLocation] = useState({ lat: 17.3850, lng: 78.4867 });

  const mapRef = useRef(null);
  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const pickupMarkerRef = useRef(null);

  useEffect(() => {
    // Initialize Google Map
    const initMap = () => {
      const mapOptions = {
        center: driverLocation,
        zoom: 12,
      };
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, mapOptions);

      directionsServiceRef.current = new window.google.maps.DirectionsService();
      directionsRendererRef.current = new window.google.maps.DirectionsRenderer();
      directionsRendererRef.current.setMap(mapInstanceRef.current);

      // Add driver marker
      driverMarkerRef.current = new window.google.maps.Marker({
        position: driverLocation,
        map: mapInstanceRef.current,
        title: 'You',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/cabs.png',
          scaledSize: new window.google.maps.Size(40, 40)
        }
      });
    };

    if (window.google && window.google.maps) {
      initMap();
    } else {
      window.initMap = initMap;
    }

    // Poll for rides if online
    const pollRides = () => {
      if (isOnline && !acceptedRide) {
        fetch('http://localhost:5000/api/ride/rides')
          .then(res => res.json())
          .then(data => setRides(data))
          .catch(err => console.error(err));
      }
    };

    const interval = setInterval(pollRides, 2000);

    return () => clearInterval(interval);
  }, [isOnline, acceptedRide]);

  useEffect(() => {
    if (acceptedRide) {
      // Show route to pickup
      const request = {
        origin: driverLocation,
        destination: acceptedRide.pickupLocation,
        travelMode: 'DRIVING',
      };

      directionsServiceRef.current.route(request, (result, status) => {
        if (status === 'OK') {
          directionsRendererRef.current.setDirections(result);

          // Add pickup marker
          pickupMarkerRef.current = new window.google.maps.Marker({
            position: result.routes[0].legs[0].end_location,
            map: mapInstanceRef.current,
            title: 'Pickup',
          });
        }
      });

      // Start simulating movement
      const moveInterval = setInterval(() => {
        setDriverLocation(prev => ({
          lat: prev.lat + 0.0005,
          lng: prev.lng + 0.0005
        }));
      }, 2000);

      // Update backend with location
      const updateInterval = setInterval(() => {
        fetch('http://localhost:5000/api/ride/update-driver-location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rideId: acceptedRide.id,
            driverLocation
          })
        }).catch(err => console.error(err));
      }, 2000);

      return () => {
        clearInterval(moveInterval);
        clearInterval(updateInterval);
      };
    }
  }, [acceptedRide, driverLocation]);

  useEffect(() => {
    // Update driver marker position
    if (driverMarkerRef.current) {
      driverMarkerRef.current.setPosition(driverLocation);
    }
  }, [driverLocation]);

  const handleAccept = (ride) => {
    fetch('http://localhost:5000/api/ride/accept-ride', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rideId: ride.id,
        driver: 'driver1'
      })
    })
    .then(res => res.json())
    .then(data => {
      setAcceptedRide(ride);
      setRides([]);
    })
    .catch(err => console.error(err));
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
                isOnline ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-800 text-gray-400'
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

          {isOnline && !acceptedRide && rides.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse"></div>
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center animate-bounce">
                  <Bell size={24} className="text-blue-500" />
                </div>
              </div>
              <p className="text-gray-400 font-medium tracking-wide">Waiting for requests...</p>
            </div>
          )}

          {rides.map(ride => (
            <div key={ride.id} className="flex-1 space-y-6">
              <div className="bg-gray-800 rounded-2xl p-5 border border-blue-500/30 shadow-2xl">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-blue-500/20 text-blue-500 text-xs font-bold px-2 py-1 rounded">NEW REQUEST</span>
                  <span className="font-bold text-xl text-blue-500">₹{ride.fare}</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin size={18} className="text-gray-500 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Pickup</p>
                      <p className="text-sm font-medium">{ride.pickupLocation}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Navigation size={18} className="text-blue-500 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Destination</p>
                      <p className="text-sm font-medium">{ride.dropLocation}</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => handleAccept(ride)}
                    className="flex-1 bg-green-500 text-white py-3 rounded-lg font-bold flex items-center justify-center space-x-2 hover:bg-green-600"
                  >
                    <Check size={20} />
                    <span>Accept</span>
                  </button>
                  <button className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-bold flex items-center justify-center space-x-2 hover:bg-gray-600">
                    <X size={20} />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {acceptedRide && (
            <div className="flex-1 space-y-6">
              <div className="bg-green-800 rounded-2xl p-5 border border-green-500/30 shadow-2xl">
                <h3 className="text-lg font-bold mb-4">Ride Accepted</h3>
                <p>Heading to pickup...</p>
                <p>Pickup: {acceptedRide.pickupLocation}</p>
                <p>Drop: {acceptedRide.dropLocation}</p>
              </div>
            </div>
          )}
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <div ref={mapRef} className="w-full h-full"></div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
