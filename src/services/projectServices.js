import Project from "../models/Project.js";

export const createProject=async(data,userId)=>{
	const{name,description}=data;

	//create project
	const project=await Project.create({
		name,
		description,
		createdBy: userId
	});
	return project;
}
//view projects: admin can view any and all projects
export const getProjects=async(user)=>{
	let projects;

	if(user.role=="admin"){
		projects=await Project.find()
		.populate("manager","name email role")
		.populate("employees","name email role");
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