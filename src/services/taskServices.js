import Task from "../models/Task.js";
import Project from "../models/Project.js";
import { AppError } from "../utils/errorHandler.js";

// Create a task – admin or manager only
export const createTask = async (data, userId) => {
	const { title, description, status, priority, project, assignedTo, dueDate } = data;

	// Ensure the project exists
	const existingProject = await Project.findById(project);
	if (!existingProject) {
		throw new AppError("Project not found", 404);
	}

	const task = await Task.create({
		title,
		description,
		status,
		priority,
		project,
		assignedTo: assignedTo || null,
		createdBy: userId,
		dueDate: dueDate || null,
	});

	return task;
};

// Get all tasks for a project – role-scoped with pagination and filter
export const getTasksByProject = async (projectId, user, options = {}) => {
	const { page = 1, limit = 10, status } = options;
	const skip = (page - 1) * limit;

	const project = await Project.findById(projectId);
	if (!project) {
		throw new AppError("Project not found", 404);
	}

	let query = { project: projectId };

	// Status filtering
	if (status) {
		query.status = status;
	}

	// Employees only see tasks assigned to them
	if (user.role === "employee") {
		query.assignedTo = user._id;
	}

	const tasks = await Task.find(query)
		.populate("assignedTo", "name email role")
		.populate("createdBy", "name email role")
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(limit);

	const total = await Task.countDocuments(query);

	return {
		tasks,
		pagination: {
			total,
			page: Number(page),
			limit: Number(limit),
			pages: Math.ceil(total / limit),
		},
	};
};

// Get a single task by ID
export const getTaskById = async (taskId, user) => {
	const task = await Task.findById(taskId)
		.populate("assignedTo", "name email role")
		.populate("createdBy", "name email role")
		.populate("project", "name description status");

	if (!task) {
		throw new AppError("Task not found", 404);
	}

	// Employees can only view tasks assigned to them
	if (
		user.role === "employee" &&
		task.assignedTo?._id.toString() !== user._id.toString()
	) {
		throw new AppError("Forbidden: you do not have access to this task", 403);
	}

	return task;
};

// Update a task – role-scoped field access
export const updateTask = async (taskId, data, user) => {
	const task = await Task.findById(taskId);
	if (!task) {
		throw new AppError("Task not found", 404);
	}

	// Employees can only update the status of tasks assigned to them
	if (user.role === "employee") {
		if (task.assignedTo?.toString() !== user._id.toString()) {
			throw new AppError("Forbidden: you can only update tasks assigned to you", 403);
		}
		// Restrict employee to only update status field
		const allowedFields = ["status"];
		const requestedFields = Object.keys(data);
		const hasDisallowedFields = requestedFields.some(
			(field) => !allowedFields.includes(field)
		);
		if (hasDisallowedFields) {
			throw new AppError("Employees can only update the task status", 403);
		}
	}

	// Managers can only update tasks in their projects
	if (user.role === "manager") {
		const project = await Project.findById(task.project);
		if (!project || project.manager?.toString() !== user._id.toString()) {
			throw new AppError(
				"Forbidden: you can only update tasks in your projects",
				403
			);
		}
	}

	const updatedTask = await Task.findByIdAndUpdate(
		taskId,
		{ $set: data },
		{ new: true, runValidators: true }
	)
		.populate("assignedTo", "name email role")
		.populate("createdBy", "name email role");

	return updatedTask;
};

// Delete a task – admin or manager only
export const deleteTask = async (taskId, user) => {
	const task = await Task.findById(taskId);
	if (!task) {
		throw new AppError("Task not found", 404);
	}

	// Managers can only delete tasks in their projects
	if (user.role === "manager") {
		const project = await Project.findById(task.project);
		if (!project || project.manager?.toString() !== user._id.toString()) {
			throw new AppError(
				"Forbidden: you can only delete tasks in your projects",
				403
			);
		}
	}

	await Task.findByIdAndDelete(taskId);
	return { message: "Task deleted successfully" };
};
