// ============================================================
// Burari Ekta Society RWA — Shared TypeScript Types
// ============================================================

export type UserRole = 'superAdmin' | 'rwaAdmin' | 'staff' | 'resident';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  flatNumber?: string;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ---- Notices -----------------------------------------------
export type NoticeCategory =
  | 'general'
  | 'maintenance'
  | 'security'
  | 'finance'
  | 'event'
  | 'emergency'
  | 'utilities'
  | 'other';

export type PublishStatus = 'draft' | 'published' | 'archived';

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: NoticeCategory;
  status: PublishStatus;
  isUrgent: boolean;
  attachmentUrls: string[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  createdBy: string;
  updatedBy: string;
}

// ---- Events ------------------------------------------------
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface SocietyEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  status: EventStatus;
  imageUrls: string[];
  publishStatus: PublishStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// ---- Documents ---------------------------------------------
export type DocumentCategory =
  | 'bylaw'
  | 'minutes'
  | 'circular'
  | 'financial'
  | 'legal'
  | 'maintenance'
  | 'other';

export interface SocietyDocument {
  id: string;
  title: string;
  description: string;
  category: DocumentCategory;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  isPublic: boolean;
  publishStatus: PublishStatus;
  createdAt: Date;
  updatedAt: Date;
  uploadedBy: string;
}

// ---- Gallery -----------------------------------------------
export interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  eventId?: string;
  eventName?: string;
  takenAt?: Date;
  publishStatus: PublishStatus;
  createdAt: Date;
  uploadedBy: string;
}

// ---- Committee Members -------------------------------------
export interface CommitteeMember {
  id: string;
  name: string;
  designation: string;
  photoUrl?: string;
  phone?: string;       // shown only if authorized
  email?: string;       // shown only if authorized
  displayPhone: boolean;
  displayEmail: boolean;
  order: number;
  isActive: boolean;
}

// ---- Complaints --------------------------------------------
export type ComplaintCategory =
  | 'maintenance'
  | 'cleanliness'
  | 'security'
  | 'water'
  | 'electricity'
  | 'parking'
  | 'noise'
  | 'other';

export type ComplaintStatus =
  | 'submitted'
  | 'under_review'
  | 'in_progress'
  | 'resolved'
  | 'closed';

export interface Complaint {
  id: string;
  referenceNumber: string;
  category: ComplaintCategory;
  subject: string;
  description: string;
  status: ComplaintStatus;
  submitterName: string;
  submitterContact: string; // stored securely, not shown publicly
  flatNumber: string;
  locationDescription?: string;
  latitude?: number;
  longitude?: number;
  locationShared: boolean;
  attachmentUrls: string[];
  adminNotes?: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

// ---- Contact Messages --------------------------------------
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// ---- Site Settings -----------------------------------------
export interface SiteSettings {
  id: string;
  societyName: string;
  tagline: string;
  address: string;
  phones: string[];
  email: string;
  mapLatitude: number;
  mapLongitude: number;
  mapZoom: number;
  googleMapsLink: string;
  logoUrl?: string;
  socialLinks: {
    whatsapp?: string;
    facebook?: string;
    twitter?: string;
  };
  maintenanceMode: boolean;
  updatedAt: Date;
  updatedBy: string;
}

// ---- Page Content ------------------------------------------
export interface PageContent {
  id: string;
  slug: string;
  title: string;
  content: string;
  metaDescription?: string;
  publishStatus: PublishStatus;
  updatedAt: Date;
  updatedBy: string;
}

// ---- Audit Logs --------------------------------------------
export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'publish'
  | 'archive'
  | 'login'
  | 'logout'
  | 'role_change'
  | 'settings_update';

export interface AuditLog {
  id: string;
  action: AuditAction;
  collection: string;
  documentId: string;
  documentTitle?: string;
  performedBy: string;
  performedByEmail: string;
  details?: string;
  createdAt: Date;
}
