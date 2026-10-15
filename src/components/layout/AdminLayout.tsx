import { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Bell, Calendar, FileText, Image,
  MessageSquare, Users, Settings, LogOut, Menu,
  Building2, Shield, MapPin, FileEdit, ClipboardList,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DemoBanner from '../ui/DemoBanner';
import { isDemoMode } from '../../lib/firebase';

const sidebarItems = [
  { label: 'Dashboard',    path: '/admin',              icon: LayoutDashboard, exact: true },
  { label: 'Notices',      path: '/admin/notices',      icon: Bell },
  { label: 'Events',       path: '/admin/events',       icon: Calendar },
  { label: 'Documents',    path: '/admin/documents',    icon: FileText },
  { label: 'Gallery',      path: '/admin/gallery',      icon: Image },
  { label: 'Complaints',   path: '/admin/complaints',   icon: MessageSquare },
  { label: 'Committee',    path: '/admin/committee',    icon: Users },
  { label: 'Pages',        path: '/admin/pages',        icon: FileEdit },
  { label: 'Messages',     path: '/admin/messages',     icon: ClipboardList },
  { label: 'Map Settings', path: '/admin/map',          icon: MapPin },
  { label: 'Users',        path: '/admin/users',        icon: Users, role: 'superAdmin' },
  { label: 'Audit Logs',   path: '/admin/audit',        icon: ClipboardList },
  { label: 'Settings',     path: '/admin/settings',     icon: Settings },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile, signOut, isAuthorized } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const visibleItems = sidebarItems.filter((item) => {
    if (!item.role) return true;
    return isAuthorized(item.role as 'superAdmin' | 'rwaAdmin' | 'staff' | 'resident');
  });

  const Sidebar = (
    <aside className="w-64 bg-[#0f2d62] min-h-screen flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/10">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-semibold text-sm leading-tight">BES RWA</div>
            <div className="text-blue-300 text-xs">Admin Panel</div>
          </div>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Admin navigation">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-white/20 text-white font-medium'
                  : 'text-blue-200 hover:bg-white/10 hover:text-white'
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3 px-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-medium truncate">{profile?.displayName ?? 'Admin'}</div>
            <div className="text-blue-300 text-xs capitalize">{profile?.role ?? 'Unknown'}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-blue-200 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-blue-300 hover:text-white transition-colors mt-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Website
        </Link>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DemoBanner />
      <div
        className="flex flex-1"
        style={{ marginTop: isDemoMode ? '40px' : '0px' }}
      >
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          {Sidebar}
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute left-0 top-0 bottom-0 w-64 z-40" onClick={(e) => e.stopPropagation()}>
              {Sidebar}
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar (mobile) */}
          <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-semibold text-gray-900 text-sm">Admin Dashboard</span>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
