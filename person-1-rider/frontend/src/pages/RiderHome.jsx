import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { MapPin, Navigation, Send, Car } from 'lucide-react';

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
  const [rideId, setRideId] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);

  const mapRef = useRef(null);
  const pickupInputRef = useRef(null);
  const destinationInputRef = useRef(null);
  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const driverMarkerRef = useRef(null);

  const updateDriverMarker = (location) => {
    // Remove previous marker
    if (driverMarkerRef.current) {
      driverMarkerRef.current.setMap(null);
    }
    // Add new driver marker
    driverMarkerRef.current = new window.google.maps.Marker({
      position: location,
      map: mapInstanceRef.current,
      title: 'Driver',
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/cabs.png',
        scaledSize: new window.google.maps.Size(40, 40)
      }
    });
  };

  const handleBookRide = () => {
    if (!pickup || !destination) return alert("Please enter pickup and destination");

    // Calculate route
    const request = {
      origin: pickup,
      destination: destination,
      travelMode: 'DRIVING',
    };

    directionsServiceRef.current.route(request, (result, status) => {
      if (status === 'OK') {
        directionsRendererRef.current.setDirections(result);

        // Request ride
        fetch('http://localhost:5000/api/ride/request-ride', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pickupLocation: pickup,
            dropLocation: destination,
            fare: 100 // mock
          })
        })
        .then(res => res.json())
        .then(data => {
          setRideId(data.id);
          setIsSearching(true);
          setRideStatus('requested');
        })
        .catch(err => console.error(err));
      } else {
        alert('Directions request failed due to ' + status);
      }
    });
  };

  useEffect(() => {
    // Initialize Google Maps
    if (window.google && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 12.9716, lng: 77.5946 }, // Bangalore
        zoom: 12,
      });
      mapInstanceRef.current = map;

      // Initialize Directions Service and Renderer
      directionsServiceRef.current = new window.google.maps.DirectionsService();
      directionsRendererRef.current = new window.google.maps.DirectionsRenderer();
      directionsRendererRef.current.setMap(map);

      // Initialize Autocomplete for pickup
      const pickupAutocomplete = new window.google.maps.places.Autocomplete(pickupInputRef.current);
      pickupAutocomplete.bindTo('bounds', map);
      pickupAutocomplete.addListener('place_changed', () => {
        const place = pickupAutocomplete.getPlace();
        if (place.geometry) {
          setPickup(place.formatted_address);
        }
      });

      // Initialize Autocomplete for destination
      const destinationAutocomplete = new window.google.maps.places.Autocomplete(destinationInputRef.current);
      destinationAutocomplete.bindTo('bounds', map);
      destinationAutocomplete.addListener('place_changed', () => {
        const place = destinationAutocomplete.getPlace();
        if (place.geometry) {
          setDestination(place.formatted_address);
        }
      });
    }

    // Polling for ride status
    const pollInterval = setInterval(() => {
      if (rideId) {
        fetch(`http://localhost:5000/api/ride/ride-status/${rideId}`)
          .then(res => res.json())
          .then(data => {
            setRideStatus(data.status);
            if (data.status === 'accepted' && data.driverLocation) {
              setDriverLocation(data.driverLocation);
              updateDriverMarker(data.driverLocation);
            }
            if (data.status === 'completed') {
              setIsSearching(false);
              setRideStatus(null);
              setRideId(null);
              setDriverLocation(null);
              if (driverMarkerRef.current) {
                driverMarkerRef.current.setMap(null);
              }
            }
          })
          .catch(err => console.error('Polling error:', err));
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [rideId]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Sidebar Controls */}
        <div className="w-full md:w-96 bg-white p-6 shadow-xl z-10 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6 text-blue-600">Where to?</h2>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <MapPin size={18} />
              </div>
              <input
                ref={pickupInputRef}
                type="text"
                placeholder="Pickup Location"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <div className="absolute left-5 top-10 w-0.5 h-6 bg-gray-300"></div>
            </div>

            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <Navigation size={18} className="text-blue-500" />
              </div>
              <input
                ref={destinationInputRef}
                type="text"
                placeholder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <button
              onClick={handleBookRide}
              disabled={isSearching}
              className={`w-full py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center space-x-2 ${
                isSearching ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
              }`}
            >
              {isSearching ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Send size={20} />}
              <span>{rideStatus === 'requested' ? 'Searching...' : rideStatus === 'accepted' ? 'Driver Assigned' : 'Request Ride'}</span>
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

        {/* Map */}
        <div className="flex-1 relative">
          <div ref={mapRef} className="w-full h-full"></div>
        </div>
      </div>
    </div>
  );
};

export default RiderHome;
