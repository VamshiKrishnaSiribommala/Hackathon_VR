import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, ShieldAlert, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/adminDashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center flex-col items-center">
            <ShieldAlert size={64} className="text-indigo-500 mb-4 animate-pulse" />
            <h2 className="text-center text-4xl font-black text-white uppercase tracking-tighter">
                Control <span className="text-indigo-500 underline decoration-indigo-500/30">Center</span>
            </h2>
            <p className="mt-2 text-center text-sm text-slate-500 font-bold uppercase tracking-widest">
                System Administration & Fleet Management
            </p>
        </div>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 py-10 px-8 shadow-2xl rounded-[2.5rem] border border-slate-800 backdrop-blur-3xl">
          <form className="space-y-8" onSubmit={handleLogin}>
            <div className="space-y-4">
               <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Admin Identity</label>
                  <input 
                    type="text" 
                    defaultValue="Vamshi SuperUser"
                    disabled
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-4 text-slate-300 font-bold outline-none focus:border-indigo-500 transition-all opacity-50 cursor-not-allowed" 
                  />
               </div>
               <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Level</label>
                  <div className="w-full bg-indigo-500/10 border border-indigo-500/20 rounded-2xl px-4 py-4 text-indigo-400 font-black flex items-center justify-between">
                    <span>LEVEL 10: CLEARANCE</span>
                    <Car size={20} />
                  </div>
               </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center space-x-3 py-5 px-4 border border-transparent rounded-[1.5rem] shadow-2xl text-lg font-black text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none transition-all transform hover:-translate-y-1 active:scale-95 active:translate-y-0"
              >
                <span>INITIALIZE CONSOLE</span>
                <ArrowRight size={24} />
              </button>
            </div>
          </form>

          <div className="mt-8 flex justify-center items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">Secured by Rapido Protocol</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
