import { AlertTriangle } from 'lucide-react';
import { isDemoMode } from '../../lib/firebase';

export default function DemoBanner() {
  if (!isDemoMode) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] bg-amber-400 text-amber-900 text-center px-4 py-2 text-sm font-medium flex items-center justify-center gap-2"
      role="alert"
    >
      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
      <span>
        <strong>DEMO MODE</strong> — No real Firebase is connected. All data is sample data only.
        Configure <code className="bg-amber-300 rounded px-1">.env</code> with your Firebase credentials to enable live mode.
      </span>
    </div>
  );
}
