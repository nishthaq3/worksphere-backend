import bcrypt from "bcrypt";
import User from "../models/Users.js";
import jwt from "jsonwebtoken";

export const registerUser=async(data)=>{
	const {name,email,password,role}=data;

	//check if user exists
	const existingUser=await User.findOne({email});
	if(existingUser){
		throw new Error("User with this email already exists!");
	}

	//hash pass
	const hashedPass=await bcrypt.hash(password,10);

	//create user
	const user=await User.create({
		name,
		email,
		password: hashedPass,
		role
	});

	const userObject=user.toObject();
	delete userObject.password;

	return userObject;
}

export const loginUser = async (data) => {
  const { email, password } = data;

  //find user with email and passs
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("Invalid email or password");
  }

  //compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  //generate JWT
  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );

  const userObject = user.toObject();
  delete userObject.password;

  return { user: userObject, token };
};