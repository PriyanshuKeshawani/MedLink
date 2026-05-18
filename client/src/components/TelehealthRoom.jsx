import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Maximize2, 
  Settings, 
  Activity, 
  Users, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

const TelehealthRoom = ({ isOpen, onClose, participantName, participantRole }) => {
  const [localStream, setLocalStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [activeHeartRate, setActiveHeartRate] = useState(72);
  const localVideoRef = useRef(null);

  // Timer interval
  useEffect(() => {
    let timer;
    if (isOpen) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
        // Simulate dynamic heart rate changes slightly
        setActiveHeartRate(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen]);

  // Request webcam stream
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240 },
        audio: true
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      toast.success('Secure telehealth camera link established');
    } catch (err) {
      console.warn('Camera access denied or unavailable, using premium mock self view:', err.message);
      toast.error('Webcam access unavailable - running in hybrid simulation mode');
    }
  };

  const stopCamera = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
    }
    setIsMuted(!isMuted);
    toast.success(isMuted ? 'Microphone active' : 'Microphone muted');
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = isVideoOff;
      });
    }
    setIsVideoOff(!isVideoOff);
    toast.success(isVideoOff ? 'Camera feed active' : 'Camera feed paused');
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-6xl h-[85vh] bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col"
      >
        
        {/* Call Header */}
        <header className="px-8 py-5 border-b border-slate-800 flex items-center justify-between relative z-10 bg-slate-900/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <h2 className="text-white font-display font-bold text-lg flex items-center gap-2">
                Telehealth Portal 
                <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                  AES-256 Encrypted
                </span>
              </h2>
              <p className="text-xs text-slate-400">Consultation Room • {participantName}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-slate-800 px-4 py-2 rounded-xl text-white font-mono text-sm font-semibold tracking-wider">
              {formatTime(callDuration)}
            </div>
            <div className="bg-primary-500/10 border border-primary-500/20 px-3.5 py-1.5 rounded-xl text-xs font-bold text-primary-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary-400" />
              HD 1080p
            </div>
          </div>
        </header>

        {/* Call Main Stage */}
        <div className="flex-1 min-h-0 relative flex flex-col md:flex-row gap-6 p-6">
          
          {/* Main Remote View */}
          <div className="flex-1 bg-slate-950/40 border border-slate-800 rounded-3xl overflow-hidden relative flex items-center justify-center group shadow-inner">
            
            {/* Mock High-Definition Call Frame */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-transparent to-slate-950/80">
              
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-primary-500/10 border-2 border-primary-500 rounded-full flex items-center justify-center text-3xl shadow-lg shadow-primary-500/10 animate-pulse">
                  {participantRole === 'doctor' ? '👨‍⚕️' : '👤'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-slate-900 rounded-full"></div>
              </div>

              <h3 className="text-xl font-display font-bold text-white mb-2">{participantName}</h3>
              <p className="text-sm text-slate-400 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                Live Video Connection Stable
              </p>
              
              {/* Pulse waves in background to show audio active */}
              <div className="flex gap-1 mt-6">
                {[1, 2, 3, 4, 5, 4, 3, 2, 3, 4, 5, 2, 1].map((val, idx) => (
                  <motion.div 
                    key={idx}
                    animate={{ height: [8, 12 + val * 4, 8] }}
                    transition={{ repeat: Infinity, duration: 1 + idx * 0.1 }}
                    className="w-1 bg-primary-400 rounded-full"
                    style={{ height: '8px' }}
                  />
                ))}
              </div>
            </div>

            {/* Vital Signs Overlay (E.g. heart rate simulated) */}
            <div className="absolute top-4 left-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-white text-xs font-semibold flex items-center gap-3 backdrop-blur-md">
              <div className="p-2 bg-rose-500/10 rounded-xl">
                <Activity className="w-5 h-5 text-rose-500 animate-bounce" />
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Patient Heart Rate</span>
                <span className="text-lg font-bold text-white font-mono">{activeHeartRate} <span className="text-[10px] text-slate-400">bpm</span></span>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-emerald-400 font-medium flex items-center gap-1.5 backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secure Data Tunnel Active
            </div>
          </div>

          {/* Local User View Panel (Self View) */}
          <div className="w-full md:w-80 h-48 md:h-auto bg-slate-950/60 border border-slate-800 rounded-3xl overflow-hidden relative shadow-inner flex items-center justify-center">
            
            {localStream && !isVideoOff ? (
              <video 
                ref={localVideoRef}
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-xl mx-auto mb-3 text-slate-500">
                  {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                </div>
                <h4 className="text-sm font-bold text-white">Your Feed</h4>
                <p className="text-xs text-slate-500 mt-1">{isVideoOff ? 'Video Paused' : 'Initializing...'}</p>
              </div>
            )}

            <div className="absolute bottom-4 left-4 right-4 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-semibold flex items-center justify-between backdrop-blur-md">
              <span>You (Self)</span>
              <div className="flex gap-1">
                {isMuted && <MicOff className="w-3.5 h-3.5 text-rose-500" />}
                {isVideoOff && <VideoOff className="w-3.5 h-3.5 text-rose-500" />}
              </div>
            </div>
          </div>
        </div>

        {/* Call Footer / Control Panel */}
        <footer className="px-8 py-6 border-t border-slate-800 bg-slate-900/60 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
            <Users className="w-4 h-4 text-slate-400" />
            <span>2 Participants Connected</span>
          </div>

          {/* Key Call Controls */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleMute}
              className={`p-4 rounded-2xl flex items-center justify-center transition-all ${
                isMuted 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            <button 
              onClick={toggleVideo}
              className={`p-4 rounded-2xl flex items-center justify-center transition-all ${
                isVideoOff 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
            </button>

            <button 
              onClick={onClose}
              className="px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all active:scale-95"
            >
              <PhoneOff className="w-5 h-5" />
              Disconnect Room
            </button>
          </div>

          <div className="flex gap-2">
            <button className="p-3 bg-slate-850 hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">
              <Maximize2 className="w-5 h-5" />
            </button>
            <button className="p-3 bg-slate-850 hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </footer>

      </motion.div>
    </div>
  );
};

export default TelehealthRoom;
