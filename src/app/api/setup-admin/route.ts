// src/app/api/setup-admin/route.ts

import { NextRequest, NextResponse } from 'next/server';
import runFlow from '@genkit-ai/next';
import { generateInitialAdminUserFlow } from '@/ai/flows/generate-initial-admin-user';

// Define the shape of the expected result
type AdminUserResult = {
  uid: string;
  email: string;
};

export async function GET(req: NextRequest) {
  try {
    console.log('Attempting to create initial admin user via runFlow...');

    // Run the flow (without passing unsupported 'prompt' unless your flow explicitly accepts it)
    const rawResult = await runFlow(generateInitialAdminUserFlow);

    console.log('Raw result from runFlow:', rawResult);

    // Safely extract uid and email
    const result: AdminUserResult = {
      uid: (rawResult as any)?.uid || 'unknown-uid',
      email: (rawResult as any)?.email || 'unknown-email',
    };

    console.log('Admin user creation flow completed successfully:', result);

    return NextResponse.json({
      message: 'Admin user setup flow completed successfully!',
      user: result,
    });
  } catch (error: any) {
    console.error('Error running admin user setup flow:', error);

    const errorMessage = error?.message || 'Failed to create admin user.';

    // Handle "user already exists" error
    if (errorMessage.includes("EMAIL_EXISTS") || errorMessage.includes("auth/email-already-exists")) {
      console.log('Detected that admin user already exists.');
      return NextResponse.json(
        { message: "Admin user already exists." },
        { status: 200 }
      );
    }

    console.error('An unexpected error occurred during admin setup:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to create admin user.', details: errorMessage },
      { status: 500 }
    );
  }
}
