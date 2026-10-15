import { Shield } from 'lucide-react';
import Card from '../../components/ui/Card';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-50 mb-4">
          <Shield className="w-7 h-7 text-[#166534]" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 font-heading mb-2">Privacy Policy</h1>
        <p className="text-gray-500">Last updated: 14 October 2026</p>
      </div>

      <Card className="p-6 md:p-8 space-y-6 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">1. Introduction</h2>
          <p>
            Burari Ekta Society Resident Welfare Association ("the RWA", "we", "us") operates this website for
            the benefit of society residents and the general public. This Privacy Policy explains how we collect,
            use, protect, and handle information provided through this website.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">2. Information We Collect</h2>
          <ul className="list-disc ml-5 space-y-1">
            <li><strong>Contact messages:</strong> Name, email address, phone number (optional), subject, and message when you use the contact form.</li>
            <li><strong>Complaints and suggestions:</strong> Name, flat number, mobile number, email (optional), complaint description, and location (only with explicit consent).</li>
            <li><strong>Location data:</strong> Only when you explicitly click "Share My Current Location" and grant browser permission. This is used solely for the complaint or session in which you share it.</li>
            <li><strong>Admin users:</strong> Email address and authentication credentials managed through Firebase Authentication.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">3. How We Use Your Information</h2>
          <ul className="list-disc ml-5 space-y-1">
            <li>To respond to contact messages and queries.</li>
            <li>To process and follow up on complaints and suggestions.</li>
            <li>To contact you about your complaint status.</li>
            <li>To maintain administrative records as required.</li>
          </ul>
          <p className="mt-2">We do not use your information for marketing, third-party sharing, or automated profiling.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">4. Location Data</h2>
          <ul className="list-disc ml-5 space-y-1">
            <li>Location sharing is always optional and requires your explicit action and browser permission.</li>
            <li>Location data is used only to help identify the area of a complaint.</li>
            <li>We do not track your location continuously or in the background.</li>
            <li>Your location is never displayed publicly or shared with other residents.</li>
            <li>Location data attached to a complaint is accessible only to authorized RWA staff.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">5. Complaint Privacy</h2>
          <p>
            Complaint details — including your name, contact number, flat number, and description — are
            kept strictly confidential. They are visible only to authorized RWA administrators.
            Complaint status updates are available to the submitter through their reference number only.
            No personal information about complainants is displayed publicly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">6. Data Storage and Security</h2>
          <ul className="list-disc ml-5 space-y-1">
            <li>Data is stored securely in Firebase Firestore with restrictive access rules.</li>
            <li>We apply appropriate technical and organizational security measures.</li>
            <li>Access to personal data is limited to authorized RWA administrators.</li>
            <li>We do not store payment information.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">7. Photographs and Gallery</h2>
          <p>
            Photographs published in the gallery are of community events and activities. We endeavor to
            obtain appropriate permission before publishing identifiable photographs of residents.
            If you appear in a photograph and wish it removed, please contact us.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">8. Retention</h2>
          <p>
            Contact messages are retained for a reasonable period to allow follow-up.
            Complaint records are retained for administrative purposes in accordance with applicable rules.
            You may request deletion of your personal data by contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">9. Resident Directory</h2>
          <p>
            We do not publish a public directory of resident names, phone numbers, email addresses, or flat details.
            Such information is only accessible to authorized RWA administrators.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">10. Contact</h2>
          <p>
            For any privacy-related concerns, data deletion requests, or questions about this policy, please
            contact us at:{' '}
            <a href="mailto:burariektasocietyrwa@gmail.com" className="text-[#1e3a8a] underline">
              burariektasocietyrwa@gmail.com
            </a>
          </p>
        </section>
      </Card>
    </div>
  );
}
