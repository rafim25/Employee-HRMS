import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

import bodyParser from 'body-parser';
import db, { testConnection } from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";

import UserRoute from "./routes/UserRoute.js";
import DataJabatanRoute from "./routes/DataJabatanRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import DataKehadiranRoute from "./routes/DataKehadiranRoute.js";
import ExpenseRoute from "./routes/expenseRoutes.js";
import LoanRoute from "./routes/LoanRoute.js";
import TransactionRoute from "./routes/TransactionRoute.js";
import DashBoardRoute from "./routes/DashboardRoute.js";
import AuthV2Route from "./routes/AuthV2Route.js";
import EmployeeRoute from "./routes/EmployeeRoute.js";
import EmailRoute from "./routes/EmailRoute.js";
import jobRoutes from "./routes/jobRoutes.js";
import skillRoute from "./routes/skillRoute.js";
import { syncModels } from "./models/index.js";
import candidateRoutes from './routes/CandidateRoute.js';
import UploadRoute from './routes/UploadRoute.js';
import EmployeeJobRoutes from "./routes/EmployeeJobRoutes.js";
import EmployeeCandidateRoutes from "./routes/EmployeeCandidateRoutes.js";
import locationRoutes from './routes/LocationRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables BEFORE importing other modules
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ 
  path: path.join(__dirname, envFile)
});

// Verify environment variables are loaded
console.log('🔧 Environment Check:');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`DB_HOST: ${process.env.DB_HOST}`);
console.log(`DB_PORT: ${process.env.DB_PORT}`);
console.log(`DB_NAME: ${process.env.DB_NAME}`);

// Now import database and other modules

const app = express();

// Define allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://13.60.189.178',
  'http://13.60.189.178:3002',
  'http://13.60.189.178:5173'
];

// CORS middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy violation'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie']
}));

// JSON middleware
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Check database connection
    await db.authenticate();
    
    // Return health status
    res.json({
      status: 'healthy',
      timestamp: new Date(),
      uptime: process.uptime(),
      database: 'connected',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date(),
      uptime: process.uptime(),
      database: 'disconnected',
      error: error.message,
      environment: process.env.NODE_ENV || 'development'
    });
  }
});

// Configure session store
const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
  db: db,
  tableName: 'sessions',
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: 24 * 60 * 60 * 1000
});

// Ensure the session table exists
await store.sync();

// Session configuration
const sessionConfig = {
  secret: process.env.SESS_SECRET || 'your-secret-key',
  resave: true,
  saveUninitialized: false,
  store: store,
  name: 'connect.sid',
  proxy: true,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/'
  }
};

// Session middleware
app.use(session(sessionConfig));

// Conditionally apply body-parser (important for multer compatibility)
app.use((req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.startsWith('multipart/form-data')) {
    return next(); // skip bodyParser for file uploads
  }
  bodyParser.json()(req, res, () => {
    bodyParser.urlencoded({ extended: true })(req, res, next);
  });
});

// Logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Static files
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Mount routes
app.use("/api", EmailRoute);
app.use(UserRoute);
app.use(AuthV2Route);
app.use("/api", ExpenseRoute);
app.use(LoanRoute);
app.use(DashBoardRoute);
app.use(TransactionRoute);
app.use(DataJabatanRoute);
app.use(AuthRoute);
app.use(DataKehadiranRoute);
app.use(EmployeeRoute);
app.use(UploadRoute);
app.use(jobRoutes);
app.use('/api/skills', skillRoute);
app.use(candidateRoutes);
app.use(EmployeeJobRoutes);
app.use(EmployeeCandidateRoutes);
app.use(locationRoutes);

// Add session debugging middleware
app.use((req, res, next) => {
  console.log('🔍 Request:', {
    url: req.url,
    method: req.method,
    sessionID: req.sessionID,
    hasSession: !!req.session,
    userId: req.session?.userId
  });
  next();
});

// Update auth check middleware
const authCheck = async (req, res, next) => {
  console.log('🔒 Auth Check:', {
    url: req.url,
    sessionID: req.sessionID,
    session: req.session,
    userId: req.session?.userId
  });

  if (!req.session || !req.session.userId) {
    return res.status(401).json({ msg: "Please login to your account!" });
  }

  try {
    // Verify session in database
    const sessionData = await store.get(req.sessionID);
    if (!sessionData) {
      return res.status(401).json({ msg: "Session expired, please login again" });
    }
    next();
  } catch (error) {
    console.error('Session verification error:', error);
    res.status(500).json({ msg: "Error verifying session" });
  }
};

// Apply auth check to protected routes
app.use('/api/dashboard/*', authCheck);

// Add session check endpoint for debugging
app.get('/api/auth/check', (req, res) => {
  res.json({
    authenticated: !!req.session?.userId,
    sessionID: req.sessionID,
    userId: req.session?.userId,
    role: req.session?.role
  });
});

// 404 Handler
app.use((req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ msg: "Route not found", path: req.url });
});

const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Start the server
    const PORT = process.env.APP_PORT || 3002;
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`✅ Health check available at: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    sessionId: req.sessionID
  });

  if (err.message.includes('CORS')) {
    return res.status(403).json({
      error: 'CORS Error',
      message: 'Origin not allowed'
    });
  }

  if (err.message.includes('session')) {
    return res.status(401).json({
      error: 'Session Error',
      message: 'Session invalid or expired'
    });
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();
