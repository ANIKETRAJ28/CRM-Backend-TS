import { Router } from "express";

import { RegisterController } from "../../controller/register.controller";

const registerController = new RegisterController();

export const registerRoute = Router();

registerRoute.post("/email/:email", registerController.registerUser);
registerRoute.post("/otp/:otp", registerController.updateRegisterUserByOTP);
