import { useState } from 'react';
import {
  MapPin, ExternalLink, Navigation, AlertTriangle, CheckCircle
} from 'lucide-react';
import { DEMO_SITE_SETTINGS } from '../../data/demoData';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function LocationPage() {
  const s = DEMO_SITE_SETTINGS;

  const [myLocation, setMyLocation]       = useState<{ lat: number; lng: number } | null>(null);
  const [locLoading, setLocLoading]       = useState(false);
  const [locError, setLocError]           = useState('');
  const [locationSharing, setLocationSharing] = useState(false);

  function handleShareLocation() {
    if (!navigator.geolocation) {
      setLocError('Your browser does not support geolocation.');
      return;
    }
    setLocLoading(true);
    setLocError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMyLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationSharing(true);
        setLocLoading(false);
      },
      (err) => {
        setLocLoading(false);
        if (err.code === 1) setLocError('Location permission was denied. Please enable it in your browser settings.');
        else if (err.code === 2) setLocError('Your current location is unavailable. Try again or use the manual address below.');
        else setLocError('Could not determine your location. Please try again.');
      },
      { timeout: 10000 }
    );
  }

  function handleStopSharing() {
    setMyLocation(null);
    setLocationSharing(false);
  }

  const societyMapsUrl = `https://www.google.com/maps?q=${s.mapLatitude},${s.mapLongitude}&z=${s.mapZoom}&t=m`;
  const directionsMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${s.mapLatitude},${s.mapLongitude}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 mb-4">
          <MapPin className="w-7 h-7 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 font-heading mb-2">Society Location</h1>
        <p className="text-gray-500">Find us and get directions to Burari Ekta Society.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Map */}
        <div className="lg:col-span-2">
          {/* Embedded Google Maps iframe */}
          <div className="rounded-xl overflow-hidden border border-gray-200 mb-4" style={{ height: '400px' }}>
            <iframe
              title="Burari Ekta Society Location"
              src={`https://maps.google.com/maps?q=${s.mapLatitude},${s.mapLongitude}&z=${s.mapZoom}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={societyMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e3a8a] text-white rounded-lg text-sm font-medium hover:bg-[#1e40af] transition-colors"
            >
              <MapPin className="w-4 h-4" />
              View on Google Maps
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href={directionsMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#1e3a8a] text-[#1e3a8a] rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              <Navigation className="w-4 h-4" />
              Get Directions
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">

          {/* Address */}
          <Card className="p-5">
            <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#1e3a8a]" />
              Address
            </h2>
            <address className="not-italic text-sm text-gray-700 leading-relaxed">
              Burari Ekta Society RWA<br />
              C-6, Plot No. 07<br />
              Kh. No. 723, 2nd Floor<br />
              Extended Lal Dora, Gali No. 02<br />
              Sant Nagar, Burari<br />
              Delhi – 110084
            </address>
          </Card>

          {/* Coordinates */}
          <Card className="p-5">
            <h2 className="font-bold text-gray-900 mb-3">Coordinates</h2>
            <div className="text-sm text-gray-700 font-mono">
              <div>Lat: {s.mapLatitude}</div>
              <div>Lng: {s.mapLongitude}</div>
            </div>
          </Card>

          {/* Share my location (optional feature) */}
          <Card className="p-5">
            <h2 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#1e3a8a]" />
              Share My Location
            </h2>
            <p className="text-xs text-gray-500 mb-3">
              Optionally share your current device location to help find you.
              This is only for your own reference — your location is not stored or shared with others.
            </p>

            {!locationSharing ? (
              <Button
                variant="outline"
                size="sm"
                loading={locLoading}
                leftIcon={<Navigation className="w-4 h-4" />}
                onClick={handleShareLocation}
                className="w-full"
              >
                Share My Current Location
              </Button>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-green-700 text-sm bg-green-50 rounded-lg px-3 py-2 mb-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  Location shared (this session only)
                </div>
                {myLocation && (
                  <p className="text-xs text-gray-500 mb-2 font-mono">
                    {myLocation.lat.toFixed(5)}, {myLocation.lng.toFixed(5)}
                  </p>
                )}
                <button
                  onClick={handleStopSharing}
                  className="text-xs text-red-600 hover:underline"
                >
                  Stop sharing
                </button>
              </div>
            )}

            {locError && (
              <p className="text-xs text-red-600 mt-2 flex items-start gap-1">
                <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                {locError}
              </p>
            )}

            <p className="text-xs text-gray-400 mt-3">
              Your location is only used locally in this session. It is never tracked, stored, or shared automatically.
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}
