import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Task title is required"],
			trim: true,
		},
		description: {
			type: String,
			trim: true,
			default: "",
		},
		status: {
			type: String,
			enum: {
				values: ["todo", "in-progress", "done"],
				message: "Status must be one of: todo, in-progress, done",
			},
			default: "todo",
		},
		priority: {
			type: String,
			enum: {
				values: ["low", "medium", "high"],
				message: "Priority must be one of: low, medium, high",
			},
			default: "medium",
		},
		project: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Project",
			required: [true, "Project reference is required"],
		},
		assignedTo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Creator reference is required"],
		},
		dueDate: {
			type: Date,
			default: null,
		},
	},
	{
		timestamps: true,
	}
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
