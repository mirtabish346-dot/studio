
'use server';

/**
 * @fileOverview An AI agent for generating and creating the first admin user.
 *
 * - generateInitialAdminUser - A function that creates the initial admin user in Firebase.
 * - GenerateInitialAdminUserInput - The input type for the generateInitialAdminUser function.
 * - GenerateInitialAdminUserOutput - The return type for the generateInitialAdminUser function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import * as admin from 'firebase-admin';

// Firebase Admin SDK is initialized in @/ai/genkit.ts, but we check here as well for safety.
if (!admin.apps.length) {
  admin.initializeApp();
}

const GenerateInitialAdminUserInputSchema = z.object({
  prompt: z
    .string()
    .describe(
      'A prompt describing the desired attributes of the initial admin user. e.g., "Create an admin user with email admin@omniserve.com and password Admin@123"'
    ),
});
export type GenerateInitialAdminUserInput = z.infer<typeof GenerateInitialAdminUserInputSchema>;

const GenerateInitialAdminUserOutputSchema = z.object({
  uid: z.string().describe('The UID of the newly created admin user.'),
  email: z.string().email().describe('The email address of the initial admin user.'),
  password: z.string().describe('The password of the initial admin user.'),
  roles: z.array(z.string()).describe('The roles assigned to the initial admin user.'),
  permissions: z
    .array(z.string())
    .describe('The permissions granted to the initial admin user.'),
});
export type GenerateInitialAdminUserOutput = z.infer<typeof GenerateInitialAdminUserOutputSchema>;

export async function generateInitialAdminUser(
  input: GenerateInitialAdminUserInput
): Promise<GenerateInitialAdminUserOutput> {
  return generateInitialAdminUserFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInitialAdminUserPrompt',
  input: {schema: GenerateInitialAdminUserInputSchema},
  output: {schema: z.object({
    username: z.string().describe('The username of the initial admin user.'),
    email: z.string().email().describe('The email address of the initial admin user.'),
    password: z.string().describe('The password of the initial admin user.'),
    roles: z.array(z.string()).describe('The roles assigned to the initial admin user.'),
    permissions: z
      .array(z.string())
      .describe('The permissions granted to the initial admin user.'),
  })},
  prompt: `You are an expert in generating initial admin users for a platform.

  Based on the following prompt, generate the username, email, password, roles, and permissions for the initial admin user.

  Prompt: {{{prompt}}}

  Please provide the output in a JSON format that adheres to the specified schema, an'd ensuring all fields are populated with appropriate and secure values. The roles should include 'admin'.`,
});

export const generateInitialAdminUserFlow = ai.defineFlow(
  {
    name: 'generateInitialAdminUserFlow',
    inputSchema: GenerateInitialAdminUserInputSchema,
    outputSchema: GenerateInitialAdminUserOutputSchema,
  },
  async input => {
    // Step 1: Generate user details with the LLM
    const {output: generatedUser} = await prompt(input);

    if (!generatedUser) {
      throw new Error('Failed to generate user details.');
    }
    
    // Step 2: Create the user in Firebase Authentication
    const auth = admin.auth();
    const userRecord = await auth.createUser({
      email: generatedUser.email,
      password: generatedUser.password,
      displayName: generatedUser.username,
      emailVerified: true,
      disabled: false,
    });

    // Step 3: Create the user document in Firestore with the 'admin' role
    const db = admin.firestore();
    await db.collection('users').doc(userRecord.uid).set({
      name: generatedUser.username,
      email: generatedUser.email,
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    // Step 4: Return the final output
    return {
      uid: userRecord.uid,
      ...generatedUser
    };
  }
);
