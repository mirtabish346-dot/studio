'use server';

import * as admin from 'firebase-admin';

// Initialize Firebase Admin (if not already initialized)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // or your genkit cert setup if needed
  });
}

export async function generateInitialAdminUserFlow() {
  const auth = admin.auth();
  const email = 'mirtabish346@gmail.com';
  const password = 'Tabish@123';
  const displayName = 'Mir Tabish';

  let userRecord;

  try {
    userRecord = await auth.createUser({
      email,
      password,
      displayName,
      emailVerified: true,
      disabled: false,
    });
    console.log('Admin user created:', email);
  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      console.log(`Admin user already exists: ${email}`);
      userRecord = await auth.getUserByEmail(email);
    } else {
      console.error('Error creating admin user:', error);
      throw error;
    }
  }

  // Ensure Firestore document exists
  const db = admin.firestore();
  const userDocRef = db.collection('users').doc(userRecord.uid);
  const userDoc = await userDocRef.get();

  if (!userDoc.exists) {
    await userDocRef.set({
      name: displayName,
      email: email,
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  // Return the real Firebase UID and email
  return {
    uid: userRecord.uid,
    email: userRecord.email,
    password,
    roles: ['admin'],
    permissions: ['all'],
  };
}
