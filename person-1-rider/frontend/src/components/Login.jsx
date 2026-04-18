import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, User, Shield, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('rider');

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === 'rider') navigate('/riderHome');
    else if (role === 'driver') navigate('/driverDashboard');
    else navigate('/adminDashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Car className="mx-auto h-16 w-auto text-uber" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 uppercase tracking-tight">
          Welcome to <span className="text-primary">Rapido</span> Clone
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 font-medium">
          Connecting you to the fleet
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl rounded-3xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Select Your Role</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'rider', icon: User, label: 'Rider' },
                  { id: 'driver', icon: Car, label: 'Driver' },
                  { id: 'admin', icon: Shield, label: 'Admin' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRole(item.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                      role === item.id 
                      ? 'border-primary bg-blue-50 text-primary shadow-inner scale-95' 
                      : 'border-gray-100 text-gray-400 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon size={24} />
                    <span className="mt-1 text-xs font-bold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center space-x-2 py-4 px-4 border border-transparent rounded-2xl shadow-lg text-lg font-bold text-white bg-uber hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-uber transition-all transform hover:-translate-y-1 active:scale-95"
              >
                <span>LOG IN AS {role.toUpperCase()}</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Hackathon Edition • v1.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
