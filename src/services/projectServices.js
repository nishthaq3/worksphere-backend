import Project from "../models/Project.js";
import User from "../models/Users.js";

export const createProject = async (data, userId) => {
	const { name, description } = data;

	//create project
	const project = await Project.create({
		name,
		description,
		createdBy: userId
	});
	return project;
}
//view projects: admin can view any and all projects
export const getProjects = async (user) => {
	let projects;

	if (user.role == "admin") {
		projects = await Project.find()
			.populate("manager", "name email role")
			.populate("employees", "name email role");
	}
	else if (user.role === "manager") {
		//manager only sees his projects
		projects = await Project.find({ manager: user._id })
			.populate("manager", "name email role")
			.populate("employees", "name email role");
	}

	else {
		//employee only sees projects assigned to them
		projects = await Project.find({ employees: user._id })
			.populate("manager", "name email role")
			.populate("employees", "name email role");
	}
	return projects;
}

//assigning a manager
export const assignManager = async (projectId, managerId) => {
	//check project exists
	//check if user exits
	//check if role is manager
	const project = await Project.findById(projectId);
	if (!project) {
		throw new Error("Project not found. Please create Project first!")
	}

	const user = await User.findById(managerId);
	if (!user) {
		throw new Error("User not found");
	}

	if (user.role !== "manager") {
		throw new Error("Sorry! Can only assign projects to managers")
	}

	//assign manager
	project.manager = managerId;
	await project.save();

	return project;
}