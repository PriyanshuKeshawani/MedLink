import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { motion } from 'framer-motion';
import { Users, Calendar, Clipboard, TrendingUp, Clock, CheckCircle } from 'lucide-react';

const DoctorDashboard = () => {
  const stats = [
    { label: 'Total Patients', value: '124', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Appointments Today', value: '12', icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending Reviews', value: '5', icon: Clipboard, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const appointments = [
    { name: 'Anuj Kumar', time: '10:30 AM', status: 'In Waiting', type: 'Online' },
    { name: 'Priyanshu K.', time: '11:15 AM', status: 'Pending', type: 'Home Visit' },
    { name: 'Sarah J.', time: '12:00 PM', status: 'Completed', type: 'Online' },
  ];

  return (
    <DashboardLayout role="doctor">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-premium flex items-center gap-6"
          >
            <div className={`p-4 ${s.bg} ${s.color} rounded-2xl`}>
              <s.icon className="w-8 h-8" />
            </div>
            <div>
              <div className="text-slate-400 font-medium">{s.label}</div>
              <div className="text-3xl font-display font-bold">{s.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Patient Queue */}
        <div className="xl:col-span-2 card-premium">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-display font-bold">Patient Queue</h3>
            <button className="text-primary-600 font-bold text-sm">View Full Schedule</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-4 font-semibold text-slate-400">Patient</th>
                  <th className="pb-4 font-semibold text-slate-400">Time</th>
                  <th className="pb-4 font-semibold text-slate-400">Type</th>
                  <th className="pb-4 font-semibold text-slate-400">Status</th>
                  <th className="pb-4 font-semibold text-slate-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {appointments.map((apt, i) => (
                  <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 font-bold">{apt.name}</td>
                    <td className="py-4 text-slate-500 font-medium">{apt.time}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        apt.type === 'Online' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                      }`}>
                        {apt.type}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        apt.status === 'In Waiting' ? 'bg-amber-100 text-amber-700 animate-pulse' : 
                        apt.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all">
                        Consult
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Earnings / Performance */}
        <div className="card-premium">
          <h3 className="text-xl font-display font-bold mb-6">Revenue Overview</h3>
          <div className="flex items-center gap-4 mb-8">
            <div className="text-4xl font-display font-bold text-slate-900">$2,450</div>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg text-xs font-bold">
              <TrendingUp className="w-3 h-3" />
              +12.5%
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-500">Weekly Target</span>
                <span className="text-sm font-bold">85%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-primary-600 h-full w-[85%]"></div>
              </div>
            </div>

            <div className="p-4 glass rounded-2xl border border-primary-100 flex items-center gap-4">
              <div className="p-2 bg-primary-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-primary-600" />
              </div>
              <p className="text-xs text-slate-600">
                You've completed <span className="font-bold text-primary-700">95%</span> of your profile. Add certificates to get more visibility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
