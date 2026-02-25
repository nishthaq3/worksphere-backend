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