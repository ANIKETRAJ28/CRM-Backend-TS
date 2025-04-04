import { Request, Response } from "express";
import { OrgService } from "../service/org.service";
import {
  Created,
  InternalServerError,
  sendResponse,
  Success,
  Unauthorized,
} from "../utils/api.util";
import { IOrgResponse } from "../interface/org.interface";
import { IUserOrgDetailResponse } from "../interface/user_org.interface";

export class OrgController {
  private orgService: OrgService;

  constructor() {
    this.orgService = new OrgService();
  }

  createOrg = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.id;
      if (userId === undefined) {
        throw new Unauthorized("Unauthorized for this action");
      }
      const orgName: string = req.body.orgName;
      const org: IUserOrgDetailResponse = await this.orgService.createOrg({
        name: orgName,
        userId,
      });
      sendResponse(res, new Created("Org created", org));
    } catch (error) {
      if (error instanceof Error) {
        sendResponse(res, new InternalServerError("Error", error.message));
        return;
      }
      sendResponse(res, new Unauthorized("Error", error));
    }
  };

  getOrgById = async (req: Request, res: Response): Promise<void> => {
    try {
      const orgId: string = req.params.id;
      const org: IOrgResponse = await this.orgService.getOrgById(orgId);
      sendResponse(res, new Success("Org found", org));
    } catch (error) {
      if (error instanceof Error) {
        sendResponse(res, new InternalServerError("Error", error.message));
        return;
      }
      sendResponse(res, new Unauthorized("Error", error));
    }
  };

  getOrgByName = async (req: Request, res: Response): Promise<void> => {
    try {
      const orgName: string = req.params.name;
      const org: IOrgResponse = await this.orgService.getOrgByName(orgName);
      sendResponse(res, new Success("Org found", org));
    } catch (error) {
      if (error instanceof Error) {
        sendResponse(res, new InternalServerError("Error", error.message));
        return;
      }
      sendResponse(res, new Unauthorized("Error", error));
    }
  };
}
