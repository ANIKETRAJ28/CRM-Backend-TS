import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import {
  InternalServerError,
  sendResponse,
  Success,
  Unauthorized,
} from "../utils/api.util";
import { IJWT, IORG, IPROFILE } from "../interface/middleware.interface";
import { UserOrgService } from "../service/userOrg.service";

export async function orgMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const orgCookie = req.cookies["ORG"];
    if (!orgCookie) {
      throw new Unauthorized("Org not authenticated");
    }
    const decodedOrgToken = jwt.decode(orgCookie);
    if (
      !decodedOrgToken ||
      typeof decodedOrgToken === "string" ||
      !decodedOrgToken.exp
    ) {
      throw new Unauthorized("Org not authenticated");
    }
    if (decodedOrgToken.exp * 1000 < Date.now()) {
      throw new Unauthorized("Org not authenticated");
    }

    const orgTokenData = decodedOrgToken as unknown as IORG;
    const userOrgService = new UserOrgService();
    if (!req.id) {
      throw new Unauthorized("User not authenticated");
    }
    const userOrg = await userOrgService.getUserByUserIdOrgId(
      req.id,
      orgTokenData.orgId
    );
    req.orgId = userOrg.orgId;
    req.role = userOrg.role;
    next();
  } catch (error) {
    if (error instanceof Error) {
      sendResponse(res, new InternalServerError("Error", error.message));
    } else {
      sendResponse(res, new Unauthorized("Error", error));
    }
  }
}

export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const jwtCookie = req.cookies["JWT"];
    if (!jwtCookie) {
      throw new Unauthorized("User not authenticated");
    }
    const decodedToken = jwt.decode(jwtCookie);
    if (
      !decodedToken ||
      typeof decodedToken === "string" ||
      !decodedToken.exp
    ) {
      throw new Error("User not authenticated");
    }
    if (decodedToken.exp * 1000 < Date.now()) {
      res.clearCookie("JWT");
      throw new Unauthorized("User not authenticated");
    }
    const tokenData = decodedToken as unknown as IJWT;

    req.id = tokenData.id;
    req.email = tokenData.email;
    next();
  } catch (error) {
    if (error instanceof Error) {
      sendResponse(res, new InternalServerError("Error", error.message));
    } else {
      sendResponse(res, new Unauthorized("Error", error));
    }
  }
}

export function getProfileInfo(req: Request, res: Response) {
  try {
    const profileCookie = req.cookies["PROFILE"];
    if (!profileCookie) {
      return undefined;
    }
    const decodedToken = jwt.decode(profileCookie) as unknown as IPROFILE;
    if (!decodedToken) {
      throw new Error("User not authenticated");
    }
    return decodedToken;
  } catch (error) {
    if (error instanceof Error) {
      sendResponse(res, new InternalServerError("Error", error.message));
    } else {
      sendResponse(res, new Unauthorized("Error", error));
    }
  }
}

export function getOtpInfo(req: Request, res: Response) {
  try {
    const otpCookie = req.cookies["OTP"];
    if (!otpCookie) {
      throw new Unauthorized("User not authenticated");
    }
    const decodedToken = jwt.decode(otpCookie) as unknown as IPROFILE;
    if (!decodedToken) {
      throw new Error("User not authenticated");
    }
    return decodedToken;
  } catch (error) {
    if (error instanceof Error) {
      sendResponse(res, new InternalServerError("Error", error.message));
    } else {
      sendResponse(res, new Unauthorized("Error", error));
    }
  }
}

export function getUserInfo(req: Request, res: Response): void {
  try {
    const jwtCookie = req.cookies["JWT"];
    if (!jwtCookie) {
      throw new Unauthorized("User not authenticated");
    }
    const decodedToken: IJWT = jwt.decode(jwtCookie) as unknown as IJWT;
    if (!decodedToken) {
      throw new Error("User not authenticated");
    }
    if (new Date(decodedToken.exp * 1000) < new Date()) {
      res.clearCookie("JWT");
      sendResponse(res, new Unauthorized("Session expired"));
    }
    sendResponse(
      res,
      new Success("User info fetched successfully", decodedToken)
    );
  } catch (error) {
    if (error instanceof Error) {
      sendResponse(res, new InternalServerError("Error", error.message));
    } else {
      sendResponse(res, new Unauthorized("Error", error));
    }
  }
}

export function logout(req: Request, res: Response): void {
  try {
    res.clearCookie("JWT");
    res.clearCookie("ORG");
    res.clearCookie("PROFILE");
    res.clearCookie("OTP");
    sendResponse(res, new Success("Logout successful"));
  } catch (error) {
    if (error instanceof Error) {
      sendResponse(res, new InternalServerError("Error", error.message));
    } else {
      sendResponse(res, new Unauthorized("Error", error));
    }
  }
}
