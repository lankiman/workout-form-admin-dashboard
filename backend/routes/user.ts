import express from "express";
import { signupUser, loginUser } from "../controllers/userControler";

const userRouter = express.Router();

//login route
userRouter.post("/login", loginUser);

//sign up route
userRouter.post("/signup", signupUser);

export default userRouter;
