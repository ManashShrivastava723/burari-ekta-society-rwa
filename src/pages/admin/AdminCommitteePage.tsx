import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit2, Trash2, Save, X, Upload, Users } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';

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

export default function AdminCommitteePage() {
  const { user } = useAuth();
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<CommitteeMember | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    phone: '',
    email: '',
    displayPhone: false,
    displayEmail: false,
    order: 0,
    isActive: true
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'committee'));
      const membersList: CommitteeMember[] = [];
      querySnapshot.forEach((doc) => {
        membersList.push({ id: doc.id, ...doc.data() } as CommitteeMember);
      });
      membersList.sort((a, b) => a.order - b.order);
      setMembers(membersList);
    } catch (error) {
      console.error('Error fetching committee members:', error);
      alert('Failed to load committee members');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      designation: '',
      phone: '',
      email: '',
      displayPhone: false,
      displayEmail: false,
      order: members.length + 1,
      isActive: true
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowModal(true);
  };

  const openEditModal = (member: CommitteeMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      designation: member.designation,
      phone: member.phone || '',
      email: member.email || '',
      displayPhone: member.displayPhone,
      displayEmail: member.displayEmail,
      order: member.order,
      isActive: member.isActive
    });
    setSelectedFile(null);
    setPreviewUrl(member.photoUrl || null);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.designation.trim()) {
      alert('Please provide name and designation');
      return;
    }

    try {
      setSaving(true);
      let photoUrl = editingMember?.photoUrl || '';

      // Upload photo if selected
      if (selectedFile) {
        const timestamp = Date.now();
        const filename = `committee/${timestamp}_${selectedFile.name}`;
        const storageRef = ref(storage, filename);
        await uploadBytes(storageRef, selectedFile);
        photoUrl = await getDownloadURL(storageRef);

        // Delete old photo if editing
        if (editingMember?.photoUrl) {
          try {
            const oldRef = ref(storage, editingMember.photoUrl);
            await deleteObject(oldRef);
          } catch (e) {
            console.warn('Could not delete old photo:', e);
          }
        }
      }

      const memberData = {
        name: formData.name.trim(),
        designation: formData.designation.trim(),
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,
        photoUrl: photoUrl || null,
        displayPhone: formData.displayPhone,
        displayEmail: formData.displayEmail,
        order: formData.order,
        isActive: formData.isActive,
        updatedAt: serverTimestamp(),
        updatedBy: user?.email || 'admin'
      };

      if (editingMember) {
        await updateDoc(doc(db, 'committee', editingMember.id), memberData);
        alert('Member updated successfully!');
      } else {
        await addDoc(collection(db, 'committee'), {
          ...memberData,
          createdAt: serverTimestamp(),
          createdBy: user?.email || 'admin'
        });
        alert('Member added successfully!');
      }

      setShowModal(false);
      fetchMembers();
    } catch (error) {
      console.error('Error saving member:', error);
      alert('Failed to save member');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (member: CommitteeMember) => {
    if (!confirm(`Are you sure you want to delete ${member.name}?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'committee', member.id));
      
      // Delete photo from storage
      if (member.photoUrl) {
        try {
          const photoRef = ref(storage, member.photoUrl);
          await deleteObject(photoRef);
        } catch (e) {
          console.warn('Could not delete photo:', e);
        }
      }

      alert('Member deleted successfully!');
      fetchMembers();
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Failed to delete member');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading committee members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Committee Management</h1>
          <p className="text-gray-600 mt-1">{members.length} member(s)</p>
        </div>
        <Button onClick={openAddModal} className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Member
        </Button>
      </div>

      {members.length === 0 ? (
        <Card className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No committee members yet</h3>
          <p className="text-gray-600 mb-4">Add your first member to get started</p>
          <Button onClick={openAddModal}>
            <Plus className="w-5 h-5 mr-2" />
            Add Member
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                {member.photoUrl ? (
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Users className="w-24 h-24 text-white opacity-50" />
                  </div>
                )}
                {!member.isActive && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded">
                    Inactive
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.designation}</p>
                
                {member.displayPhone && member.phone && (
                  <p className="text-sm text-gray-600 mb-1">📞 {member.phone}</p>
                )}
                {member.displayEmail && member.email && (
                  <p className="text-sm text-gray-600 mb-3">✉️ {member.email}</p>
                )}

                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => openEditModal(member)}
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(member)}
                    variant="outline"
                    className="px-4 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingMember ? 'Edit Committee Member' : 'Add Committee Member'}
      >
        <div className="space-y-4">
          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
              {previewUrl ? (
                <div className="relative inline-block">
                  <img src={previewUrl} alt="Preview" className="max-h-48 rounded-lg" />
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(editingMember?.photoUrl || null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <span className="text-sm text-gray-600">Click to upload photo</span>
                  <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Full Name"
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., President, Secretary"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="+91 9876543210"
            />
            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={formData.displayPhone}
                onChange={(e) => setFormData({ ...formData, displayPhone: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm text-gray-600">Display phone on website</span>
            </label>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="email@example.com"
            />
            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={formData.displayEmail}
                onChange={(e) => setFormData({ ...formData, displayEmail: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm text-gray-600">Display email on website</span>
            </label>
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="1"
            />
          </div>

          {/* Active Status */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm font-medium text-gray-700">Active Member</span>
          </label>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={saving || !formData.name.trim() || !formData.designation.trim()}
              className="flex-1"
            >
              {saving ? 'Saving...' : editingMember ? 'Update Member' : 'Add Member'}
            </Button>
            <Button onClick={() => setShowModal(false)} variant="outline" disabled={saving}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
