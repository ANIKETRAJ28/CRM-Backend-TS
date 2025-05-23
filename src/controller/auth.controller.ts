import { CookieOptions, Request, Response } from "express";
import {
  IUserLogin,
  IUserRequest,
  IUserResponse,
} from "../interface/user.interface";
import {
  Created,
  InternalServerError,
  sendResponse,
  Unauthorized,
} from "../utils/api.util";
import { createJWTtoken, createORGToken } from "../utils/jwt.util";
import { AuthService } from "../service/auth.service";
import { UserOrgService } from "../service/userOrg.service";
import { getProfileInfo } from "../middleware/auth.middleware";
import { FRONTEND_URL } from "../config/env.config";

export class AuthController {
  private authService: AuthService;
  private userOrgService: UserOrgService;

  constructor() {
    this.authService = new AuthService();
    this.userOrgService = new UserOrgService();
  }

  signup = async (req: Request, res: Response) => {
    try {
      const emailData = getProfileInfo(req, res);
      if (!emailData) {
        throw new Unauthorized("User not authenticated");
      }
      const signupPayload: Omit<IUserRequest, "email"> = req.body;
      const user: IUserResponse = await this.authService.signUp({
        ...signupPayload,
        email: emailData.email,
      });
      const token = createJWTtoken(user);
      const options = {
        // domain: FRONTEND_URL, // Only allow this domain
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true, // Don't expose cookie to JS
        secure: true, // Required for HTTPS (Render uses HTTPS)
        sameSite: "none", // Or "None" if frontend/backend are on different subdomains
        path: "/",
      } as CookieOptions;
      res.clearCookie("PROFILE", options);
      res.cookie("JWT", token, options);
      sendResponse(res, new Created("User registered successfully"));
    } catch (error) {
      if (error instanceof Error) {
        sendResponse(res, new InternalServerError("Error", error.message));
      } else {
        sendResponse(res, new Unauthorized("Error", error));
      }
    }
  };

  signIn = async (req: Request, res: Response) => {
    try {
      const signInPayload: IUserLogin = req.body;
      const user = await this.authService.signIn(signInPayload);
      const token = createJWTtoken(user);
      const options = {
        // domain: FRONTEND_URL, // Only allow this domain
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true, // Don't expose cookie to JS
        secure: true, // Required for HTTPS (Render uses HTTPS)
        sameSite: "none", // Or "None" if frontend/backend are on different subdomains
        path: "/",
      } as CookieOptions;
      res.cookie("JWT", token, options);
      sendResponse(res, new Created("User loggedin successfully"));
    } catch (error) {
      if (error instanceof Error) {
        sendResponse(res, new InternalServerError("Error", error.message));
      } else {
        sendResponse(res, new Unauthorized("Error", error));
      }
    }
  };

  switchOrg = async (req: Request, res: Response) => {
    try {
      const userId = req.id;
      if (!userId) {
        throw new Unauthorized("User not authenticated");
      }
      const orgId = req.params.orgId;
      const userOrg = await this.userOrgService.getUserByUserIdOrgId(
        userId,
        orgId
      );
      const orgToken = createORGToken({ orgId: userOrg.orgId });
      const options = {
        // domain: FRONTEND_URL, // Only allow this domain
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true, // Don't expose cookie to JS
        secure: true, // Required for HTTPS (Render uses HTTPS)
        sameSite: "none", // Or "None" if frontend/backend are on different subdomains
        path: "/",
      } as CookieOptions;
      res.cookie("ORG", orgToken, options);
      sendResponse(res, new Created("Org switched successfully"));
    } catch (error) {
      if (error instanceof Error) {
        sendResponse(res, new InternalServerError("Error", error.message));
      } else {
        sendResponse(res, new Unauthorized("Error", error));
      }
    }
  };
}
