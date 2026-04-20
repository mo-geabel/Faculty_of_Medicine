import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./_lib/Routers/AnnouncementRouter.js";
import EmergencyRouter from "./_lib/Routers/EmergencyRouter.js";
import MembersRouter from "./_lib/Routers/MemberRoutes.js";
import AssistantRouter from "./_lib/Routers/AssistantRouter.js";
import LoginRouter from "./_lib/Routers/UserRouter.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    // Allow all vercel.app domains and localhost
    if (
      origin.endsWith(".vercel.app") ||
      origin.startsWith("http://localhost") ||
      origin.startsWith("http://127.0.0.1")
    ) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
  methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true,
};
app.use(cors(corsOptions));

// Handle preflight OPTIONS requests
app.options("*", cors(corsOptions));


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debugging: Log incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// MongoDB Connection
const PORT = process.env.PORT || 5000;

let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes
app.use("/api", router);
app.use("/api/emergency", EmergencyRouter);
app.use("/api/members", MembersRouter);
app.use("/api/assistant", AssistantRouter);
app.use("/api/login", LoginRouter);

// Local server (only if not on Vercel)
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  });
}

export default app;
