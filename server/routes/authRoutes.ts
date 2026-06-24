import express from 'express';
import crypto from 'crypto';
import { dbService } from '../config/db.js';

const router = express.Router();

// Helper to hash passwords securely using PBKDF2
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

// Generate secure random token
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Helper to construct Google Redirect URI
const getRedirectUri = (req: express.Request) => {
  const hostUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  return `${hostUrl.replace(/\/$/, '')}/auth/callback`;
};

// 1. Register with Email/Password
router.post('/auth/register', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const existing = await dbService.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = hashPassword(password, salt);

    const newUser = await dbService.createUser({
      email: email.toLowerCase(),
      password: hashedPassword,
      salt,
      name,
    });

    // Create session
    const token = generateToken();
    await dbService.createSession(token, newUser.email);

    // Set Session Cookie for cross-origin preview iframe compatibility
    res.cookie('session_token', token, {
      secure: true,
      sameSite: 'none',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      token,
      user: {
        email: newUser.email,
        name: newUser.name,
        picture: newUser.picture
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// 2. Login with Email/Password
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    const user = await dbService.getUserByEmail(email);
    if (!user || !user.password || !user.salt) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const hashedPassword = hashPassword(password, user.salt);
    if (hashedPassword !== user.password) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Create session
    const token = generateToken();
    await dbService.createSession(token, user.email);

    // Set Session Cookie with SameSite=None & Secure for Iframe support
    res.cookie('session_token', token, {
      secure: true,
      sameSite: 'none',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      token,
      user: {
        email: user.email,
        name: user.name,
        picture: user.picture
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// 3. Current User Profile check
router.get('/auth/me', async (req, res) => {
  // Read token from authorization header or cookie
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '') || req.cookies?.session_token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not logged in' });
  }

  try {
    const session = await dbService.getSession(token);
    if (!session) {
      return res.status(401).json({ success: false, message: 'Session expired' });
    }

    const user = await dbService.getUserByEmail(session.userEmail);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
        picture: user.picture
      }
    });
  } catch (error: any) {
    console.error('Check user session error:', error);
    res.status(500).json({ success: false, message: 'Server error check session' });
  }
});

// 4. Logout Session
router.post('/auth/logout', async (req, res) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '') || req.cookies?.session_token;

  if (token) {
    try {
      await dbService.deleteSession(token);
    } catch (e) {
      console.error('Error deleting session:', e);
    }
  }

  res.clearCookie('session_token', {
    secure: true,
    sameSite: 'none',
    httpOnly: true
  });

  res.json({ success: true, message: 'Successfully logged out' });
});

// 5. Fetch Google OAuth Authorization URL
router.get('/auth/google/url', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = getRedirectUri(req);

  // If Client Credentials are not yet set up, return a direct sandbox trigger URL
  if (!clientId || !process.env.GOOGLE_CLIENT_SECRET) {
    console.log('Google Client Credentials are not set in environment. Falling back to sandbox...');
    const sandboxUrl = `${req.protocol}://${req.get('host')}/auth/callback?sandbox=true`;
    return res.json({ url: sandboxUrl, isSandbox: true });
  }

  const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state: 'google-oauth',
    prompt: 'select_account'
  });

  res.json({ url: `${googleAuthUrl}?${params.toString()}`, isSandbox: false });
});

// 6. Google OAuth Redirect Callback Handler (Supports both real OAuth and high-fidelity Sandbox fallback)
router.get(['/auth/callback', '/auth/callback/'], async (req, res) => {
  const { code, sandbox } = req.query;

  try {
    let email = '';
    let name = '';
    let picture = '';
    let googleId = '';

    if (sandbox === 'true' || (!process.env.GOOGLE_CLIENT_ID && !code)) {
      // High-Fidelity Sandbox Mode: Simulate a successful Google Authentication sign-in
      console.log('Sign-in requested via Google OAuth Sandbox Mode...');
      email = 'student.sandbox@gmail.com';
      name = 'KCET Sandbox Student';
      picture = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80';
      googleId = 'sandbox-1234567890';
    } else {
      // Real Google OAuth code exchange
      if (!code) {
        throw new Error('Authorization code missing from Google OAuth query params');
      }

      const tokenUrl = 'https://oauth2.googleapis.com/token';
      const redirectUri = getRedirectUri(req);

      const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code: code as string,
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        }).toString()
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        throw new Error(`Google Token Exchange failed: ${errorText}`);
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // Fetch user profile from Google's Userinfo endpoint
      const userinfoUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';
      const userinfoResponse = await fetch(userinfoUrl, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (!userinfoResponse.ok) {
        throw new Error('Failed to retrieve user profile info from Google');
      }

      const profile = await userinfoResponse.json();
      email = profile.email;
      name = profile.name || profile.given_name || 'Google User';
      picture = profile.picture || '';
      googleId = profile.sub;
    }

    // Find or register the user in the database
    let user = await dbService.getUserByEmail(email);
    if (!user) {
      user = await dbService.createUser({
        email: email.toLowerCase(),
        name,
        googleId,
        picture,
      });
    }

    // Generate secure session token
    const token = generateToken();
    await dbService.createSession(token, user.email);

    // Write SameSite=None secure cookie to support iframe embedded context
    res.cookie('session_token', token, {
      secure: true,
      sameSite: 'none',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Send successful postMessage to parent window and close popup window safely
    const serializedUser = JSON.stringify({ email: user.email, name: user.name, picture: user.picture });
    res.send(`
      <html>
        <head>
          <title>Authentication Successful</title>
          <style>
            body { font-family: system-ui, sans-serif; text-align: center; padding: 50px; background-color: #f9f9f9; }
            .spinner { border: 4px solid rgba(0,0,0,0.1); width: 36px; height: 36px; border-radius: 50%; border-left-color: #000; animation: spin 1s linear infinite; margin: 20px auto; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <h2>Login Successful!</h2>
          <p>Redirecting you back to KCET Predictor Hub...</p>
          <div class="spinner"></div>
          <script>
            try {
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'OAUTH_AUTH_SUCCESS', 
                  token: ${JSON.stringify(token)},
                  user: ${serializedUser}
                }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            } catch (err) {
              console.error('Error communicating with parent window:', err);
              window.location.href = '/';
            }
          </script>
        </body>
      </html>
    `);
  } catch (error: any) {
    console.error('Google callback auth error:', error);
    res.status(500).send(`
      <html>
        <body style="font-family: sans-serif; padding: 40px; text-align: center;">
          <h2 style="color: #d32f2f;">Authentication Failed</h2>
          <p>${error.message || 'Server error encountered during Google authentication callback.'}</p>
          <button onclick="window.close()" style="padding: 10px 20px; font-weight: bold; background: #000; color: #fff; border: none; cursor: pointer;">Close Window</button>
        </body>
      </html>
    `);
  }
});

export default router;
