import express from "express";
import {
	createTaskController,
	getTasksByProjectController,
	getTaskByIdController,
	updateTaskController,
	deleteTaskController,
} from "../controllers/taskController.js";
import { protect, authorize } from "../middlewares/verifyMiddleware.js";
import { validateCreateTask, validateUpdateTask } from "../middlewares/taskValidator.js";
import { validateObjectId } from "../middlewares/objectIdValidator.js";

const router = express.Router();

// POST /api/tasks  – admin, manager
router.post(
	"/",
	protect,
	authorize("admin", "manager"),
	validateCreateTask,
	createTaskController
);

// GET /api/tasks/project/:projectId  – all authenticated
router.get(
	"/project/:projectId",
	protect,
	validateObjectId("projectId"),
	getTasksByProjectController
);

// GET /api/tasks/:id  – all authenticated
router.get(
	"/:id",
	protect,
	validateObjectId("id"),
	getTaskByIdController
);

// PATCH /api/tasks/:id  – all authenticated (role-scoped inside service)
router.patch(
	"/:id",
	protect,
	validateObjectId("id"),
	validateUpdateTask,
	updateTaskController
);

// DELETE /api/tasks/:id  – admin, manager
router.delete(
	"/:id",
	protect,
	authorize("admin", "manager"),
	validateObjectId("id"),
	deleteTaskController
);

export default router;
