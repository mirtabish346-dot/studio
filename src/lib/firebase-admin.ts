import * as admin from 'firebase-admin';

console.log('🔥 [FORCE LOG] firebase-admin file loaded');  // This should always appear first

// Env checks with structured JSON for easier parsing in Vercel
console.log(JSON.stringify({
  level: 'info',
  message: 'Env check - Project ID',
  value: process.env.FIREBASE_PROJECT_ID ? 'Set' : 'MISSING'
}));
console.log(JSON.stringify({
  level: 'info',
  message: 'Env check - Client Email',
  value: process.env.FIREBASE_CLIENT_EMAIL ? 'Set' : 'MISSING'
}));
console.log(JSON.stringify({
  level: 'info',
  message: 'Env check - Private Key preview',
  value: (process.env.FIREBASE_PRIVATE_KEY || '').substring(0, 50) + '...'
}));

if (!admin.apps.length) {
  try {
    const credential = admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    });
    admin.initializeApp({ credential });
    console.log(JSON.stringify({ level: 'info', message: 'Firebase Admin SDK initialized successfully' }));
  } catch (initError: any) {
    console.error(JSON.stringify({ level: 'error', message: 'Firebase init failed', details: initError.message }));
    // Don't throw here—let it fail later to see userRecord behavior
  }
}

export { admin };