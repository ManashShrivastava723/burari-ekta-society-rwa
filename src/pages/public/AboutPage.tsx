import { Shield, Users, Target, Heart } from 'lucide-react';
import { DEMO_COMMITTEE, DEMO_PAGE_CONTENT } from '../../data/demoData';
import Card from '../../components/ui/Card';

function MarkdownContent({ content }: { content: string }) {
  // Simple markdown parser for basic formatting
  const html = content
    .split('\n')
    .map((line) => {
      if (line.startsWith('## '))   return `<h2 class="text-xl font-bold text-gray-900 mt-6 mb-3">${line.slice(3)}</h2>`;
      if (line.startsWith('### '))  return `<h3 class="text-lg font-semibold text-gray-900 mt-4 mb-2">${line.slice(4)}</h3>`;
      if (line.startsWith('# '))    return `<h1 class="text-2xl font-bold text-gray-900 mb-4">${line.slice(2)}</h1>`;
      if (line.startsWith('- '))    return `<li class="ml-4 list-disc text-gray-700">${line.slice(2)}</li>`;
      if (line.trim() === '')        return '<div class="h-2"></div>';
      // Bold
      const processed = line
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>');
      return `<p class="text-gray-700 leading-relaxed">${processed}</p>`;
    })
    .join('\n');

  return (
    <div
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function AboutPage() {
  const page = DEMO_PAGE_CONTENT['about'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1e3a8a] mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 font-heading mb-2">About Us</h1>
        <p className="text-gray-500">Burari Ekta Society Resident Welfare Association</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main content */}
        <div className="lg:col-span-2">
          <Card className="p-6 md:p-8">
            {page ? <MarkdownContent content={page.content} /> : (
              <p className="text-gray-500">Content coming soon.</p>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">

          {/* Our purpose */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-[#1e3a8a]" />
              <h3 className="font-bold text-gray-900">Our Purpose</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              {[
                'Ensure a safe and secure residential environment',
                'Maintain cleanliness and hygiene in common areas',
                'Manage shared facilities and services efficiently',
                'Represent residents before local authorities',
                'Promote community harmony and cooperation',
                'Resolve resident grievances effectively',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Heart className="w-3.5 h-3.5 text-[#166534] mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          {/* Committee */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-[#1e3a8a]" />
              <h3 className="font-bold text-gray-900">Office Bearers</h3>
            </div>
            <div className="space-y-4">
              {DEMO_COMMITTEE.map((m) => (
                <div key={m.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1e3a8a] to-[#1d4ed8] text-white font-bold flex items-center justify-center text-sm flex-shrink-0">
                    {m.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{m.name}</div>
                    <div className="text-sm text-[#1e3a8a] font-medium">{m.designation}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-100">
              Contact details are available through the official RWA office for verified residents only.
            </p>
          </Card>

          {/* Society details */}
          <Card className="p-5 bg-blue-50">
            <h3 className="font-bold text-gray-900 mb-3">Society Details</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500 text-xs">Society Name</dt>
                <dd className="font-medium text-gray-900">Burari Ekta Society</dd>
              </div>
              <div>
                <dt className="text-gray-500 text-xs">Type</dt>
                <dd className="font-medium text-gray-900">Resident Welfare Association (RWA)</dd>
              </div>
              <div>
                <dt className="text-gray-500 text-xs">Location</dt>
                <dd className="font-medium text-gray-900">Sant Nagar, Burari, Delhi-110084</dd>
              </div>
              <div>
                <dt className="text-gray-500 text-xs">Email</dt>
                <dd className="font-medium text-gray-900 break-all">burariektasocietyrwa@gmail.com</dd>
              </div>
            </dl>
          </Card>
        </aside>
      </div>
    </div>
  );
}
