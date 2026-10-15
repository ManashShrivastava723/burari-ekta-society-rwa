// ============================================================
// Demo / Seed data — used when VITE_APP_MODE=demo
// All values are clearly labeled as sample data.
// ============================================================
import type {
  Notice, SocietyEvent, SocietyDocument, GalleryImage,
  CommitteeMember, SiteSettings, PageContent
} from '../types';

export const DEMO_SITE_SETTINGS: SiteSettings = {
  id: 'main',
  societyName: 'Burari Ekta Society',
  tagline: 'Resident Welfare Association',
  address: 'C-6, Plot No. 07, Kh. No. 723, 2nd Floor, Extended Lal Dora, Gali No. 02, Sant Nagar, Burari, Delhi-110084',
  phones: ['+91 9810497750', '+91 9990158578', '+91 9958692545', '+91 9871841310'],
  email: 'burariektasocietyrwa@gmail.com',
  mapLatitude: 28.7254,
  mapLongitude: 77.1983,
  mapZoom: 16,
  googleMapsLink: 'https://maps.google.com/?q=Sant+Nagar+Burari+Delhi+110084',
  socialLinks: {},
  maintenanceMode: false,
  updatedAt: new Date('2024-01-01'),
  updatedBy: 'system',
};

export const DEMO_COMMITTEE: CommitteeMember[] = [
  {
    id: '1',
    name: 'D.S. Chauhan',
    designation: 'President',
    displayPhone: false,
    displayEmail: false,
    order: 1,
    isActive: true,
  },
  {
    id: '2',
    name: 'Yashwant Singh',
    designation: 'Secretary',
    displayPhone: false,
    displayEmail: false,
    order: 2,
    isActive: true,
  },
  {
    id: '3',
    name: 'Bala Dutt',
    designation: 'Treasurer',
    displayPhone: false,
    displayEmail: false,
    order: 3,
    isActive: true,
  },
];

export const DEMO_NOTICES: Notice[] = [
  {
    id: 'n1',
    title: 'Monthly Maintenance Charges — Due by 10th of Every Month',
    content:
      'All residents are requested to pay their monthly maintenance charges on or before the 10th of every month. Late payment will attract a penalty as per society bylaws. Please collect receipt from the treasurer.',
    category: 'finance',
    status: 'published',
    isUrgent: false,
    attachmentUrls: [],
    createdAt: new Date('2026-10-01'),
    updatedAt: new Date('2026-10-01'),
    publishedAt: new Date('2026-10-01'),
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: 'n2',
    title: 'Water Supply Interruption — 15 October 2026',
    content:
      'Due to scheduled maintenance of the overhead water tank, water supply will be interrupted on 15 October 2026 from 10:00 AM to 2:00 PM. Residents are advised to store sufficient water in advance. We regret the inconvenience.',
    category: 'utilities',
    status: 'published',
    isUrgent: true,
    attachmentUrls: [],
    createdAt: new Date('2026-10-12'),
    updatedAt: new Date('2026-10-12'),
    publishedAt: new Date('2026-10-12'),
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: 'n3',
    title: 'Annual General Meeting — Date and Agenda',
    content:
      'The Annual General Meeting of Burari Ekta Society RWA will be held on Sunday, 26 October 2026 at 6:00 PM in the common area. All residents are requested to attend. Agenda: (1) Annual accounts, (2) Upcoming maintenance works, (3) Election of new committee members, (4) Any other matter with the permission of the chair.',
    category: 'general',
    status: 'published',
    isUrgent: false,
    attachmentUrls: [],
    createdAt: new Date('2026-10-05'),
    updatedAt: new Date('2026-10-05'),
    publishedAt: new Date('2026-10-05'),
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: 'n4',
    title: 'Security Notice — Verify Before Allowing Entry',
    content:
      'Residents are reminded not to allow unknown persons entry into the building without verification. If you notice any suspicious activity, please immediately contact security or call the emergency numbers listed on the website.',
    category: 'security',
    status: 'published',
    isUrgent: false,
    attachmentUrls: [],
    createdAt: new Date('2026-09-20'),
    updatedAt: new Date('2026-09-20'),
    publishedAt: new Date('2026-09-20'),
    createdBy: 'admin',
    updatedBy: 'admin',
  },
];

