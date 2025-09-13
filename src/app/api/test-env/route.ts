import { NextResponse } from 'next/server';
import '@/lib/firebase-admin';  // Triggers env logs + init

export async function GET() {
  const key = process.env.FIREBASE_PRIVATE_KEY || 'MISSING';
  return NextResponse.json({
    projectId: process.env.FIREBASE_PROJECT_ID || 'MISSING',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL ? 'Set' : 'MISSING',
    keyPreview: key.substring(0, 50) + '...',
    keyLength: key.length,  // Should be ~1792 for your key
    hasPemHeader: key.includes('-----BEGIN PRIVATE KEY-----') ? 'Yes' : 'No',
  });
}