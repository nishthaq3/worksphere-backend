import express from "express";
import { createProjectController } from "../controllers/projectController.js";
import {protect, authorize} from "../middlewares/verifyMiddleware.js";
import { getProjectsController } from "../controllers/projectController.js";
import { assignManagerController } from "../controllers/projectController.js";

const router=express.Router()

//create proj:admin
router.post(
	"/",
	protect,
	authorize("admin"),
	createProjectController
);

router.get(
	"/",
	protect,
	getProjectsController
  );

router.patch(
  "/:id/assign-manager",
  protect,
  authorize("admin"),
  assignManagerController
);


export default router;