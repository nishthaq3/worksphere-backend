import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./src/app.js";

dotenv.config();
const PORT=process.env.PORT || 8000;

//connecting database

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
	console.log("MongoDB Connected successfully");

	app.listen(PORT,()=>{
		console.log(`Server running on port ${PORT}`);
	});
})
.catch((error)=>{
	console.log("Failed to connect to MongoDB",error);
})
