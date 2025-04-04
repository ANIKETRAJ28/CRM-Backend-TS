import { IUserOrgRole } from "./user_org.interface";

export interface ITicket {
  id: string;
  title: string;
  description: string;
  orgId: string;
  status: ITicketStatus;
  priority: ITicketPriority;
  assigneeId: string;
  reporterId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITicketRequest {
  title: string;
  description: string;
  priority: ITicketPriority;
  orgId: string;
  reporterId: string;
  reporterEmail: string;
  reporterName: string;
}

export interface ITicketResponse {
  id: string;
  title: string;
  description: string;
  status: ITicketStatus;
  priority: ITicketPriority;
  orgId: string;
}

export interface ITicketResponse {
  id: string;
  title: string;
  description: string;
  status: ITicketStatus;
  priority: ITicketPriority;
  orgId: string;
}

export interface ITicketAssigneeResponse extends ITicketResponse {
  reporterId: string;
  reporterName: string;
  reporterEmail: string;
  reporterRole: IUserOrgRole;
}

export interface ITicketReporterResponse extends ITicketResponse {
  assigneeId: string;
  assigneeName: string;
}

export interface ITicketAdminResponse extends ITicketResponse {
  assigneeId: string;
  assigneeName: string;
  assigneeEmail: string;
  reporterId: string;
  reporterName: string;
  reporterEmail: string;
  reporterRole: IUserOrgRole;
}

export type ITicketStatus =
  | "OPEN"
  | "CLOSED"
  | "PROGRESS"
  | "RESOLVED"
  | "CLOSED"
  | "HOLD";

export type ITicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
