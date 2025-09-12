
// src/app/api/setup-admin/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { runFlow } from '@genkit-ai/next';
import { generateInitialAdminUserFlow } from '@/ai/flows/generate-initial-admin-user';

export async function GET(req: NextRequest) {
  try {
    console.log('Attempting to create initial admin user via runFlow...');

    const result = await runFlow(generateInitialAdminUserFlow, {
      prompt: 'Create an admin user with email admin@omniserve.com and password Admin@123',
    });

    console.log('Admin user creation successful:', result);

    return NextResponse.json({
      message: 'Admin user created successfully!',
      user: {
        uid: result.uid,
        email: result.email,
      },
    });
  } catch (error: any) {
    console.error('Error creating admin user:', error);

    let errorMessage = error.message || 'Failed to create admin user.';
    
    // Firebase errors for existing users might be nested or have specific codes
    if (errorMessage.includes("EMAIL_EXISTS")) {
       console.log('Detected that admin user already exists.');
       return NextResponse.json(
          { error: "Admin user already exists." },
          { status: 409 }
        );
    }

    console.error('An unexpected error occurred during admin setup:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to create admin user.', details: errorMessage },
      { status: 500 }
    );
  }
}
