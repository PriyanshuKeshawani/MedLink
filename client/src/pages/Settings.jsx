import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Shield, 
  Settings as SettingsIcon, 
  Radio, 
  Check, 
  Volume2, 
  Sliders, 
  Sparkles,
  Info,
  Server
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, token, updateUser } = useAuthStore();
  
  // Profile state
  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    bio: user?.bio || 'Certified Healthcare Professional dedicated to wellness.',
    avatar: user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.firstName || 'User'}`
  });

  // P2P WebRTC settings
  const [p2pEnabled, setP2pEnabled] = useState(true);
  const [stunServers, setStunServers] = useState([
    'stun:stun.l.google.com:19002',
    'stun:stun1.l.google.com:19002'
  ]);
  const [newStun, setNewStun] = useState('');
  const [encryptionLevel, setEncryptionLevel] = useState('AES-GCM-256');

  // Application settings
  const [sidebarGlass, setSidebarGlass] = useState(true);
  const [accentColor, setAccentColor] = useState('indigo');
  const [notificationsVolume, setNotificationsVolume] = useState(80);

  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const handleSaveSettings = () => {
    setSaving(true);
    setTimeout(() => {
      // Save user details to Zustand authStore
      updateUser({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        bio: profile.bio,
        avatar: profile.avatar
      });

      // Save local web configuration preferences
      localStorage.setItem('medlink_p2p_enabled', JSON.stringify(p2pEnabled));
      localStorage.setItem('medlink_stun_servers', JSON.stringify(stunServers));
      localStorage.setItem('medlink_sidebar_glass', JSON.stringify(sidebarGlass));
      localStorage.setItem('medlink_accent_color', accentColor);

      setSaving(false);
      toast.success('System configuration saved successfully! ✨');
    }, 1200);
  };

  const handleAddStun = () => {
    if (!newStun.trim()) return;
    if (stunServers.includes(newStun)) {
      toast.error('STUN server already added');
      return;
    }
    setStunServers([...stunServers, newStun.trim()]);
    setNewStun('');
    toast.success('New ICE / STUN gateway registered');
  };

  const handleRemoveStun = (stun) => {
    setStunServers(stunServers.filter(s => s !== stun));
    toast.success('ICE gateway removed');
  };

  const generateRandomAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`;
    setProfile({ ...profile, avatar: newAvatar });
    toast.success('Generated a new clinical digital avatar! 🎨');
  };

  return (
    <DashboardLayout role={user?.role}>
      <div className="max-w-5xl mx-auto space-y-8 pb-10">
        <div>
          <h1 className="text-3xl font-display font-bold">System <span className="text-primary-600">Settings.</span></h1>
          <p className="text-slate-500 text-sm mt-1">Configure your personal healthcare account, security preferences, and WebRTC Direct Tunnels.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Tabs Menu Column */}
          <div className="w-full md:w-64 glass rounded-[2rem] p-4 border border-white/20 shadow-lg space-y-1.5 shrink-0 bg-white/40">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                activeTab === 'profile'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-650 hover:bg-slate-100/50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile Settings</span>
            </button>
            <button
              onClick={() => setActiveTab('webrtc')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                activeTab === 'webrtc'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-650 hover:bg-slate-100/50'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>WebRTC & P2P</span>
            </button>
            <button
              onClick={() => setActiveTab('app')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                activeTab === 'app'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-650 hover:bg-slate-100/50'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Dashboard Accent</span>
            </button>
          </div>

          {/* Active Configuration Workspace Panel */}
          <div className="flex-1 w-full bg-white/80 glass rounded-[2.5rem] border border-white/20 p-8 md:p-10 shadow-xl min-h-[50vh] flex flex-col justify-between">
            <div>
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h3 className="text-xl font-bold text-slate-800">Profile Settings</h3>
                    <span className="text-xs font-bold bg-primary-100 text-primary-600 px-3 py-1 rounded-full capitalize">{user?.role} Mode</span>
                  </div>

                  {/* Avatar Picker Section */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-3xl bg-slate-50/50 border border-slate-100/50">
                    <img 
                      src={profile.avatar}
                      alt="avatar generator"
                      className="w-20 h-20 rounded-2xl bg-white border border-slate-200 shadow-sm"
                    />
                    <div className="text-center sm:text-left space-y-2">
                      <h4 className="font-bold text-sm text-slate-800">Digital Identity Avatar</h4>
                      <p className="text-xs text-slate-400 max-w-sm font-medium">Generate a customizable clinical SVG avatar seed instantly via advanced Dicebear libraries.</p>
                      <button
                        onClick={generateRandomAvatar}
                        className="text-xs font-bold bg-white border border-slate-200 hover:border-primary-400 text-slate-700 py-2 px-4 rounded-xl transition-all shadow-sm flex items-center gap-1.5 mx-auto sm:mx-0"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-primary-500 animate-pulse" /> Generate Avatar
                      </button>
                    </div>
                  </div>

                  {/* Personal Fields Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">First Name</label>
                      <input
                        type="text"
                        value={profile.firstName}
                        onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                        className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-primary-400 font-medium transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Last Name</label>
                      <input
                        type="text"
                        value={profile.lastName}
                        onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                        className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-primary-400 font-medium transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-primary-400 font-medium transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Clinical Profile / Bio</label>
                      <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        rows="3"
                        className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-primary-400 font-medium transition-all shadow-sm resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'webrtc' && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h3 className="text-xl font-bold text-slate-800">WebRTC DataChannel Settings</h3>
                    <Shield className="w-5 h-5 text-emerald-500" />
                  </div>

                  {/* WebRTC P2P Toggle Card */}
                  <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-50/50 border border-slate-100/50">
                    <div className="space-y-1 pr-6">
                      <h4 className="font-bold text-sm text-slate-800">Direct P2P Tunnelling (WhatsApp Mode)</h4>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed">Establish raw client-to-client WebRTC connections for direct sub-millisecond chat communications. Falls back to database indexing when peers are offline.</p>
                    </div>
                    <button
                      onClick={() => setP2pEnabled(!p2pEnabled)}
                      className={`w-14 h-8 rounded-full transition-all shrink-0 p-1 flex items-center shadow-inner ${
                        p2pEnabled ? 'bg-slate-900 justify-end' : 'bg-slate-200 justify-start'
                      }`}
                    >
                      <span className="w-6 h-6 bg-white rounded-full shadow-md"></span>
                    </button>
                  </div>

                  {/* Encryption config */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Signal Channel Encryption</label>
                    <select
                      value={encryptionLevel}
                      onChange={(e) => setEncryptionLevel(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-primary-400 font-bold transition-all shadow-sm text-slate-700"
                    >
                      <option value="AES-GCM-256">AES-GCM-256 (High Privacy Mode)</option>
                      <option value="ChaCha20-Poly1305">ChaCha20-Poly1305 (Ultra Speed Mode)</option>
                      <option value="Disabled">None (Standard Transport Layer Security)</option>
                    </select>
                  </div>

                  {/* STUN/TURN Configurations */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-1.5">
                        <Server className="w-3.5 h-3.5 text-slate-400" /> Primary ICE / STUN Servers
                      </label>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="stun:your-stun-gateway.com:19002"
                        value={newStun}
                        onChange={(e) => setNewStun(e.target.value)}
                        className="flex-1 bg-slate-50/50 border border-slate-100 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-primary-400 font-medium transition-all shadow-sm"
                      />
                      <button
                        onClick={handleAddStun}
                        className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs transition-all shadow-md shrink-0"
                      >
                        Add Gateway
                      </button>
                    </div>

                    <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 no-scrollbar">
                      {stunServers.map((stun, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-650 shadow-sm">
                          <span>{stun}</span>
                          <button
                            onClick={() => handleRemoveStun(stun)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'app' && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h3 className="text-xl font-bold text-slate-800">Visual Settings & Styles</h3>
                    <Sparkles className="w-5 h-5 text-primary-500" />
                  </div>

                  {/* Glassmorphic Toggling */}
                  <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-50/50 border border-slate-100/50">
                    <div className="space-y-1 pr-6">
                      <h4 className="font-bold text-sm text-slate-800">Premium Glassmorphism Sidebars</h4>
                      <p className="text-xs text-slate-400 font-medium">Configure deep backdrop blur opacity vectors for sidebar layouts to look spectacular in clinical demo showcases.</p>
                    </div>
                    <button
                      onClick={() => setSidebarGlass(!sidebarGlass)}
                      className={`w-14 h-8 rounded-full transition-all shrink-0 p-1 flex items-center shadow-inner ${
                        sidebarGlass ? 'bg-slate-900 justify-end' : 'bg-slate-200 justify-start'
                      }`}
                    >
                      <span className="w-6 h-6 bg-white rounded-full shadow-md"></span>
                    </button>
                  </div>

                  {/* Accent palette */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Interface Color Profile Accent</label>
                    <div className="grid grid-cols-4 gap-3">
                      {['indigo', 'emerald', 'sky', 'rose'].map((color) => (
                        <button
                          key={color}
                          onClick={() => {
                            setAccentColor(color);
                            toast.success(`Theme updated to clinical ${color} branding!`);
                          }}
                          className={`p-4 rounded-2xl text-xs font-bold border capitalize transition-all ${
                            accentColor === color 
                              ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-105' 
                              : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-700'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Volume slide */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-slate-455" /> Push Notification Ring Sound Volume
                      </label>
                      <span className="text-xs font-bold text-primary-600">{notificationsVolume}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={notificationsVolume}
                      onChange={(e) => setNotificationsVolume(e.target.value)}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons Row */}
            <div className="flex gap-4 border-t border-slate-100 pt-8 mt-10">
              <button
                disabled={saving}
                onClick={handleSaveSettings}
                className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-sm transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Saving configurations...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save Configuration Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
