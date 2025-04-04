import { Request, Response } from "express";
import { TicketService } from "../service/ticket.service";
import {
  ITicketAdminResponse,
  ITicketAssigneeResponse,
  ITicketReporterResponse,
  ITicketRequest,
  ITicketResponse,
  ITicketStatus,
} from "../interface/ticket.interface";
import {
  BadRequest,
  Created,
  InternalServerError,
  sendResponse,
  Success,
} from "../utils/api.util";

export class TicketController {
  private ticketService: TicketService;

  constructor() {
    this.ticketService = new TicketService();
  }

  createTicket = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.id;
      const email = req.email;
      const role = req.role;
      if (!userId || !email || !role) {
        throw new BadRequest("User not authenticated");
      }
      const orgId = req.orgId;
      if (!orgId) {
        throw new BadRequest("Cannot create ticket for different org");
      }
      const data: Omit<ITicketRequest, "userOrgId" | "assigneeId"> = req.body;
      const ticket: ITicketReporterResponse | ITicketAdminResponse =
        await this.ticketService.createTicket(orgId, role, {
          ...data,
          orgId,
          reporterEmail: email,
          reporterId: userId,
        });
      sendResponse(res, new Created("Ticket created", ticket));
    } catch (error) {
      if (error instanceof Error) {
        sendResponse(res, new InternalServerError("Error", error.message));
        return;
      }
      sendResponse(res, new InternalServerError("Error", error));
    }
  };

  getTicketById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const orgId = req.orgId;
      const role = req.role;
      if (!orgId) {
        throw new BadRequest("Cannot get ticket for different org");
      }
      if (!role || role !== "ADMIN") {
        throw new BadRequest("Unauthorized for this action");
      }
      const ticket: ITicketAdminResponse =
        await this.ticketService.getTicketById(orgId, id);
      sendResponse(res, new Success("Ticket found", ticket));
    } catch (error) {
      if (error instanceof Error) {
        sendResponse(res, new InternalServerError("Error", error.message));
        return;
      }
      sendResponse(res, new InternalServerError("Error", error));
    }
  };

  updateTicketStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const role = req.role;
      const userId = req.id;
      const orgId = req.orgId;
      if (!userId) {
        throw new BadRequest("User not authenticated");
      }
      if (!orgId) {
        throw new BadRequest("Cannot update ticket for different org");
      }
      if (!role || role !== "ENGINEER") {
        throw new BadRequest("Unauthorized for updating ticket status");
      }
      const status: ITicketStatus = req.body.status;
      const ticket: ITicketAssigneeResponse =
        await this.ticketService.updateTicketStatus(id, orgId, userId, status);
      sendResponse(res, new Success("Ticket status updated", ticket));
    } catch (error) {
      if (error instanceof Error) {
        sendResponse(res, new InternalServerError("Error", error.message));
        return;
      }
      sendResponse(res, new InternalServerError("Error", error));
    }
  };

  getTicketForReporter = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.id;
      const orgId = req.orgId;
      if (!userId) {
        throw new BadRequest("User not authenticated");
      }
      if (!orgId) {
        throw new BadRequest("Cannot get ticket for different org");
      }
      const tickets: ITicketReporterResponse[] =
        await this.ticketService.getTicketsForReporter(userId, orgId);
      sendResponse(res, new Success("Tickets found", tickets));
    } catch (error) {
      if (error instanceof Error) {
        sendResponse(res, new InternalServerError("Error", error.message));
        return;
      }
      sendResponse(res, new InternalServerError("Error", error));
    }
  };

  getTicketForAssignee = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.id;
      const orgId = req.orgId;
      const role = req.role;
      if (!userId) {
        throw new BadRequest("User not authenticated");
      }
      if (!orgId) {
        throw new BadRequest("Cannot get ticket for different org");
      }
      if (!role || role !== "ENGINEER") {
        throw new BadRequest("Unauthorized for this action");
      }
      const tickets: ITicketAssigneeResponse[] =
        await this.ticketService.getTicketsForAssignee(userId, orgId);
      sendResponse(res, new Success("Tickets found", tickets));
    } catch (error) {
      if (error instanceof Error) {
        sendResponse(res, new InternalServerError("Error", error.message));
        return;
      }
      sendResponse(res, new InternalServerError("Error", error));
    }
  };

  getTicketsForAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const orgId = req.orgId;
      const role = req.role;
      if (!orgId) {
        throw new BadRequest("Cannot get ticket for different org");
      }
      if (!role || role !== "ADMIN") {
        throw new BadRequest("Unauthorized for getting tickets");
      }
      const tickets: ITicketAdminResponse[] =
        await this.ticketService.getTicketsForAdmin(orgId);
      sendResponse(res, new Success("Tickets found", tickets));
    } catch (error) {
      if (error instanceof Error) {
        sendResponse(res, new InternalServerError("Error", error.message));
        return;
      }
      sendResponse(res, new InternalServerError("Error", error));
    }
  };
}
