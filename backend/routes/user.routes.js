import express from "express";
import {
  getCurrentUser,
  updateMobile,
  updateUserLocation,
} from "../controllers/user.controllers.js";
import isAuth from "../middlewares/isAuth.js";

const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);
userRouter.post("/update-location", isAuth, updateUserLocation);
userRouter.post("/update-mobile", isAuth, updateMobile);

export default userRouter;
