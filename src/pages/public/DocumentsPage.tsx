import { useState, useMemo } from 'react';
import { FileText, Search, Download, Lock } from 'lucide-react';
import { DEMO_DOCUMENTS } from '../../data/demoData';
import { formatDate, formatFileSize, DOCUMENT_CATEGORY_LABELS } from '../../utils/helpers';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import { Input, Select } from '../../components/ui/Input';

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  ...Object.entries(DOCUMENT_CATEGORY_LABELS).map(([value, label]) => ({ value, label })),
];

export default function DocumentsPage() {
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('');

  const filtered = useMemo(() => {
    return DEMO_DOCUMENTS
      .filter((d) => d.publishStatus === 'published' && d.isPublic)
      .filter((d) => {
        const q = search.toLowerCase();
        return !q || d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q);
      })
      .filter((d) => !category || d.category === category);
  }, [search, category]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-50 mb-4">
          <FileText className="w-7 h-7 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 font-heading mb-2">Documents & Downloads</h1>
        <p className="text-gray-500">Official society documents approved for resident access.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search documents…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="sm:w-48">
          <Select
            options={CATEGORIES}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="font-medium">No documents found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((doc) => (
            <Card key={doc.id} className="p-5 hover:shadow-card-hover transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1 flex-wrap">
                    <h2 className="font-semibold text-gray-900 text-sm">{doc.title}</h2>
                    <Badge variant="gray">{doc.fileType}</Badge>
                  </div>
                  <p className="text-gray-500 text-xs mb-2">{doc.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span>{DOCUMENT_CATEGORY_LABELS[doc.category]}</span>
                    <span>•</span>
                    <span>{formatFileSize(doc.fileSize)}</span>
                    <span>•</span>
                    <span>{formatDate(doc.createdAt)}</span>
                  </div>
                  {doc.fileUrl === '#' ? (
                    <div className="inline-flex items-center gap-1 text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-1.5">
                      <Lock className="w-3 h-3" />
                      Contact RWA office to obtain this document
                    </div>
                  ) : (
                    <a
                      href={doc.fileUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-[#1e3a8a] rounded-lg px-3 py-1.5 hover:bg-[#1e40af] transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <p>
          <strong>Note:</strong> Only publicly approved documents are listed here. For access to private or
          confidential documents, please contact the RWA office directly at{' '}
          <a href="mailto:burariektasocietyrwa@gmail.com" className="underline">
            burariektasocietyrwa@gmail.com
          </a>.
        </p>
      </div>
    </div>
  );
}
