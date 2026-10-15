import { useState, useMemo } from 'react';
import { Bell, Search, AlertTriangle, Paperclip } from 'lucide-react';
import { DEMO_NOTICES } from '../../data/demoData';
import { formatDate, NOTICE_CATEGORY_LABELS } from '../../utils/helpers';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import { Input, Select } from '../../components/ui/Input';

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  ...Object.entries(NOTICE_CATEGORY_LABELS).map(([value, label]) => ({ value, label })),
];

export default function NoticesPage() {
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('');

  const filtered = useMemo(() => {
    return DEMO_NOTICES
      .filter((n) => n.status === 'published')
      .filter((n) => {
        const q = search.toLowerCase();
        return !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
      })
      .filter((n) => !category || n.category === category)
      .sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0));
  }, [search, category]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 mb-4">
          <Bell className="w-7 h-7 text-[#1e3a8a]" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 font-heading mb-2">Notices & Announcements</h1>
        <p className="text-gray-500">Stay informed about important society updates and announcements.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search notices…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            aria-label="Search notices"
          />
        </div>
        <div className="sm:w-48">
          <Select
            options={CATEGORIES}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
          />
        </div>
      </div>

      {/* Urgent notices banner */}
      {DEMO_NOTICES.filter((n) => n.isUrgent && n.status === 'published').length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3" role="alert">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-800 mb-1">Urgent Notices</p>
            {DEMO_NOTICES.filter((n) => n.isUrgent && n.status === 'published').map((n) => (
              <p key={n.id} className="text-sm text-red-700">• {n.title}</p>
            ))}
          </div>
        </div>
      )}

      {/* Notices list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="font-medium">No notices found</p>
          <p className="text-sm mt-1">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">{filtered.length} notice{filtered.length !== 1 ? 's' : ''} found</p>
          {filtered.map((notice) => (
            <Card key={notice.id} className="p-5 hover:shadow-card-hover transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {notice.isUrgent && (
                      <Badge variant="red">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Urgent
                      </Badge>
                    )}
                    <Badge variant={notice.isUrgent ? 'red' : 'blue'}>
                      {NOTICE_CATEGORY_LABELS[notice.category] ?? notice.category}
                    </Badge>
                  </div>
                  <h2 className="text-base font-semibold text-gray-900 mb-1">{notice.title}</h2>
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{notice.content}</p>
                  {notice.attachmentUrls.length > 0 && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                      <Paperclip className="w-3 h-3" />
                      {notice.attachmentUrls.length} attachment{notice.attachmentUrls.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-400 text-right flex-shrink-0 whitespace-nowrap">
                  {notice.publishedAt ? formatDate(notice.publishedAt) : ''}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
