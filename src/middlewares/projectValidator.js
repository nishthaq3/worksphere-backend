import { body, param, validationResult } from "express-validator";

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

export const validateCreateProject = [
	body("name")
		.notEmpty()
		.withMessage("Project name is required")
		.isLength({ min: 2, max: 100 })
		.withMessage("Project name must be between 2 and 100 characters"),

	body("description")
		.notEmpty()
		.withMessage("Project description is required")
		.isLength({ max: 500 })
		.withMessage("Description must not exceed 500 characters"),

	body("status")
		.optional()
		.isIn(["active", "completed"])
		.withMessage("Status must be one of: active, completed"),

	handleValidationErrors,
];

export const validateUpdateProject = [
	body("name")
		.optional()
		.isLength({ min: 2, max: 100 })
		.withMessage("Project name must be between 2 and 100 characters"),

	body("description")
		.optional()
		.isLength({ max: 500 })
		.withMessage("Description must not exceed 500 characters"),

	body("status")
		.optional()
		.isIn(["active", "completed"])
		.withMessage("Status must be one of: active, completed"),

	handleValidationErrors,
];
