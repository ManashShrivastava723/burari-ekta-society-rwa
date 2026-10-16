import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout  from './components/layout/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Public pages
import HomePage         from './pages/public/HomePage';
import AboutPage        from './pages/public/AboutPage';
import NoticesPage      from './pages/public/NoticesPage';
import EventsPage       from './pages/public/EventsPage';
import DocumentsPage    from './pages/public/DocumentsPage';
import GalleryPage      from './pages/public/GalleryPage';
import CommitteePage    from './pages/public/CommitteePage';
import ComplaintsPage   from './pages/public/ComplaintsPage';
import LocationPage     from './pages/public/LocationPage';
import ContactPage      from './pages/public/ContactPage';
import PrivacyPolicyPage from './pages/public/PrivacyPolicyPage';

// Admin pages
import AdminLoginPage    from './pages/admin/AdminLoginPage';
import AdminDashboard    from './pages/admin/AdminDashboard';
import AdminNoticesPage  from './pages/admin/AdminNoticesPage';
import AdminComplaintsPage from './pages/admin/AdminComplaintsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminPlaceholderPage from './pages/admin/AdminPlaceholderPage';
import AdminGalleryPage from './pages/admin/AdminGalleryPage';
import AdminCommitteePage from './pages/admin/AdminCommitteePage';

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#1e3a8a]" />
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-center p-8">
      <div>
        <div className="text-6xl font-bold text-gray-200 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-6">The page you are looking for does not exist.</p>
        <a href="/" className="px-4 py-2 bg-[#1e3a8a] text-white rounded-lg text-sm font-medium hover:bg-[#1e40af] transition-colors">
          Go to Home
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/"          element={<HomePage />} />
          <Route path="/about"     element={<AboutPage />} />
          <Route path="/notices"   element={<NoticesPage />} />
          <Route path="/events"    element={<EventsPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/gallery"   element={<GalleryPage />} />
          <Route path="/committee" element={<CommitteePage />} />
          <Route path="/complaints" element={<ComplaintsPage />} />
          <Route path="/complaints/track" element={<ComplaintsPage />} />
          <Route path="/location"  element={<LocationPage />} />
          <Route path="/contact"   element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin login — not inside AdminLayout */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="staff">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="notices"   element={<AdminNoticesPage />} />
          <Route path="notices/new" element={<AdminNoticesPage />} />

          <Route path="events"    element={<AdminPlaceholderPage title="Events Management" />} />
          <Route path="events/new" element={<AdminPlaceholderPage title="New Event" />} />

          <Route path="documents" element={<AdminPlaceholderPage title="Documents Management" />} />
          <Route path="documents/new" element={<AdminPlaceholderPage title="Upload Document" />} />

          <Route path="gallery"   element={<AdminGalleryPage />} />
          <Route path="gallery/new" element={<AdminGalleryPage />} />

          <Route path="complaints" element={<AdminComplaintsPage />} />
          <Route path="committee" element={<AdminCommitteePage />} />
          <Route path="pages"     element={<AdminPlaceholderPage title="Page Content Management" />} />
          <Route path="messages"  element={<AdminPlaceholderPage title="Contact Messages" />} />
          <Route path="map"       element={<AdminPlaceholderPage title="Map Location Settings" />} />
          <Route path="users"     element={
            <ProtectedRoute requiredRole="superAdmin">
              <AdminPlaceholderPage title="User & Role Management" />
            </ProtectedRoute>
          } />
          <Route path="audit"     element={<AdminPlaceholderPage title="Audit Logs" />} />
          <Route path="settings"  element={<AdminSettingsPage />} />

          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
