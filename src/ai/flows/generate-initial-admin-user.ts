'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as admin from 'firebase-admin';

// Input schema
const GenerateInitialAdminUserInputSchema = z.object({
  prompt: z.string().describe(
    'A prompt describing the desired attributes of the initial admin user.'
  ),
});
export type GenerateInitialAdminUserInput = z.infer<typeof GenerateInitialAdminUserInputSchema>;

// Output schema
const GenerateInitialAdminUserOutputSchema = z.object({
  uid: z.string().describe('The UID of the newly created admin user.'),
  email: z.string().email().describe('The email address of the initial admin user.'),
  password: z.string().describe('The password of the initial admin user.'),
  roles: z.array(z.string()).describe('The roles assigned to the initial admin user.'),
  permissions: z.array(z.string()).describe('The permissions granted to the initial admin user.'),
});
export type GenerateInitialAdminUserOutput = z.infer<typeof GenerateInitialAdminUserOutputSchema>;

// Define the prompt
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

Provide a JSON with username, email, password, roles (include "admin"), and permissions.`,
});

// Define the flow
export const generateInitialAdminUserFlow = ai.defineFlow(
  {
    name: 'generateInitialAdminUserFlow',
    inputSchema: GenerateInitialAdminUserInputSchema,
    outputSchema: GenerateInitialAdminUserOutputSchema,
  },
  async (input: GenerateInitialAdminUserInput): Promise<GenerateInitialAdminUserOutput> => {
    console.log('Input prompt:', input.prompt);

    // Generate user from AI
    const { output: generatedUser } = await prompt(input);
    console.log('Generated user from Genkit:', generatedUser);

    if (!generatedUser || !generatedUser.email) {
      throw new Error('Failed to generate user details or email is missing.');
    }

    // Initialize Firebase Admin if not already initialized
    if (!admin.apps.length) {
      console.log('Initializing Firebase Admin...');
      admin.initializeApp();
    }

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
      console.log('Firebase user created:', userRecord.uid, userRecord.email);
    } catch (error: any) {
      console.error('Error creating Firebase user:', error.message, error.code);
      if (error.code === 'auth/email-already-exists') {
        console.log(`User already exists: ${generatedUser.email}`);
        userRecord = await auth.getUserByEmail(generatedUser.email);
      } else {
        throw error;
      }
    }

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
      console.log('Firestore document created for user:', userRecord.uid);
    } else {
      console.log('Firestore document already exists for user:', userRecord.uid);
    }

    console.log('Returning final user object...');
    return {
      uid: userRecord.uid || 'unknown-uid',
      email: userRecord.email || 'unknown-email',
      password: generatedUser.password,
      roles: generatedUser.roles,
      permissions: generatedUser.permissions,
    };
  }
);
