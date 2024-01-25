import express from "express";
import { deleteUser, getUsers } from "../controllers/adminControler";
import requireAuth from "../middlewares/requireAuth";

const adminRouter = express.Router();

//get users
adminRouter.use(requireAuth);
adminRouter.get("/users", getUsers);

//delete
adminRouter.delete("/users/:id", deleteUser);

export default adminRouter;
