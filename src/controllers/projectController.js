import { createProject } from "../services/projectServices.js";
import { getProjects } from "../services/projectServices.js";
import { assignManager } from "../services/projectServices.js";

export const createProjectController = async (req, res) => {
  try {
    const project = await createProject(req.body, req.user._id);

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getProjectsController = async (req, res) => {
	try {
	  const projects = await getProjects(req.user);
  
	  return res.status(200).json({
		success: true,
		data: projects
	  });
  
	} catch (error) {
	  return res.status(400).json({
		success: false,
		message: error.message
	  });
	}
  };
  export const assignManagerController = async (req, res) => {
    try {
      const { id } = req.params;
      const { managerId } = req.body;
  
      const project = await assignManager(id, managerId);
  
      return res.status(200).json({
        success: true,
        message: "Manager assigned successfully",
        data: project
      });
  
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };