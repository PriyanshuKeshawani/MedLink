import React from 'react';
import { Video, Calendar, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const UpcomingCare = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
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
            In 45 Minutes
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h3 className="text-3xl font-display font-bold mb-2">Dr. Sarah Mitchell</h3>
            <p className="text-slate-300 mb-6">Senior Cardiologist • General Checkup</p>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <Calendar className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-medium">Today, 16 May</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <Clock className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-medium">10:30 AM - 11:00 AM</span>
              </div>
            </div>
          </div>

          <button className="flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold transition-all hover:bg-primary-400 group-hover:scale-105">
            Join Meeting
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default UpcomingCare;
