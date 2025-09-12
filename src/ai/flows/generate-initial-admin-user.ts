'use server';

import * as admin from 'firebase-admin';

export type GenerateInitialAdminUserOutput = {
  uid: string;
  email: string;
  password: string;
  roles: string[];
  permissions: string[];
};

export const generateInitialAdminUserFlow = async (): Promise<GenerateInitialAdminUserOutput> => {
  const hardcodedUser = {
    username: 'Admin User',
    email: 'mirtabish346@gmail.com',
    password: 'Tabish@123',
    roles: ['admin'],
    permissions: ['*'],
  };

  const auth = admin.auth();
  let userRecord;

  try {
    userRecord = await auth.createUser({
      email: hardcodedUser.email,
      password: hardcodedUser.password,
      displayName: hardcodedUser.username,
      emailVerified: true,
      disabled: false,
    });
    console.log('Created Firebase user:', userRecord.uid);
  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      console.log(`User already exists: ${hardcodedUser.email}`);
      userRecord = await auth.getUserByEmail(hardcodedUser.email);
    } else {
      throw error;
    }
  }

  const db = admin.firestore();
  const userDocRef = db.collection('users').doc(userRecord.uid);
  const userDoc = await userDocRef.get();

  if (!userDoc.exists) {
    await userDocRef.set({
      name: hardcodedUser.username,
      email: hardcodedUser.email,
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  return {
    uid: userRecord.uid,
    email: userRecord.email!,
    password: hardcodedUser.password,
    roles: hardcodedUser.roles,
    permissions: hardcodedUser.permissions,
  };
};
