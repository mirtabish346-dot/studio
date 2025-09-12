'use server';

/**
 * AI agent for generating and creating the first admin user.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

// Input schema
const GenerateInitialAdminUserInputSchema = z.object({
  prompt: z.string(),
});
export type GenerateInitialAdminUserInput = z.infer<typeof GenerateInitialAdminUserInputSchema>;

// Output schema
const GenerateInitialAdminUserOutputSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  username: z.string(),
  password: z.string(),
  roles: z.array(z.string()),
  permissions: z.array(z.string()),
});
export type GenerateInitialAdminUserOutput = z.infer<typeof GenerateInitialAdminUserOutputSchema>;

// AI prompt
const prompt = ai.definePrompt({
  name: 'generateInitialAdminUserPrompt',
  input: { schema: GenerateInitialAdminUserInputSchema },
  output: {
    schema: z.object({
      username: z.string(),
      email: z.string().email(),
      password: z.string(),
      roles: z.array(z.string()),
      permissions: z.array(z.string()),
    }),
  },
  prompt: `You are an expert in generating initial admin users.
Prompt: {{{prompt}}}
Return username, email, password, roles (include 'admin'), permissions in JSON format.`,
});

// Flow
export const generateInitialAdminUserFlow = ai.defineFlow(
  {
    name: 'generateInitialAdminUserFlow',
    inputSchema: GenerateInitialAdminUserInputSchema,
    outputSchema: GenerateInitialAdminUserOutputSchema,
  },
  async input => {
    // Step 1: Generate user details
    const { output: generatedUser } = await prompt(input);

    if (!generatedUser) {
      throw new Error('Failed to generate user details.');
    }

    // Step 2: Create user in Firebase Auth
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
        console.log(`User with email ${generatedUser.email} exists. Fetching...`);
        userRecord = await auth.getUserByEmail(generatedUser.email);
      } else {
        throw error;
      }
    }

    // Step 3: Create user document in Firestore if not exists
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
      email: userRecord.email!,
      username: generatedUser.username,
      password: generatedUser.password,
      roles: generatedUser.roles,
      permissions: generatedUser.permissions,
    };
  }
);

// --- Plain function to return real Firebase UID/email ---
export async function createInitialAdminUser(): Promise<{ uid: string; email: string }> {
  const result = await generateInitialAdminUserFlow({
    prompt: 'Create an admin user with email admin@omniserve.com and password Admin@123',
  });

  return {
    uid: result.uid,
    email: result.email!,
  };
}
