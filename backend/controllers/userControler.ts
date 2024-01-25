import { Request, Response } from "express";
import User from "../models/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const createToken = (_id: string) => {
  return jwt.sign({ _id }, process.env.SECRET!, { expiresIn: "3d" });
};

const adminToken = (token: string) => {
  return jwt.sign({ token }, process.env.SECRET!, { expiresIn: "1h" });
};

const hashAdminToken = async () => {
  const adminToken = process.env.ADMIN_TOKEN!;
  const salt = await bcrypt.genSalt(10);
  const hashedToken = await bcrypt.hash(adminToken, salt);
  return hashedToken;
};

// login user
const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    if (user.role == "Admin") {
      const adminSecret = await hashAdminToken();
      const token = createToken(user._id as any as string);
      const adminTk = adminToken(adminSecret as any as string);
      res.status(200).json({ email, adminTk, role: user.role });
    } else {
      const user = await User.login(email, password);
      const token = createToken(user._id as any as string);
      res.status(200).json({ email, token, role: user.role });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

// signup user
const signupUser = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  const { authorization } = req.headers;
  const adminSecret = await hashAdminToken();

  if (role == "Admin" && !authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }
  const authToken = authorization!.split(" ")[1];

  try {
    if (role == "Admin") {
      const match = await bcrypt.compare(authToken, adminSecret);
      if (match) {
        const user = await User.signup(email, password, role);
        const token = createToken(user._id as any as string);
        const adminTk = adminToken(authToken as any as string);
        res.status(200).json({ email, adminTk, role: user.role });
        return;
      } else {
        throw new Error("Invalid Authetincation Token");
      }
    }
    const user = await User.signup(email, password, role);
    const token = createToken(user._id as any as string);
    res.status(200).json({ email, token, role: user.role });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export { loginUser, signupUser };
