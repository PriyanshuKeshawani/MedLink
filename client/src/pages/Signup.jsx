import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Mail, Lock, User, UserCheck, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'patient'
  });
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(formData);
    setLoading(false);
    
    if (result.success) {
      toast.success('Account created successfully!');
      navigate(formData.role === 'doctor' ? '/dashboard/doctor' : '/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full glass p-10 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row gap-10"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-display font-bold">MedLink</span>
          </div>
          <h1 className="text-4xl font-display font-bold mb-4">Join the Future of <span className="text-primary-600">Care.</span></h1>
          <p className="text-slate-500 mb-8">Create an account to start managing your health or patients more efficiently.</p>
          
          <div className="space-y-4 hidden md:block">
            {['Expert Doctors', '24/7 Support', 'Secure Records'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm font-bold text-slate-700 bg-white/50 p-3 rounded-xl border border-white/20">
                <UserCheck className="w-4 h-4 text-primary-600" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-[1.2] space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">First Name</label>
              <input 
                type="text" required
                placeholder="Anuj"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-primary-500 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Last Name</label>
              <input 
                type="text" required
                placeholder="Kumar"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
            <input 
              type="email" required
              placeholder="anuj@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-primary-500 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
            <input 
              type="password" required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-primary-500 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => setFormData({...formData, role: 'patient'})}
                className={`p-3 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  formData.role === 'patient' ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-500/30' : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <User className="w-4 h-4" /> Patient
              </button>
              <button 
                type="button"
                onClick={() => setFormData({...formData, role: 'doctor'})}
                className={`p-3 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  formData.role === 'doctor' ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-500/30' : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <Activity className="w-4 h-4" /> Doctor
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-md mt-4 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Get Started'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>

          <p className="text-center text-slate-500 text-xs mt-4">
            Already have an account? 
            <Link to="/login" className="text-primary-600 font-bold ml-1 hover:underline">Log in</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;
