import { IUserOrgRole } from "./user_org.interface";

export interface IOrgInvite {
  id: string;
  orgId: string;
  email: string;
  hashCode: string;
  expiryAt: Date;
  role: IUserOrgRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrgInviteResponse {
  id: string;
  orgId: string;
  email: string;
  expiryAt: Date;
  hashCode: string;
  role: IUserOrgRole;
}

export interface IOrgInviteRequest {
  orgId: string;
  userId: string;
  email: string;
  hashCode: string;
  role: IUserOrgRole;
}
