import { body, param, validationResult } from "express-validator";
import mongoose from "mongoose";

// Middleware to collect and return validation errors
export const handleValidationErrors = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			success: false,
			errors: errors.array(),
		});
	}
	next();
};

export const validateCreateTask = [
	body("title")
		.notEmpty()
		.withMessage("Task title is required")
		.isLength({ min: 2, max: 200 })
		.withMessage("Title must be between 2 and 200 characters"),

	body("description")
		.optional()
		.isLength({ max: 1000 })
		.withMessage("Description must not exceed 1000 characters"),

	body("status")
		.optional()
		.isIn(["todo", "in-progress", "done"])
		.withMessage("Status must be one of: todo, in-progress, done"),

	body("priority")
		.optional()
		.isIn(["low", "medium", "high"])
		.withMessage("Priority must be one of: low, medium, high"),

	body("project")
		.notEmpty()
		.withMessage("Project ID is required")
		.custom((value) => {
			if (!mongoose.Types.ObjectId.isValid(value)) {
				throw new Error("Project ID must be a valid MongoDB ObjectId");
			}
			return true;
		}),

	body("assignedTo")
		.optional()
		.custom((value) => {
			if (value && !mongoose.Types.ObjectId.isValid(value)) {
				throw new Error("assignedTo must be a valid MongoDB ObjectId");
			}
			return true;
		}),

	body("dueDate")
		.optional()
		.isISO8601()
		.withMessage("dueDate must be a valid ISO 8601 date"),

	handleValidationErrors,
];

export const validateUpdateTask = [
	body("title")
		.optional()
		.isLength({ min: 2, max: 200 })
		.withMessage("Title must be between 2 and 200 characters"),

	body("description")
		.optional()
		.isLength({ max: 1000 })
		.withMessage("Description must not exceed 1000 characters"),

	body("status")
		.optional()
		.isIn(["todo", "in-progress", "done"])
		.withMessage("Status must be one of: todo, in-progress, done"),

	body("priority")
		.optional()
		.isIn(["low", "medium", "high"])
		.withMessage("Priority must be one of: low, medium, high"),

	body("assignedTo")
		.optional()
		.custom((value) => {
			if (value && !mongoose.Types.ObjectId.isValid(value)) {
				throw new Error("assignedTo must be a valid MongoDB ObjectId");
			}
			return true;
		}),

	body("dueDate")
		.optional()
		.isISO8601()
		.withMessage("dueDate must be a valid ISO 8601 date"),

	handleValidationErrors,
];
