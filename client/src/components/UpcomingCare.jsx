import React, { useState, useEffect } from 'react';
import { Video, Calendar, Clock, ArrowRight, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import TelehealthRoom from './TelehealthRoom';

const UpcomingCare = () => {
  const navigate = useNavigate();
  const token = useAuthStore(state => state.token);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCallOpen, setIsCallOpen] = useState(false);

  useEffect(() => {
    if (token) {
      fetchNextAppointment();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchNextAppointment = async () => {
    try {
      const res = await axios.get('/api/appointments/my-appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Find the first confirmed/pending appointment
      const upcoming = res.data.find(apt => apt.status === 'confirmed' || apt.status === 'pending');
      setNextAppointment(upcoming);
    } catch (error) {
      console.error('Error fetching upcoming care:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="col-span-1 lg:col-span-2 glass-dark rounded-3xl p-8 text-white h-[300px] flex items-center justify-center shadow-2xl">
        <div className="w-8 h-8 border-4 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {nextAppointment ? (
        <motion.div 
          key="appointment-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="col-span-1 lg:col-span-2 glass-dark rounded-3xl p-8 text-white relative overflow-hidden group shadow-2xl"
        >
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                  <Video className="w-6 h-6 text-primary-400" />
                </div>
                <span className="font-semibold text-primary-200">Next Consultation</span>
              </div>
              <div className="px-4 py-1 bg-primary-500 text-slate-900 rounded-full text-xs font-bold animate-pulse">
                {nextAppointment.type === 'online' ? 'Telehealth' : 'Home Visit'}
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h3 className="text-3xl font-display font-bold mb-2">
                  Dr. {nextAppointment.doctor?.firstName} {nextAppointment.doctor?.lastName}
                </h3>
                <p className="text-slate-300 mb-6">
                  {nextAppointment.doctor?.profile?.specialization || 'General Practitioner'} • {nextAppointment.reason || 'Routine Assessment'}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                    <Calendar className="w-4 h-4 text-primary-400" />
                    <span className="text-sm font-medium">
                      {new Date(nextAppointment.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                    <Clock className="w-4 h-4 text-primary-400" />
                    <span className="text-sm font-medium">
                      {nextAppointment.timeSlot?.start} - {nextAppointment.timeSlot?.end}
                    </span>
                  </div>
                </div>
              </div>

              {nextAppointment.type === 'online' ? (
                <button 
                  onClick={() => setIsCallOpen(true)}
                  className="flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold transition-all hover:bg-primary-400 group-hover:scale-105"
                >
                  Join Meeting
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <div className="px-6 py-3 bg-white/5 rounded-xl border border-white/10 text-xs font-semibold text-primary-200">
                  Doctor will visit your home
                </div>
              )}
            </div>
          </div>
          <TelehealthRoom 
            isOpen={isCallOpen}
            onClose={() => setIsCallOpen(false)}
            participantName={`Dr. ${nextAppointment.doctor?.firstName} ${nextAppointment.doctor?.lastName}`}
            participantRole="doctor"
          />
        </motion.div>
      ) : (
        <motion.div 
          key="no-appointment-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="col-span-1 lg:col-span-2 glass-dark rounded-3xl p-8 text-white relative overflow-hidden group shadow-2xl flex flex-col justify-between h-[300px]"
        >
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-emerald-500/20 rounded-2xl border border-emerald-500/30">
                <Activity className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="font-semibold text-emerald-300">Your Health Hub</span>
            </div>
            
            <h3 className="text-3xl font-display font-bold mb-2">Ready to schedule care?</h3>
            <p className="text-slate-300 max-w-md">
              Book a home visit or high-fidelity online telehealth session with our certified specialist team instantly.
            </p>
          </div>

          <button 
            onClick={() => navigate('/doctors')}
            className="flex items-center gap-3 bg-primary-500 text-slate-900 self-start px-8 py-4 rounded-2xl font-bold transition-all hover:bg-primary-400 group-hover:scale-105 mt-4"
          >
            Find & Book Doctor
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpcomingCare;
