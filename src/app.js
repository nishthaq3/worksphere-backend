import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

const app=express();

//middlewares
app.use(helmet());

app.use(cors());

const limiter=rateLimit({
	windowMs: 15*60*1000,
	max: 100,
	message: "Too many requests, Please try again later"
});
app.use(limiter);

app.use(express.json());

app.use(mongoSanitize());

app.use(xss());

app.use("/api/auth",authRoutes);
app.use("/api/projects", projectRoutes);


app.get("/api/health",(req,res)=>{
	res.status(200).json({
		success: true,
		message: "Worksphere API is running"
	});
})
export default app;