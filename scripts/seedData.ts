/**
 * Seed Script - Initialize Firebase with Committee Members and Gallery
 * Run with: npx ts-node scripts/seedData.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as fs from 'fs';
import * as path from 'path';

// Firebase config (same as in your .env)
const firebaseConfig = {
  apiKey: "AIzaSyAx1fU2G88K-IiOEjnfsFDiTCxGwt_DArQ",
  authDomain: "burari-ekta-society-rwa.firebaseapp.com",
  projectId: "burari-ekta-society-rwa",
  storageBucket: "burari-ekta-society-rwa.firebasestorage.app",
  messagingSenderId: "1051927920323",
  appId: "1:1051927920323:web:48bea42053dfc72f7d2c76",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Committee Members Data
const committeeMembers = [
  {
    name: "S.S. Chauhan",
    designation: "President",
    email: "schouhan86@gmail.com",
    phone: "+91 9810497750",
    displayPhone: true,
    displayEmail: true,
    photoPath: "public/images/committee/president.jpg", // White shirt photo
    order: 1,
    isActive: true
  },
  {
    name: "Yashwant Singh",
    designation: "Secretary",
    email: "yash3dec1983@gmail.com",
    phone: "+91 9990158578",
    displayPhone: true,
    displayEmail: true,
    photoPath: "public/images/committee/secretary.jpg", // Light green shirt with tie
    order: 2,
    isActive: true
  },
  {
    name: "Bala Dutt",
    designation: "Treasurer",
    email: "bala.mambers@gmail.com",
    phone: "+91 9958692545",
    displayPhone: true,
    displayEmail: true,
    photoPath: "public/images/committee/treasurer.jpg", // Black t-shirt
    order: 3,
    isActive: true
  }
];

// Gallery Images Data
const galleryImages = [
  {
    title: "Burari Ekta Society Logo",
    description: "Official logo of Burari Ekta Society Resident Welfare Association",
    category: "society",
    imagePath: "public/images/gallery/society-logo.jpg"
  },
  {
    title: "Society Street View",
    description: "Main street view of Burari Ekta Society",
    category: "society",
    imagePath: "public/images/gallery/street-view-1.jpg"
  },
  {
    title: "Society Entrance",
    description: "Entrance gate of Burari Ekta Society",
    category: "society",
    imagePath: "public/images/gallery/street-view-2.jpg"
  }
];

async function uploadImage(localPath: string, storagePath: string): Promise<string> {
  try {
    const fileBuffer = fs.readFileSync(localPath);
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, fileBuffer);
    const downloadURL = await getDownloadURL(storageRef);
    console.log(`✓ Uploaded: ${storagePath}`);
    return downloadURL;
  } catch (error) {
    console.error(`✗ Failed to upload ${localPath}:`, error);
    throw error;
  }
}

async function seedCommittee() {
  console.log('\n========== SEEDING COMMITTEE MEMBERS ==========\n');
  
  for (const member of committeeMembers) {
    try {
      let photoUrl = '';
      
      // Upload photo if exists
      if (fs.existsSync(member.photoPath)) {
        const filename = `committee/${Date.now()}_${path.basename(member.photoPath)}`;
        photoUrl = await uploadImage(member.photoPath, filename);
      } else {
        console.log(`⚠ Photo not found: ${member.photoPath}`);
      }

      // Add to Firestore
      await addDoc(collection(db, 'committee'), {
        name: member.name,
        designation: member.designation,
        email: member.email,
        phone: member.phone,
        displayPhone: member.displayPhone,
        displayEmail: member.displayEmail,
        photoUrl: photoUrl || null,
        order: member.order,
        isActive: member.isActive,
        createdAt: serverTimestamp(),
        createdBy: 'seed-script'
      });

      console.log(`✓ Added: ${member.name} (${member.designation})`);
    } catch (error) {
      console.error(`✗ Failed to add ${member.name}:`, error);
    }
  }
}

async function seedGallery() {
  console.log('\n========== SEEDING GALLERY IMAGES ==========\n');
  
  for (const image of galleryImages) {
    try {
      let imageUrl = '';
      
      // Upload image
      if (fs.existsSync(image.imagePath)) {
        const filename = `gallery/${Date.now()}_${path.basename(image.imagePath)}`;
        imageUrl = await uploadImage(image.imagePath, filename);
      } else {
        console.log(`⚠ Image not found: ${image.imagePath}`);
        continue;
      }

      // Add to Firestore
      await addDoc(collection(db, 'gallery'), {
        title: image.title,
        description: image.description,
        imageUrl: imageUrl,
        category: image.category,
        uploadedAt: serverTimestamp(),
        uploadedBy: 'seed-script'
      });

      console.log(`✓ Added: ${image.title}`);
    } catch (error) {
      console.error(`✗ Failed to add ${image.title}:`, error);
    }
  }
}

async function main() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║  BURARI EKTA SOCIETY - DATA SEEDING   ║');
  console.log('╚════════════════════════════════════════╝');

  try {
    await seedCommittee();
    await seedGallery();
    
    console.log('\n✓✓✓ SEEDING COMPLETED SUCCESSFULLY! ✓✓✓\n');
  } catch (error) {
    console.error('\n✗✗✗ SEEDING FAILED! ✗✗✗\n', error);
    process.exit(1);
  }
}

main();
