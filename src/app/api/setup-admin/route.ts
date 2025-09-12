import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function GET(req: NextRequest) {
  try {
    const auth = admin.auth();

    // Hardcoded admin credentials
    const email = 'mirtabish346@gmail.com';
    const password = 'Tabish@123';
    const displayName = 'Tabish';

    let userRecord;
    try {
      userRecord = await auth.createUser({
        email,
        password,
        displayName,
        emailVerified: true,
        disabled: false,
      });
    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        console.log(`User already exists: ${email}`);
        userRecord = await auth.getUserByEmail(email);
      } else {
        throw error;
      }
    }

    const db = admin.firestore();
    const userDocRef = db.collection('users').doc(userRecord.uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      await userDocRef.set({
        name: displayName,
        email,
        role: 'admin',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    return NextResponse.json({
      message: 'Admin user setup completed successfully!',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
      },
    });
  } catch (error: any) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user.', details: error.message },
      { status: 500 }
    );
  }
}
