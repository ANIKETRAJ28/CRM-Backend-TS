import { CookieOptions, Request, Response } from "express";
import { RegisterService } from "../service/register.service";
import { IRegister } from "../interface/register.interface";
import { createOtpToken, createProfileToken } from "../utils/jwt.util";
import {
  BadRequest,
  Created,
  InternalServerError,
  sendResponse,
} from "../utils/api.util";
import { getOtpInfo } from "../middleware/auth.middleware";
import { FRONTEND_URL } from "../config/env.config";

export class RegisterController {
  private registerService: RegisterService;

  constructor() {
    this.registerService = new RegisterService();
  }

  registerUser = async (req: Request, res: Response) => {
    try {
      const email = req.params.email;
      if (!email) {
        throw new BadRequest("Email is required");
      }
      const user: IRegister = await this.registerService.registerUser(email);
      console.log("url...", FRONTEND_URL);
      const options = {
        domain: FRONTEND_URL, // Only allow this domain
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true, // Don't expose cookie to JS
        secure: true, // Required for HTTPS (Render uses HTTPS)
        sameSite: "none", // Or "None" if frontend/backend are on different subdomains
        path: "/",
      } as CookieOptions;
      if (user.isRegistered) {
        const profileToken = createProfileToken({ email: user.email });
        res.cookie("PROFILE", profileToken, options);
        sendResponse(
          res,
          new Created("User already registered, create profile", {
            step: "profile",
          })
        );
      } else {
        const otpToken = createOtpToken({ email: user.email });
        res.cookie("OTP", otpToken, options);
        sendResponse(
          res,
          new Created("Verify OTP", {
            step: "otp",
          })
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        sendResponse(res, new InternalServerError("Error", error.message));
      } else {
        sendResponse(res, new InternalServerError("Error", error));
      }
    }
  };

  updateRegisterUserByOTP = async (req: Request, res: Response) => {
    try {
      const emailData = getOtpInfo(req, res);
      if (!emailData) {
        throw new InternalServerError("User not authenticated");
      }
      const otp = req.params.otp;
      const user: IRegister =
        await this.registerService.updateRegisterUserByOTP(
          emailData.email,
          otp
        );
      const profileToken = createProfileToken({ email: user.email });
      const options = {
        domain: FRONTEND_URL, // Only allow this domain
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true, // Don't expose cookie to JS
        secure: true, // Required for HTTPS (Render uses HTTPS)
        sameSite: "none", // Or "None" if frontend/backend are on different subdomains
        path: "/",
      } as CookieOptions;
      res.clearCookie("OTP");
      res.cookie("PROFILE", profileToken, options);
      sendResponse(res, new Created("Create profile", { step: "profile" }));
    } catch (error) {
      if (error instanceof Error) {
        sendResponse(res, new InternalServerError("Error", error.message));
      } else {
        sendResponse(res, new InternalServerError("Error", error));
      }
    }
  };
}
