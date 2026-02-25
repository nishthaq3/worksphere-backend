import express from "express";
import {register} from "../controllers/authController.js";
import {validateRegister} from "../middlewares/authMiddleware.js";
import {login} from "../controllers/authController.js";
import { validateLogin } from "../middlewares/authMiddleware.js";

const router=express.Router();

router.post("/register",validateRegister,register);
router.post("/login",validateLogin,login);
//middelware=>controller

export default router;