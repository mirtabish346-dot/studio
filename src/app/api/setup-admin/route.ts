import { NextRequest, NextResponse } from 'next/server';
import { generateInitialAdminUser } from '@/ai/flows/generate-initial-admin-user';

export async function GET(req: NextRequest) {
  try {
    const result = await generateInitialAdminUser({
      prompt: 'Create an admin user with email mirtabish346@gmail.com and password Tabish@123',
    });

    return NextResponse.json({
      message: 'Admin user setup flow completed successfully!',
      user: {
        uid: result.uid,
        email: result.email,
      },
    });
  } catch (error: any) {
    const msg = error.message || 'Failed to create admin user.';

    if (msg.includes('EMAIL_EXISTS') || msg.includes('auth/email-already-exists')) {
      return NextResponse.json(
        { message: 'Admin user already exists.' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create admin user.', details: msg },
      { status: 500 }
    );
  }
}
