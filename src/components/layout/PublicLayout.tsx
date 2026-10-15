import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import DemoBanner from '../ui/DemoBanner';
import { isDemoMode } from '../../lib/firebase';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to main content for keyboard/screen-reader users */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <DemoBanner />
      {/* Add top padding when demo banner is shown (banner height ≈ 40px) */}
      <div className={isDemoMode ? 'pt-10' : ''}>
        <Navbar />
        <main className="flex-1 pt-16" id="main-content" tabIndex={-1}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
