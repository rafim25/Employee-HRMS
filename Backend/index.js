import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

import bodyParser from 'body-parser';
import db, { testConnection } from "./config/Database.js";
import initializeDatabase from "./config/initDb.js";
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

const app = express();
dotenv.config();

// Remove other database initialization code and replace with:
(async () => {
    try {
        await initializeDatabase();
        console.log("✅ Database initialized successfully");
    } catch (error) {
        console.error("❌ Failed to initialize database:", error);
    }
})();

// Authenticate and sync DB
(async () => {
  try {
    await db.authenticate();
    console.log('✅ Database connected...');
    await db.sync({ alter: true });
    console.log('✅ Database synchronized...');
  } catch (error) {
    console.error('❌ Error syncing database:', error);
  }
})();

// Start Server Function
const startServer = async () => {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error("❌ Failed to start server due to DB connection issues");
      process.exit(1);
    }

    const sessionStore = SequelizeStore(session.Store);
    const store = new sessionStore({ db });
    await store.sync();
    console.log("✅ Session store synchronized");

    const server = app.listen(process.env.APP_PORT || 3002, () => {
      console.log(`✅ Server is running on port ${process.env.APP_PORT || 3002}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV}`);
    });

    server.timeout = 60000;
    server.keepAliveTimeout = 65000;
    server.headersTimeout = 66000;

    // Setup CORS
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

    // Express session
    app.use(session({
      secret: process.env.SESS_SECRET,
      resave: false,
      saveUninitialized: true,
      store,
      cookie: {
        secure: false, // true if using HTTPS
        httpOnly: true
      }
    }));

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

    console.log("✅ Server boot complete.");
  } catch (error) {
    console.error("❌ Server startup error:", error);
    process.exit(1);
  }
};

startServer().catch(console.error);
