import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db, { testConnection } from "./config/Database.js";

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

const app = express();
dotenv.config();

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

    // CORS Middleware
    app.use(
      cors({
        origin:
          process.env.NODE_ENV === "production"
            ? [
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
      })
    );

    // Middleware for parsing JSON and handling sessions
    app.use(express.json());
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
    app.use(FileUpload());
    app.use(express.static("public"));

    // Routes
    app.use("/api", EmailRoute); // Mount email routes first
    app.use(UserRoute);
    app.use(AuthV2Route);
    app.use(ExpenseRoute);

    // Add this to your routes section
    app.use(LoanRoute);
    app.use(DashBoardRoute);

    // Add this to your routes section
    app.use(TransactionRoute);
    app.use(DataJabatanRoute);
    app.use(AuthRoute);
    app.use(DataKehadiranRoute);
    app.use(EmployeeRoute);

    // 404 Handler
    app.use((req, res) => {
      res.status(404).json({ error: "Route not found", path: req.path });
    });

    console.log("process.env.APP_POR------->T", process.env);

    // Start the server
    const PORT = process.env.APP_PORT || 3002;
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 CORS enabled for: ${process.env.CORS_ORIGIN}`);
    });
  } catch (error) {
    console.error("❌ Server startup error:", error);
    process.exit(1);
  }
};

// Start the server
startServer().catch(console.error);
