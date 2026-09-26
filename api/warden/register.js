// Vercel Serverless Function: /api/warden/register
// NOTE: Server-side ONLY. API keys and invitation secrets are never exposed to client-side code.

import admin from 'firebase-admin';

// Initialize Firebase Admin if credentials are provided in server-side environment
function getFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin;
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || 'smart-hostel-and-mess';

  if (serviceAccountJson) {
    try {
      const parsed = JSON.parse(serviceAccountJson);
      admin.initializeApp({
        credential: admin.credential.cert(parsed),
        projectId: parsed.project_id || projectId
      });
      return admin;
    } catch (e) {
      console.warn('Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:', e);
    }
  } else if (privateKey && clientEmail) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n')
        }),
        projectId
      });
      return admin;
    } catch (e) {
      console.warn('Failed to initialize with FIREBASE_PRIVATE_KEY:', e);
    }
  }

  // Attempt application default credentials or minimal project initialization
  try {
    admin.initializeApp({ projectId });
    return admin;
  } catch (e) {
    console.warn('Firebase Admin default initialization error:', e);
    return null;
  }
}

export default async function handler(req, res) {
  // CORS & method check
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, password, phone, hostel, inviteCode, uid: clientUid } = req.body || {};

  const cleanName = (name || '').trim();
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPhone = (phone || '').trim();
  const cleanHostel = (hostel || 'Aravali Residence Hall').trim();
  const cleanCode = (inviteCode || '').trim();

  // Strict request validation
  if (!cleanName || cleanName.length < 2 || cleanName.length > 80) {
    return res.status(400).json({ error: 'Full legal name must be between 2 and 80 characters.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!cleanEmail || !emailRegex.test(cleanEmail) || cleanEmail.length > 100) {
    return res.status(400).json({ error: 'A valid institutional email address is required.' });
  }

  if (!password || password.length < 8 || password.length > 128) {
    return res.status(400).json({ error: 'Password must be between 8 and 128 characters.' });
  }

  if (!cleanCode || cleanCode.length > 128) {
    return res.status(400).json({ error: 'Institutional Warden Invitation Code is required.' });
  }

  // Institutional Secret Validation (WARDEN_INVITE_CODE)
  // Server-side ONLY. Must be set in deployment environment. Never hardcoded.
  const expectedInviteCode = process.env.WARDEN_INVITE_CODE;

  if (!expectedInviteCode) {
    return res.status(500).json({
      error: 'Warden registration service is temporarily unavailable. Institutional authorization secret is not configured on the server.'
    });
  }

  // Verify invitation code
  if (cleanCode !== expectedInviteCode) {
    return res.status(403).json({
      error: 'Invalid or unauthorized institutional warden invitation code. Administrator onboarding access denied.'
    });
  }

  // Valid invitation code confirmed! Now create/authorize the warden profile.
  let wardenUid = clientUid || null;

  const adminApp = getFirebaseAdmin();

  if (adminApp) {
    try {
      const authAdmin = adminApp.auth();
      const firestoreAdmin = adminApp.firestore();

      if (!wardenUid) {
        // Create user in Firebase Auth server-side
        try {
          const userRecord = await authAdmin.createUser({
            email: cleanEmail,
            password: password,
            displayName: cleanName
          });
          wardenUid = userRecord.uid;
        } catch (authErr) {
          if (authErr.code === 'auth/email-already-exists') {
            const existing = await authAdmin.getUserByEmail(cleanEmail);
            wardenUid = existing.uid;
          } else {
            throw authErr;
          }
        }
      }

      // Set custom claims for role: 'warden'
      await authAdmin.setCustomUserClaims(wardenUid, { role: 'warden' });

      // Create official users/{uid} document with role: "warden"
      const profileData = {
        uid: wardenUid,
        name: cleanName,
        email: cleanEmail,
        role: 'warden',
        phone: cleanPhone || '+91 98000 00000',
        hostel: cleanHostel,
        block: 'Administration',
        roomNumber: 'Office-01',
        bedNumber: 'N/A',
        status: 'active',
        createdAt: new Date().toISOString()
      };

      await firestoreAdmin.collection('users').doc(wardenUid).set(profileData, { merge: true });

      return res.status(200).json({
        success: true,
        uid: wardenUid,
        email: cleanEmail,
        role: 'warden',
        profile: profileData,
        message: 'Warden administrator account successfully created and authorized.'
      });
    } catch (adminErr) {
      console.error('Firebase Admin operation error:', adminErr);
      // Fall through to fallback handler if Admin SDK had permission issue
    }
  }

  // Fallback: If service account is not yet configured in server environment,
  // we can use Firebase Auth REST API with the Web API Key
  const apiKey = process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY || 'AIzaSyCKZIGqWceKfPef9ZO5E4-NX4rGujgAbF8';
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || 'smart-hostel-and-mess';

  try {
    let idToken = null;

    if (!wardenUid) {
      if (!password || password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters.' });
      }

      // Create user via Firebase Auth REST API
      const authRes = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            password: password,
            returnSecureToken: true
          })
        }
      );

      const authData = await authRes.json();
      if (!authRes.ok) {
        if (authData.error?.message === 'EMAIL_EXISTS') {
          return res.status(400).json({ error: 'An account with this email address already exists. Please log in.' });
        }
        return res.status(400).json({ error: authData.error?.message || 'Authentication creation failed.' });
      }

      wardenUid = authData.localId;
      idToken = authData.idToken;
    }

    const profileData = {
      uid: wardenUid,
      name: cleanName,
      email: cleanEmail,
      role: 'warden',
      phone: cleanPhone || '+91 98000 00000',
      hostel: cleanHostel,
      block: 'Administration',
      roomNumber: 'Office-01',
      bedNumber: 'N/A',
      status: 'active',
      createdAt: new Date().toISOString()
    };

    // Store in Firestore via REST API
    try {
      const restDocUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${wardenUid}`;
      const firestoreBody = {
        fields: {
          uid: { stringValue: wardenUid },
          name: { stringValue: cleanName },
          email: { stringValue: cleanEmail },
          role: { stringValue: 'warden' },
          phone: { stringValue: cleanPhone || '+91 98000 00000' },
          hostel: { stringValue: cleanHostel },
          block: { stringValue: 'Administration' },
          roomNumber: { stringValue: 'Office-01' },
          bedNumber: { stringValue: 'N/A' },
          status: { stringValue: 'active' },
          createdAt: { stringValue: new Date().toISOString() }
        }
      };

      const headers = { 'Content-Type': 'application/json' };
      if (idToken) {
        headers['Authorization'] = `Bearer ${idToken}`;
      }

      await fetch(restDocUrl, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(firestoreBody)
      });
    } catch (fsErr) {
      console.warn('Firestore REST write warning:', fsErr);
    }

    return res.status(200).json({
      success: true,
      uid: wardenUid,
      email: cleanEmail,
      role: 'warden',
      profile: profileData,
      message: 'Warden administrator account successfully created and authorized.'
    });
  } catch (err) {
    console.error('Server error during warden registration:', err);
    return res.status(500).json({ error: 'Server error during warden registration. Please check server logs.' });
  }
}
