import {body,validationResult} from "express-validator";

export const validateLogin = [
	body("email")
	  .notEmpty()
	  .withMessage("Email is required")
	  .isEmail()
	  .withMessage("Invalid email format"),
  
	body("password")
	  .notEmpty()
	  .withMessage("Password is required"),
  
	(req, res, next) => {
	  const errors = validationResult(req);
	  if (!errors.isEmpty()) {
		return res.status(400).json({
		  success: false,
		  errors: errors.array()
		});
	  }
	  next();
	}
  ];

  
export const validateRegister=[
	body("name")
	.notEmpty()
	.withMessage("Name is required"),

	body("email")
	.notEmpty()
	.withMessage("Email is required")
	.isEmail()
	.withMessage("Invalid email format"),

	body("password")
	.notEmpty()
	.withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number"),

  	body("role")
    .optional()
    .isIn(["admin", "manager", "employee"])
    .withMessage("Invalid role"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
	  });
	}
	next()
}
];