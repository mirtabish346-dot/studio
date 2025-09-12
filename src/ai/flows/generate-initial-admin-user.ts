'use server';

import * as admin from 'firebase-admin';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Hardcoded admin credentials
const ADMIN_EMAIL = 'mirtabish346@gmail.com';
const ADMIN_PASSWORD = 'Tabish@123';
const ADMIN_USERNAME = 'Tabish';

// Output schema
const GenerateInitialAdminUserOutputSchema = z.object({
  uid: z.string().describe('The UID of the newly created admin user.'),
  email: z.string().email().describe('The email address of the initial admin user.'),
  password: z.string().describe('The password of the initial admin user.'),
  roles: z.array(z.string()).describe('The roles assigned to the initial admin user.'),
  permissions: z.array(z.string()).describe('The permissions granted to the initial admin user.'),
});
export type GenerateInitialAdminUserOutput = z.infer<typeof GenerateInitialAdminUserOutputSchema>;

// Define the flow
export const generateInitialAdminUserFlow = ai.defineFlow(
  {
    name: 'generateInitialAdminUserFlow',
    inputSchema: z.object({}), // no input needed
    outputSchema: GenerateInitialAdminUserOutputSchema,
  },
  async (): Promise<GenerateInitialAdminUserOutput> => {
    const auth = admin.auth();
    let userRecord;

    try {
      // Try to create the admin user
      userRecord = await auth.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        displayName: ADMIN_USERNAME,
        emailVerified: true,
        disabled: false,
      });
      console.log(`Admin user created: ${userRecord.uid}`);
    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        console.log(`Admin already exists, fetching user: ${ADMIN_EMAIL}`);
        userRecord = await auth.getUserByEmail(ADMIN_EMAIL);
      } else {
        throw error;
      }
    }

    // Save to Firestore if not exists
    const db = admin.firestore();
    const userDocRef = db.collection('users').doc(userRecord.uid);
    const userDoc = await userDocRef.get();
    if (!userDoc.exists) {
      await userDocRef.set({
        name: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        role: 'admin',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    return {
      uid: userRecord.uid,
      email: userRecord.email!,
      password: ADMIN_PASSWORD,
      roles: ['admin'],
      permissions: ['all'],
    };
  }
);
