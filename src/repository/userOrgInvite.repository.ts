import { prisma } from "../config/db.config";
import {
  IOrgInvite,
  IOrgInviteRequest,
  IOrgInviteResponse,
} from "../interface/org_invite.interface";
import {
  BadRequest,
  InternalServerError,
  Unauthorized,
} from "../utils/api.util";
import { UserRepository } from "./user.repository";

export class OrgInviteRepository {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUserOrgInvite(
    data: IOrgInviteRequest & { expiryAt: Date }
  ): Promise<IOrgInviteResponse> {
    try {
      const user = await this.userRepository.getUserByEmail(data.email);
      if (!user) {
        throw new BadRequest("User not registered");
      }
      const userOrg = await prisma.user_org.findUnique({
        where: {
          userId_orgId: {
            userId: user.id,
            orgId: data.orgId,
          },
        },
      });
      if (userOrg) {
        throw new Unauthorized("User already exist in the org");
      }
      const orgInvite = await prisma.org_invite.create({
        data: {
          email: data.email,
          orgId: data.orgId,
          role: data.role,
          expiryAt: data.expiryAt,
          hashCode: data.hashCode,
        },
      });
      return orgInvite;
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      } else {
        throw new InternalServerError("An unknown error occurred", error);
      }
    }
  }

  async getUserOrgInviteByHashCode(
    hashCode: string
  ): Promise<IOrgInviteResponse | null> {
    try {
      const orgInvite: IOrgInvite | null = await prisma.org_invite.findUnique({
        where: {
          hashCode,
        },
      });
      return orgInvite;
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
      throw new InternalServerError("An unknown error occurred", error);
    }
  }
}
