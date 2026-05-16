import React from 'react';
import { Heart, Wind, Droplets, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const statItems = [
  { label: 'Heart Rate', value: '72', unit: 'bpm', icon: Heart, color: 'text-red-500', bg: 'bg-red-50', trend: '+2%' },
  { label: 'Blood Oxygen', value: '98', unit: '%', icon: Wind, color: 'text-blue-500', bg: 'bg-blue-50', trend: 'Stable' },
  { label: 'Hydration', value: '2.4', unit: 'Liters', icon: Droplets, color: 'text-cyan-500', bg: 'bg-cyan-50', trend: '-12%' },
];

const HealthInsights = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="card-premium h-full"
    >
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-display font-bold text-xl">Health Insights</h3>
        <button className="text-primary-600 font-bold text-sm hover:underline">View History</button>
      </div>

      <div className="space-y-6">
        {statItems.map((item, i) => (
          <div key={i} className="flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className={`p-3 ${item.bg} ${item.color} rounded-2xl transition-transform group-hover:scale-110`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm text-slate-400 font-medium">{item.label}</div>
                <div className="text-lg font-bold">
                  {item.value} <span className="text-xs text-slate-400 font-normal">{item.unit}</span>
                </div>
              </div>
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
              item.trend.startsWith('+') ? 'text-emerald-600 bg-emerald-50' : 
              item.trend === 'Stable' ? 'text-slate-500 bg-slate-100' : 'text-red-600 bg-red-50'
            }`}>
              <TrendingUp className={`w-3 h-3 ${item.trend.startsWith('+') ? '' : 'rotate-180'}`} />
              {item.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-4 bg-primary-50 rounded-2xl border border-primary-100">
        <p className="text-xs text-primary-800 font-medium leading-relaxed">
          <span className="font-bold">Pro Tip:</span> Your heart rate is consistent with your sleep pattern. Keep it up!
        </p>
      </div>
    </motion.div>
  );
};

export default HealthInsights;
