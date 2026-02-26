import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { globalErrorHandler } from "./utils/errorHandler.js";

const app = express();

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet());

// CORS – allow frontend origin (update in production)
const allowedOrigins = [
	"http://localhost:5173", // Vite dev server
	"http://localhost:3000", // CRA dev server
	process.env.FRONTEND_URL, // production frontend URL
].filter(Boolean);

app.use(
	cors({
		origin: (origin, callback) => {
			// Allow requests with no origin (mobile apps, Postman, curl)
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		credentials: true,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

// Rate limiter – global
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100,
	message: {
		success: false,
		message: "Too many requests from this IP, please try again after 15 minutes",
	},
	standardHeaders: true,
	legacyHeaders: false,
});
app.use(limiter);

// Stricter rate limit on auth endpoints
const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 10,
	message: {
		success: false,
		message: "Too many login/register attempts. Please try again after 15 minutes.",
	},
	standardHeaders: true,
	legacyHeaders: false,
});

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ─── NoSQL Injection & XSS Prevention ────────────────────────────────────────
app.use(mongoSanitize());
app.use(xss());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/api/health", (req, res) => {
	res.status(200).json({
		success: true,
		message: "WorkSphere API is running",
		environment: process.env.NODE_ENV,
		timestamp: new Date().toISOString(),
	});
});

// 404 handler for unknown routes
app.use((req, res) => {
	res.status(404).json({
		success: false,
		message: `Route ${req.method} ${req.originalUrl} not found`,
	});
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(globalErrorHandler);

export default app;