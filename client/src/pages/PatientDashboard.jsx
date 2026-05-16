import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import UpcomingCare from '../components/UpcomingCare';
import HealthInsights from '../components/HealthInsights';
import { motion } from 'framer-motion';
import { Search, Filter, Plus } from 'lucide-react';

const PatientDashboard = () => {
  return (
    <DashboardLayout role="patient">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <UpcomingCare />
        <HealthInsights />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Activity / Timeline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-premium"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-display font-bold text-xl">Recent Activity</h3>
            <button className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
              <Filter className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="space-y-8 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
            {[
              { title: 'Prescription Uploaded', desc: 'Dr. Sarah uploaded your medicine list', time: '2 hours ago', icon: '💊', color: 'bg-amber-100' },
              { title: 'Payment Successful', desc: 'Consultation fee paid for #APT-2024', time: 'Yesterday', icon: '✅', color: 'bg-emerald-100' },
              { title: 'Lab Result Ready', desc: 'Complete Blood Count (CBC) is available', time: '2 days ago', icon: '🔬', color: 'bg-blue-100' },
            ].map((item, i) => (
              <div key={i} className="relative flex items-start gap-6 pl-2 group">
                <div className={`z-10 w-8 h-8 rounded-full ${item.color} flex items-center justify-center text-sm shadow-sm group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{item.title}</h4>
                  <p className="text-sm text-slate-500 mb-1">{item.desc}</p>
                  <span className="text-xs text-slate-400 font-medium">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions / Find Doctors */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-primary-600 rounded-[2rem] p-10 text-white relative overflow-hidden"
        >
          <div className="relative z-10">
            <h3 className="text-2xl font-display font-bold mb-4 text-white">Need a specialist?</h3>
            <p className="text-primary-100 mb-8 max-w-sm">
              Search from over 5,000+ verified healthcare professionals available for instant consultation.
            </p>
            
            <div className="relative mb-8 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search by name, specialty or symptoms..." 
                className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/50 focus:bg-white focus:text-slate-900 transition-all outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {['Cardiology', 'Dermatology', 'Dentist', 'Neurology'].map((tag) => (
                <button key={tag} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-all backdrop-blur-md">
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary-400/20 rounded-full blur-3xl"></div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
