import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardList, 
  FileText, 
  Pill, 
  Activity, 
  Heart, 
  Plus, 
  Trash2, 
  Check, 
  ArrowLeft,
  Calendar,
  AlertCircle,
  Video
} from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import DashboardLayout from '../components/DashboardLayout';
import toast from 'react-hot-toast';
import TelehealthRoom from '../components/TelehealthRoom';
import { printPrescription } from '../utils/printPrescription';

const ConsultationWorkspace = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const token = useAuthStore(state => state.token);
  const user = useAuthStore(state => state.user);

  // States
  const [appointment, setAppointment] = useState(null);
  const [patientHistory, setPatientHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCallOpen, setIsCallOpen] = useState(false);

  // Form States
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [symptomInput, setSymptomInput] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [diagnosis, setDiagnosis] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [temperature, setTemperature] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');

  // Prescription Builder States
  const [prescriptions, setPrescriptions] = useState([]);
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medFrequency, setMedFrequency] = useState('');
  const [medDuration, setMedDuration] = useState('');
  const [medInstructions, setMedInstructions] = useState('');

  useEffect(() => {
    fetchWorkspaceData();
  }, [appointmentId]);

  const fetchWorkspaceData = async () => {
    try {
      // 1. Fetch Appointment Details
      const aptRes = await axios.get(`/api/appointments/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointment(aptRes.data);

      // 2. Fetch Patient's Medical History
      if (aptRes.data.patient?._id) {
        const historyRes = await axios.get(`/api/medical-records/patient/${aptRes.data.patient._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPatientHistory(historyRes.data);
      }
    } catch (error) {
      console.error('Error fetching workspace data:', error);
      toast.error('Failed to load workspace data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSymptom = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = symptomInput.trim().replace(/,$/, '');
      if (trimmed && !symptoms.includes(trimmed)) {
        setSymptoms([...symptoms, trimmed]);
        setSymptomInput('');
      }
    }
  };

  const handleRemoveSymptom = (indexToRemove) => {
    setSymptoms(symptoms.filter((_, i) => i !== indexToRemove));
  };

  const handleAddPrescription = () => {
    if (!medName || !medDosage || !medFrequency || !medDuration) {
      toast.error('Please fill all prescription fields');
      return;
    }
    const newMed = {
      medicineName: medName,
      dosage: medDosage,
      frequency: medFrequency,
      duration: medDuration,
      instructions: medInstructions
    };
    setPrescriptions([...prescriptions, newMed]);
    
    // Clear inputs
    setMedName('');
    setMedDosage('');
    setMedFrequency('');
    setMedDuration('');
    setMedInstructions('');
    toast.success('Medication added');
  };

  const handleRemovePrescription = (indexToRemove) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== indexToRemove));
  };

  const handlePreviewPrescription = () => {
    if (prescriptions.length === 0) {
      toast.error('Add at least one medication to preview the prescription');
      return;
    }
    const tempRecord = {
      prescriptions,
      clinicalNotes: {
        diagnosis: diagnosis || 'Pending Diagnosis',
        chiefComplaint,
        vitals: {
          bloodPressure: bloodPressure || '120/80',
          heartRate: heartRate ? Number(heartRate) : undefined,
          temperature: temperature ? Number(temperature) : undefined,
          weight: weight ? Number(weight) : undefined
        },
        notes
      },
      doctor: {
        firstName: user?.firstName || 'Clinical',
        lastName: user?.lastName || 'Specialist',
        profile: {
          specialization: user?.specialization || 'General Care Specialist'
        }
      },
      patient: {
        firstName: appointment?.patient?.firstName || 'Valued',
        lastName: appointment?.patient?.lastName || 'Patient',
        email: appointment?.patient?.email || 'N/A'
      },
      createdAt: new Date()
    };
    printPrescription(tempRecord);
  };

  const handleSubmitConsultation = async () => {
    if (!diagnosis) {
      toast.error('Diagnosis is required to complete consultation');
      return;
    }

    try {
      const payload = {
        patient: appointment.patient._id,
        appointment: appointmentId,
        type: 'consultation',
        title: `Consultation Summary - ${new Date().toLocaleDateString()}`,
        clinicalNotes: {
          chiefComplaint,
          symptoms,
          diagnosis,
          vitals: {
            bloodPressure,
            heartRate: heartRate ? Number(heartRate) : undefined,
            temperature: temperature ? Number(temperature) : undefined,
            weight: weight ? Number(weight) : undefined
          },
          notes
        },
        prescriptions
      };

      await axios.post('/api/medical-records', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Consultation saved and completed successfully!');
      navigate('/dashboard/doctor');
    } catch (error) {
      console.error('Error saving consultation:', error);
      toast.error('Failed to save consultation');
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="doctor">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!appointment) {
    return (
      <DashboardLayout role="doctor">
        <div className="max-w-md mx-auto text-center py-12">
          <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Appointment Not Found</h2>
          <button onClick={() => navigate('/dashboard/doctor')} className="btn-primary mt-6 px-6 py-2 rounded-xl">
            Return to Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="doctor">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard/doctor')}
              className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-500 hover:text-slate-800 shadow-sm transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-display font-bold">Clinical Workspace</h1>
              <p className="text-sm text-slate-500">
                Consultation with <span className="font-bold text-slate-700">{appointment.patient?.firstName} {appointment.patient?.lastName}</span>
              </p>
            </div>
          </div>

          {appointment.type === 'online' && (
            <button
              onClick={() => setIsCallOpen(true)}
              className="px-6 py-3 bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded-2xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95 duration-200"
            >
              <Video className="w-4 h-4 animate-pulse text-indigo-200" /> Start Telehealth Session
            </button>
          )}
        </header>

        {/* Split Screen Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Panel: Patient Information & History Timeline */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Patient Card */}
            <div className="card-premium">
              <h3 className="text-lg font-display font-bold mb-4">Patient Profile</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Name</span>
                  <span className="font-bold text-slate-800">{appointment.patient?.firstName} {appointment.patient?.lastName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Email</span>
                  <span className="font-medium text-slate-700">{appointment.patient?.email}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Reason for Visit</span>
                  <span className="font-bold text-primary-600">{appointment.reason || 'Not provided'}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="card-premium max-h-[600px] overflow-y-auto no-scrollbar">
              <h3 className="text-lg font-display font-bold mb-6">Medical History Timeline</h3>
              {patientHistory.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <ClipboardList className="w-12 h-12 mx-auto mb-3 stroke-1 text-slate-300" />
                  <p>No previous health records available.</p>
                </div>
              ) : (
                <div className="relative space-y-6 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                  {patientHistory.map((record) => {
                    const isConsult = record.type === 'consultation';
                    return (
                      <div key={record._id} className="relative pl-8 text-sm">
                        <div className={`absolute left-2.5 top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                          isConsult ? 'bg-blue-500' : 'bg-purple-500'
                        }`}></div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              {record.type}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(record.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-800 mb-1">{record.title}</h4>
                          {isConsult && record.clinicalNotes?.diagnosis && (
                            <p className="text-xs text-slate-600">Diagnosis: {record.clinicalNotes.diagnosis}</p>
                          )}
                          {!isConsult && record.prescriptions?.length > 0 && (
                            <p className="text-xs text-purple-600 font-medium">
                              Prescribed: {record.prescriptions.map(p => p.medicineName).join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Active Consultation Form */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Consultation Details */}
            <div className="card-premium space-y-6">
              <h3 className="text-lg font-display font-bold">Clinical Assessment</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Chief Complaint
                  </label>
                  <input
                    type="text"
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    placeholder="e.g. Chronic back pain, sore throat"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-primary-400 focus:bg-white transition-all text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Symptoms (Press Enter/Comma)
                  </label>
                  <input
                    type="text"
                    value={symptomInput}
                    onChange={(e) => setSymptomInput(e.target.value)}
                    onKeyDown={handleAddSymptom}
                    placeholder="Type symptom and press Enter"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-primary-400 focus:bg-white transition-all text-sm outline-none"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {symptoms.map((s, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 font-bold rounded-lg text-xs">
                        {s}
                        <button onClick={() => handleRemoveSymptom(idx)}>
                          <Trash2 className="w-3 h-3 text-slate-400 hover:text-rose-500" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Vitals Form */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Patient Vitals
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Blood Pressure</span>
                    <input
                      type="text"
                      value={bloodPressure}
                      onChange={(e) => setBloodPressure(e.target.value)}
                      placeholder="120/80"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm text-center outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Heart Rate (bpm)</span>
                    <input
                      type="number"
                      value={heartRate}
                      onChange={(e) => setHeartRate(e.target.value)}
                      placeholder="72"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm text-center outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Temp (°F)</span>
                    <input
                      type="number"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      placeholder="98.6"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm text-center outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Weight (kg)</span>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="70"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm text-center outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Diagnosis Field */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Diagnosis *
                </label>
                <input
                  type="text"
                  required
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Acute Pharyngitis, General Exhaustion"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-primary-400 focus:bg-white transition-all text-sm outline-none font-medium"
                />
              </div>

              {/* Consultation Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Clinical Notes / Treatment Plan
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detailed notes, advice, follow-up recommendations..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-primary-400 focus:bg-white transition-all text-sm outline-none resize-none"
                />
              </div>
            </div>

            {/* Prescription Builder */}
            <div className="card-premium space-y-6">
              <h3 className="text-lg font-display font-bold">Interactive Prescription Builder</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Medicine Name</span>
                  <input
                    type="text"
                    value={medName}
                    onChange={(e) => setMedName(e.target.value)}
                    placeholder="e.g. Paracetamol"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Dosage</span>
                  <input
                    type="text"
                    value={medDosage}
                    onChange={(e) => setMedDosage(e.target.value)}
                    placeholder="e.g. 500mg, 1 tablet"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Frequency</span>
                  <input
                    type="text"
                    value={medFrequency}
                    onChange={(e) => setMedFrequency(e.target.value)}
                    placeholder="e.g. Twice daily, Once in morning"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Duration</span>
                  <input
                    type="text"
                    value={medDuration}
                    onChange={(e) => setMedDuration(e.target.value)}
                    placeholder="e.g. 5 days, 1 month"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Instructions (Optional)</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={medInstructions}
                      onChange={(e) => setMedInstructions(e.target.value)}
                      placeholder="e.g. Take after food, avoid cold water"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm outline-none"
                    />
                    <button
                      onClick={handleAddPrescription}
                      className="px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center justify-center transition-all"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Prescriptions List */}
              {prescriptions.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-50">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Added Medications</h4>
                  <div className="grid gap-2">
                    {prescriptions.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-55 border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center">
                            <Pill className="w-4.5 h-4.5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-slate-800">{p.medicineName}</div>
                            <div className="text-[10px] text-slate-400">{p.dosage} • {p.duration}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-xs font-bold text-slate-600">{p.frequency}</div>
                            <div className="text-[10px] text-slate-400">{p.instructions || 'No instructions'}</div>
                          </div>
                          <button 
                            onClick={() => handleRemovePrescription(idx)}
                            className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submission Actions */}
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => navigate('/dashboard/doctor')}
                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl text-sm transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handlePreviewPrescription}
                className="px-6 py-3.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold rounded-2xl text-sm transition-all flex items-center gap-2 border border-indigo-100"
              >
                <FileText className="w-4 h-4" /> Preview Prescription
              </button>
              <button 
                onClick={handleSubmitConsultation}
                className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/10"
              >
                <Check className="w-4 h-4" /> Save & Complete Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
      <TelehealthRoom 
        isOpen={isCallOpen}
        onClose={() => setIsCallOpen(false)}
        participantName={`${appointment.patient?.firstName} ${appointment.patient?.lastName}`}
        participantRole="patient"
      />
    </DashboardLayout>
  );
};

export default ConsultationWorkspace;
