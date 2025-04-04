// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request } from "express";
import { IUserOrgRole } from "../interface/user_org.interface";

declare global {
  namespace Express {
    interface Request {
      id?: string;
      email?: string;
      userOrgId?: string;
      orgId?: string;
      role?: IUserOrgRole;
    }
  }
}
