import { NextRequest, NextResponse } from 'next/server';
import { generateInitialAdminUserFlow } from '@/ai/flows/generate-initial-admin-user';

export async function GET(req: NextRequest) {
  try {
    // Read email and password from query params
    const email = req.nextUrl.searchParams.get('email');
    const password = req.nextUrl.searchParams.get('password');

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Please provide both email and password in query parameters.' },
        { status: 400 }
      );
    }

    const result = await generateInitialAdminUserFlow({
      prompt: `Create an admin user with email ${email} and password ${password}`,
    });

    console.log('Final flow result:', result); // ✅ Debug log

    return NextResponse.json({
      message: 'Admin user setup flow completed successfully!',
      user: {
        uid: result.uid,
        email: result.email,
        password: result.password, // optional, useful for testing
      },
    });
  } catch (error: any) {
    console.error('Error running admin setup flow:', error);

    const errorMessage = error.message || 'Failed to create admin user.';
    return NextResponse.json(
      { error: 'Failed to create admin user.', details: errorMessage },
      { status: 500 }
    );
  }
}
