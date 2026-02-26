import express from "express";
import {
	getProfileController,
	getAllUsersController,
	getAllEmployeesController,
	getAllManagersController,
	assignEmployeeController,
	removeEmployeeController,
	deleteProjectController,
} from "../controllers/userController.js";
import { protect, authorize } from "../middlewares/verifyMiddleware.js";
import { validateObjectId } from "../middlewares/objectIdValidator.js";
import { body, validationResult } from "express-validator";
import mongoose from "mongoose";

const router = express.Router();

// Inline validator for assign/remove body fields
const validateAssignBody = [
	body("projectId")
		.notEmpty()
		.withMessage("projectId is required")
		.custom((v) => {
			if (!mongoose.Types.ObjectId.isValid(v)) throw new Error("Invalid projectId");
			return true;
		}),
	body("employeeId")
		.notEmpty()
		.withMessage("employeeId is required")
		.custom((v) => {
			if (!mongoose.Types.ObjectId.isValid(v)) throw new Error("Invalid employeeId");
			return true;
		}),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(400).json({ success: false, errors: errors.array() });
		next();
	},
];

// GET /api/users/profile  – all authenticated
router.get("/profile", protect, getProfileController);

// GET /api/users  – admin only
router.get("/", protect, authorize("admin"), getAllUsersController);

// GET /api/users/employees  – admin, manager
router.get(
	"/employees",
	protect,
	authorize("admin", "manager"),
	getAllEmployeesController
);

// GET /api/users/managers  – admin only
router.get("/managers", protect, authorize("admin"), getAllManagersController);

// POST /api/users/assign-employee  – admin, manager
router.post(
	"/assign-employee",
	protect,
	authorize("admin", "manager"),
	validateAssignBody,
	assignEmployeeController
);

// DELETE /api/users/remove-employee  – admin, manager
router.delete(
	"/remove-employee",
	protect,
	authorize("admin", "manager"),
	validateAssignBody,
	removeEmployeeController
);

// DELETE /api/users/projects/:id  – admin only (with task guard in service)
router.delete(
	"/projects/:id",
	protect,
	authorize("admin"),
	validateObjectId("id"),
	deleteProjectController
);

export default router;