export const DEMO_EVENTS: SocietyEvent[] = [
  {
    id: 'e1',
    title: 'Annual General Meeting 2026',
    description:
      'Annual General Meeting of all residents. All are invited to participate in society governance.',
    location: 'Common Area, Burari Ekta Society',
    startDate: new Date('2026-10-26T18:00:00'),
    endDate: new Date('2026-10-26T20:00:00'),
    status: 'upcoming',
    imageUrls: [],
    publishStatus: 'published',
    createdAt: new Date('2026-10-05'),
    updatedAt: new Date('2026-10-05'),
    createdBy: 'admin',
  },
  {
    id: 'e2',
    title: 'Diwali Celebration 2026',
    description:
      'Community Diwali celebration for all residents. Bring your family and join us for a festive evening with cultural activities.',
    location: 'Common Area, Burari Ekta Society',
    startDate: new Date('2026-10-20T18:00:00'),
    endDate: new Date('2026-10-20T21:00:00'),
    status: 'upcoming',
    imageUrls: [],
    publishStatus: 'published',
    createdAt: new Date('2026-10-08'),
    updatedAt: new Date('2026-10-08'),
    createdBy: 'admin',
  },
  {
    id: 'e3',
    title: 'Independence Day Celebration 2026',
    description: 'Flag hoisting and cultural program on Independence Day.',
    location: 'Society Entrance, Burari Ekta Society',
    startDate: new Date('2026-08-15T08:00:00'),
    endDate: new Date('2026-08-15T10:00:00'),
    status: 'completed',
    imageUrls: [],
    publishStatus: 'published',
    createdAt: new Date('2026-08-01'),
    updatedAt: new Date('2026-08-16'),
    createdBy: 'admin',
  },
];

export const DEMO_DOCUMENTS: SocietyDocument[] = [
  {
    id: 'd1',
    title: 'Society Bylaws and Rules',
    description: 'Official bylaws and house rules of Burari Ekta Society RWA.',
    category: 'bylaw',
    fileUrl: '#',
    fileType: 'PDF',
    fileSize: 256000,
    isPublic: true,
    publishStatus: 'published',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    uploadedBy: 'admin',
  },
  {
    id: 'd2',
    title: 'Maintenance Charges Structure 2026–27',
    description: 'Approved maintenance charges for the financial year 2026–27.',
    category: 'financial',
    fileUrl: '#',
    fileType: 'PDF',
    fileSize: 128000,
    isPublic: true,
    publishStatus: 'published',
    createdAt: new Date('2026-04-01'),
    updatedAt: new Date('2026-04-01'),
    uploadedBy: 'admin',
  },
  {
    id: 'd3',
    title: 'Minutes — AGM April 2026',
    description: 'Minutes of the Annual General Meeting held in April 2026.',
    category: 'minutes',
    fileUrl: '#',
    fileType: 'PDF',
    fileSize: 98000,
    isPublic: true,
    publishStatus: 'published',
    createdAt: new Date('2026-04-30'),
    updatedAt: new Date('2026-04-30'),
    uploadedBy: 'admin',
  },
];

export const DEMO_GALLERY: GalleryImage[] = [
  {
    id: 'g1',
    title: 'Independence Day 2026',
    description: 'Flag hoisting ceremony on Independence Day.',
    imageUrl: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=400&q=60',
    eventName: 'Independence Day 2026',
    publishStatus: 'published',
    createdAt: new Date('2026-08-15'),
    uploadedBy: 'admin',
  },
  {
    id: 'g2',
    title: 'Holi Celebration 2026',
    description: 'Community Holi celebration.',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=60',
    eventName: 'Holi 2026',
    publishStatus: 'published',
    createdAt: new Date('2026-03-25'),
    uploadedBy: 'admin',
  },
];

export const DEMO_PAGE_CONTENT: Record<string, PageContent> = {
  about: {
    id: 'about',
    slug: 'about',
    title: 'About Burari Ekta Society RWA',
    content: `
## Welcome to Burari Ekta Society

Burari Ekta Society Resident Welfare Association is dedicated to creating a **safe, clean, well-maintained, and harmonious community** for all residents.

Our association works collectively to promote the welfare and interests of residents while ensuring the smooth and efficient management of common facilities and community services. We believe that a strong community is built on **cooperation, transparency, mutual respect, and active participation**.

## Our Purpose

The primary objective of Burari Ekta Society RWA is to provide a well-organized and pleasant living environment for every resident. We work closely with residents, service providers, and relevant authorities to address community concerns and continuously improve the quality of life within our neighbourhood.

## President's Message

*"Dear Residents,*

*It gives me immense pleasure to welcome you to the official website of Burari Ekta Society RWA.*

*Our community is more than just a place where we live — it is a shared space where we build relationships, celebrate togetherness, and work collectively towards a better quality of life.*

*Our primary objective is to ensure a safe, clean, well-maintained, peaceful, and harmonious environment for everyone. We are committed to working with transparency, accountability, and dedication while continuously improving the facilities and services available to our residents.*

*We believe that the success of our community depends on the active participation, cooperation, and support of every resident. I encourage all residents to share their suggestions, raise genuine concerns, and actively participate in community initiatives.*

*Together, we can address challenges effectively, strengthen our community spirit, and create an environment where every resident feels respected, secure, and proud to be a part of our neighbourhood.*

*On behalf of the RWA, I assure you of our continued commitment to the welfare and development of our community.*

*Let us work together to make our community cleaner, safer, greener, and better for everyone.*"*

— **D.S. Chauhan**, President, Burari Ekta Society RWA
    `,
    metaDescription: 'About Burari Ekta Society Resident Welfare Association — our history, purpose, and committee.',
    publishStatus: 'published',
    updatedAt: new Date('2026-01-01'),
    updatedBy: 'admin',
  },
};


