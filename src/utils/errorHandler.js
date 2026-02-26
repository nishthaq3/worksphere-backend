// Custom operational error class
export class AppError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = true;
		Error.captureStackTrace(this, this.constructor);
	}
}

// Wraps async controller functions to eliminate repetitive try/catch
export const asyncHandler = (fn) => (req, res, next) => {
	Promise.resolve(fn(req, res, next)).catch(next);
};

// Global error handling middleware – register LAST in app.js
export const globalErrorHandler = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.message = err.message || "Internal Server Error";

	// Mongoose duplicate key error
	if (err.code === 11000) {
		const field = Object.keys(err.keyValue)[0];
		err.statusCode = 409;
		err.message = `${field} already exists`;
	}

	// Mongoose validation error
	if (err.name === "ValidationError") {
		err.statusCode = 400;
		err.message = Object.values(err.errors)
			.map((e) => e.message)
			.join(", ");
	}

	// Mongoose cast error (bad ObjectId)
	if (err.name === "CastError") {
		err.statusCode = 400;
		err.message = `Invalid ${err.path}: ${err.value}`;
	}

	// JWT errors
	if (err.name === "JsonWebTokenError") {
		err.statusCode = 401;
		err.message = "Invalid token";
	}
	if (err.name === "TokenExpiredError") {
		err.statusCode = 401;
		err.message = "Token expired, please log in again";
	}

	return res.status(err.statusCode).json({
		success: false,
		message: err.message,
		...(process.env.NODE_ENV === "development" && { stack: err.stack }),
	});
};
