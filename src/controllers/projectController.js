import {
  createProject,
  getProjects,
  assignManager,
} from "../services/projectServices.js";
import { asyncHandler } from "../utils/errorHandler.js";
import { successResponse } from "../utils/apiResponse.js";

// POST /api/projects  – admin only
export const createProjectController = asyncHandler(async (req, res) => {
  const project = await createProject(req.body, req.user._id);
  return successResponse(res, 201, "Project created successfully", project);
});

// GET /api/projects  – all authenticated (role-scoped)
export const getProjectsController = asyncHandler(async (req, res) => {
  const projects = await getProjects(req.user);
  return successResponse(res, 200, "Projects retrieved successfully", projects);
});

// PATCH /api/projects/:id/assign-manager  – admin only
export const assignManagerController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { managerId } = req.body;
  const project = await assignManager(id, managerId);
  return successResponse(res, 200, "Manager assigned successfully", project);
});