'use server';

import { admin } from '@/lib/firebase-admin';  // Ensures init

export const generateInitialAdminUserFlow = async () => {
  console.log(JSON.stringify({ level: 'info', message: 'Flow started', email: 'mirtabish346@gmail.com' }));

  const auth = admin.auth();
  console.log(JSON.stringify({ level: 'info', message: 'Auth instance type', type: auth.constructor.name }));  // Should be 'Auth'

  const email = 'mirtabish346@gmail.com';
  const password = 'Tabish@123';
  let userRecord: any = null;  // Explicit type for logging

  try {
    console.log(JSON.stringify({ level: 'info', message: 'Attempting to create user' }));
    userRecord = await auth.createUser({
      email,
      password,
      displayName: 'Tabish Admin',
      emailVerified: true,
      disabled: false,
    });
    console.log(JSON.stringify({ level: 'info', message: 'Create successful', userRecordSummary: userRecord ? { uid: userRecord.uid, email: userRecord.email } : 'NULL' }));
  } catch (error: any) {
    console.error(JSON.stringify({ level: 'error', message: 'Create user error', code: error.code, details: error.message }));
    if (error.code === 'auth/email-already-exists') {
      console.log(JSON.stringify({ level: 'info', message: 'Email exists, fetching...' }));
      try {
        userRecord = await auth.getUserByEmail(email);
        console.log(JSON.stringify({ level: 'info', message: 'Fetch successful', userRecordSummary: userRecord ? { uid: userRecord.uid, email: userRecord.email } : 'NULL' }));
      } catch (fetchError: any) {
        console.error(JSON.stringify({ level: 'error', message: 'Fetch user error', code: fetchError.code, details: fetchError.message }));
        throw new Error(`Failed to fetch existing user: ${fetchError.message}`);
      }
    } else {
      throw error;
    }
  }

  // Hard fail if still no userRecord—don't proceed to Firestore
  if (!userRecord || !userRecord.uid) {
    console.error(JSON.stringify({ level: 'error', message: 'CRITICAL: userRecord invalid', userRecord: userRecord }));
    throw new Error('userRecord is undefined/null/missing UID after creation/fetch. Check Firebase init/permissions.');
  }

  // Firestore part with logs
  try {
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
      console.log(JSON.stringify({ level: 'info', message: 'Firestore doc created', uid: userRecord.uid }));
    } else {
      console.log(JSON.stringify({ level: 'info', message: 'Firestore doc exists', uid: userRecord.uid }));
    }
  } catch (fsError: any) {
    console.error(JSON.stringify({ level: 'error', message: 'Firestore error', details: fsError.message }));
    // Don't throw—return partial success for now
  }

  const result = {
    uid: userRecord.uid,
    email: userRecord.email,
    password: password,
    roles: ['admin'],
    permissions: ['all'],
  };
  console.log(JSON.stringify({ level: 'info', message: 'Final flow result', result }));

  return result;
};