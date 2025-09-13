import { NextRequest, NextResponse } from 'next/server';
import '@/lib/firebase-admin';  // Force init + logs on route load
import { generateInitialAdminUserFlow } from '@/ai/flows/generate-initial-admin-user';

export async function GET(req: NextRequest) {
  try {
    const result = await generateInitialAdminUserFlow();

    console.log('Admin user creation flow completed successfully:', JSON.stringify(result));  // Structured for consistency

    return NextResponse.json({
      message: 'Admin user setup flow completed successfully!',
      user: {
        uid: result.uid,
        email: result.email,
      },
    });
  } catch (error: any) {
    console.error('Error running admin setup flow:', JSON.stringify({ code: error.code, message: error.message }));  // JSON for better logging

    return NextResponse.json(
      { error: 'Failed to create admin user.', details: error.message },
      { status: 500 }
    );
  }
}