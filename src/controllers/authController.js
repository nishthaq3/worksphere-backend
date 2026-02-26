import { registerUser, loginUser } from "../services/authServices.js";
import { asyncHandler } from "../utils/errorHandler.js";
import { successResponse } from "../utils/apiResponse.js";

export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);
  return successResponse(res, 201, "User registered successfully", user);
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  return successResponse(res, 200, "Login successful", result);
});