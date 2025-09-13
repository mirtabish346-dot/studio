import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import '@/lib/firebase-admin';  // Import shared Firebase init (removes duplicate code)

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});