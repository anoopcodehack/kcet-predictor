import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { connectDB } from './server/config/db.js';
import predictorRoutes from './server/routes/predictorRoutes.js';
import collegeRoutes from './server/routes/collegeRoutes.js';
import analyticsRoutes from './server/routes/analyticsRoutes.js';
import authRoutes from './server/routes/authRoutes.js';

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env');
let packageRootEnvPath = '';
try {
  const metaUrl = import.meta.url;
  if (metaUrl) {
    packageRootEnvPath = path.resolve(path.dirname(fileURLToPath(metaUrl)), '.env');
  } else if (typeof __dirname !== 'undefined') {
    packageRootEnvPath = path.resolve(__dirname, '.env');
  }
} catch (e) {
  // Ignored in bundled environments
}

const result = dotenv.config({ path: envPath });
if (result.error) {
  if (packageRootEnvPath && fs.existsSync(packageRootEnvPath)) {
    dotenv.config({ path: packageRootEnvPath });
    console.log(`Loaded .env from ${packageRootEnvPath}`);
  } else {
    console.warn(`No .env found at ${envPath} or fallback path`);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize DB Connection
  const connected = await connectDB();
  console.log(`Database Mode: ${connected ? 'MongoDB' : 'In-Memory Engine'}`);

  // Middlewares
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Custom lightweight cookie parser for cross-origin iframe support
  app.use((req: any, res, next) => {
    const cookieHeader = req.headers.cookie || '';
    req.cookies = {};
    cookieHeader.split(';').forEach((c: string) => {
      const parts = c.split('=');
      if (parts.length === 2) {
        req.cookies[parts[0].trim()] = parts[1].trim();
      }
    });
    next();
  });

  // API Routes (Mounted BEFORE Vite static fallback middleware)
  app.use('/api', predictorRoutes);
  app.use('/api', collegeRoutes);
  app.use('/api', analyticsRoutes);
  app.use('/api', authRoutes);

  // Simple API Healthcheck
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date(),
      database: connected ? 'MongoDB (Connected)' : 'In-Memory Fallback Active'
    });
  });

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    console.log('Starting server in DEVELOPMENT mode...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('Starting server in PRODUCTION mode...');
    const distPath = path.join(process.cwd(), 'dist');
    // Serve static frontend assets
    app.use(express.static(distPath));
    // SPA fallback route
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`==================================================`);
    console.log(`🚀 KCET PREDICTOR SERVER RUNNING`);
    console.log(`🌐 Address: http://localhost:${PORT}`);
    console.log(`📦 Node Env: ${process.env.NODE_ENV || 'development'}`);
    console.log(`==================================================`);
  });
}

startServer().catch((error) => {
  console.error('Fatal error starting server:', error);
});
