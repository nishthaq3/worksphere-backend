import mongoose from "mongoose";

// Validates a single route param by name is a valid MongoDB ObjectId
export const validateObjectId = (paramName = "id") => {
	return (req, res, next) => {
		const id = req.params[paramName];
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({
				success: false,
				message: `Invalid ${paramName}: must be a valid MongoDB ObjectId`,
			});
		}
		next();
	};
};
