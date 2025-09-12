'use server';

import * as admin from 'firebase-admin';
import { z } from 'genkit';

// Input schema (optional)
export const GenerateInitialAdminUserInputSchema = z.object({
  prompt: z.string().optional(),
});

// Output schema
export const GenerateInitialAdminUserOutputSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  password: z.string(),
  roles: z.array(z.string()),
  permissions: z.array(z.string()),
});

export type GenerateInitialAdminUserOutput = z.infer<typeof GenerateInitialAdminUserOutputSchema>;

// Hardcoded admin details
const HARDCODED_ADMIN = {
  username: 'mirtabish',
  email: 'mirtabish346@gmail.com',
  password: 'Tabish@123',
  roles: ['admin'],
  permissions: ['all'],
};

// ✅ Export the function so it can be imported safely
export async function generateInitialAdminUserFlow(): Promise<GenerateInitialAdminUserOutput> {
  const auth = admin.auth();
  let userRecord;

  try {
    userRecord = await auth.createUser({
      email: HARDCODED_ADMIN.email,
      password: HARDCODED_ADMIN.password,
      displayName: HARDCODED_ADMIN.username,
      emailVerified: true,
      disabled: false,
    });
  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      console.log(`User already exists: ${HARDCODED_ADMIN.email}`);
      userRecord = await auth.getUserByEmail(HARDCODED_ADMIN.email);
    } else {
      throw error;
    }
  }

  const db = admin.firestore();
  const userDocRef = db.collection('users').doc(userRecord.uid);
  const userDoc = await userDocRef.get();

  if (!userDoc.exists) {
    await userDocRef.set({
      name: HARDCODED_ADMIN.username,
      email: HARDCODED_ADMIN.email,
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  return {
    uid: userRecord.uid,
    email: userRecord.email!,
    password: HARDCODED_ADMIN.password,
    roles: HARDCODED_ADMIN.roles,
    permissions: HARDCODED_ADMIN.permissions,
  };
}
