import { createProject } from "../services/projectServices.js";

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