import { prisma } from "../config/db.config";
import {
  ITicket,
  ITicketAdminResponse,
  ITicketAssigneeResponse,
  ITicketReporterResponse,
  ITicketRequest,
  ITicketResponse,
  ITicketStatus,
} from "../interface/ticket.interface";
import {
  IUserOrgResponse,
  IUserOrgRole,
} from "../interface/user_org.interface";
import { BadRequest, InternalServerError } from "../utils/api.util";
import { UserRepository } from "./user.repository";
import { UserOrgRepository } from "./userOrg.repository";
import { wss, clients } from "../index";

export class TicketRepository {
  private userOrgRepository: UserOrgRepository;
  private userRepository: UserRepository;

  constructor() {
    this.userOrgRepository = new UserOrgRepository();
    this.userRepository = new UserRepository();
  }

  async createTicket(
    userId: string,
    orgId: string,
    role: IUserOrgRole,
    data: ITicketRequest
  ): Promise<ITicketReporterResponse | ITicketAdminResponse> {
    try {
      let engineers: IUserOrgResponse[] =
        await this.userOrgRepository.getOrgEngineers(orgId);
      if (role === "ENGINEER") {
        engineers = engineers.filter(
          (engineer) => engineer.userId !== data.reporterId
        );
      }
      if (engineers.length === 0) {
        throw new Error("No engineers in the org");
      }
      const randomEngineer: IUserOrgResponse =
        engineers[Math.floor(Math.random() * engineers.length)];
      const randomEngineerData = await this.userRepository.getUserById(
        randomEngineer.userId
      );
      const admin = await this.userOrgRepository.getOrgAdmin(orgId);
      const user = await this.userRepository.getUserById(userId);

      const ticket: ITicket = await prisma.ticket.create({
        data: {
          title: data.title,
          description: data.description,
          status: "OPEN",
          priority: data.priority,
          orgId: data.orgId,
          assigneeId: randomEngineer.userId,
          reporterId: data.reporterId,
        },
      });
      const adminRes = {
        type: "admin",
        ticket: {
          id: ticket.id,
          title: ticket.title,
          description: ticket.description,
          priority: ticket.priority,
          status: ticket.status,
          orgId: ticket.orgId,
          assigneeId: randomEngineer.userId,
          assigneeName: randomEngineerData.name,
          assigneeEmail: randomEngineerData.email,
          reporterId: data.reporterId,
          reporterName: data.reporterName,
          reporterEmail: data.reporterEmail,
          reporterRole: role,
        },
      };
      const engineerRes = {
        type: "assigned",
        ticket: {
          id: ticket.id,
          title: ticket.title,
          description: ticket.description,
          priority: ticket.priority,
          status: ticket.status,
          orgId: ticket.orgId,
          reporterName: user.name,
          reporterId: user.id,
          reporterEmail: user.email,
          reporterRole: role,
        },
      };
      const engineerWs = clients.get(randomEngineer.userId);
      if (engineerWs) {
        engineerWs.send(JSON.stringify(engineerRes), { binary: false });
      }
      if (role === "ADMIN") {
        return adminRes.ticket;
      }
      const adminWs = clients.get(admin.userId);
      if (adminWs) {
        adminWs.send(JSON.stringify(adminRes), { binary: false });
      }
      return {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        status: ticket.status,
        orgId: ticket.orgId,
        assigneeId: randomEngineer.userId,
        assigneeName: randomEngineerData.name,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
      throw new InternalServerError("An unknown error occurred", error);
    }
  }

  async getTicketById(
    id: string,
    orgId: string
  ): Promise<ITicketAdminResponse> {
    try {
      const ticket: ITicket | null = await prisma.ticket.findUnique({
        where: {
          id,
          orgId,
        },
      });
      if (ticket === null) {
        throw new BadRequest("Ticket not found");
      }

      const reporterData = await this.userRepository.getUserById(
        ticket.reporterId
      );
      const assigneeData = await this.userRepository.getUserById(
        ticket.assigneeId
      );
      const reporterOrgData = await this.userOrgRepository.getUserByUserIdOrgId(
        assigneeData.id,
        orgId
      );
      return {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        status: ticket.status,
        orgId: ticket.orgId,
        assigneeId: assigneeData.id,
        assigneeName: assigneeData.name,
        assigneeEmail: assigneeData.email,
        reporterId: reporterData.id,
        reporterName: reporterData.name,
        reporterEmail: reporterData.email,
        reporterRole: reporterOrgData.role,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
      throw new InternalServerError("An unknown error occurred", error);
    }
  }

  async updateTicketStatus(
    id: string,
    orgId: string,
    engineerId: string,
    status: ITicketStatus
  ): Promise<ITicketAssigneeResponse> {
    try {
      let ticket = await prisma.ticket.findUnique({
        where: {
          id,
          orgId,
        },
      });
      if (ticket == null) {
        throw new BadRequest("Ticket not found");
      }
      if (ticket.assigneeId !== engineerId) {
        throw new BadRequest("Unauthorized to update ticket status");
      }
      ticket = await prisma.ticket.update({
        where: {
          id,
        },
        data: {
          status,
        },
      });
      const userData = await this.userRepository.getUserById(ticket.reporterId);
      const engineerData = await this.userRepository.getUserById(
        ticket.assigneeId
      );
      const admin = await this.userOrgRepository.getOrgAdmin(orgId);
      const userOrgData = await this.userOrgRepository.getUserByUserIdOrgId(
        userData.id,
        orgId
      );
      const adminRes: { type: string; ticket: ITicketAdminResponse } = {
        type: "admin",
        ticket: {
          id: ticket.id,
          title: ticket.title,
          description: ticket.description,
          priority: ticket.priority,
          status: ticket.status,
          orgId: ticket.orgId,
          assigneeId: engineerData.id,
          assigneeName: engineerData.name,
          assigneeEmail: engineerData.email,
          reporterId: ticket.reporterId,
          reporterName: userData.name,
          reporterEmail: userData.email,
          reporterRole: userOrgData.role,
        },
      };
      const userRes: { type: string; ticket: ITicketReporterResponse } = {
        type: "reported",
        ticket: {
          id: ticket.id,
          title: ticket.title,
          description: ticket.description,
          priority: ticket.priority,
          status: ticket.status,
          orgId: ticket.orgId,
          assigneeId: ticket.assigneeId,
          assigneeName: engineerData.name,
        },
      };
      const userWs = clients.get(ticket.reporterId);
      if (userWs) {
        userWs.send(JSON.stringify(userRes), { binary: false });
      }
      const adminWs = clients.get(admin.userId);
      if (adminWs) {
        adminWs.send(JSON.stringify(adminRes), { binary: false });
      }
      return {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        status: ticket.status,
        orgId: ticket.orgId,
        reporterEmail: userData.email,
        reporterName: userData.name,
        reporterId: userData.id,
        reporterRole: userOrgData.role,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
      throw new InternalServerError("An unknown error occurred", error);
    }
  }

  async getTicketsForReporter(
    userId: string,
    orgId: string
  ): Promise<ITicketReporterResponse[]> {
    try {
      const tickets: ITicket[] = await prisma.ticket.findMany({
        where: {
          orgId,
          reporterId: userId,
        },
      });
      const result: ITicketReporterResponse[] = await Promise.all(
        tickets.map(async (ticket: ITicket) => {
          const userData = await this.userRepository.getUserById(
            ticket.assigneeId
          );
          return {
            id: ticket.id,
            title: ticket.title,
            description: ticket.description,
            priority: ticket.priority,
            status: ticket.status,
            orgId: ticket.orgId,
            assigneeId: userData.id,
            assigneeName: userData.name,
          };
        })
      );
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
      throw new InternalServerError("An unknown error occurred", error);
    }
  }

  async getTicketsForAssignee(
    userId: string,
    orgId: string
  ): Promise<ITicketAssigneeResponse[]> {
    try {
      const tickets: ITicket[] = await prisma.ticket.findMany({
        where: {
          orgId,
          assigneeId: userId,
        },
      });
      const result: ITicketAssigneeResponse[] = await Promise.all(
        tickets.map(async (ticket: ITicket) => {
          const userData = await this.userRepository.getUserById(
            ticket.reporterId
          );
          const userOrgData = await this.userOrgRepository.getUserByUserIdOrgId(
            ticket.reporterId,
            orgId
          );
          return {
            id: ticket.id,
            title: ticket.title,
            description: ticket.description,
            priority: ticket.priority,
            status: ticket.status,
            orgId: ticket.orgId,
            reporterId: userData.id,
            reporterName: userData.name,
            reporterEmail: userData.email,
            reporterRole: userOrgData.role,
          };
        })
      );
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
      throw new InternalServerError("An unknown error occurred", error);
    }
  }

  async getTicketsForAdmin(orgId: string): Promise<ITicketAdminResponse[]> {
    try {
      const tickets = await prisma.ticket.findMany({
        where: {
          orgId,
        },
      });
      const result: ITicketAdminResponse[] = await Promise.all(
        tickets.map(async (ticket: ITicket) => {
          const reporterData = await this.userRepository.getUserById(
            ticket.reporterId
          );
          const assigneeData = await this.userRepository.getUserById(
            ticket.assigneeId
          );
          const reporterOrgData =
            await this.userOrgRepository.getUserByUserIdOrgId(
              reporterData.id,
              orgId
            );
          return {
            id: ticket.id,
            title: ticket.title,
            description: ticket.description,
            priority: ticket.priority,
            status: ticket.status,
            orgId: ticket.orgId,
            assigneeId: assigneeData.id,
            assigneeName: assigneeData.name,
            assigneeEmail: assigneeData.email,
            reporterId: reporterData.id,
            reporterName: reporterData.name,
            reporterEmail: reporterData.email,
            reporterRole: reporterOrgData.role,
          };
        })
      );
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
      throw new InternalServerError("An unknown error occurred", error);
    }
  }
}
