import { NextRequest, NextResponse } from 'next/server';
import '@/lib/firebase-admin';  // Force init + logs
import { generateInitialAdminUserFlow } from '@/ai/flows/generate-initial-admin-user';

export async function GET(req: NextRequest) {
  try {
    const result = await generateInitialAdminUserFlow();

    console.error('Admin user creation flow completed successfully:', JSON.stringify(result));  // Use error for visibility

    return NextResponse.json({
      message: 'Admin user setup flow completed successfully!',
      user: {
        uid: result.uid,
        email: result.email,
      },
      // fullResult: result,  // Optional: Remove in production
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