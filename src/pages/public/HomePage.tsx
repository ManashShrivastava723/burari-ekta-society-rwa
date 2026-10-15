import { Link } from 'react-router-dom';
import {
  Bell, Calendar, FileText, MessageSquare, MapPin, Phone,
  Mail, ChevronRight, AlertTriangle, Shield, Users, Building2,
  Image, ExternalLink
} from 'lucide-react';
import { DEMO_NOTICES, DEMO_EVENTS, DEMO_COMMITTEE, DEMO_SITE_SETTINGS } from '../../data/demoData';
import { formatDate, formatDateTime } from '../../utils/helpers';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';

export default function HomePage() {
  const s = DEMO_SITE_SETTINGS;
  const urgentNotices = DEMO_NOTICES.filter((n) => n.status === 'published' && n.isUrgent);
  const recentNotices = DEMO_NOTICES.filter((n) => n.status === 'published' && !n.isUrgent).slice(0, 3);
  const upcomingEvents = DEMO_EVENTS.filter((e) => e.status === 'upcoming').slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section
        className="relative bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#1d4ed8] text-white"
        aria-labelledby="hero-heading"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.4%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center">
              <Building2 className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 id="hero-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 font-heading">
            {s.societyName}
          </h1>
          <p className="text-xl sm:text-2xl font-light text-blue-200 mb-2">{s.tagline}</p>
          <p className="text-blue-200 text-sm mb-8 flex items-center justify-center gap-1">
            <MapPin className="w-4 h-4" />
            Sant Nagar, Burari, Delhi-110084
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/notices"
              className="bg-white text-[#1e3a8a] px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <Bell className="w-4 h-4" /> View Notices
            </Link>
            <Link
              to="/complaints"
              className="bg-white/10 border border-white/30 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" /> Submit Complaint
            </Link>
            <a
              href={s.googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 border border-white/30 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" /> Get Directions
            </a>
          </div>
        </div>
      </section>

      {/* Urgent notices */}
      {urgentNotices.length > 0 && (
        <div className="bg-red-50 border-b border-red-200" role="alert" aria-live="polite">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-red-800 mb-1">Urgent Notices</p>
                {urgentNotices.map((n) => (
                  <div key={n.id} className="text-sm text-red-700">
                    <strong>{n.title}</strong>
                    {n.publishedAt && <span className="text-red-500 ml-2 text-xs">{formatDate(n.publishedAt)}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Quick actions */}
        <section className="mb-12" aria-labelledby="quick-actions-heading">
          <h2 id="quick-actions-heading" className="sr-only">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Notices',    path: '/notices',   icon: Bell,          color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
              { label: 'Events',     path: '/events',    icon: Calendar,      color: 'bg-green-50 text-green-700 hover:bg-green-100' },
              { label: 'Documents',  path: '/documents', icon: FileText,      color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
              { label: 'Gallery',    path: '/gallery',   icon: Image,         color: 'bg-pink-50 text-pink-700 hover:bg-pink-100' },
              { label: 'Complaints', path: '/complaints',icon: MessageSquare, color: 'bg-orange-50 text-orange-700 hover:bg-orange-100' },
              { label: 'Location',   path: '/location',  icon: MapPin,        color: 'bg-red-50 text-red-700 hover:bg-red-100' },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${item.color} rounded-xl p-4 flex flex-col items-center gap-2 text-center transition-colors`}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Notices column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Recent notices */}
            <section aria-labelledby="notices-heading">
              <div className="flex items-center justify-between mb-4">
                <h2 id="notices-heading" className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#1e3a8a]" />
                  Recent Notices
                </h2>
                <Link to="/notices" className="text-sm text-[#1e3a8a] hover:underline flex items-center gap-1">
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {recentNotices.length === 0 ? (
                  <div className="text-gray-500 text-sm py-8 text-center bg-gray-50 rounded-xl">No notices published yet.</div>
                ) : recentNotices.map((notice) => (
                  <Card key={notice.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge variant={notice.isUrgent ? 'red' : 'blue'}>
                            {notice.category.charAt(0).toUpperCase() + notice.category.slice(1)}
                          </Badge>
                          {notice.isUrgent && <Badge variant="red">Urgent</Badge>}
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">{notice.title}</h3>
                        <p className="text-gray-500 text-xs line-clamp-2">{notice.content}</p>
                      </div>
                      <div className="text-xs text-gray-400 text-right flex-shrink-0 mt-1">
                        {notice.publishedAt ? formatDate(notice.publishedAt) : ''}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Upcoming events */}
            <section aria-labelledby="events-heading">
              <div className="flex items-center justify-between mb-4">
                <h2 id="events-heading" className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#166534]" />
                  Upcoming Events
                </h2>
                <Link to="/events" className="text-sm text-[#1e3a8a] hover:underline flex items-center gap-1">
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {upcomingEvents.length === 0 ? (
                  <div className="text-gray-500 text-sm py-8 text-center bg-gray-50 rounded-xl">No upcoming events.</div>
                ) : upcomingEvents.map((event) => (
                  <Card key={event.id} className="p-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[#166534] text-white flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium leading-none">
                          {event.startDate.toLocaleString('en-IN', { month: 'short' })}
                        </span>
                        <span className="text-lg font-bold leading-none">{event.startDate.getDate()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm mb-0.5">{event.title}</h3>
                        <p className="text-gray-500 text-xs mb-1">
                          {formatDateTime(event.startDate)}
                        </p>
                        <p className="text-gray-500 text-xs flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {event.location}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Right column */}
          <aside className="space-y-6">

            {/* Welcome */}
            <Card className="p-5 bg-gradient-to-br from-blue-50 to-white">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-[#1e3a8a]" />
                <h3 className="font-bold text-gray-900">About Our RWA</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Burari Ekta Society RWA is dedicated to creating a safe, clean, well-maintained,
                and harmonious community for all residents. We work on cooperation, transparency,
                mutual respect, and active participation.
              </p>
              <Link
                to="/about"
                className="text-sm text-[#1e3a8a] font-medium hover:underline flex items-center gap-1"
              >
                Read more <ChevronRight className="w-4 h-4" />
              </Link>
            </Card>

            {/* Committee */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-[#1e3a8a]" />
                <h3 className="font-bold text-gray-900">Committee</h3>
              </div>
              <div className="space-y-3">
                {DEMO_COMMITTEE.map((m) => (
                  <div key={m.id} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#1e3a8a] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                      {m.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{m.name}</div>
                      <div className="text-xs text-gray-500">{m.designation}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/committee" className="mt-4 text-sm text-[#1e3a8a] font-medium hover:underline flex items-center gap-1">
                Full committee <ChevronRight className="w-4 h-4" />
              </Link>
            </Card>

            {/* Contact */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Phone className="w-5 h-5 text-[#1e3a8a]" />
                <h3 className="font-bold text-gray-900">Contact Us</h3>
              </div>
              <div className="space-y-2 text-sm">
                {s.phones.slice(0, 2).map((phone, i) => (
                  <a
                    key={i}
                    href={`tel:${phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-2 text-gray-700 hover:text-[#1e3a8a] transition-colors"
                  >
                    <Phone className="w-4 h-4 text-gray-400" /> {phone}
                  </a>
                ))}
                <a
                  href={`mailto:${s.email}`}
                  className="flex items-center gap-2 text-gray-700 hover:text-[#1e3a8a] transition-colors"
                >
                  <Mail className="w-4 h-4 text-gray-400" /> {s.email}
                </a>
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-xs">{s.address}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Link
                  to="/contact"
                  className="flex-1 text-center text-xs font-medium text-white bg-[#1e3a8a] rounded-lg px-3 py-2 hover:bg-[#1e40af] transition-colors"
                >
                  Contact Form
                </Link>
                <a
                  href={s.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center text-xs font-medium text-[#1e3a8a] border border-[#1e3a8a] rounded-lg px-3 py-2 hover:bg-blue-50 transition-colors flex items-center justify-center gap-1"
                >
                  Directions <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
