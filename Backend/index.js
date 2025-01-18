import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";

import SequelizeStore from "connect-session-sequelize";
import FileUpload from "express-fileupload";

import UserRoute from "./routes/UserRoute.js";
import DataJabatanRoute from "./routes/DataJabatanRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import DataKehadiranRoute from "./routes/DataKehadiranRoute.js";

import LoanRoute from "./routes/LoanRoute.js";
import TransactionRoute from "./routes/TransactionRoute.js";
import DashBoardRoute from "./routes/DashboardRoute.js";

import AuthV2Route from "./routes/AuthV2Route.js";

const app = express();
dotenv.config();

const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
  db: db,
});

// CORS Middleware
app.use(
  cors({
    origin: ["http://localhost:3002", "http://localhost:5173"], // Add all your frontend URLs
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Allow credentials (cookies)
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"], // Expose custom headers if needed
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

// File upload and static files
app.use(FileUpload());
app.use(express.static("public"));

// Routes
app.use(UserRoute);

app.use(AuthV2Route);

// Add this to your routes section
app.use(LoanRoute);
app.use(DashBoardRoute);

// Add this to your routes section
app.use(TransactionRoute);
app.use(DataJabatanRoute);
app.use(AuthRoute);
app.use(DataKehadiranRoute);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found", path: req.path });
});

console.log("process.env.APP_POR------->T", process.env);

// Start the server
app.listen(process.env.APP_PORT, () => {
  console.log(`Server running on port... ${process.env.APP_PORT}`);
});
