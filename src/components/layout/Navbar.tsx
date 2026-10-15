import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Home, Info, Bell, Calendar, FileText, Users,
  MessageSquare, MapPin, Image, Menu, X, ChevronDown,
  Building2, Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isDemoMode } from '../../lib/firebase';

const navItems = [
  { label: 'Home',       path: '/',          icon: Home },
  { label: 'About',      path: '/about',      icon: Info },
  {
    label: 'Information', icon: ChevronDown,
    children: [
      { label: 'Notices',   path: '/notices',   icon: Bell },
      { label: 'Events',    path: '/events',    icon: Calendar },
      { label: 'Documents', path: '/documents', icon: FileText },
      { label: 'Gallery',   path: '/gallery',   icon: Image },
    ]
  },
  { label: 'Committee',  path: '/committee',  icon: Users },
  { label: 'Complaints', path: '/complaints', icon: MessageSquare },
  { label: 'Location',   path: '/location',   icon: MapPin },
  { label: 'Contact',    path: '/contact',    icon: Users },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { profile } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); setDropdownOpen(false); }, [location]);

  return (
    <header
      className={`fixed left-0 right-0 z-40 transition-shadow duration-200 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm shadow-sm'
      } ${isDemoMode ? 'top-10' : 'top-0'}`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0" aria-label="Burari Ekta Society Home">
            <div className="w-10 h-10 rounded-full bg-[#1e3a8a] flex items-center justify-center flex-shrink-0">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-[#1e3a8a] leading-tight text-sm">Burari Ekta Society</div>
              <div className="text-xs text-gray-500 leading-tight">Resident Welfare Association</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              if ('children' in item && item.children) {
                return (
                  <div key={item.label} className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-[#1e3a8a] hover:bg-blue-50 transition-colors"
                      aria-expanded={dropdownOpen}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {dropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                        {item.children.map((child) => (
                          <NavLink
                            key={child.path}
                            to={child.path}
                            className={({ isActive }) =>
                              `flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                                isActive
                                  ? 'text-[#1e3a8a] bg-blue-50 font-medium'
                                  : 'text-gray-700 hover:text-[#1e3a8a] hover:bg-blue-50'
                              }`
                            }
                          >
                            <child.icon className="w-4 h-4" />
                            {child.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <NavLink
                  key={item.path}
                  to={item.path!}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-[#1e3a8a] bg-blue-50'
                        : 'text-gray-700 hover:text-[#1e3a8a] hover:bg-blue-50'
                    }`
                  }
                  end={item.path === '/'}
                >
                  {item.label}
                </NavLink>
              );
            })}
          </div>

          {/* Right side: Admin link + mobile toggle */}
          <div className="flex items-center gap-2">
            {profile ? (
              <Link
                to="/admin"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1e3a8a] text-white hover:bg-[#1e40af] transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#1e3a8a] text-[#1e3a8a] hover:bg-blue-50 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg max-h-[85vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              if ('children' in item && item.children) {
                return (
                  <div key={item.label}>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {item.label}
                    </div>
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive
                              ? 'text-[#1e3a8a] bg-blue-50 font-medium'
                              : 'text-gray-700 hover:text-[#1e3a8a] hover:bg-blue-50'
                          }`
                        }
                      >
                        <child.icon className="w-4 h-4" />
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                );
              }
              return (
                <NavLink
                  key={item.path}
                  to={item.path!}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'text-[#1e3a8a] bg-blue-50 font-medium'
                        : 'text-gray-700 hover:text-[#1e3a8a] hover:bg-blue-50'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              );
            })}
            <div className="border-t border-gray-100 pt-2 mt-2">
              <Link
                to={profile ? '/admin' : '/admin/login'}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#1e3a8a] font-medium hover:bg-blue-50 transition-colors"
              >
                <Shield className="w-4 h-4" />
                Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
