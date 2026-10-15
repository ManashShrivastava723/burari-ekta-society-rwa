import { Link } from 'react-router-dom';
import {
  Bell, Calendar, FileText, Image, MessageSquare, Users,
  TrendingUp, Clock, AlertTriangle, Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DEMO_NOTICES, DEMO_EVENTS } from '../../data/demoData';
import { formatDate, formatDateTime } from '../../utils/helpers';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { isDemoMode } from '../../lib/firebase';

const stats = [
  { label: 'Published Notices',  value: 4,  icon: Bell,          color: 'text-blue-600 bg-blue-50',   path: '/admin/notices' },
  { label: 'Upcoming Events',    value: 2,  icon: Calendar,      color: 'text-green-600 bg-green-50', path: '/admin/events' },
  { label: 'Documents',          value: 3,  icon: FileText,      color: 'text-purple-600 bg-purple-50', path: '/admin/documents' },
  { label: 'Open Complaints',    value: 0,  icon: MessageSquare, color: 'text-orange-600 bg-orange-50', path: '/admin/complaints' },
];

const quickLinks = [
  { label: 'Add Notice',        path: '/admin/notices/new',    icon: Bell },
  { label: 'Add Event',         path: '/admin/events/new',     icon: Calendar },
  { label: 'Upload Document',   path: '/admin/documents/new',  icon: FileText },
  { label: 'Upload Photo',      path: '/admin/gallery/new',    icon: Image },
  { label: 'View Complaints',   path: '/admin/complaints',     icon: MessageSquare },
  { label: 'Edit Committee',    path: '/admin/committee',      icon: Users },
];

export default function AdminDashboard() {
  const { profile } = useAuth();

  const recentNotices = DEMO_NOTICES.filter((n) => n.status === 'published')
    .sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0))
    .slice(0, 4);

  const upcomingEvents = DEMO_EVENTS.filter((e) => e.status === 'upcoming').slice(0, 3);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Greeting */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {profile?.displayName ?? 'Admin'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1e3a8a]/10 rounded-lg">
          <Shield className="w-4 h-4 text-[#1e3a8a]" />
          <span className="text-sm font-medium text-[#1e3a8a] capitalize">{profile?.role ?? 'Admin'}</span>
        </div>
      </div>

      {isDemoMode && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <strong>Demo Mode Active.</strong> All data shown is sample data. Changes made here will not be stored.
            Configure Firebase credentials in <code className="bg-amber-100 rounded px-1">.env</code> to use live mode.
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.path} to={stat.path}>
            <Card hover className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <TrendingUp className="w-4 h-4 text-gray-300" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickLinks.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#1e3a8a]/30 hover:shadow-sm text-center text-sm text-gray-700 font-medium transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-[#1e3a8a]/10 flex items-center justify-center">
                <l.icon className="w-4 h-4 text-[#1e3a8a]" />
              </div>
              {l.label}
            </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent notices */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Recent Notices</h2>
            <Link to="/admin/notices" className="text-sm text-[#1e3a8a] hover:underline">View all</Link>
          </div>
          <Card>
            {recentNotices.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">No notices yet.</div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {recentNotices.map((n) => (
                  <li key={n.id} className="px-5 py-4 flex items-start gap-3">
                    <Bell className={`w-4 h-4 mt-0.5 flex-shrink-0 ${n.isUrgent ? 'text-red-500' : 'text-blue-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{n.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.publishedAt ? formatDate(n.publishedAt) : ''}</p>
                    </div>
                    <Badge variant={n.isUrgent ? 'red' : 'blue'}>{n.isUrgent ? 'Urgent' : n.category}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>

        {/* Upcoming events */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
            <Link to="/admin/events" className="text-sm text-[#1e3a8a] hover:underline">View all</Link>
          </div>
          <Card>
            {upcomingEvents.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">No upcoming events.</div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {upcomingEvents.map((ev) => (
                  <li key={ev.id} className="px-5 py-4 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-[#166534]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{ev.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDateTime(ev.startDate)}
                      </p>
                    </div>
                    <Badge variant="green">Upcoming</Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>
      </div>

      {/* Footer note */}
      <p className="text-xs text-gray-400 text-center pb-4">
        All changes made through this dashboard are reflected on the public website.
        Changes cannot be undone after confirmation.
      </p>
    </div>
  );
}
