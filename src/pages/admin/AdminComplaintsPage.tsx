import { useState } from 'react';
import {
  MessageSquare, Search, Eye, CheckCircle, MapPin, Shield
} from 'lucide-react';
import type { Complaint, ComplaintStatus } from '../../types';
import { formatDateTime, COMPLAINT_CATEGORY_LABELS } from '../../utils/helpers';
import { Input, Select, Textarea } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';

// Sample complaints with sensitive fields only visible to admins
const SAMPLE_COMPLAINTS: Complaint[] = [
  {
    id: 'c1',
    referenceNumber: 'BES2026123456',
    category: 'maintenance',
    subject: 'Leaking pipe on 3rd floor corridor',
    description: 'There is a water leak from an overhead pipe in the 3rd floor corridor near the staircase. Water is dripping on to the floor. Please fix urgently.',
    status: 'in_progress',
    submitterName: '[Resident Name — Confidential]',
    submitterContact: '[Contact — Confidential]',
    flatNumber: '301',
    locationDescription: '3rd floor corridor near staircase',
    locationShared: false,
    attachmentUrls: [],
    adminNotes: 'Plumber contacted. Will visit on 15 Oct.',
    createdAt: new Date('2026-10-10'),
    updatedAt: new Date('2026-10-12'),
  },
  {
    id: 'c2',
    referenceNumber: 'BES2026789012',
    category: 'cleanliness',
    subject: 'Garbage not collected for 3 days',
    description: 'The common area garbage has not been collected for 3 days. It is causing a bad smell and attracting insects.',
    status: 'submitted',
    submitterName: '[Resident Name — Confidential]',
    submitterContact: '[Contact — Confidential]',
    flatNumber: '104',
    locationShared: false,
    attachmentUrls: [],
    createdAt: new Date('2026-10-13'),
    updatedAt: new Date('2026-10-13'),
  },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'submitted',    label: 'Submitted' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'in_progress',  label: 'In Progress' },
  { value: 'resolved',     label: 'Resolved' },
  { value: 'closed',       label: 'Closed' },
];

const STATUS_LABELS: Record<string, string> = {
  submitted:    'Submitted',
  under_review: 'Under Review',
  in_progress:  'In Progress',
  resolved:     'Resolved',
  closed:       'Closed',
};

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>(SAMPLE_COMPLAINTS);
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected]     = useState<Complaint | null>(null);
  const [newStatus, setNewStatus]   = useState<ComplaintStatus>('submitted');
  const [adminNote, setAdminNote]   = useState('');

  const filtered = complaints
    .filter((c) => !search || c.subject.toLowerCase().includes(search.toLowerCase()) || c.referenceNumber.includes(search.toUpperCase()))
    .filter((c) => !statusFilter || c.status === statusFilter)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  function handleUpdateStatus() {
    if (!selected) return;
    setComplaints((prev) => prev.map((c) =>
      c.id === selected.id
        ? { ...c, status: newStatus, adminNotes: adminNote || c.adminNotes, updatedAt: new Date() }
        : c
    ));
    setSelected(null);
  }

  function openDetail(c: Complaint) {
    setSelected(c);
    setNewStatus(c.status);
    setAdminNote(c.adminNotes ?? '');
  }

  const getStatusVariant = (status: string): 'blue' | 'yellow' | 'orange' | 'green' | 'gray' => {
    const map: Record<string, 'blue' | 'yellow' | 'orange' | 'green' | 'gray'> = {
      submitted:    'blue',
      under_review: 'yellow',
      in_progress:  'orange',
      resolved:     'green',
      closed:       'gray',
    };
    return map[status] ?? 'gray';
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Complaints Management</h1>
        <p className="text-gray-500 text-sm">
          All personal information is confidential — visible to authorized staff only.
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 text-sm text-amber-800">
        <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>
          Complaint details including names and contact numbers are confidential.
          Never share this information publicly or with unauthorized persons.
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search by subject or reference number…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <Select
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="sm:w-44"
        />
      </div>

      <Card>
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No complaints found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-5 py-3 text-left">Reference</th>
                  <th className="px-5 py-3 text-left">Subject</th>
                  <th className="px-5 py-3 text-left">Category</th>
                  <th className="px-5 py-3 text-left">Flat</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left">Date</th>
                  <th className="px-5 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-gray-600">{c.referenceNumber}</td>
                    <td className="px-5 py-4">
                      <span className="font-medium text-gray-900 line-clamp-1">{c.subject}</span>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant="gray">{COMPLAINT_CATEGORY_LABELS[c.category]}</Badge>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{c.flatNumber}</td>
                    <td className="px-5 py-4">
                      <Badge variant={getStatusVariant(c.status)}>
                        {STATUS_LABELS[c.status]}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">
                      {formatDateTime(c.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => openDetail(c)}
                        className="p-1.5 text-gray-500 hover:text-[#1e3a8a] hover:bg-blue-50 rounded-lg transition-colors"
                        aria-label="View and update"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={`Complaint — ${selected?.referenceNumber}`}
        size="lg"
      >
        {selected && (
          <div className="space-y-5">
            <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-xs text-red-800 flex items-start gap-2">
              <Shield className="w-3.5 h-3.5 mt-0.5" />
              Resident information below is confidential. Do not disclose to unauthorized parties.
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 text-xs mb-0.5">Resident Name</p>
                <p className="font-medium text-gray-900">{selected.submitterName}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-0.5">Flat Number</p>
                <p className="font-medium text-gray-900">{selected.flatNumber}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-0.5">Category</p>
                <p className="font-medium text-gray-900">{COMPLAINT_CATEGORY_LABELS[selected.category]}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-0.5">Submitted</p>
                <p className="font-medium text-gray-900">{formatDateTime(selected.createdAt)}</p>
              </div>
            </div>

            <div>
              <p className="text-gray-500 text-xs mb-1">Subject</p>
              <p className="font-semibold text-gray-900">{selected.subject}</p>
            </div>

            <div>
              <p className="text-gray-500 text-xs mb-1">Description</p>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{selected.description}</p>
            </div>

            {selected.locationDescription && (
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                {selected.locationDescription}
              </div>
            )}

            <div className="border-t border-gray-100 pt-4 space-y-4">
              <Select
                label="Update Status"
                options={STATUS_OPTIONS.filter((o) => o.value !== '')}
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
              />
              <Textarea
                label="Admin Notes (internal only)"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                rows={3}
                placeholder="Internal notes for staff…"
              />
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setSelected(null)}>Cancel</Button>
                <Button
                  leftIcon={<CheckCircle className="w-4 h-4" />}
                  onClick={handleUpdateStatus}
                >
                  Update Status
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
