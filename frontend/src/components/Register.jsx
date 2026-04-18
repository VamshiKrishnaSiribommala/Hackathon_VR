import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, ChevronRight, Lock, Mail, User as UserIcon, Shield } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'rider'
  });
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await register(formData);
      if (data.user.role === 'rider') navigate('/rider');
      else if (data.user.role === 'driver') navigate('/driver');
      else if (data.user.role === 'admin') navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Car className="mx-auto h-16 w-auto text-uber" />
        <h2 className="mt-6 text-center text-3xl font-black text-gray-900 uppercase tracking-tight">Create Your Account</h2>
        <p className="mt-2 text-center text-sm font-medium text-gray-500 italic">Join the next-gen fleet network.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl rounded-3xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {['rider', 'driver', 'admin'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFormData({ ...formData, role })}
                  className={`py-3 rounded-2xl border-2 text-xs font-black uppercase tracking-widest transition-all ${
                    formData.role === role 
                    ? 'border-primary bg-blue-50 text-primary shadow-inner' 
                    : 'border-gray-50 text-gray-400 hover:border-gray-100'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            <div className="relative group">
              <div className="absolute left-4 top-4 text-gray-400">
                <UserIcon size={20} />
              </div>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none font-medium" 
                placeholder="Full Name"
                required
              />
            </div>

            <div className="relative group">
              <div className="absolute left-4 top-4 text-gray-400">
                <Mail size={20} />
              </div>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none font-medium" 
                placeholder="Email Address"
                required
              />
            </div>

            <div className="relative group">
              <div className="absolute left-4 top-4 text-gray-400">
                <Lock size={20} />
              </div>
              <input 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none font-medium" 
                placeholder="Create Password"
                required
              />
            </div>

            <button type="submit" className="w-full py-4 bg-primary text-white rounded-2xl font-black text-lg flex items-center justify-center space-x-2 hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-blue-200">
              <span>GET STARTED</span>
              <ChevronRight size={20} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm font-medium text-gray-500">
              Already have an account? <Link to="/" className="text-primary font-black hover:underline underline-offset-4">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
