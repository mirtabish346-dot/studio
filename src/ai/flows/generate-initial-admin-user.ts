'use server';

import * as admin from 'firebase-admin';

export const generateInitialAdminUserFlow = async () => {
  const email = 'mirtabish346@gmail.com';
  const password = 'Tabish@123';

  const auth = admin.auth();
  let userRecord;

  try {
    // Try to create user
    userRecord = await auth.createUser({
      email,
      password,
      displayName: 'Tabish Admin',
      emailVerified: true,
      disabled: false,
    });
    console.log('Admin user created:', userRecord.uid);
  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      // If already exists, fetch existing user
      userRecord = await auth.getUserByEmail(email);
      console.log('Admin user already exists:', userRecord.uid);
    } else {
      throw error;
    }
  }

  // Add Firestore record if not exists
  const db = admin.firestore();
  const userDocRef = db.collection('users').doc(userRecord.uid);
  const userDoc = await userDocRef.get();

  if (!userDoc.exists) {
    await userDocRef.set({
      name: 'Tabish Admin',
      email: email,
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  return {
    uid: userRecord.uid,
    email: userRecord.email,
    password: password,
    roles: ['admin'],
    permissions: ['all'],
  };
};
