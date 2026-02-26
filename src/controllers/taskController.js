import {
	createTask,
	getTasksByProject,
	getTaskById,
	updateTask,
	deleteTask,
} from "../services/taskServices.js";
import { asyncHandler } from "../utils/errorHandler.js";
import { successResponse } from "../utils/apiResponse.js";

// POST /api/tasks
export const createTaskController = asyncHandler(async (req, res) => {
	const task = await createTask(req.body, req.user._id);
	return successResponse(res, 201, "Task created successfully", task);
});

// GET /api/tasks/project/:projectId
export const getTasksByProjectController = asyncHandler(async (req, res) => {
	const { page, limit, status } = req.query;
	const result = await getTasksByProject(req.params.projectId, req.user, {
		page,
		limit,
		status,
	});
	return successResponse(res, 200, "Tasks retrieved successfully", result);
});

// GET /api/tasks/:id
export const getTaskByIdController = asyncHandler(async (req, res) => {
	const task = await getTaskById(req.params.id, req.user);
	return successResponse(res, 200, "Task retrieved successfully", task);
});

// PATCH /api/tasks/:id
export const updateTaskController = asyncHandler(async (req, res) => {
	const task = await updateTask(req.params.id, req.body, req.user);
	return successResponse(res, 200, "Task updated successfully", task);
});

// DELETE /api/tasks/:id
export const deleteTaskController = asyncHandler(async (req, res) => {
	const result = await deleteTask(req.params.id, req.user);
	return successResponse(res, 200, result.message, null);
});
