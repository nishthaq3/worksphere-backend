import express from "express";
import { createProjectController } from "../controllers/projectController.js";
import {protect, authorize} from "../middlewares/verifyMiddleware.js";

const router=express.Router()

//create proj:admin
router.post(
	"/",
	protect,
	authorize("admin"),
	createProjectController
);
export default router;