import {
  ITicketAdminResponse,
  ITicketAssigneeResponse,
  ITicketReporterResponse,
  ITicketRequest,
  ITicketResponse,
  ITicketStatus,
} from "../interface/ticket.interface";
import { IUserOrgRole } from "../interface/user_org.interface";
import { TicketRepository } from "../repository/ticket.repository";

export class TicketService {
  private ticketRepository: TicketRepository;

  constructor() {
    this.ticketRepository = new TicketRepository();
  }

  async createTicket(
    orgId: string,
    role: IUserOrgRole,
    data: ITicketRequest
  ): Promise<ITicketReporterResponse | ITicketAdminResponse> {
    try {
      return this.ticketRepository.createTicket(orgId, role, data);
    } catch (error) {
      throw error;
    }
  }

  async getTicketById(
    id: string,
    orgId: string
  ): Promise<ITicketAdminResponse> {
    try {
      return this.ticketRepository.getTicketById(id, orgId);
    } catch (error) {
      throw error;
    }
  }

  async updateTicketStatus(
    id: string,
    orgId: string,
    engineerId: string,
    status: ITicketStatus
  ): Promise<ITicketAssigneeResponse> {
    try {
      return this.ticketRepository.updateTicketStatus(
        id,
        orgId,
        engineerId,
        status
      );
    } catch (error) {
      throw error;
    }
  }

  async getTicketsForReporter(
    userId: string,
    orgId: string
  ): Promise<ITicketReporterResponse[]> {
    try {
      return this.ticketRepository.getTicketsForReporter(userId, orgId);
    } catch (error) {
      throw error;
    }
  }

  async getTicketsForAssignee(
    userId: string,
    orgId: string
  ): Promise<ITicketAssigneeResponse[]> {
    try {
      return this.ticketRepository.getTicketsForAssignee(userId, orgId);
    } catch (error) {
      throw error;
    }
  }

  async getTicketsForAdmin(orgId: string): Promise<ITicketAdminResponse[]> {
    try {
      return this.ticketRepository.getTicketsForAdmin(orgId);
    } catch (error) {
      throw error;
    }
  }
}
