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
import db, { testConnection } from "./config/Database.js";

const app = express();

// CORS middleware
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL || 'http://localhost:5173'
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
  tableName: 'sessions', // Explicitly name the sessions table
  checkExpirationInterval: 15 * 60 * 1000, // Clean up expired sessions every 15 minutes
  expiration: 24 * 60 * 60 * 1000  // Sessions expire after 24 hours
});

// Create the sessions table if it doesn't exist
store.sync();

// Session middleware
app.use(session({
  secret: process.env.SESS_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false, // Changed to false for better security
  store: store,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Only use secure in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },
  name: 'sid' // Change the cookie name from 'connect.sid' to something less obvious
}));

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

// 404 Handler
app.use((req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ msg: "Route not found", path: req.url });
});

const PORT = process.env.APP_PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Start the server
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
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something broke!',
    timestamp: new Date()
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
