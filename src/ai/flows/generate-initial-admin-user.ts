'use server';

/**
 * Direct admin user creation using Firebase Admin SDK
 */

import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * Creates the initial admin user with fixed credentials.
 * Returns Firebase UID and email.
 */
export async function createInitialAdminUser(): Promise<{ uid: string; email: string }> {
  const auth = admin.auth();

  let userRecord;
  try {
    userRecord = await auth.createUser({
      email: 'admin@omniserve.com',
      password: 'Admin@123',
      displayName: 'admin',
      emailVerified: true,
      disabled: false,
    });
  } catch (err: any) {
    if (err.code === 'auth/email-already-exists') {
      userRecord = await auth.getUserByEmail('admin@omniserve.com');
    } else {
      throw err;
    }
  }

  // Optionally create Firestore document if it doesn't exist
  const db = admin.firestore();
  const userDocRef = db.collection('users').doc(userRecord.uid);
  const userDoc = await userDocRef.get();
  if (!userDoc.exists) {
    await userDocRef.set({
      name: 'admin',
      email: 'admin@omniserve.com',
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  return {
    uid: userRecord.uid,
    email: userRecord.email!,
  };
}
