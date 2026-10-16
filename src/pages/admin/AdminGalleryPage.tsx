import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2, Upload, X, Image as ImageIcon } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';

interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category?: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export default function AdminGalleryPage() {
  const { user } = useAuth();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'society'
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'gallery'));
      const imagesList: GalleryImage[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        imagesList.push({
          id: doc.id,
          ...data,
          uploadedAt: data.uploadedAt?.toDate() || new Date()
        } as GalleryImage);
      });
      imagesList.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
      setImages(imagesList);
    } catch (error) {
      console.error('Error fetching images:', error);
      alert('Failed to load gallery images');
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
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !formData.title.trim()) {
      alert('Please provide both an image and a title');
      return;
    }

    try {
      setUploading(true);

      // Upload image to Firebase Storage
      const timestamp = Date.now();
      const filename = `gallery/${timestamp}_${selectedFile.name}`;
      const storageRef = ref(storage, filename);
      
      await uploadBytes(storageRef, selectedFile);
      const imageUrl = await getDownloadURL(storageRef);

      // Save metadata to Firestore
      await addDoc(collection(db, 'gallery'), {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        imageUrl,
        category: formData.category,
        uploadedAt: serverTimestamp(),
        uploadedBy: user?.email || 'admin'
      });

      alert('Image uploaded successfully!');
      setShowUploadModal(false);
      resetForm();
      fetchImages();
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (image: GalleryImage) => {
    if (!confirm(`Are you sure you want to delete "${image.title}"?`)) {
      return;
    }

    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'gallery', image.id));

      // Delete from Storage
      try {
        const imageRef = ref(storage, image.imageUrl);
        await deleteObject(imageRef);
      } catch (storageError) {
        console.warn('Could not delete image from storage:', storageError);
      }

      alert('Image deleted successfully!');
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormData({ title: '', description: '', category: 'society' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-600 mt-1">{images.length} image(s) in gallery</p>
        </div>
        <Button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Upload Image
        </Button>
      </div>

      {images.length === 0 ? (
        <Card className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No images yet</h3>
          <p className="text-gray-600 mb-4">Upload your first image to get started</p>
          <Button onClick={() => setShowUploadModal(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Upload Image
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-[4/3] bg-gray-100">
                <img
                  src={image.imageUrl}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleDelete(image)}
                  className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                  title="Delete image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 truncate">{image.title}</h3>
                {image.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">{image.description}</p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="capitalize">{image.category || 'general'}</span>
                  <span>{new Date(image.uploadedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          resetForm();
        }}
        title="Upload New Image"
      >
        <div className="space-y-4">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Image *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <span className="text-sm text-gray-600">Click to select image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Maximum file size: 5MB</p>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Society Main Gate"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add a brief description..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              maxLength={200}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="society">Society</option>
              <option value="events">Events</option>
              <option value="maintenance">Maintenance</option>
              <option value="celebrations">Celebrations</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleUpload}
              disabled={uploading || !selectedFile || !formData.title.trim()}
              className="flex-1"
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </Button>
            <Button
              onClick={() => {
                setShowUploadModal(false);
                resetForm();
              }}
              variant="outline"
              disabled={uploading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
