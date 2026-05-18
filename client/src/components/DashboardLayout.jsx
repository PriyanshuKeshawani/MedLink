import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  ClipboardList, 
  MessageSquare, 
  User, 
  Settings, 
  LogOut,
  Bell
} from 'lucide-react';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import NotificationCenter from './NotificationCenter';

const DashboardLayout = ({ children, role = 'patient' }) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: role === 'doctor' ? '/dashboard/doctor' : '/dashboard' },
    { icon: User, label: 'Find Doctors', path: '/doctors', hidden: role === 'doctor' },
    { icon: Calendar, label: 'Appointments', path: '/appointments' },
    { icon: ClipboardList, label: 'Medical Records', path: '/records' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-slate-200 flex flex-col p-6 z-30 relative">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <LayoutDashboard className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-display font-bold">MedLink</span>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.filter(i => !i.hidden).map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path
                  ? 'bg-primary-50 text-primary-700 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-semibold">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-200 space-y-2">
          <Link 
            to="/settings"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              location.pathname === '/settings'
                ? 'bg-primary-50 text-primary-700 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-semibold">Settings</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 glass border-b border-slate-200 flex items-center justify-between px-10 shrink-0 z-20 relative">
          <div>
            <h2 className="text-xl font-bold">Good Morning, {user?.firstName || 'User'} 👋</h2>
            <p className="text-sm text-slate-500">Here's what's happening with your health today.</p>
          </div>
          <div className="flex items-center gap-6">
            <NotificationCenter />
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <div className="font-bold text-sm">{user?.firstName} {user?.lastName}</div>
                <div className="text-xs text-slate-400 capitalize">{user?.role} Account</div>
              </div>
              <img 
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.firstName}`} 
                alt="avatar" 
                className="w-10 h-10 rounded-full border-2 border-primary-100"
              />
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-10 bg-mesh">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
