// src/app/api/setup-admin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateInitialAdminUserFlow } from '@/ai/flows/generate-initial-admin-user';

export async function GET(req: NextRequest) {
  try {
    // Directly call the flow — no runFlow()
    const result = await generateInitialAdminUserFlow({
      prompt: 'Create an admin user with email admin@omniserve.com and password Admin@123',
    });

    // Return actual Firebase UID and email
    return NextResponse.json({
      message: 'Admin user setup flow completed successfully!',
      user: {
        uid: result.uid,
        email: result.email,
      },
    });
  } catch (error: any) {
    console.error('Error in admin setup:', error.message);

    if (
      error.message.includes('already exists') ||
      error.message.includes('auth/email-already-exists')
    ) {
      return NextResponse.json({ message: 'Admin user already exists.' }, { status: 200 });
    }

    return NextResponse.json(
      { error: 'Failed to create admin user.', details: error.message },
      { status: 500 }
    );
  }
}
