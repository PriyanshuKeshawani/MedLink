import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import { io } from 'socket.io-client';

const socket = io(); // Uses same origin (proxied)

const BookingModal = ({ doctor, isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(false);
  const token = useAuthStore(state => state.token);

  React.useEffect(() => {
    if (date && doctor._id) {
      fetchSlots();
    }
  }, [date, doctor._id]);

  const fetchSlots = async () => {
    setFetchingSlots(true);
    try {
      const res = await axios.get(`/api/doctors/${doctor._id}/availability?date=${date}`);
      setSlots(res.data);
    } catch (error) {
      toast.error('Failed to fetch slots');
    } finally {
      setFetchingSlots(false);
    }
  };

  const handleBooking = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/appointments', {
        doctorId: doctor._id,
        date,
        timeSlot: { start: selectedSlot.start, end: selectedSlot.end },
        reason: 'General Consultation',
        type: 'online'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStep(3);
      toast.success('Appointment booked!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-display font-bold">Book Appointment</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary-600" /> Select Date
                  </label>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary-500"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary-600" /> Available Slots
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {fetchingSlots ? (
                      <div className="col-span-3 text-center py-4 text-slate-400">Loading slots...</div>
                    ) : slots.length > 0 ? (
                      slots.map(slot => (
                        <button 
                          key={slot.start}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-3 rounded-xl border font-bold text-xs transition-all ${
                            selectedSlot?.start === slot.start ? 'bg-primary-600 border-primary-600 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-primary-300'
                          }`}
                        >
                          {slot.start}
                        </button>
                      ))
                    ) : (
                      <div className="col-span-3 text-center py-4 text-slate-400">No slots available</div>
                    )}
                  </div>
                </div>

                <button 
                  disabled={!date || !selectedSlot}
                  onClick={() => setStep(2)}
                  className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 mt-8"
                >
                  Continue to Confirm
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 text-center"
              >
                <div className="bg-primary-50 p-6 rounded-3xl inline-block mb-4">
                  <Calendar className="w-12 h-12 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold">Confirm Your Slot</h3>
                <div className="bg-slate-50 p-6 rounded-3xl space-y-3 text-left">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Doctor</span>
                    <span className="font-bold">Dr. {doctor.firstName} {doctor.lastName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Date</span>
                    <span className="font-bold">{date}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Time</span>
                    <span className="font-bold">{selectedSlot?.start} - {selectedSlot?.end}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="flex-1 py-4 font-bold text-slate-500 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all">Back</button>
                  <button 
                    onClick={handleBooking}
                    disabled={loading}
                    className="flex-[2] btn-primary py-4 rounded-2xl flex items-center justify-center gap-2"
                  >
                    {loading ? 'Processing...' : 'Confirm Booking'}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-10"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
                <p className="text-slate-500 mb-8">Your appointment has been scheduled successfully.</p>
                <button onClick={onClose} className="w-full btn-primary py-4 rounded-2xl">Done</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingModal;
