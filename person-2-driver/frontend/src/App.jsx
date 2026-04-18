import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import RiderHome from './pages/RiderHome';
import RiderTrack from './pages/RiderTrack';
import RiderHistory from './pages/RiderHistory';
import DriverDashboard from './pages/DriverDashboard';
import DriverRide from './pages/DriverRide';
import DriverEarnings from './pages/DriverEarnings';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/riderHome" element={<RiderHome />} />
        <Route path="/riderTrack" element={<RiderTrack />} />
        <Route path="/riderHistory" element={<RiderHistory />} />
        <Route path="/driverDashboard" element={<DriverDashboard />} />
        <Route path="/driverRide" element={<DriverRide />} />
        <Route path="/driverEarnings" element={<DriverEarnings />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
