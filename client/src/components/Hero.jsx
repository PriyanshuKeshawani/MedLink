import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, Users, Play } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-primary-100/50 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-cyan-100/40 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full font-semibold text-sm mb-6 border border-primary-100">
            <Shield className="w-4 h-4" />
            <span>Trusted by 10,000+ Families</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-display font-bold leading-tight mb-6">
            Healthcare at your <span className="text-primary-600">Doorstep</span> in minutes.
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-lg leading-relaxed">
            Connect with top-rated doctors for home visits or online consultations. 
            Real-time tracking, AI diagnostics, and personalized care.
          </p>
          <div className="flex flex-wrap gap-4 mb-10">
            <button className="btn-primary flex items-center gap-2">
              Book Appointment Now
            </button>
            <button className="btn-outline flex items-center gap-2 group">
              <div className="p-1 bg-slate-100 rounded-full group-hover:bg-white transition-colors">
                <Play className="w-4 h-4" />
              </div>
              See How It Works
            </button>
          </div>

          <div className="flex items-center gap-10">
            <div>
              <div className="text-3xl font-bold font-display">4.9/5</div>
              <div className="text-slate-500 text-sm">User Satisfaction</div>
            </div>
            <div className="h-10 w-px bg-slate-200"></div>
            <div>
              <div className="text-3xl font-bold font-display">15 min</div>
              <div className="text-slate-500 text-sm">Avg. Response Time</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
            <img 
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop" 
              alt="Medical professional" 
              className="w-full aspect-[4/5] object-cover"
            />
          </div>
          
          {/* Floating Cards */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 -left-10 z-20 glass p-4 rounded-2xl shadow-xl flex items-center gap-4"
          >
            <div className="p-3 bg-emerald-500 rounded-xl">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold">Fast Booking</div>
              <div className="text-xs text-slate-500">Available 24/7</div>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-20 -right-6 z-20 glass p-4 rounded-2xl shadow-xl flex items-center gap-4"
          >
            <div className="p-3 bg-cyan-500 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold">500+ Doctors</div>
              <div className="text-xs text-slate-500">Expert Specialists</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
