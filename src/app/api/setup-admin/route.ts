// src/app/api/setup-admin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createInitialAdminUser } from '@/ai/flows/generate-initial-admin-user';

export async function GET(req: NextRequest) {
  try {
    const user = await createInitialAdminUser();

    return NextResponse.json({
      message: 'Admin user setup flow completed successfully!',
      user,
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
