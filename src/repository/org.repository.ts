import { IOrg, IOrgRequest, IOrgResponse } from "../interface/org.interface";
import { UserOrgRepository } from "../repository/userOrg.repository";
import { prisma } from "../config/db.config";
import { BadRequest, InternalServerError } from "../utils/api.util";
import {
  IUserOrgDetailResponse,
  IUserOrgResponse,
} from "../interface/user_org.interface";

export class OrgRepository {
  private userOrgRepository: UserOrgRepository;
  constructor() {
    this.userOrgRepository = new UserOrgRepository();
  }

  async createOrg(data: IOrgRequest): Promise<IUserOrgDetailResponse> {
    try {
      const org: IOrg | null = await prisma.org.findUnique({
        where: {
          name: data.name,
        },
      });
      if (org) {
        throw new Error("Org already exists");
      }
      const newOrg: IOrg = await prisma.org.create({
        data: {
          name: data.name,
        },
      });
      const userOrg: IUserOrgResponse =
        await this.userOrgRepository.createUserOrg({
          userId: data.userId,
          orgId: newOrg.id,
          role: "ADMIN",
        });
      return {
        id: newOrg.id,
        userId: userOrg.userId,
        org: {
          id: newOrg.id,
          name: newOrg.name,
        },
        role: userOrg.role,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new InternalServerError("An unknown error occurred", error);
    }
  }

  async getOrgById(id: string): Promise<IOrgResponse> {
    try {
      const org: IOrg | null = await prisma.org.findUnique({
        where: {
          id,
        },
      });
      if (org) {
        return {
          id: org.id,
          name: org.name,
        };
      }
      throw new BadRequest("Org not found");
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
      throw new InternalServerError("An unknown error occurred", error);
    }
  }

  async getOrgByName(name: string): Promise<IOrgResponse> {
    try {
      const org: IOrg | null = await prisma.org.findUnique({
        where: {
          name,
        },
      });
      if (org === null) {
        throw new BadRequest("Org not found");
      }
      return {
        id: org.id,
        name: org.name,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
      throw new InternalServerError("An unknown error occurred", error);
    }
  }
}
