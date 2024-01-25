import { Request, Response } from "express";
import userModel from "../models/userModel";
import workout from "../models/workoutModel";
import mongoose from "mongoose";

//get all users in my database
const getUsers = async (req: Request, res: Response) => {
  const data = await userModel.find({}).sort({ createdAt: -1 });
  const users = data.map((user: any) => ({
    _id: user._id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  }));
  res.status(200).json(users);
};

//delete Basic Users
const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No Such User Found" });
  }

  if (role == "Admin") {
    return res
      .status(401)
      .json({ error: "Admin user can only be removed by super Admin" });
  }

  const data = await userModel.findOneAndDelete({ _id: id });
  !data
    ? res.status(404).json({ error: "No Such UserFound" })
    : res.status(200).json(data);
};

//get workouts
const getAdminWorkouts = (req: Request, res: Response) => {};

export { getUsers, getAdminWorkouts, deleteUser };
