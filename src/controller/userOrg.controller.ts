import { Request, Response } from "express";
import { UserOrgService } from "../service/userOrg.service";
import {
  InternalServerError,
  sendResponse,
  Success,
  Unauthorized,
} from "../utils/api.util";
import { IUserOrgMember, IUserResponse } from "../interface/user.interface";

export class UserOrgController {
  private userOrgService: UserOrgService;

  constructor() {
    this.userOrgService = new UserOrgService();
  }

  getUserByUserIdOrgId = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId: string = req.params.userId;
      const orgId: string = req.params.orgId;
      const userOrg = await this.userOrgService.getUserByUserIdOrgId(
        userId,
        orgId
      );
      sendResponse(res, new Success("User found", userOrg));
    } catch (error) {
      if (error instanceof Error) {
        sendResponse(res, new InternalServerError("Error", error.message));
        return;
      }
      sendResponse(res, new Unauthorized("Error", error));
    }
  };

  getUserOrgs = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.id;
      if (userId === undefined) {
        throw new Unauthorized("Unauthorized for this action");
      }
      const userOrgs = await this.userOrgService.getUserOrgs(userId);
      sendResponse(res, new Success("User orgs found", userOrgs));
    } catch (error) {
      if (error instanceof Error) {
        sendResponse(res, new InternalServerError("Error", error.message));
        return;
      }
      sendResponse(res, new Unauthorized("Error", error));
    }
  };

  addUserOrgForUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.id;
      if (userId === undefined) {
        throw new Unauthorized("Unauthorized for this action");
      }
      const orgName: string = req.params.orgName;
      const userOrg = await this.userOrgService.addUserOrgForUser(
        userId,
        orgName
      );
      sendResponse(res, new Success("Successfully added to Org", userOrg));
    } catch (error) {
      if (error instanceof Error) {
        sendResponse(res, new InternalServerError("Error", error.message));
        return;
      }
      sendResponse(res, new Unauthorized("Error", error));
    }
  };

  addUserOrg = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.id;
      if (userId === undefined) {
        throw new Unauthorized("Unauthorized for this action");
      }
      const hashCode: string = req.params.hashCode;
      const userOrg = await this.userOrgService.addUserOrg(userId, hashCode);
      sendResponse(res, new Success("Successfully added to Org", userOrg));
    } catch (error) {
      if (error instanceof Error) {
        sendResponse(res, new InternalServerError("Error", error.message));
        return;
      }
      sendResponse(res, new Unauthorized("Error", error));
    }
  };

  getUserOrgMembers = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.id;
      const orgId = req.orgId;
      const role = req.role;
      if (userId === undefined || orgId === undefined || role === undefined) {
        throw new Unauthorized("User not authenticated");
      }
      if (role !== "ADMIN") {
        throw new Unauthorized("Unauthorized for this action");
      }
      const users: IUserOrgMember[] =
        await this.userOrgService.getUserOrgMembers(orgId);
      sendResponse(res, new Success("Successfully fetched members", users));
    } catch (error) {
      if (error instanceof Error) {
        sendResponse(res, new InternalServerError("Error", error.message));
        return;
      }
      sendResponse(res, new Unauthorized("Error", error));
    }
  };
}
