import { Request, Response } from "express";
import { OrgInviteService } from "../service/userOrgInvite.service";
import {
  BadRequest,
  Created,
  InternalServerError,
  sendResponse,
  Unauthorized,
} from "../utils/api.util";

export class OrgInviteController {
  private orgInviteService: OrgInviteService;

  constructor() {
    this.orgInviteService = new OrgInviteService();
  }

  createUserOrgInvite = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.id;
      const role = req.role;
      const orgId = req.orgId;
      if (!userId) {
        throw new Unauthorized("User not authenticated");
      }
      if (!role || role !== "ADMIN" || !orgId) {
        throw new Unauthorized("Unauthorized for this action");
      }
      const email: string = req.body.email;
      if (!email) {
        throw new BadRequest("Email is required");
      }
      await this.orgInviteService.createUserOrgInvite({
        email,
        orgId,
        userId,
      });
      sendResponse(res, new Created("User invite created"));
    } catch (error) {
      if (error instanceof Error) {
        sendResponse(res, new InternalServerError("Error", error.message));
        return;
      }
      sendResponse(res, new Unauthorized("Error", error));
    }
  };
}
