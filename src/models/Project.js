import mongoose from "mongoose";

const projectSchema= new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Project name is required"],
			trim: true
		  },
		  description: {
			type: String,
			required: [true, "Project description is required"],
			trim: true
		  },
		  status: {
			type: String,
			enum: ["active", "completed"],
			default: "active"
		  },
		  createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true
		  },
		  manager: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null
		  },
		  employees: [
			{
			  type: mongoose.Schema.Types.ObjectId,
			  ref: "User"
			}
		  ]
	},
	{
		timestamps: true
	}
);

const Project = mongoose.model("Project",projectSchema);
export default Project;