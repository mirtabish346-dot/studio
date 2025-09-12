'use server';

/**
 * @fileOverview An AI agent for generating the first admin user with roles and permissions.
 *
 * - generateInitialAdminUser - A function that generates the initial admin user data.
 * - GenerateInitialAdminUserInput - The input type for the generateInitialAdminUser function.
 * - GenerateInitialAdminUserOutput - The return type for the generateInitialAdminUser function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInitialAdminUserInputSchema = z.object({
  prompt: z
    .string()
    .describe(
      'A prompt describing the desired attributes and permissions of the initial admin user.'
    ),
});
export type GenerateInitialAdminUserInput = z.infer<typeof GenerateInitialAdminUserInputSchema>;

const GenerateInitialAdminUserOutputSchema = z.object({
  username: z.string().describe('The username of the initial admin user.'),
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
  output: {schema: GenerateInitialAdminUserOutputSchema},
  prompt: `You are an expert in generating initial admin users for a platform.

  Based on the following prompt, generate the username, email, password, roles, and permissions for the initial admin user.

  Prompt: {{{prompt}}}

  Please provide the output in a JSON format that adheres to the specified schema, ensuring all fields are populated with appropriate and secure values.`,
});

const generateInitialAdminUserFlow = ai.defineFlow(
  {
    name: 'generateInitialAdminUserFlow',
    inputSchema: GenerateInitialAdminUserInputSchema,
    outputSchema: GenerateInitialAdminUserOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
