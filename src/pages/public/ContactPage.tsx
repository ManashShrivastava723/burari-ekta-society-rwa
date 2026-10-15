import { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import { DEMO_SITE_SETTINGS } from '../../data/demoData';
import { Input, Textarea } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { isValidEmail, isValidPhone } from '../../utils/helpers';
import { isDemoMode } from '../../lib/firebase';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const s = DEMO_SITE_SETTINGS;
  const [form, setForm]       = useState<FormData>({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors]   = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  function validate() {
    const e: Partial<FormData> = {};
    if (!form.name.trim())     e.name    = 'Name is required.';
    if (!form.email.trim())    e.email   = 'Email is required.';
    else if (!isValidEmail(form.email)) e.email = 'Enter a valid email address.';
    if (form.phone && !isValidPhone(form.phone)) e.phone = 'Enter a valid 10-digit mobile number.';
    if (!form.subject.trim())  e.subject = 'Subject is required.';
    if (!form.message.trim())  e.message = 'Message is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // TODO: save to Firestore contactMessages collection
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Message Sent</h1>
        <p className="text-gray-600 mb-6">
          Thank you for contacting us. The RWA committee will get back to you
          at <strong>{form.email}</strong> as soon as possible.
        </p>
        {isDemoMode && (
          <p className="text-amber-700 bg-amber-50 rounded-xl p-3 text-xs mb-4">
            Demo mode — this message was not actually sent.
          </p>
        )}
        <button
          onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
          className="px-4 py-2 text-sm font-medium text-white bg-[#1e3a8a] rounded-lg hover:bg-[#1e40af]"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 mb-4">
          <Mail className="w-7 h-7 text-[#1e3a8a]" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 font-heading mb-2">Contact Us</h1>
        <p className="text-gray-500">Reach out to the RWA committee for any queries or assistance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name *"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  error={errors.name}
                  placeholder="Full name"
                />
                <Input
                  label="Email Address *"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  error={errors.email}
                  placeholder="your@email.com"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone (optional)"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  error={errors.phone}
                  placeholder="Mobile number"
                />
                <Input
                  label="Subject *"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  error={errors.subject}
                  placeholder="What is this about?"
                />
              </div>
              <Textarea
                label="Message *"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                error={errors.message}
                rows={5}
                placeholder="Write your message here…"
              />
              <Button
                type="submit"
                loading={loading}
                leftIcon={<Send className="w-4 h-4" />}
                className="w-full"
                size="lg"
              >
                Send Message
              </Button>
            </form>
          </Card>
        </div>

        {/* Contact details */}
        <aside className="space-y-5">
          <Card className="p-5">
            <h2 className="font-bold text-gray-900 mb-4">Get in Touch</h2>
            <div className="space-y-4">
              {s.phones.map((phone, i) => (
                <a
                  key={i}
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#1e3a8a] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-[#1e3a8a]" />
                  </div>
                  {phone}
                </a>
              ))}
              <a
                href={`mailto:${s.email}`}
                className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#1e3a8a] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-[#1e3a8a]" />
                </div>
                {s.email}
              </a>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#1e3a8a]" />
              Office Address
            </h2>
            <address className="not-italic text-sm text-gray-700 leading-relaxed">
              {s.address}
            </address>
          </Card>

          <Card className="p-5 bg-blue-50">
            <p className="text-sm text-blue-800">
              <strong>Response Time:</strong> We aim to respond to all queries within 2 working days.
              For urgent matters, please call the numbers listed above.
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}
