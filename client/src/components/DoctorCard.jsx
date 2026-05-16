import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, ArrowRight } from 'lucide-react';

const DoctorCard = ({ doctor, onBook }) => {
  const { firstName, lastName, profile } = doctor;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="glass p-6 rounded-[2rem] border border-white/20 hover:border-primary-500/30 transition-all group"
    >
      <div className="flex gap-5">
        <div className="relative">
          <img 
            src={doctor.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}`} 
            alt={firstName}
            className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white/10"
          />
          <div className="absolute -bottom-2 -right-2 bg-green-500 w-5 h-5 rounded-full border-4 border-white"></div>
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-display font-bold">Dr. {firstName} {lastName}</h3>
              <p className="text-primary-600 font-bold text-sm">{profile?.specialization || 'General Physician'}</p>
            </div>
            <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-bold text-yellow-700">{profile?.rating || '4.8'}</span>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-4 text-slate-500 text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {profile?.experience || '10+ Years Exp'}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Available Today
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Consultation Fee</p>
          <p className="text-lg font-display font-bold text-slate-800">$50.00</p>
        </div>
        
        <button 
          onClick={() => onBook(doctor)}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 group-hover:bg-primary-600 transition-colors"
        >
          Book Now
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default DoctorCard;
