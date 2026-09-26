// Vercel Serverless Function: /api/warden/register
// NOTE: Server-side ONLY. API keys and invitation secrets are never exposed to client-side code.

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  return res.end(JSON.stringify(payload));
}

export default async function handler(req, res) {
  try {
    // CORS & method check
    if (req.method === 'OPTIONS') {
      res.statusCode = 200;
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      return res.end();
    }

    if (req.method !== 'POST') {
      return sendJson(res, 405, {
        success: false,
        message: 'Method Not Allowed. Warden registration requires POST.'
      });
    }

    // Safely parse body if not pre-parsed
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return sendJson(res, 400, {
          success: false,
          message: 'Invalid JSON request payload.'
        });
      }
    }
    body = body || {};

    const { name, email, password, phone, hostel, inviteCode, uid: clientUid } = body;

    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = (phone || '').trim();
    const cleanHostel = (hostel || 'Aravali Residence Hall').trim();
    const cleanCode = (inviteCode || '').trim();

    // 1. Validation
    if (!cleanName || cleanName.length < 2 || cleanName.length > 80) {
      return sendJson(res, 400, {
        success: false,
        message: 'Full legal name must be between 2 and 80 characters.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail) || cleanEmail.length > 100) {
      return sendJson(res, 400, {
        success: false,
        message: 'A valid institutional email address is required.'
      });
    }

    if (!password || password.length < 8 || password.length > 128) {
      return sendJson(res, 400, {
        success: false,
        message: 'Password must be between 8 and 128 characters.'
      });
    }

    if (!cleanCode || cleanCode.length > 128) {
      return sendJson(res, 400, {
        success: false,
        message: 'Institutional Warden Invitation Code is required.'
      });
    }

    // 2. Institutional Secret Validation (WARDEN_INVITE_CODE)
    // Server-side ONLY. Must be set in deployment environment. Never hardcoded.
    const expectedInviteCode = process.env.WARDEN_INVITE_CODE;

    if (!expectedInviteCode) {
      return sendJson(res, 500, {
        success: false,
        message: 'Warden registration service is not configured.'
      });
    }

    if (cleanCode !== expectedInviteCode) {
      return sendJson(res, 403, {
        success: false,
        message: 'Invalid institutional invitation code.'
      });
    }

    // 3. Valid invitation code confirmed! Now create/authorize the warden profile.
    let wardenUid = clientUid || null;

    // Optional: Firebase Admin SDK if service account is provided in server environment
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || 'smart-hostel-and-mess';

    if (serviceAccountJson || (privateKey && clientEmail)) {
      try {
        const adminModule = await import('firebase-admin');
        const admin = adminModule.default;

        if (admin.apps.length === 0) {
          if (serviceAccountJson) {
            const parsed = JSON.parse(serviceAccountJson);
            admin.initializeApp({
              credential: admin.credential.cert(parsed),
              projectId: parsed.project_id || projectId
            });
          } else {
            admin.initializeApp({
              credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey: privateKey.replace(/\\n/g, '\n')
              }),
              projectId
            });
          }
        }

        const authAdmin = admin.auth();
        const firestoreAdmin = admin.firestore();

        if (!wardenUid) {
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

        await authAdmin.setCustomUserClaims(wardenUid, { role: 'warden' });

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

        return sendJson(res, 200, {
          success: true,
          message: 'Warden registration completed.'
        });
      } catch (adminErr) {
        console.error('Firebase Admin operation error:', adminErr?.message || adminErr);
        return sendJson(res, 500, {
          success: false,
          message: 'Warden registration service is temporarily unavailable.'
        });
      }
    }

    // Standard Server-Side REST flow (Vercel Production Safe)
    const apiKey = process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY || 'AIzaSyCKZIGqWceKfPef9ZO5E4-NX4rGujgAbF8';

    try {
      let idToken = null;

      if (!wardenUid) {
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
            return sendJson(res, 400, {
              success: false,
              message: 'An account with this email address already exists. Please log in.'
            });
          }
          return sendJson(res, 400, {
            success: false,
            message: 'Authentication service rejected the registration request.'
          });
        }

        wardenUid = authData.localId;
        idToken = authData.idToken;
      }

      // Store warden profile in Firestore via REST API
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

      return sendJson(res, 200, {
        success: true,
        message: 'Warden registration completed.'
      });
    } catch (restErr) {
      console.error('REST auth flow error:', restErr?.message || restErr);
      return sendJson(res, 500, {
        success: false,
        message: 'Warden registration service is temporarily unavailable.'
      });
    }
  } catch (globalErr) {
    console.error('Unexpected error in /api/warden/register:', globalErr?.message || globalErr);
    return sendJson(res, 500, {
      success: false,
      message: 'Warden registration service is temporarily unavailable.'
    });
  }
}
