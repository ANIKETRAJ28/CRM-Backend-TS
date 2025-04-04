import crypto from "crypto";
import {
  IOrgInviteRequest,
  IOrgInviteResponse,
} from "../interface/org_invite.interface";
import { OrgInviteRepository } from "../repository/userOrgInvite.repository";

export class OrgInviteService {
  private orgInviteRepository: OrgInviteRepository;

  constructor() {
    this.orgInviteRepository = new OrgInviteRepository();
  }

  async createUserOrgInvite(data: {
    orgId: string;
    userId: string;
    email: string;
  }): Promise<IOrgInviteResponse> {
    try {
      const hashCode = crypto.randomBytes(20).toString("hex");
      const expiryAt = new Date();
      expiryAt.setDate(expiryAt.getDate() + 1);
      return await this.orgInviteRepository.createUserOrgInvite({
        orgId: data.orgId,
        userId: data.userId,
        email: data.email,
        hashCode: hashCode,
        expiryAt,
        role: "ENGINEER",
      });
    } catch (error) {
      throw error;
    }
  }

  async getUserOrgInviteByHashCode(
    hashCode: string
  ): Promise<IOrgInviteResponse | null> {
    try {
      return await this.orgInviteRepository.getUserOrgInviteByHashCode(
        hashCode
      );
    } catch (error) {
      throw error;
    }
  }
}
