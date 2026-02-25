import brcypt from "bcrypt";
import User from "../models/Users.js";

export const registerUser=async(data)=>{
	const {name,email,password,role}=data;

	//check if user exists
	const existingUser=await User.findOne({email});
	if(existingUser){
		throw new Error("User with this email already exists!");
	}

	//hash pass
	const hashedPass=await brcypt.hash(password,10);

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