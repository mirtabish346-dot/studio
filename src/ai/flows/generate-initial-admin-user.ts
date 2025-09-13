'use server';

import { admin } from '@/lib/firebase-admin';  // Assuming you added this file as per previous advice

export const generateInitialAdminUserFlow = async () => {
  const email = 'mirtabish346@gmail.com';
  const password = 'Tabish@123';

  const auth = admin.auth();
  let userRecord;

  try {
    console.log('Attempting to create user with email:', email);  // Debug: Confirm attempt
    userRecord = await auth.createUser({
      email,
      password,
      displayName: 'Tabish Admin',
      emailVerified: true,
      disabled: false,
    });
    console.log('Admin user created successfully. userRecord:', userRecord);  // Debug: Full object
  } catch (error: any) {
    console.error('Create user error:', error.code, error.message);  // Debug: Full error details
    if (error.code === 'auth/email-already-exists') {
      console.log('Email exists, fetching existing user...');
      try {
        userRecord = await auth.getUserByEmail(email);
        console.log('Fetched existing user. userRecord:', userRecord);  // Debug: Full object
      } catch (fetchError: any) {
        console.error('Fetch user error:', fetchError.code, fetchError.message);  // Debug: If fetch fails
        throw new Error(`Failed to fetch existing user: ${fetchError.message}`);
      }
    } else {
      throw error;
    }
  }

  // Safety check: Ensure userRecord is valid before proceeding
  if (!userRecord || !userRecord.uid) {
    throw new Error('userRecord is invalid or missing UID after creation/fetch');
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
    console.log('Firestore user doc created for UID:', userRecord.uid);
  } else {
    console.log('Firestore user doc already exists for UID:', userRecord.uid);
  }

  return {
    uid: userRecord.uid,
    email: userRecord.email,
    password: password,
    roles: ['admin'],
    permissions: ['all'],
  };
};