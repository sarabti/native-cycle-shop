import { Router } from "express";
import {
  createNewUser,
  sendProfile,
  signIn,
  verifyEmail,
} from "controllers/auth";
import validate from "src/middlewares/validator";
import { newUserSchema, verifyTokenSchema } from "src/utils/validationSchema";
import { isAuth } from "src/middlewares/auth";

const authRouter = Router();

authRouter.post("/sign-up", validate(newUserSchema), createNewUser);
authRouter.post("/verify", validate(verifyTokenSchema), verifyEmail);
authRouter.post("/sign-in", signIn);
authRouter.get("/profile", isAuth, sendProfile);

export default authRouter;
