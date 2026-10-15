import { useState } from 'react';
import { Save, MapPin, Phone, Building2 } from 'lucide-react';
import { DEMO_SITE_SETTINGS } from '../../data/demoData';
import { Input, Textarea } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import { isDemoMode } from '../../lib/firebase';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({ ...DEMO_SITE_SETTINGS });
  const [phonesText, setPhonesText] = useState(DEMO_SITE_SETTINGS.phones.join('\n'));
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: save to Firestore siteSettings/main
    await new Promise((r) => setTimeout(r, 800));
    setSaved(true);
    setLoading(false);
    setTimeout(() => setSaved(false), 3000);
    if (isDemoMode) alert('Demo mode: settings not persisted.');
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
        <p className="text-gray-500 text-sm">Configure society name, contact details, and map location.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Building2 className="w-4 h-4" /> Society Information
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Society Name"
              value={settings.societyName}
              onChange={(e) => setSettings({ ...settings, societyName: e.target.value })}
            />
            <Input
              label="Tagline"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
            />
            <Textarea
              label="Address"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              rows={3}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Phone className="w-4 h-4" /> Contact Details
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Numbers (one per line)
              </label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]"
                rows={4}
                value={phonesText}
                onChange={(e) => setPhonesText(e.target.value)}
                placeholder="+91 9810497750&#10;+91 9990158578"
              />
            </div>
            <Input
              label="Email Address"
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Map Location
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-sm text-gray-600">
              Set the society's fixed location on the map. This should be the actual address coordinates —
              not a device's live location.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Latitude"
                type="number"
                step="0.000001"
                value={settings.mapLatitude}
                onChange={(e) => setSettings({ ...settings, mapLatitude: parseFloat(e.target.value) })}
              />
              <Input
                label="Longitude"
                type="number"
                step="0.000001"
                value={settings.mapLongitude}
                onChange={(e) => setSettings({ ...settings, mapLongitude: parseFloat(e.target.value) })}
              />
            </div>
            <Input
              label="Zoom Level (1–20)"
              type="number"
              min={1}
              max={20}
              value={settings.mapZoom}
              onChange={(e) => setSettings({ ...settings, mapZoom: parseInt(e.target.value) })}
            />
            <Input
              label="Google Maps Link"
              type="url"
              value={settings.googleMapsLink}
              onChange={(e) => setSettings({ ...settings, googleMapsLink: e.target.value })}
              hint="Used for 'Get Directions' button"
            />
          </CardBody>
        </Card>

        <div className="flex items-center gap-4">
          <Button type="submit" loading={loading} leftIcon={<Save className="w-4 h-4" />} size="lg">
            Save Settings
          </Button>
          {saved && (
            <span className="text-green-700 text-sm font-medium">✓ Settings saved successfully</span>
          )}
        </div>
      </form>
    </div>
  );
}
