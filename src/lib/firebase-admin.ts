// /lib/firebase-admin.ts
import * as admin from 'firebase-admin';

console.log('Env check - Project ID:', process.env.FIREBASE_PROJECT_ID ? 'Set' : 'MISSING');
console.log('Env check - Client Email:', process.env.FIREBASE_CLIENT_EMAIL ? 'Set' : 'MISSING');
console.log('Env check - Private Key preview:', process.env.FIREBASE_PRIVATE_KEY?.substring(0, 50) + '...');

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log('Firebase Admin SDK initialized successfully');
  } catch (initError) {
    console.error('Firebase init failed:', initError);
  }
}

export { admin };