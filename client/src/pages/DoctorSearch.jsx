import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Activity } from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import DoctorCard from '../components/DoctorCard';
import BookingModal from '../components/BookingModal';

const DoctorSearch = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const specializations = ['Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Dentist'];

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/doctors?search=${searchTerm}&specialization=${selectedSpecialization}`);
      setDoctors(res.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchDoctors();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedSpecialization]);

  const handleBook = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold">Find your <span className="text-primary-600">Specialist.</span></h1>
            <p className="text-slate-500 mt-2">Book an appointment with top-rated doctors across all specialties.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search doctors by name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-primary-500 focus:shadow-lg focus:shadow-primary-500/5 transition-all w-80"
              />
            </div>
            <button className="glass p-4 rounded-2xl hover:bg-white transition-all border border-white/40 shadow-sm">
              <Filter className="w-6 h-6 text-slate-600" />
            </button>
          </div>
        </header>

        <section className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          <button 
            onClick={() => setSelectedSpecialization('')}
            className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
              selectedSpecialization === '' ? 'bg-primary-600 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-100 hover:border-primary-300'
            }`}
          >
            All Specialties
          </button>
          {specializations.map(spec => (
            <button 
              key={spec}
              onClick={() => setSelectedSpecialization(spec)}
              className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                selectedSpecialization === spec ? 'bg-primary-600 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-100 hover:border-primary-300'
              }`}
            >
              {spec}
            </button>
          ))}
        </section>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass h-64 rounded-[2rem] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <>
            {doctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {doctors.map(doctor => (
                  <DoctorCard key={doctor._id} doctor={doctor} onBook={handleBook} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/40 rounded-[3rem] border border-white/20">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Activity className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold">No doctors found</h3>
                <p className="text-slate-500">Try adjusting your search filters.</p>
              </div>
            )}
          </>
        )}
      </div>

      {selectedDoctor && (
        <BookingModal 
          doctor={selectedDoctor} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </DashboardLayout>
  );
};

export default DoctorSearch;
