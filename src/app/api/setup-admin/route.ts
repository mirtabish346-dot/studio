import { NextRequest, NextResponse } from 'next/server';
import '@/lib/firebase-admin';  // Force init early
import { generateInitialAdminUserFlow } from '@/ai/flows/generate-initial-admin-user';
import { admin } from '@/lib/firebase-admin';  // Double-import to trigger logs

export async function GET(req: NextRequest) {
  try {
    // Quick test: Log admin apps length to confirm init
    console.error('Admin apps length before flow:', admin.apps.length);

    const result = await generateInitialAdminUserFlow();

    console.error('Admin user creation flow completed successfully:', JSON.stringify(result));

    return NextResponse.json({
      message: 'Admin user setup flow completed successfully!',
      user: {
        uid: result.uid,
        email: result.email,
      },
      // fullResult: result,  // Comment out for prod
    });
  } catch (error: any) {
    console.error('Error running admin setup flow:', JSON.stringify({ 
      message: error.message, 
      stack: error.stack,
      code: error.code 
    }));

    return NextResponse.json(
      { error: 'Failed to create admin user.', details: error.message, code: error.code },
      { status: 500 }
    );
  }
}