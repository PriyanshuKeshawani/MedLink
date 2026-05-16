import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Calendar, CheckCircle2, Info } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case 'appointment_booked': return <Calendar className="w-5 h-5 text-primary-600" />;
      case 'appointment_confirmed': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      default: return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-2xl bg-white border border-slate-100 hover:border-primary-300 transition-all shadow-sm"
      >
        <Bell className="w-6 h-6 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white ring-2 ring-red-500/20">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-96 bg-white rounded-[2rem] shadow-2xl border border-slate-100 z-50 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-display font-bold text-lg">Notifications</h3>
                <span className="text-xs font-bold px-2 py-1 bg-primary-100 text-primary-600 rounded-lg">{unreadCount} New</span>
              </div>

              <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div 
                      key={n._id}
                      onClick={() => markAsRead(n._id)}
                      className={`p-6 border-b border-slate-50 flex gap-4 hover:bg-slate-50 transition-all cursor-pointer relative ${!n.isRead ? 'bg-primary-50/30' : ''}`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${!n.isRead ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
                        {getIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-sm text-slate-800 truncate">{n.title}</h4>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{n.message}</p>
                      </div>
                      {!n.isRead && (
                        <div className="w-2 h-2 bg-primary-600 rounded-full absolute right-4 top-1/2 -translate-y-1/2" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bell className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-slate-400 font-bold">All caught up!</p>
                    <p className="text-xs text-slate-400 mt-1">No new notifications.</p>
                  </div>
                )}
              </div>

              <button className="w-full p-4 text-center text-xs font-bold text-primary-600 hover:bg-primary-50 transition-all border-t border-slate-50">
                View All Notifications
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
