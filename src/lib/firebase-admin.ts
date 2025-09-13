import * as admin from 'firebase-admin';

console.error('🔥 [FORCE LOG] firebase-admin.ts LOADED - This MUST appear in logs');  // Top-level log to confirm import

// Env checks - Use error for high visibility in Vercel
console.error(JSON.stringify({
  level: 'info',
  message: 'Env check - Project ID',
  value: process.env.FIREBASE_PROJECT_ID ? 'Set (' + process.env.FIREBASE_PROJECT_ID + ')' : 'MISSING'
}));
console.error(JSON.stringify({
  level: 'info',
  message: 'Env check - Client Email',
  value: process.env.FIREBASE_CLIENT_EMAIL ? 'Set (' + process.env.FIREBASE_CLIENT_EMAIL.substring(0, 20) + '...)' : 'MISSING'
}));
const privateKey = process.env.FIREBASE_PRIVATE_KEY;
console.error(JSON.stringify({
  level: 'info',
  message: 'Env check - Private Key',
  value: privateKey ? `Length: ${privateKey.length}, Starts: "${privateKey.substring(0, 30)}..."` : 'MISSING'
}));

if (!admin.apps.length) {
  try {
    const processedKey = privateKey?.replace(/\\n/g, '\n').trim();
    if (!processedKey || !processedKey.includes('-----BEGIN PRIVATE KEY-----')) {
      throw new Error('Private key malformed - missing PEM header');
    }
    const credential = admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: processedKey,
    });
    admin.initializeApp({ credential });
    console.error(JSON.stringify({ level: 'info', message: 'Firebase Admin SDK initialized successfully' }));

    // Test credential: Try listing 1 user (fails if creds bad, but catches to log)
    admin.auth().listUsers(1).catch((testErr: any) => {
      console.error(JSON.stringify({ level: 'error', message: 'Credential test failed', details: testErr.message, code: testErr.code }));
    });
  } catch (initError: any) {
    console.error(JSON.stringify({ level: 'error', message: 'CRITICAL: Firebase init FAILED', details: initError.message, stack: initError.stack }));
    throw initError;  // Throw to bubble up - now shows in response/logs
  }
}

export { admin };