'use server';

/**
 * Direct admin user creation using Firebase Admin SDK
 */

import * as admin from 'firebase-admin';

// Initialize Firebase Admin with credentials from env variables or fallback
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

// Your test admin credentials
const TEST_EMAIL = 'mirtabish346@gmail.com';
const TEST_PASSWORD = 'Tabish@123';

export async function createInitialAdminUser(): Promise<{ uid: string; email: string }> {
  const auth = admin.auth();

  let userRecord;
  try {
    userRecord = await auth.createUser({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      displayName: 'admin',
      emailVerified: true,
      disabled: false,
    });
  } catch (err: any) {
    if (err.code === 'auth/email-already-exists') {
      userRecord = await auth.getUserByEmail(TEST_EMAIL);
    } else {
      throw err;
    }
  }

  // Create Firestore document if not exists
  const db = admin.firestore();
  const userDocRef = db.collection('users').doc(userRecord.uid);
  const userDoc = await userDocRef.get();
  if (!userDoc.exists) {
    await userDocRef.set({
      name: 'admin',
      email: TEST_EMAIL,
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  return {
    uid: userRecord.uid,
    email: userRecord.email!,
  };
}
