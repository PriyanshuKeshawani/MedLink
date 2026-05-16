import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeatureGrid from './components/FeatureGrid';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DoctorSearch from './pages/DoctorSearch';
import MedicalRecords from './pages/MedicalRecords';
import { Toaster } from 'react-hot-toast';

// Landing Page Wrapper
const LandingPage = () => (
  <div className="bg-mesh min-h-screen">
    <Navbar />
    <main>
      <Hero />
      <FeatureGrid />
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="glass-dark rounded-[2.5rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
                Ready to experience the future of <span className="text-primary-400">Healthcare?</span>
              </h2>
              <p className="text-slate-300 text-xl mb-10 max-w-2xl mx-auto">
                Join thousands of users who have transformed how they manage their health.
                Sign up today and get your first consultation free.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="px-8 py-4 bg-primary-500 hover:bg-primary-400 text-slate-900 font-bold rounded-2xl transition-all shadow-xl shadow-primary-500/20">
                  Get Started for Free
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <footer className="py-12 border-t border-slate-200">
      <div className="container mx-auto px-6 text-center text-slate-500">
        <p>© 2026 MedLink Health Platform. All rights reserved.</p>
      </div>
    </footer>
  </div>
);

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<PatientDashboard />} />
        <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
        <Route path="/doctors" element={<DoctorSearch />} />
        <Route path="/records" element={<MedicalRecords />} />
      </Routes>
    </Router>
  );
}

export default App;
