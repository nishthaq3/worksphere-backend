import User from "../models/Users.js";
import Project from "../models/Project.js";
import { AppError } from "../utils/errorHandler.js";

// Get a user's own profile
export const getProfile = async (userId) => {
	const user = await User.findById(userId).select("-password");
	if (!user) {
		throw new AppError("User not found", 404);
	}
	return user;
};

// List all users – admin only (with pagination and search)
export const getAllUsers = async (options = {}) => {
	const { page = 1, limit = 10, search } = options;
	const skip = (page - 1) * limit;

	let query = {};
	if (search) {
		query.name = { $regex: search, $options: "i" };
	}

	const users = await User.find(query)
		.select("-password")
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(limit);

	const total = await User.countDocuments(query);

	return {
		users,
		pagination: {
			total,
			page: Number(page),
			limit: Number(limit),
			pages: Math.ceil(total / limit),
		},
	};
};

// Get all employees – admin or manager (with pagination and search)
export const getAllEmployees = async (options = {}) => {
	const { page = 1, limit = 10, search } = options;
	const skip = (page - 1) * limit;

	let query = { role: "employee" };
	if (search) {
		query.name = { $regex: search, $options: "i" };
	}

	const employees = await User.find(query)
		.select("-password")
		.sort({ name: 1 })
		.skip(skip)
		.limit(limit);

	const total = await User.countDocuments(query);

	return {
		employees,
		pagination: {
			total,
			page: Number(page),
			limit: Number(limit),
			pages: Math.ceil(total / limit),
		},
	};
};

// Get all managers – admin only
export const getAllManagers = async () => {
	const managers = await User.find({ role: "manager" })
		.select("-password")
		.sort({ name: 1 });
	return managers;
};

// Assign an employee to a project (prevent duplicates)
export const assignEmployeeToProject = async (projectId, employeeId) => {
	const project = await Project.findById(projectId);
	if (!project) {
		throw new AppError("Project not found", 404);
	}

	const employee = await User.findById(employeeId);
	if (!employee) {
		throw new AppError("User not found", 404);
	}

	if (employee.role !== "employee") {
		throw new AppError("Only users with the employee role can be assigned to projects", 400);
	}

	// Prevent duplicate assignment
	const alreadyAssigned = project.employees.some(
		(emp) => emp.toString() === employeeId.toString()
	);
	if (alreadyAssigned) {
		throw new AppError("Employee is already assigned to this project", 409);
	}

	project.employees.push(employeeId);
	await project.save();

	return project.populate([
		{ path: "manager", select: "name email role" },
		{ path: "employees", select: "name email role" },
	]);
};

// Remove an employee from a project
export const removeEmployeeFromProject = async (projectId, employeeId) => {
	const project = await Project.findById(projectId);
	if (!project) {
		throw new AppError("Project not found", 404);
	}

	const isAssigned = project.employees.some(
		(emp) => emp.toString() === employeeId.toString()
	);
	if (!isAssigned) {
		throw new AppError("Employee is not assigned to this project", 400);
	}

	project.employees = project.employees.filter(
		(emp) => emp.toString() !== employeeId.toString()
	);
	await project.save();

	return project.populate([
		{ path: "manager", select: "name email role" },
		{ path: "employees", select: "name email role" },
	]);
};

// Delete a project – admin only, prevents deletion if tasks exist
export const deleteProject = async (projectId) => {
	const { default: Task } = await import("../models/Task.js");

	const project = await Project.findById(projectId);
	if (!project) {
		throw new AppError("Project not found", 404);
	}

	// Prevent deletion if tasks are still linked to the project
	const taskCount = await Task.countDocuments({ project: projectId });
	if (taskCount > 0) {
		throw new AppError(
			`Cannot delete project: ${taskCount} task(s) still exist. Remove tasks first.`,
			400
		);
	}

	await Project.findByIdAndDelete(projectId);
	return { message: "Project deleted successfully" };
};
