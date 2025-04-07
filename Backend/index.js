import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import multer from 'multer';
import fileUpload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';

import bodyParser from 'body-parser';
import db, { testConnection } from "./config/Database.js";
import initializeDatabase from "./config/initDb.js";

import SequelizeStore from "connect-session-sequelize";
import FileUpload from "express-fileupload";

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

// Import job and skill routes
import jobRoutes from "./routes/jobRoutes.js";
import skillRoute from "./routes/skillRoute.js";
import { syncModels } from "./models/index.js";
import candidateRoutes from './routes/CandidateRoute.js';
import UploadRoute from './routes/UploadRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();

// Initialize database without dropping tables
(async () => {
  try {
    await syncModels();
    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize database:", error);
  }
})();

// Sync database with models
(async()=>{
    try {
        await db.authenticate();
        console.log('Database connected...');
        
        // Force true will drop and recreate tables
        await db.sync({ alter: true });
        console.log('Database synchronized...');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
})();

// Test database connection before starting the server
const startServer = async () => {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error(
        "❌ Failed to start server due to database connection issues"
      );
      process.exit(1);
    }

    // Initialize session store
    const sessionStore = SequelizeStore(session.Store);
    const store = new sessionStore({
      db: db,
    });

    // Sync the session store
    await store.sync();
    console.log("✅ Session store synchronized");

    // Create Express app with timeout
    const server = app.listen(process.env.APP_PORT || 3002, () => {
      console.log(
        `✅ Server is running on port ${process.env.APP_PORT || 3002}`
      );
      console.log(`📝 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 CORS enabled for: ${process.env.CORS_ORIGIN}`);
    });

    // Set server timeout to 60 seconds
    server.timeout = 60000;
    server.keepAliveTimeout = 65000;
    server.headersTimeout = 66000;

    // CORS Middleware
    app.use(cors({
      origin: process.env.NODE_ENV === "production"
        ? [
          "https://raghaveliteprojects.com",
          "http://raghaveliteprojects.com",
          "http://172.105.59.206:5173",
          "http://172.105.59.206:3002",
          "http://localhost:5173",
          "http://localhost:3002",
        ]
        : [
          "http://172.105.59.206:5173",
          "http://172.105.59.206:3002",
          "http://localhost:5173",
          "http://localhost:3002",
        ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin",
      ],
      exposedHeaders: ["Authorization"],
    }));

    // Middleware for parsing JSON and handling sessions
    app.use((req, res, next) => {
      if (req.path.startsWith('/api/upload')) {
        next();
      } else {
        bodyParser.json()(req, res, next);
      }
    });

    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(
      session({
        secret: process.env.SESS_SECRET,
        resave: false,
        saveUninitialized: true,
        store: store,
        cookie: {
          secure: false, // Set to true in production with HTTPS
          httpOnly: true, // Prevent JavaScript access to cookies
        },
      })
    );

    // Request logging middleware
    app.use((req, res, next) => {
      console.log(`${req.method} ${req.path}`);
      next();
    });

    // File upload and static files
    app.use(fileUpload({
      createParentPath: true,
      limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
      },
      abortOnLimit: true
    }));

    // Serve static files
    app.use('/images', express.static(path.join(__dirname, 'public/images')));

    // Add multer configuration here (add this before your routes)
    const storage = multer.memoryStorage();
    const upload = multer({
      storage: storage,
      limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
      }
    });

    // Routes
    app.use("/api", EmailRoute); // Mount email routes first
    app.use(UserRoute);
    app.use(AuthV2Route);
    app.use("/api", ExpenseRoute);

    // Add this to your routes section
    app.use(LoanRoute);
    app.use(DashBoardRoute);

    // Add this to your routes section
    app.use(TransactionRoute);
    app.use(DataJabatanRoute);
    app.use(AuthRoute);
    app.use(DataKehadiranRoute);
    app.use(EmployeeRoute);
    app.use(UploadRoute);

    // Add job and skill routes
    app.use(jobRoutes);
    app.use('/api/skills', skillRoute);
    app.use(candidateRoutes);
    // Add before your routes
    app.use((req, res, next) => {
      console.log(`${req.method} ${req.url}`);
      next();
    });

    // Add after your routes
    app.use((req, res) => {
      console.log(`Route not found: ${req.method} ${req.url}`);
      res.status(404).json({ msg: "Route not found", path: req.url });
    });

    console.log("process.env.APP_POR------->T", process.env);
  } catch (error) {
    console.error("❌ Server startup error:", error);
    process.exit(1);
  }
};

// Start the server
startServer().catch(console.error);
