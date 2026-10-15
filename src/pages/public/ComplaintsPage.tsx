import { useState } from 'react';
import {
  MessageSquare, CheckCircle, Search, AlertTriangle,
  MapPin, Loader2, Info
} from 'lucide-react';
import { Input, Textarea, Select } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { generateReferenceNumber, isValidEmail, isValidPhone, COMPLAINT_CATEGORY_LABELS, COMPLAINT_STATUS_LABELS } from '../../utils/helpers';
import { isDemoMode } from '../../lib/firebase';

interface FormData {
  submitterName: string;
  flatNumber: string;
  phone: string;
  email: string;
  category: string;
  subject: string;
  description: string;
  locationDescription: string;
  shareLocation: boolean;
}

const CATEGORY_OPTIONS = [
  { value: '', label: 'Select a category' },
  ...Object.entries(COMPLAINT_CATEGORY_LABELS).map(([v, l]) => ({ value: v, label: l })),
];

export default function ComplaintsPage() {
  const [tab, setTab]         = useState<'submit' | 'track'>('submit');
  const [form, setForm]       = useState<FormData>({
    submitterName: '', flatNumber: '', phone: '', email: '',
    category: '', subject: '', description: '', locationDescription: '',
    shareLocation: false,
  });
  const [errors, setErrors]   = useState<Partial<FormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState<{ refNo: string } | null>(null);

  // Track complaint
  const [trackRef, setTrackRef]         = useState('');
  const [trackResult, setTrackResult]   = useState<string | null>(null);
  const [trackError, setTrackError]     = useState('');

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationData, setLocationData]       = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError]     = useState('');

  function validate(): boolean {
    const e: Partial<FormData> = {};
    if (!form.submitterName.trim()) e.submitterName = 'Name is required.';
    if (!form.flatNumber.trim())    e.flatNumber    = 'Flat number is required.';
    if (!form.phone.trim())         e.phone         = 'Phone is required.';
    else if (!isValidPhone(form.phone)) e.phone     = 'Enter a valid 10-digit mobile number.';
    if (form.email && !isValidEmail(form.email)) e.email = 'Enter a valid email address.';
    if (!form.category)             e.category      = 'Please select a category.';
    if (!form.subject.trim())       e.subject       = 'Subject is required.';
    if (!form.description.trim())   e.description   = 'Description is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    if (isDemoMode) {
      await new Promise((r) => setTimeout(r, 1200));
      const refNo = generateReferenceNumber();
      setSubmitted({ refNo });
      setSubmitting(false);
      return;
    }

    // TODO: submit to Firestore
    await new Promise((r) => setTimeout(r, 1200));
    const refNo = generateReferenceNumber();
    setSubmitted({ refNo });
    setSubmitting(false);
  }

  function handleShareLocation() {
    if (!navigator.geolocation) {
      setLocationError('Your browser does not support location sharing.');
      return;
    }
    setLocationLoading(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationData({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationLoading(false);
      },
      (err) => {
        setLocationLoading(false);
        if (err.code === 1) setLocationError('Location permission denied. You can describe the location manually below.');
        else if (err.code === 2) setLocationError('Location unavailable. Please describe the location manually.');
        else setLocationError('Location could not be determined. Please describe the location manually.');
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }

  function handleTrack(ev: React.FormEvent) {
    ev.preventDefault();
    if (!trackRef.trim()) { setTrackError('Please enter a reference number.'); return; }
    // Demo: show generic status
    setTrackError('');
    setTrackResult(COMPLAINT_STATUS_LABELS['submitted'] ?? 'Status not available.');
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Complaint Submitted</h1>
        <p className="text-gray-600 mb-4">
          Your complaint has been received. Please note your reference number:
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 mb-6 inline-block">
          <p className="text-xs text-gray-500 mb-1">Reference Number</p>
          <p className="text-2xl font-bold text-[#1e3a8a] font-mono">{submitted.refNo}</p>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Save this reference number to track the status of your complaint.
          You will be contacted on the phone number provided.
        </p>
        {isDemoMode && (
          <p className="text-amber-700 bg-amber-50 rounded-xl p-3 text-xs mb-4">
            Demo mode — this complaint was not actually stored anywhere.
          </p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => { setSubmitted(null); setForm({ submitterName: '', flatNumber: '', phone: '', email: '', category: '', subject: '', description: '', locationDescription: '', shareLocation: false }); }}
            className="px-4 py-2 text-sm font-medium text-white bg-[#1e3a8a] rounded-lg hover:bg-[#1e40af]"
          >
            Submit Another
          </button>
          <button
            onClick={() => setTab('track')}
            className="px-4 py-2 text-sm font-medium text-[#1e3a8a] border border-[#1e3a8a] rounded-lg hover:bg-blue-50"
          >
            Track Status
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-50 mb-4">
          <MessageSquare className="w-7 h-7 text-orange-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 font-heading mb-2">Complaints & Suggestions</h1>
        <p className="text-gray-500">Submit a complaint or suggestion to the RWA committee.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('submit')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            tab === 'submit' ? 'bg-[#1e3a8a] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Submit Complaint
        </button>
        <button
          onClick={() => setTab('track')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            tab === 'track' ? 'bg-[#1e3a8a] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Track Complaint
        </button>
      </div>

      {tab === 'submit' && (
        <Card className="p-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-6 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              Your personal details are kept strictly confidential and are only accessible to authorized RWA staff.
              They will never be displayed publicly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                value={form.submitterName}
                onChange={(e) => setForm({ ...form, submitterName: e.target.value })}
                error={errors.submitterName}
                placeholder="Your name"
              />
              <Input
                label="Flat / Unit Number *"
                value={form.flatNumber}
                onChange={(e) => setForm({ ...form, flatNumber: e.target.value })}
                error={errors.flatNumber}
                placeholder="e.g. 201, Ground Floor"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Mobile Number *"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                error={errors.phone}
                placeholder="10-digit mobile number"
              />
              <Input
                label="Email (optional)"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                error={errors.email}
                placeholder="your@email.com"
              />
            </div>

            <Select
              label="Category *"
              options={CATEGORY_OPTIONS}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              error={errors.category}
            />

            <Input
              label="Subject *"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              error={errors.subject}
              placeholder="Brief subject of your complaint"
            />

            <Textarea
              label="Description *"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              error={errors.description}
              rows={5}
              placeholder="Describe the issue in detail…"
            />

            {/* Location sharing */}
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                Location (optional)
              </p>
              <p className="text-xs text-gray-500 mb-3">
                You may optionally share your current device location or describe the affected area.
                Location is only shared with RWA staff and only if you choose to.
              </p>
              <Textarea
                placeholder="Describe the location, e.g. Near the main gate, 2nd floor corridor…"
                value={form.locationDescription}
                onChange={(e) => setForm({ ...form, locationDescription: e.target.value })}
                rows={2}
              />
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleShareLocation}
                  disabled={locationLoading}
                  className="inline-flex items-center gap-2 text-xs font-medium text-[#1e3a8a] border border-[#1e3a8a] rounded-lg px-3 py-1.5 hover:bg-blue-50 disabled:opacity-50"
                >
                  {locationLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
                  Share My Current Location
                </button>
                {locationData && (
                  <span className="text-xs text-green-700 bg-green-50 rounded-lg px-2 py-1">
                    ✓ Location captured ({locationData.lat.toFixed(4)}, {locationData.lng.toFixed(4)})
                  </span>
                )}
              </div>
              {locationError && (
                <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {locationError}
                </p>
              )}
              {locationData && (
                <p className="text-xs text-gray-500 mt-2">
                  By submitting, you confirm that you consent to sharing this location with the RWA committee only.
                  You can remove it by clicking the button again.
                </p>
              )}
            </div>

            <Button type="submit" loading={submitting} className="w-full" size="lg">
              Submit Complaint
            </Button>
          </form>
        </Card>
      )}

      {tab === 'track' && (
        <Card className="p-6">
          <h2 className="font-bold text-gray-900 mb-4">Track Your Complaint</h2>
          <p className="text-sm text-gray-600 mb-6">
            Enter the reference number you received when you submitted your complaint.
          </p>
          <form onSubmit={handleTrack} className="space-y-4">
            <Input
              label="Reference Number"
              value={trackRef}
              onChange={(e) => setTrackRef(e.target.value.toUpperCase())}
              error={trackError}
              placeholder="e.g. BES20261234567"
              leftIcon={<Search className="w-4 h-4" />}
            />
            <Button type="submit" className="w-full">Check Status</Button>
          </form>

          {trackResult && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-blue-900 mb-1">Status Update</p>
              <p className="text-sm text-blue-800">{trackResult}</p>
              {isDemoMode && (
                <p className="text-xs text-amber-700 mt-2">Demo mode — this is a sample response.</p>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
