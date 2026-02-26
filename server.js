import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

// Connect to MongoDB then start the server
connectDB().then(() => {
	app.listen(PORT, () => {
		console.log(`🚀 WorkSphere server running on port ${PORT}`);
		console.log(`📡 Environment: ${process.env.NODE_ENV}`);
	});
});
