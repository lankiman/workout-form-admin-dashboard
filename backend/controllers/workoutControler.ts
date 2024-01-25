import workoutModel from "../models/workoutModel";
import { Request, Response } from "express";
import mongoose from "mongoose";

// get all workouts
const getWorkouts = async (req: Request, res: Response) => {
  const user_id = (req as any).user._id;
  let query = {};
  if (req.params.userid) {
    query = { user_id: req.params.userid };
    const workouts = await workoutModel.find(query).sort({ createdAt: -1 });
    res.status(200).json(workouts);
    return;
  }
  const workouts = await workoutModel.find({ user_id }).sort({ createdAt: -1 });
  res.status(200).json(workouts);
};

//get a single workout

const getWorkout = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No Such Workout Found" });
  }
  const workout = await workoutModel.findById(id);
  !workout
    ? res.status(404).json({ error: "No Such Workout Found" })
    : res.status(200).json(workout);
};

//create new workout
const createWorkout = async (req: Request, res: Response) => {
  const { tittle, load, reps } = req.body;

  let emptyFields: string[] = [];

  if (!tittle) {
    emptyFields.push("tittle");
  }
  if (!load) {
    emptyFields.push("load");
  }
  if (!reps) {
    emptyFields.push("reps");
  }

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please Fill in all the feilds", emptyFields });
  }

  try {
    const user_id = (req as any).user._id;
    const workout = await workoutModel.create({ tittle, load, reps, user_id });
    res.status(200).json(workout);
  } catch (error) {
    res.status(400).json(error);
  }
};

//delete a workout
const deleteWorkout = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No Such Workout Found" });
  }

  const workout = await workoutModel.findOneAndDelete({ _id: id });
  !workout
    ? res.status(404).json({ error: "No Such Workout Found" })
    : res.status(200).json(workout);
};

//update a workout
const updateWorkout = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No Such Workout Found" });
  }
  const workout = await workoutModel.findOneAndUpdate(
    { _id: id },
    {
      ...req.body
    }
  );
  !workout
    ? res.status(404).json({ error: "No Such Workout Found" })
    : res.status(200).json(workout);
};

//exports
export { createWorkout, getWorkouts, getWorkout, deleteWorkout, updateWorkout };
