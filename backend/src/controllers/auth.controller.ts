import { Request, Response } from "express";
import { savePassword, verifyPassword } from "../utils/passHash";
import userModel, { IUser } from "../models/user.model";
import { createToken } from "../utils/auth.token";

const registerUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, username, password } = req.body;
    const hashedPassword = await savePassword(password);
    const user: IUser = new userModel({
      email: email,
      username: username,
      password: hashedPassword,
    });
    await user.save();
    return res.status(201).json({
      message: "new user registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "error registering user",
    });
  }
};

const loginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    //find the user in db
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "No user found",
      });
    }

    const passwordMatch = await verifyPassword(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    const token = await createToken(user._id);
    return res.status(200).json({ token });
  } catch (error) {
    console.error("error logging in", error);
    return res.status(500).json({
      message: "internal server error. Please try again later",
    });
  }
};

export { registerUser, loginUser };
