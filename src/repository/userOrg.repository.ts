import {
  IUserOrgRequest,
  IUserOrg,
  IUserOrgResponse,
  IUserOrgDetailResponse,
} from "../interface/user_org.interface";
import { prisma } from "../config/db.config";
import { BadRequest, InternalServerError } from "../utils/api.util";
import { IOrg, IOrgResponse } from "../interface/org.interface";
import { OrgInviteRepository } from "./userOrgInvite.repository";
import { UserRepository } from "./user.repository";
import { IUserOrgMember, IUserResponse } from "../interface/user.interface";

export class UserOrgRepository {
  private orgInviteReposiotry: OrgInviteRepository;
  private userRepositoy: UserRepository;

  constructor() {
    this.orgInviteReposiotry = new OrgInviteRepository();
    this.userRepositoy = new UserRepository();
  }

  async createUserOrg(data: IUserOrgRequest): Promise<IUserOrgResponse> {
    try {
      const isUserOrgExist: IUserOrg | null = await prisma.user_org.findUnique({
        where: {
          userId_orgId: {
            userId: data.userId,
            orgId: data.orgId,
          },
        },
      });
      if (isUserOrgExist) {
        throw new BadRequest("User already in the org");
      }
      const userOrg: IUserOrg = await prisma.user_org.create({
        data: data,
      });
      return {
        id: userOrg.id,
        userId: userOrg.userId,
        orgId: userOrg.orgId,
        role: userOrg.role,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequest(error.message);
      } else {
        throw new BadRequest("An unknown error occurred", error);
      }
    }
  }

  async getUserByUserIdOrgId(userId: string, orgId: string): Promise<IUserOrg> {
    try {
      const userOrg: IUserOrg | null = await prisma.user_org.findUnique({
        where: {
          userId_orgId: {
            userId,
            orgId,
          },
        },
      });
      if (userOrg === null) {
        throw new BadRequest("User not found in the org");
      }
      return userOrg;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequest(error.message);
      } else {
        throw new InternalServerError("An unknown error occurred", error);
      }
    }
  }

  async getUserOrgs(userId: string): Promise<IUserOrgDetailResponse[]> {
    try {
      const userOrgs: IUserOrg[] = await prisma.user_org.findMany({
        where: {
          userId,
        },
      });
      const userOrgsDetail: IUserOrgDetailResponse[] = await Promise.all(
        userOrgs.map(async (userOrg) => {
          const org: IOrg | null = await prisma.org.findUnique({
            where: {
              id: userOrg.orgId,
            },
          });
          return {
            id: userOrg.id,
            userId: userOrg.userId,
            org: org
              ? {
                  id: org.id,
                  name: org.name,
                }
              : null,
            role: userOrg.role,
          };
        })
      );
      return userOrgsDetail;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequest(error.message);
      } else {
        throw new BadRequest("An unknown error occurred", error);
      }
    }
  }

  async addUserOrgForUser(
    userId: string,
    name: string
  ): Promise<IUserOrgDetailResponse> {
    try {
      const org = await prisma.org.findUnique({
        where: {
          name,
        },
      });
      if (org === null) {
        throw new BadRequest("Org not found");
      }
      const getUserOrg = await prisma.user_org.findUnique({
        where: {
          userId_orgId: {
            userId,
            orgId: org.id,
          },
        },
      });
      if (getUserOrg) {
        throw new BadRequest("User already in the org");
      }
      const userOrg = await this.createUserOrg({
        userId,
        orgId: org.id,
        role: "USER",
      });
      return {
        id: userOrg.id,
        userId: userId,
        org: {
          id: org.id,
          name: org.name,
        },
        role: userOrg.role,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
      throw new BadRequest("An unknown error occurred", error);
    }
  }

  async addUserOrg(
    userId: string,
    hashCode: string
  ): Promise<IUserOrgDetailResponse> {
    try {
      const orgInvite =
        await this.orgInviteReposiotry.getUserOrgInviteByHashCode(hashCode);
      if (orgInvite === null) {
        throw new BadRequest("Invalid hash code");
      }
      const currTime = new Date();
      if (currTime > orgInvite.expiryAt) {
        throw new BadRequest("Invite has expired");
      }
      const user: IUserResponse | null =
        await this.userRepositoy.getUserByEmail(orgInvite.email);
      if (user === null || user.id !== userId) {
        throw new BadRequest("You are not invited to this org");
      }
      const orgDetail: IOrg | null = await prisma.org.findUnique({
        where: {
          id: orgInvite.orgId,
        },
      });
      if (orgDetail === null) {
        throw new BadRequest("Org not found");
      }
      const userOrg = await this.createUserOrg({
        userId: user.id,
        orgId: orgInvite.orgId,
        role: orgInvite.role,
      });
      return {
        id: userOrg.id,
        userId: userOrg.userId,
        org: {
          id: orgDetail.id,
          name: orgDetail.name,
        },
        role: userOrg.role,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
      throw new BadRequest("An unknown error occurred", error);
    }
  }

  async getOrgEngineers(orgId: string): Promise<IUserOrgResponse[]> {
    try {
      const userOrgs = await prisma.user_org.findMany({
        where: {
          orgId,
          role: "ENGINEER",
        },
      });
      const response: IUserOrgResponse[] = userOrgs.map((userOrg) => ({
        id: userOrg.id,
        orgId: userOrg.orgId,
        role: userOrg.role,
        userId: userOrg.userId,
      }));
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
      throw new BadRequest("An unknown error occurred", error);
    }
  }

  async getUserOrgMembers(orgId: string): Promise<IUserOrgMember[]> {
    try {
      const userOrgs: IUserOrg[] = await prisma.user_org.findMany({
        where: {
          orgId,
        },
      });
      const userOrgMembers = Promise.all(
        userOrgs.map(async (userOrg: IUserOrg) => {
          const user: IUserResponse = await this.userRepositoy.getUserById(
            userOrg.userId
          );
          return { role: userOrg.role, ...user };
        })
      );
      return userOrgMembers;
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
      throw new BadRequest("An unknown error occurred", error);
    }
  }
}
