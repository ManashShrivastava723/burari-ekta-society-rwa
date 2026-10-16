import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db, isDemoMode } from '../../lib/firebase';
import { Users, Phone, Mail, Shield } from 'lucide-react';
import { DEMO_COMMITTEE, DEMO_SITE_SETTINGS } from '../../data/demoData';
import Card from '../../components/ui/Card';

interface CommitteeMember {
  id: string;
  name: string;
  designation: string;
  phone?: string;
  email?: string;
  photoUrl?: string;
  displayPhone: boolean;
  displayEmail: boolean;
  order: number;
  isActive: boolean;
}

export default function CommitteePage() {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const s = DEMO_SITE_SETTINGS;

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    if (isDemoMode) {
      // Use demo data
      const activeMembers = DEMO_COMMITTEE.filter((m) => m.isActive);
      setMembers(activeMembers as CommitteeMember[]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const q = query(
        collection(db, 'committee'),
        where('isActive', '==', true),
        orderBy('order', 'asc')
      );
      const querySnapshot = await getDocs(q);
      const membersList: CommitteeMember[] = [];
      querySnapshot.forEach((doc) => {
        membersList.push({ id: doc.id, ...doc.data() } as CommitteeMember);
      });
      setMembers(membersList);
    } catch (error) {
      console.error('Error fetching committee members:', error);
      // Fallback to demo data
      const activeMembers = DEMO_COMMITTEE.filter((m) => m.isActive);
      setMembers(activeMembers as CommitteeMember[]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading committee members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 mb-4">
          <Users className="w-7 h-7 text-[#1e3a8a]" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 font-heading mb-2">Committee & Contact</h1>
        <p className="text-gray-500">Meet the office bearers and get in touch with the RWA.</p>
      </div>

      {/* Committee cards */}
      <section aria-labelledby="committee-heading" className="mb-12">
        <h2 id="committee-heading" className="text-xl font-bold text-gray-900 mb-6">Office Bearers</h2>
        {members.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="font-medium">No committee members listed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {members.map((member) => (
              <Card key={member.id} className="p-6 text-center">
                {member.photoUrl ? (
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-[#1e3a8a]/20"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#1e3a8a] to-[#1d4ed8] text-white font-bold text-2xl flex items-center justify-center mx-auto mb-4">
                    {member.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                  </div>
                )}
                <h3 className="font-bold text-gray-900 text-lg mb-1">{member.name}</h3>
                <div className="inline-flex items-center gap-1 text-sm text-[#1e3a8a] font-medium mb-3">
                  <Shield className="w-3.5 h-3.5" />
                  {member.designation}
                </div>
                <div className="space-y-1">
                  {member.displayPhone && member.phone && (
                    <a
                      href={`tel:${member.phone.replace(/\s/g, '')}`}
                      className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-[#1e3a8a] transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" /> {member.phone}
                    </a>
                  )}
                  {member.displayEmail && member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-[#1e3a8a] transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" /> {member.email}
                    </a>
                  )}
                  {!member.displayPhone && !member.displayEmail && (
                    <p className="text-xs text-gray-400">
                      Contact through the RWA office
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* RWA Contact details */}
      <section aria-labelledby="contact-details-heading">
        <h2 id="contact-details-heading" className="text-xl font-bold text-gray-900 mb-6">RWA Contact Information</h2>
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Official Contact</h3>
              <div className="space-y-3 text-sm">
                {s.phones.map((phone, i) => (
                  <a
                    key={i}
                    href={`tel:${phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-[#1e3a8a] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-[#1e3a8a]" />
                    </div>
                    {phone}
                  </a>
                ))}
                <a
                  href={`mailto:${s.email}`}
                  className="flex items-center gap-3 text-gray-700 hover:text-[#1e3a8a] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-[#1e3a8a]" />
                  </div>
                  {s.email}
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Office Address</h3>
              <address className="not-italic text-sm text-gray-700 leading-relaxed">
                {s.address.split(',').map((part, i) => (
                  <span key={i}>{part.trim()}{i < s.address.split(',').length - 1 ? ',' : ''}<br /></span>
                ))}
              </address>
            </div>
          </div>
        </Card>
      </section>

      <p className="text-xs text-gray-500 mt-6 text-center">
        Personal contact details of committee members are kept private to protect their privacy.
        Please use the official RWA contact numbers or the{' '}
        <a href="/contact" className="text-[#1e3a8a] underline">contact form</a> for all correspondence.
      </p>
    </div>
  );
}
