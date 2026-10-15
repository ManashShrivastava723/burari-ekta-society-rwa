import { useState } from 'react';
import {
  Bell, Plus, Pencil, Trash2, Archive, Eye, AlertTriangle, Search
} from 'lucide-react';
import { DEMO_NOTICES } from '../../data/demoData';
import type { Notice, NoticeCategory, PublishStatus } from '../../types';
import { formatDate, NOTICE_CATEGORY_LABELS, STATUS_COLORS } from '../../utils/helpers';
import { Input, Textarea, Select } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card, { CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal, { ConfirmDialog } from '../../components/ui/Modal';
import { isDemoMode } from '../../lib/firebase';

const CATEGORY_OPTIONS = [
  { value: '', label: 'All' },
  ...Object.entries(NOTICE_CATEGORY_LABELS).map(([v, l]) => ({ value: v, label: l })),
];

const FORM_CATEGORIES = CATEGORY_OPTIONS.filter((o) => o.value !== '');

export default function AdminNoticesPage() {
  const [notices, setNotices]         = useState<Notice[]>(DEMO_NOTICES);
  const [search, setSearch]           = useState('');
  const [catFilter, setCatFilter]     = useState('');
  const [isFormOpen, setIsFormOpen]   = useState(false);
  const [editing, setEditing]         = useState<Notice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '', content: '', category: 'general' as NoticeCategory,
    isUrgent: false, status: 'published' as PublishStatus,
  });

  const filtered = notices
    .filter((n) => !search || n.title.toLowerCase().includes(search.toLowerCase()))
    .filter((n) => !catFilter || n.category === catFilter)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  function openNew() {
    setEditing(null);
    setForm({ title: '', content: '', category: 'general', isUrgent: false, status: 'published' });
    setIsFormOpen(true);
  }

  function openEdit(notice: Notice) {
    setEditing(notice);
    setForm({
      title: notice.title,
      content: notice.content,
      category: notice.category,
      isUrgent: notice.isUrgent,
      status: notice.status,
    });
    setIsFormOpen(true);
  }

  function handleSave() {
    if (!form.title.trim() || !form.content.trim()) return;
    if (editing) {
      setNotices((prev) => prev.map((n) =>
        n.id === editing.id
          ? { ...n, ...form, updatedAt: new Date(), updatedBy: 'admin' }
          : n
      ));
    } else {
      const newNotice: Notice = {
        id: `n${Date.now()}`,
        ...form,
        attachmentUrls: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: form.status === 'published' ? new Date() : undefined,
        createdBy: 'admin',
        updatedBy: 'admin',
      };
      setNotices((prev) => [newNotice, ...prev]);
    }
    setIsFormOpen(false);
    if (isDemoMode) alert('Demo mode: changes are not persisted to the database.');
  }

  function handleDelete(id: string) {
    setNotices((prev) => prev.filter((n) => n.id !== id));
    setDeleteTarget(null);
    if (isDemoMode) alert('Demo mode: changes are not persisted.');
  }

  function toggleStatus(id: string) {
    setNotices((prev) => prev.map((n) =>
      n.id === id
        ? { ...n, status: n.status === 'published' ? 'archived' as PublishStatus : 'published' as PublishStatus, updatedAt: new Date() }
        : n
    ));
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notices Management</h1>
          <p className="text-gray-500 text-sm">Create, edit, publish, and archive notices.</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openNew}>
          New Notice
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search notices…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <Select
          options={CATEGORY_OPTIONS}
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="sm:w-44"
        />
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">All Notices ({filtered.length})</h2>
        </CardHeader>
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No notices found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-5 py-3 text-left">Title</th>
                  <th className="px-5 py-3 text-left">Category</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left">Date</th>
                  <th className="px-5 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((n) => (
                  <tr key={n.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {n.isUrgent && <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />}
                        <span className="font-medium text-gray-900 line-clamp-1">{n.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant="gray">{NOTICE_CATEGORY_LABELS[n.category]}</Badge>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[n.status]}`}>
                        {n.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                      {formatDate(n.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(n)}
                          className="p-1.5 text-gray-500 hover:text-[#1e3a8a] hover:bg-blue-50 rounded-lg transition-colors"
                          aria-label="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleStatus(n.id)}
                          className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          aria-label={n.status === 'published' ? 'Archive' : 'Publish'}
                        >
                          {n.status === 'published'
                            ? <Archive className="w-3.5 h-3.5" />
                            : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => setDeleteTarget(n.id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editing ? 'Edit Notice' : 'New Notice'}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Title *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Notice title"
          />
          <Textarea
            label="Content *"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={6}
            placeholder="Notice content…"
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              options={FORM_CATEGORIES}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as NoticeCategory })}
            />
            <Select
              label="Status"
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'published', label: 'Published' },
                { value: 'archived', label: 'Archived' },
              ]}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as PublishStatus })}
            />
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={form.isUrgent}
              onChange={(e) => setForm({ ...form, isUrgent: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-[#1e3a8a]"
            />
            Mark as Urgent
          </label>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>
              {editing ? 'Save Changes' : 'Publish Notice'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        title="Delete Notice"
        message="Are you sure you want to delete this notice? This action cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  );
}
