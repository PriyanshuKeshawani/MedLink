import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ClipboardList, 
  FileText, 
  Pill, 
  Activity, 
  Search, 
  Download, 
  ChevronRight,
  PlusCircle
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import useAuthStore from '../store/authStore';

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const token = useAuthStore(state => state.token);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await axios.get('/api/medical-records/my-history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(res.data);
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case 'consultation': return { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' };
      case 'prescription': return { icon: Pill, color: 'text-purple-600', bg: 'bg-purple-50' };
      case 'lab_result': return { icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50' };
      default: return { icon: ClipboardList, color: 'text-slate-600', bg: 'bg-slate-50' };
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold">Health <span className="text-primary-600">Timeline.</span></h1>
            <p className="text-slate-500 mt-2">Your complete medical history, organized and accessible.</p>
          </div>
          
          <button className="btn-primary py-3 px-6 rounded-2xl flex items-center gap-2 shadow-lg shadow-primary-500/20">
            <PlusCircle className="w-5 h-5" />
            Upload Record
          </button>
        </header>

        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {['all', 'consultation', 'prescription', 'lab_result'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                filter === f 
                ? 'bg-slate-900 text-white' 
                : 'bg-white text-slate-500 border border-slate-100 hover:border-primary-300'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1).replace('_', ' ')}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass h-40 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="relative space-y-8 before:absolute before:left-8 before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
            {records.filter(r => filter === 'all' || r.type === filter).map((record, index) => {
              const styles = getTypeStyles(record.type);
              const Icon = styles.icon;
              
              return (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={record._id} 
                  className="relative pl-20"
                >
                  {/* Timeline Node */}
                  <div className={`absolute left-4 top-0 w-8 h-8 rounded-full border-4 border-white shadow-md flex items-center justify-center z-10 ${styles.bg}`}>
                    <Icon className={`w-4 h-4 ${styles.color}`} />
                  </div>

                  <div className="glass group hover:bg-white transition-all duration-500 rounded-[2rem] p-8 border border-white/20 shadow-sm hover:shadow-xl hover:shadow-primary-500/5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${styles.bg} ${styles.color}`}>
                            {record.type.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {new Date(record.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">{record.title}</h3>
                        <p className="text-sm text-slate-500">Dr. {record.doctor?.firstName} {record.doctor?.lastName} • {record.doctor?.specialization}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-all">
                          <Download className="w-5 h-5" />
                        </button>
                        <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-all">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {record.clinicalNotes && (
                      <div className="grid md:grid-cols-2 gap-6 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Diagnosis</h4>
                          <p className="text-sm font-medium text-slate-700">{record.clinicalNotes?.diagnosis}</p>
                        </div>
                        <div className="flex gap-8">
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">BP</h4>
                            <p className="text-sm font-bold text-slate-700">{record.clinicalNotes?.vitals?.bloodPressure}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Heart Rate</h4>
                            <p className="text-sm font-bold text-slate-700">{record.clinicalNotes?.vitals?.heartRate} bpm</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {record.prescriptions && record.prescriptions.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Prescribed Medications</h4>
                        <div className="grid gap-3">
                          {record.prescriptions.map((p, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                  <Pill className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                  <div className="font-bold text-sm">{p.medicineName}</div>
                                  <div className="text-[10px] text-slate-400">{p.dosage} • {p.duration}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs font-bold text-slate-600">{p.frequency}</div>
                                <div className="text-[10px] text-slate-400">{p.instructions}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MedicalRecords;
