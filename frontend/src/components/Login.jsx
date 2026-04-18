import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, ChevronRight, Lock, Mail, User as UserIcon, Shield } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      if (data.user.role === 'rider') navigate('/rider');
      else if (data.user.role === 'driver') navigate('/driver');
      else if (data.user.role === 'admin') navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Decoration (Visible on LG onwards) */}
      <div className="hidden lg:flex bg-uber items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 opacity-10 animate-pulse-slow"></div>
        <div className="z-10 text-white space-y-6">
          <div className="flex items-center space-x-3">
            <Car size={64} className="text-rapido" />
            <h1 className="text-5xl font-black tracking-tighter uppercase italic">Rapido Clone</h1>
          </div>
          <p className="text-2xl font-medium opacity-80 max-w-md">The most premium ride-hailing experience for your portfolio.</p>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-black text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-500 font-medium">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm font-bold rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-4 text-gray-400 group-focus-within:text-primary transition-colors">
                  <Mail size={20} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary transition-all outline-none font-medium" 
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between ml-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
                <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot?</a>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-4 text-gray-400 group-focus-within:text-primary transition-colors">
                  <Lock size={20} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary transition-all outline-none font-medium" 
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-uber text-white rounded-2xl font-black text-lg flex items-center justify-center space-x-2 hover:bg-black transform transition-all active:scale-95 shadow-xl shadow-gray-200">
              <span>SIGN IN</span>
              <ChevronRight size={20} />
            </button>
          </form>

          <div className="pt-6 text-center">
            <p className="text-sm font-medium text-gray-500">
              Don't have an account? <Link to="/register" className="text-primary font-black hover:underline underline-offset-4">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
