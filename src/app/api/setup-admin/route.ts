// src/app/api/setup-admin/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { generateInitialAdminUserFlow } from '../../../ai/flows/generate-initial-admin-user';

export async function POST(req: NextRequest) {
  try {
    // Call your flow function
    const result = await generateInitialAdminUserFlow();

    // Return success response
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    console.error('Error running generateInitialAdminUserFlow:', err);
    return NextResponse.json({ success: false, error: err.message || 'Unknown error' });
  }
}

// Optional: allow GET to check if route is alive
export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Setup-admin route is working' });
}
