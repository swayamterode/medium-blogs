import { Hono } from "hono";
import { signinController } from "../controller/auth/signin.controller";
import { signupController } from "../controller/auth/signup.controller";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.post("/signup", signupController);
userRouter.post("/signin", signinController);
