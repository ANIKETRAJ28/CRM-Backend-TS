import { IOrgResponse } from "./org.interface";

export interface IUserOrg {
  id: string;
  userId: string;
  orgId: string;
  role: IUserOrgRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserOrgRequest {
  userId: string;
  orgId: string;
  role: IUserOrgRole;
}

export interface IUserOrgResponse {
  id: string;
  userId: string;
  orgId: string;
  role: IUserOrgRole;
}

export interface IUserOrgDetailResponse {
  id: string;
  userId: string;
  org: IOrgResponse | null;
  role: IUserOrgRole;
}

export type IUserOrgRole = "ADMIN" | "ENGINEER" | "USER";
