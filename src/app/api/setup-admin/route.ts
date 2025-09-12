import { NextRequest, NextResponse } from 'next/server';
import { generateInitialAdminUserFlow } from '@/ai/flows/generate-initial-admin-user';

export async function GET(req: NextRequest) {
  try {
    const result = await generateInitialAdminUserFlow({}); // no input needed, hardcoded admin

    console.log('Admin created successfully:', result);  // ✅ Debug

    return NextResponse.json({
      message: 'Admin user setup flow completed successfully!',
      user: {
        uid: result.uid,
        email: result.email,
        password: result.password,
      },
    });
  } catch (error: any) {
    console.error('Error creating admin user:', error);

    return NextResponse.json(
      { error: 'Failed to create admin user.', details: error.message || error },
      { status: 500 }
    );
  }
}
