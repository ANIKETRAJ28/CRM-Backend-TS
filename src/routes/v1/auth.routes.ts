import { Router } from "express";
import { AuthController } from "../../controller/auth.controller";
import { jwtMiddleware, logout } from "../../middleware/auth.middleware";
import { getUserInfo } from "../../middleware/auth.middleware";

const authController = new AuthController();

export const authRouter = Router();

authRouter.get("/", getUserInfo);
authRouter.get("/logout", logout);
authRouter.post("/signup", authController.signup);
authRouter.post("/signin", authController.signIn);
authRouter.post("/org/switch/:orgId", jwtMiddleware, authController.switchOrg);
