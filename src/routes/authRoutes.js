import express from "express";
import {register} from "../controllers/authController.js";
import {validateRegister} from "../middlewares/authMiddleware.js";

const router=express.Router();

router.post("/register",validateRegister,register);
//middelware=>controller

export default router;