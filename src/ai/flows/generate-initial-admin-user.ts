'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as admin from 'firebase-admin';

// Hardcoded admin credentials
const HARDCODED_EMAIL = 'mirtabish346@gmail.com';
const HARDCODED_PASSWORD = 'Tabish@123';
const HARDCODED_USERNAME = 'Admin';

// Input schema
const GenerateInitialAdminUserInputSchema = z.object({
  prompt: z.string().optional(),
});

export type GenerateInitialAdminUserInput = z.infer<typeof GenerateInitialAdminUserInputSchema>;

// Output schema
const GenerateInitialAdminUserOutputSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  password: z.string(),
  roles: z.array(z.string()),
  permissions: z.array(z.string()),
});

export type GenerateInitialAdminUserOutput = z.infer<typeof GenerateInitialAdminUserOutputSchema>;

// Define the flow
export const generateInitialAdminUserFlow = ai.defineFlow(
  {
    name: 'generateInitialAdminUserFlow',
    inputSchema: GenerateInitialAdminUserInputSchema,
    outputSchema: GenerateInitialAdminUserOutputSchema,
  },
  async (): Promise<GenerateInitialAdminUserOutput> => {
    const auth = admin.auth();

    let userRecord;
    try {
      // Try to create the admin user
      userRecord = await auth.createUser({
        email: HARDCODED_EMAIL,
        password: HARDCODED_PASSWORD,
        displayName: HARDCODED_USERNAME,
        emailVerified: true,
        disabled: false,
      });
      console.log('Admin user created:', userRecord.uid);
    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        // If user already exists, fetch it
        userRecord = await auth.getUserByEmail(HARDCODED_EMAIL);
        console.log('Admin user already exists:', userRecord.uid);
      } else {
        throw error;
      }
    }

    // Firestore: create user doc if it doesn't exist
    const db = admin.firestore();
    const userDocRef = db.collection('users').doc(userRecord.uid);
    const userDoc = await userDocRef.get();
    if (!userDoc.exists) {
      await userDocRef.set({
        name: HARDCODED_USERNAME,
        email: HARDCODED_EMAIL,
        role: 'admin',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    return {
      uid: userRecord.uid,
      email: HARDCODED_EMAIL,
      password: HARDCODED_PASSWORD,
      roles: ['admin'],
      permissions: ['all'], // adjust if needed
    };
  }
);
