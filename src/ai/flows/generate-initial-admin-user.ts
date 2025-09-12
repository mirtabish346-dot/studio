'use server';

/**
 * @fileOverview An AI agent for generating and creating the first admin user.
 *
 * - generateInitialAdminUser - A function that creates the initial admin user in Firebase.
 * - generateInitialAdminUserFlow - The Genkit flow object for creating the user.
 * - GenerateInitialAdminUserInput - The input type for the generateInitialAdminUser function.
 * - GenerateInitialAdminUserOutput - The return type for the generateInitialAdminUser function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

// Input schema for the AI flow
const GenerateInitialAdminUserInputSchema = z.object({
  prompt: z
    .string()
    .describe(
      'A prompt describing the desired attributes of the initial admin user, e.g., "Create an admin user with email admin@omniserve.com and password Admin@123"'
    ),
});
export type GenerateInitialAdminUserInput = z.infer<typeof GenerateInitialAdminUserInputSchema>;

// Output schema for the AI flow
const GenerateInitialAdminUserOutputSchema = z.object({
  uid: z.string().describe('The UID of the newly created admin user.'),
  email: z.string().email().describe('The email address of the initial admin user.'),
  password: z.string().describe('The password of the initial admin user.'),
  roles: z.array(z.string()).describe('The roles assigned to the initial admin user.'),
  permissions: z.array(z.string()).describe('The permissions granted to the initial admin user.'),
});
export type GenerateInitialAdminUserOutput = z.infer<typeof GenerateInitialAdminUserOutputSchema>;

// Main function to generate the initial admin user via the AI flow
export async function generateInitialAdminUser(
  input: GenerateInitialAdminUserInput
): Promise<GenerateInitialAdminUserOutput> {
  return generateInitialAdminUserFlow(input);
}

// Define the AI prompt
const prompt = ai.definePrompt({
  name: 'generateInitialAdminUserPrompt',
  input: { schema: GenerateInitialAdminUserInputSchema },
  output: {
    schema: z.object({
      username: z.string().describe('The username of the initial admin user.'),
      email: z.string().email().describe('The email address of the initial admin user.'),
      password: z.string().describe('The password of the initial admin user.'),
      roles: z.array(z.string()).describe('The roles assigned to the initial admin user.'),
      permissions: z.array(z.string()).describe('The permissions granted to the initial admin user.'),
    }),
  },
  prompt: `You are an expert in generating initial admin users for a platform.

Based on the following prompt, generate the username, email, password, roles, and permissions for the initial admin user.

Prompt: {{{prompt}}}

Please provide the output in a JSON format that adheres to the specified schema, ensuring all fields are populated with appropriate and secure values. The roles should include 'admin'.`,
});

// Define the AI flow
export const generateInitialAdminUserFlow = ai.defineFlow(
  {
    name: 'generateInitialAdminUserFlow',
    inputSchema: GenerateInitialAdminUserInputSchema,
    outputSchema: GenerateInitialAdminUserOutputSchema,
  },
  async input => {
    // Step 1: Generate user details with the AI
    const response = await prompt(input);
    const generatedUser = response?.output;
    if (!generatedUser) {
      throw new Error('Failed to generate user details.');
    }

    // Step 2: Create the user in Firebase Authentication
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
        console.log(`User with email ${generatedUser.email} already exists. Fetching user...`);
        userRecord = await auth.getUserByEmail(generatedUser.email);
      } else {
        throw error;
      }
    }

    // Step 3: Create the user document in Firestore if it doesn't exist
    const db = admin.firestore();
    const userDocRef = db.collection('users').doc(userRecord.uid);
    const userDoc = await userDocRef.get();
    if (!userDoc.exists) {
      await userDocRef.set({
        name: generatedUser.username,
        email: generatedUser.email,
        roles: generatedUser.roles || ['admin'],
        permissions: generatedUser.permissions || [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // Step 4: Return the final output, ensuring roles and permissions are always arrays
    return {
      uid: userRecord.uid,
      email: generatedUser.email,
      password: generatedUser.password,
      roles: generatedUser.roles || ['admin'],
      permissions: generatedUser.permissions || [],
    };
  }
);
