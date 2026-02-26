import {
	getProfile,
	getAllUsers,
	getAllEmployees,
	getAllManagers,
	assignEmployeeToProject,
	removeEmployeeFromProject,
	deleteProject,
} from "../services/userServices.js";
import { asyncHandler } from "../utils/errorHandler.js";
import { successResponse } from "../utils/apiResponse.js";

// GET /api/users/profile
export const getProfileController = asyncHandler(async (req, res) => {
	const user = await getProfile(req.user._id);
	return successResponse(res, 200, "Profile retrieved successfully", user);
});

// GET /api/users  (admin only)
export const getAllUsersController = asyncHandler(async (req, res) => {
	const { page, limit, search } = req.query;
	const result = await getAllUsers({ page, limit, search });
	return successResponse(res, 200, "Users retrieved successfully", result);
});

// GET /api/users/employees  (admin, manager)
export const getAllEmployeesController = asyncHandler(async (req, res) => {
	const { page, limit, search } = req.query;
	const result = await getAllEmployees({ page, limit, search });
	return successResponse(res, 200, "Employees retrieved successfully", result);
});

// GET /api/users/managers  (admin only)
export const getAllManagersController = asyncHandler(async (req, res) => {
	const managers = await getAllManagers();
	return successResponse(res, 200, "Managers retrieved successfully", managers);
});

// POST /api/users/assign-employee
export const assignEmployeeController = asyncHandler(async (req, res) => {
	const { projectId, employeeId } = req.body;
	const project = await assignEmployeeToProject(projectId, employeeId);
	return successResponse(res, 200, "Employee assigned to project successfully", project);
});

// DELETE /api/users/remove-employee
export const removeEmployeeController = asyncHandler(async (req, res) => {
	const { projectId, employeeId } = req.body;
	const project = await removeEmployeeFromProject(projectId, employeeId);
	return successResponse(res, 200, "Employee removed from project successfully", project);
});

// DELETE /api/users/projects/:id  (admin only)
export const deleteProjectController = asyncHandler(async (req, res) => {
	const result = await deleteProject(req.params.id);
	return successResponse(res, 200, result.message, null);
});
