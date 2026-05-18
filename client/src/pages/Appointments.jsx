import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  MapPin, 
  User, 
  UserCheck, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ChevronRight,
  Download,
  Trash2,
  CalendarDays
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import useAuthStore from '../store/authStore';
import { printPrescription } from '../utils/printPrescription';
import toast from 'react-hot-toast';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const token = useAuthStore(state => state.token);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    try {
      if (!user) return;
      const endpoint = user.role === 'doctor' 
        ? '/api/appointments/doctor-appointments' 
        : '/api/appointments/my-appointments';

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(res.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await axios.patch(`/api/appointments/${id}/status`, { status: 'cancelled' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Appointment cancelled successfully');
      fetchAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment');
    }
  };

  const handleViewPrescription = async (appointmentId) => {
    try {
      // Find associated medical record
      const res = await axios.get('/api/medical-records/my-history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const record = res.data.find(r => r.appointment === appointmentId || r.appointment?._id === appointmentId);
      if (record) {
        printPrescription(record);
      } else {
        toast.error('No clinical record found for this completed appointment.');
      }
    } catch (error) {
      console.error('Error printing prescription:', error);
      toast.error('Could not fetch prescription');
    }
  };

  // Stats Calculations
  const totalCount = appointments.length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;
  const upcomingCount = appointments.filter(a => a.status === 'scheduled').length;
  const virtualCount = appointments.filter(a => a.type === 'online' && a.status === 'scheduled').length;

  const getFilteredAppointments = () => {
    switch (filter) {
      case 'upcoming':
        return appointments.filter(a => a.status === 'scheduled');
      case 'completed':
        return appointments.filter(a => a.status === 'completed');
      case 'cancelled':
        return appointments.filter(a => a.status === 'cancelled');
      default:
        return appointments;
    }
  };

  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border border-rose-100';
      default:
        return 'bg-blue-50 text-blue-700 border border-blue-100';
    }
  };

  return (
    <DashboardLayout role={user?.role}>
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold">
              {user?.role === 'doctor' ? 'Clinical' : 'Your'}{' '}
              <span className="text-primary-600">Calendar.</span>
            </h1>
            <p className="text-slate-500 mt-2">
              {user?.role === 'doctor' 
                ? 'Manage clinical workflows, patient schedules, and live video consultations.' 
                : 'Track, manage, and attend scheduled health checkups and telehealth consultations.'}
            </p>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Bookings', value: totalCount, icon: CalendarIcon, color: 'text-slate-600', bg: 'bg-slate-100' },
            { label: 'Upcoming Consults', value: upcomingCount, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Completed Sessions', value: completedCount, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Virtual Care Slots', value: virtualCount, icon: Video, color: 'text-purple-600', bg: 'bg-purple-50' }
          ].map((stat, idx) => (
            <div key={idx} className="glass p-6 rounded-3xl border border-white/20 shadow-sm flex items-center gap-5">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">{stat.label}</span>
                <span className="text-2xl font-bold text-slate-800">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {['all', 'upcoming', 'completed', 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                filter === f 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-white text-slate-500 border border-slate-100 hover:border-primary-300'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2].map(i => (
              <div key={i} className="glass h-40 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {getFilteredAppointments().length === 0 ? (
              <div className="glass rounded-[2rem] p-12 text-center border border-white/20">
                <CalendarDays className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-700">No Appointments Found</h3>
                <p className="text-sm text-slate-500 mt-1">There are no appointments matching your filter selection.</p>
                {user?.role !== 'doctor' && (
                  <button 
                    onClick={() => navigate('/doctors')}
                    className="btn-primary mt-6 py-2.5 px-6 rounded-xl text-sm font-bold shadow-md shadow-primary-500/10"
                  >
                    Find and Book a Doctor
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-6">
                <AnimatePresence mode="popLayout">
                  {getFilteredAppointments().map((appt, idx) => {
                    const isDoctor = user?.role === 'doctor';
                    const counterpart = isDoctor ? appt.patient : appt.doctor;
                    const dateObj = new Date(appt.date);
                    const formattedDate = dateObj.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });

                    return (
                      <motion.div
                        key={appt._id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.05 }}
                        className="glass group hover:bg-white rounded-[2rem] p-6 md:p-8 border border-white/20 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
                      >
                        {/* Profile Details */}
                        <div className="flex items-center gap-4">
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${counterpart?.firstName || 'User'}`}
                            alt="avatar"
                            className="w-16 h-16 rounded-2xl bg-primary-50 border border-slate-100"
                          />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${getStatusBadgeStyles(appt.status)}`}>
                                {appt.status}
                              </span>
                              <span className="text-xs text-slate-400 font-medium">#{appt._id.slice(-6)}</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">
                              {isDoctor ? 'Patient:' : 'Dr.'} {counterpart?.firstName} {counterpart?.lastName}
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {isDoctor ? counterpart?.email : (appt.doctor?.profile?.specialization || appt.doctor?.specialization || 'Clinical Specialist')}
                            </p>
                          </div>
                        </div>

                        {/* Calendar Details */}
                        <div className="flex flex-wrap items-center gap-6 text-slate-600">
                          <div className="flex items-center gap-2 bg-slate-50 border border-slate-100/50 py-2 px-4 rounded-2xl">
                            <CalendarIcon className="w-4 h-4 text-primary-500" />
                            <span className="text-sm font-bold">{formattedDate}</span>
                          </div>
                          <div className="flex items-center gap-2 bg-slate-50 border border-slate-100/50 py-2 px-4 rounded-2xl">
                            <Clock className="w-4 h-4 text-primary-500" />
                            <span className="text-sm font-bold">{appt.timeSlot?.start} - {appt.timeSlot?.end}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {appt.type === 'online' ? (
                              <span className="flex items-center gap-1 text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">
                                <Video className="w-3.5 h-3.5" /> Virtual Telehealth
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                                <MapPin className="w-3.5 h-3.5" /> In-Clinic Visit
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 justify-end self-stretch md:self-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                          {appt.status === 'scheduled' && (
                            <>
                              {appt.type === 'online' ? (
                                <button
                                  onClick={() => navigate(isDoctor ? `/doctor/consultation/${appt._id}` : `/doctor/consultation/${appt._id}`)}
                                  className="btn-primary py-2.5 px-5 rounded-xl text-xs font-bold flex items-center gap-2 animate-pulse shadow-md shadow-primary-500/20"
                                >
                                  <Video className="w-4 h-4" /> Join Video Consult
                                </button>
                              ) : isDoctor ? (
                                <button
                                  onClick={() => navigate(`/doctor/consultation/${appt._id}`)}
                                  className="btn-primary py-2.5 px-5 rounded-xl text-xs font-bold flex items-center gap-2"
                                >
                                  <ChevronRight className="w-4 h-4" /> Start Consultation
                                </button>
                              ) : null}

                              <button
                                onClick={() => handleCancelAppointment(appt._id)}
                                className="p-2.5 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-xl transition-all"
                                title="Cancel Appointment"
                              >
                                <Trash2 className="w-4.5 h-4.5" />
                              </button>
                            </>
                          )}

                          {appt.status === 'completed' && (
                            <button
                              onClick={() => handleViewPrescription(appt._id)}
                              className="px-5 py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
                            >
                              <Download className="w-3.5 h-3.5" /> Prescription
                            </button>
                          )}

                          {appt.status === 'cancelled' && (
                            <span className="text-xs text-rose-500 font-bold flex items-center gap-1 px-3 py-1.5 bg-rose-50 rounded-lg">
                              <XCircle className="w-4 h-4" /> Cancelled
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Appointments;
