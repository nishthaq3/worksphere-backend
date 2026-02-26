import express from "express";
import { createProjectController } from "../controllers/projectController.js";
import { protect, authorize } from "../middlewares/verifyMiddleware.js";
import { getProjectsController } from "../controllers/projectController.js";
import { assignManagerController } from "../controllers/projectController.js";
import {
	validateCreateProject,
	validateUpdateProject,
} from "../middlewares/projectValidator.js";
import { validateObjectId } from "../middlewares/objectIdValidator.js";

const router = express.Router();

// POST /api/projects  – admin only
router.post(
	"/",
	protect,
	authorize("admin"),
	validateCreateProject,
	createProjectController
);

// GET /api/projects  – all authenticated (role-scoped in service)
router.get("/", protect, getProjectsController);

// PATCH /api/projects/:id/assign-manager  – admin only
router.patch(
	"/:id/assign-manager",
	protect,
	authorize("admin"),
	validateObjectId("id"),
	assignManagerController
);

export default router;