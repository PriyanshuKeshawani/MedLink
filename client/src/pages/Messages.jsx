import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  Smile, 
  Paperclip,
  Check,
  CheckCheck,
  MessageCircle,
  ShieldCheck,
  AlertCircle,
  Radio
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import useAuthStore from '../store/authStore';
import { useP2PChat } from '../hooks/useP2PChat';
import toast from 'react-hot-toast';

const mockContacts = {
  patient: [
    { id: 'doc1', name: 'Dr. Sarah Jenkins', specialty: 'Cardiologist', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', online: true, unread: 2, lastMsg: 'Please make sure to monitor your blood pressure twice daily.', time: '10:42 AM' },
    { id: 'doc2', name: 'Dr. Marcus Vance', specialty: 'Neurologist', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus', online: false, unread: 0, lastMsg: 'The lab reports look normal. No need to worry.', time: 'Yesterday' },
    { id: 'doc3', name: 'Dr. Evelyn Martinez', specialty: 'General Practitioner', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Evelyn', online: true, unread: 0, lastMsg: 'I have successfully updated your active prescription.', time: '3 days ago' },
  ],
  doctor: [
    { id: 'pat1', name: 'John Doe', specialty: 'Hypertension Patient', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', online: true, unread: 1, lastMsg: 'I took the prescribed medicine, but my heart rate is still 85 bpm.', time: '11:15 AM' },
    { id: 'pat2', name: 'Alice Smith', specialty: 'Migraine Follow-up', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice', online: true, unread: 0, lastMsg: 'Thank you doctor, the therapy sessions are helping a lot.', time: 'Yesterday' },
    { id: 'pat3', name: 'Robert Johnson', specialty: 'Routine Checkup', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert', online: false, unread: 0, lastMsg: 'Can you please review my recent blood sugar logs?', time: '4 days ago' }
  ]
};

const smartPresets = {
  patient: [
    "Hello Doctor, I took my dose but feel slightly dizzy.",
    "Could you please review my recent prescription updates?",
    "Thank you for the guidance, I will keep monitoring my stats.",
    "When should I schedule our next telehealth review?"
  ],
  doctor: [
    "Please take your prescribed dosage twice daily before meals.",
    "Monitor your vitals and let me know if they change dramatically.",
    "I have reviewed your medical logs and they look stellar.",
    "Let's schedule a virtual session to examine this details."
  ]
};

const Messages = () => {
  const user = useAuthStore(state => state.user);
  const token = useAuthStore(state => state.token);
  const userRole = user?.role === 'doctor' ? 'doctor' : 'patient';
  
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const chatEndRef = useRef(null);

  // Initialize WebRTC P2P direct connection hook + DB backup messaging!
  const {
    messages: p2pMessages,
    loading: chatLoading,
    peerOnline,
    p2pConnected,
    typing: remotePeerTyping,
    sendP2PMessage,
    sendTypingStatus
  } = useP2PChat(selectedContact?.id);

  // Fetch unique contacts from active appointments to match actual DB values
  useEffect(() => {
    const fetchInboxContacts = async () => {
      try {
        if (!user || !token) return;
        const endpoint = user.role === 'doctor' 
          ? '/api/appointments/doctor-appointments' 
          : '/api/appointments/my-appointments';
        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const uniqueContactsMap = new Map();
        res.data.forEach(appt => {
          const counterpart = user.role === 'doctor' ? appt.patient : appt.doctor;
          if (!counterpart) return;
          
          const specialty = user.role === 'doctor' 
            ? 'Patient Account' 
            : (appt.doctor?.profile?.specialization || appt.doctor?.specialization || 'Clinical Specialist');
          
          uniqueContactsMap.set(counterpart._id, {
            id: counterpart._id,
            name: `${counterpart.firstName} ${counterpart.lastName}`,
            specialty,
            avatar: counterpart.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${counterpart.firstName}`,
            online: false,
            unread: 0,
            lastMsg: appt.reason || 'Click to initiate secure chat',
            time: new Date(appt.date).toLocaleDateString([], { month: 'short', day: 'numeric' })
          });
        });

        const list = Array.from(uniqueContactsMap.values());
        if (list.length === 0) {
          setContacts(mockContacts[userRole]);
        } else {
          setContacts(list);
        }
      } catch (err) {
        console.error('Error fetching inbox contacts:', err);
        setContacts(mockContacts[userRole]);
      }
    };

    fetchInboxContacts();
  }, [user, token]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [p2pMessages, selectedContact, remotePeerTyping]);

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
  };

  const handleSendMessage = async (textToSend = messageText) => {
    if (!textToSend.trim() || !selectedContact) return;

    // Call hybrid WebRTC / DB send function
    await sendP2PMessage(textToSend);
    setMessageText('');
  };

  const handleInputChange = (e) => {
    setMessageText(e.target.value);
    // Send typing notification directly over P2P DataChannel!
    if (e.target.value.length > 0) {
      sendTypingStatus(true);
    } else {
      sendTypingStatus(false);
    }
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout role={user?.role}>
      <div className="max-w-6xl mx-auto h-[78vh] flex glass rounded-[2.5rem] overflow-hidden border border-white/20 shadow-xl">
        
        {/* Left Panel: Contacts List */}
        <div className="w-80 md:w-96 border-r border-slate-200/60 bg-white/40 flex flex-col h-full">
          {/* Search Header */}
          <div className="p-6 border-b border-slate-200/60 space-y-4 shrink-0">
            <h1 className="text-2xl font-display font-bold">Secure <span className="text-primary-600">Inbox.</span></h1>
            <div className="relative">
              <Search className="absolute left-4 top-3 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search direct contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary-400 font-medium transition-all"
              />
            </div>
          </div>

          {/* Contact Cards Scroll */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
            {filteredContacts.map(contact => {
              const active = selectedContact?.id === contact.id;
              const isContactOnline = active ? peerOnline : contact.online;
              return (
                <button
                  key={contact.id}
                  onClick={() => handleSelectContact(contact)}
                  className={`w-full flex items-start gap-4 p-4 rounded-2xl text-left transition-all ${
                    active 
                      ? 'bg-slate-900 text-white shadow-lg' 
                      : 'hover:bg-slate-50/80 text-slate-700'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/50"
                    />
                    {isContactOnline && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline gap-2">
                      <h3 className={`font-bold text-sm truncate ${active ? 'text-white' : 'text-slate-800'}`}>
                        {contact.name}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-bold shrink-0">{contact.time}</span>
                    </div>
                    <p className={`text-[10px] font-bold ${active ? 'text-primary-300' : 'text-primary-600'} mb-1`}>
                      {contact.specialty}
                    </p>
                    <p className={`text-xs truncate font-medium ${active ? 'text-slate-300' : 'text-slate-500'}`}>
                      {contact.lastMsg}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Active Chat Space */}
        <div className="flex-1 flex flex-col h-full bg-slate-50/50">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="h-20 bg-white/70 border-b border-slate-200/60 flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={selectedContact.avatar}
                      alt={selectedContact.name}
                      className="w-10 h-10 rounded-xl bg-slate-50 border"
                    />
                    {peerOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-850 text-sm leading-tight">{selectedContact.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${peerOnline ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${peerOnline ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {peerOnline ? 'Online' : 'Offline'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">|</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{selectedContact.specialty}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {p2pConnected ? (
                    <span className="hidden md:flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-2.5 py-1 rounded-lg mr-2 animate-pulse">
                      <ShieldCheck className="w-3.5 h-3.5" /> P2P Direct Tunnel Active
                    </span>
                  ) : (
                    <span className="hidden md:flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100/50 px-2.5 py-1 rounded-lg mr-2">
                      <Radio className="w-3.5 h-3.5 animate-spin" /> DB Delayed Queue Backup
                    </span>
                  )}
                  <button className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 transition-all">
                    <Phone className="w-4.5 h-4.5" />
                  </button>
                  <button className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 transition-all">
                    <Video className="w-4.5 h-4.5" />
                  </button>
                  <button className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 transition-all">
                    <MoreVertical className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

              {/* Message Bubble timeline */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {chatLoading ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-10 bg-slate-200 rounded-xl w-1/3"></div>
                    <div className="h-10 bg-slate-200 rounded-xl w-1/2 ml-auto"></div>
                  </div>
                ) : (
                  p2pMessages.map((msg, index) => {
                    const isYou = msg.sender === user.id || msg.sender?._id === user.id || msg.sender === 'you';
                    const timeString = new Date(msg.createdAt || msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    return (
                      <div
                        key={index}
                        className={`flex ${isYou ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] flex flex-col ${isYou ? 'items-end' : 'items-start'}`}>
                          <div
                            className={`p-4 rounded-[1.5rem] shadow-sm text-sm font-medium ${
                              isYou 
                                ? 'bg-slate-900 text-white rounded-tr-none' 
                                : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                            }`}
                          >
                            {msg.text}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1.5 px-1">
                            <span className="text-[10px] text-slate-400 font-semibold">{timeString}</span>
                            {isYou && (
                              <CheckCheck className={`w-3.5 h-3.5 ${msg.status === 'read' ? 'text-primary-500' : 'text-slate-400'}`} />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {remotePeerTyping && (
                  <div className="flex justify-start">
                    <div className="flex flex-col items-start">
                      <div className="bg-white border border-slate-100 p-4 rounded-[1.5rem] rounded-tl-none shadow-sm flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-slate-300 rounded-full animate-bounce"></span>
                        <span className="w-2.5 h-2.5 bg-slate-300 rounded-full animate-bounce delay-100"></span>
                        <span className="w-2.5 h-2.5 bg-slate-300 rounded-full animate-bounce delay-200"></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Presets Panel */}
              <div className="px-8 pb-3 shrink-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">Quick Presets</span>
                <div className="flex flex-wrap gap-2">
                  {smartPresets[userRole].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(preset)}
                      className="text-xs font-bold bg-white hover:bg-primary-50 border border-slate-100 text-slate-600 hover:text-primary-750 py-1.5 px-3 rounded-xl transition-all shadow-sm"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input Field */}
              <div className="p-6 bg-white/50 border-t border-slate-200/60 flex items-center gap-4 shrink-0">
                <button className="p-3 bg-white text-slate-400 border border-slate-100 rounded-2xl hover:text-slate-600 transition-all shadow-sm">
                  <Paperclip className="w-5 h-5" />
                </button>
                <div className="flex-1 relative flex items-center">
                  <input
                    type="text"
                    value={messageText}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendMessage();
                    }}
                    placeholder="Type your secure message here..."
                    className="w-full bg-white border border-slate-100 rounded-2xl px-5 pr-12 py-3 text-sm focus:outline-none focus:border-primary-400 font-medium transition-all shadow-sm"
                  />
                  <button className="absolute right-4 text-slate-400 hover:text-slate-600 transition-all">
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={() => handleSendMessage()}
                  className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 bg-slate-100 border border-slate-200/50 rounded-[1.75rem] flex items-center justify-center mb-6 shadow-sm">
                <MessageCircle className="w-10 h-10 text-slate-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Your Secure Messenger</h2>
              <p className="text-sm text-slate-500 mt-2 max-w-sm">
                Select a certified health specialist or a patient from the list on the left to review history logs and initiate a secure chat.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Messages;
