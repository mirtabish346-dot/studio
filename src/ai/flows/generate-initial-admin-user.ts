'use server';

/**
 * @fileOverview AI agent for generating and creating the first admin user using Firebase Admin SDK.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin using Vercel environment variables
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Replace literal \n with real newlines when parsing
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const GenerateInitialAdminUserInputSchema = z.object({
  prompt: z.string().describe(
    'Prompt describing the desired attributes of the initial admin user.'
  ),
});

export type GenerateInitialAdminUserInput = z.infer<typeof GenerateInitialAdminUserInputSchema>;

const GenerateInitialAdminUserOutputSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  username: z.string(),
  password: z.string(),
  roles: z.array(z.string()),
  permissions: z.array(z.string()),
});

export type GenerateInitialAdminUserOutput = z.infer<typeof GenerateInitialAdminUserOutputSchema>;

export const generateInitialAdminUserFlow = ai.defineFlow(
  {
    name: 'generateInitialAdminUserFlow',
    inputSchema: GenerateInitialAdminUserInputSchema,
    outputSchema: GenerateInitialAdminUserOutputSchema,
  },
  async input => {
    // Step 1: Generate user details with LLM
    const { output: generatedUser } = await ai.definePrompt({
      name: 'generateInitialAdminUserPrompt',
      input: { schema: GenerateInitialAdminUserInputSchema },
      output: { schema: GenerateInitialAdminUserOutputSchema },
      prompt: `Create a secure admin user based on: {{{prompt}}}`,
    })(input);

    if (!generatedUser) throw new Error('Failed to generate user details.');

    // Step 2: Create Firebase Auth user
    const auth = admin.auth();
    let userRecord;
    try {
      userRecord = await auth.createUser({
        email: generatedUser.email,
        password: generatedUser.password,
        displayName: generatedUser.username,
        emailVerified: true,
        disabled: false,
      });
    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        userRecord = await auth.getUserByEmail(generatedUser.email);
      } else {
        throw error;
      }
    }

    // Step 3: Create Firestore user document
    const db = admin.firestore();
    const userDocRef = db.collection('users').doc(userRecord.uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      await userDocRef.set({
        name: generatedUser.username,
        email: generatedUser.email,
        role: 'admin',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // Step 4: Return final output
    return {
      uid: userRecord.uid,
      ...generatedUser,
    };
  }
);

export async function generateInitialAdminUser(
  input: GenerateInitialAdminUserInput
): Promise<GenerateInitialAdminUserOutput> {
  return generateInitialAdminUserFlow(input);
}
