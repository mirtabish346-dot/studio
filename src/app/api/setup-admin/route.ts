import { NextRequest, NextResponse } from 'next/server';
import { generateInitialAdminUserFlow } from '@/ai/flows/generate-initial-admin-user';

export async function GET(req: NextRequest) {
  try {
    const result = await generateInitialAdminUserFlow({
      prompt: 'Create an admin user with email mirtabish346@gmail.com and password Tabish@123',
    });

    console.log('Final flow result:', result);  // ✅ Debug log

    return NextResponse.json({
      message: 'Admin user setup flow completed successfully!',
      user: {
        uid: result.uid,
        email: result.email,
      },
    });
  } catch (error: any) {
    console.error('Error running admin setup flow:', error);

    let errorMessage = error.message || 'Failed to create admin user.';
    return NextResponse.json(
      { error: 'Failed to create admin user.', details: errorMessage },
      { status: 500 }
    );
  }
};
