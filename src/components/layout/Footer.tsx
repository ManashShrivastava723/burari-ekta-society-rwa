import { Link } from 'react-router-dom';
import {
  Phone, Mail, MapPin, Building2, ExternalLink
} from 'lucide-react';
import { DEMO_SITE_SETTINGS } from '../../data/demoData';

export default function Footer() {
  const s = DEMO_SITE_SETTINGS;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0f2d62] text-gray-300 mt-16" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Society info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-white">{s.societyName}</div>
                <div className="text-sm text-gray-400">{s.tagline}</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 mb-4">
              Dedicated to creating a safe, clean, well-maintained, and harmonious community
              for all residents of {s.societyName}.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400" />
                <span>{s.address}</span>
              </div>
              {s.phones.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0 text-gray-400" />
                  <a href={`tel:${p.replace(/\s/g, '')}`} className="hover:text-white transition-colors">
                    {p}
                  </a>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-gray-400" />
                <a href={`mailto:${s.email}`} className="hover:text-white transition-colors">{s.email}</a>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Home',          path: '/' },
                { label: 'About Us',      path: '/about' },
                { label: 'Notices',       path: '/notices' },
                { label: 'Events',        path: '/events' },
                { label: 'Documents',     path: '/documents' },
                { label: 'Committee',     path: '/committee' },
                { label: 'Gallery',       path: '/gallery' },
                { label: 'Location',      path: '/location' },
              ].map((l) => (
                <li key={l.path}>
                  <Link to={l.path} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Residents */}
          <div>
            <h3 className="font-semibold text-white mb-4">Residents</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Submit Complaint',     path: '/complaints' },
                { label: 'Track Complaint',      path: '/complaints/track' },
                { label: 'Contact RWA',          path: '/contact' },
                { label: 'Find Us',              path: '/location' },
              ].map((l) => (
                <li key={l.path}>
                  <Link to={l.path} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={s.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  Get Directions <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>

            <h3 className="font-semibold text-white mb-2 mt-6">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/admin/login" className="hover:text-white transition-colors">Admin Login</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {year} {s.societyName} — {s.tagline}. All rights reserved.</p>
          <p>
            Official website:{' '}
            <a
              href="https://sites.google.com/view/burariektasocietyrwa"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors"
            >
              sites.google.com/view/burariektasocietyrwa
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
