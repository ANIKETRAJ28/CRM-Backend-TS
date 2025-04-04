import { IOrgResponse } from "../interface/org.interface";
import { IUserOrgMember, IUserResponse } from "../interface/user.interface";
import {
  IUserOrgDetailResponse,
  IUserOrgRequest,
  IUserOrgResponse,
} from "../interface/user_org.interface";
import { UserOrgRepository } from "../repository/userOrg.repository";

export class UserOrgService {
  private userOrgRepository: UserOrgRepository;

  constructor() {
    this.userOrgRepository = new UserOrgRepository();
  }

  // async createUserOrg(data: IUserOrgRequest): Promise<IUserOrgResponse> {
  //   try {
  //     return await this.userOrgRepository.createUserOrg(data);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async getUserByUserIdOrgId(
    userId: string,
    orgId: string
  ): Promise<IUserOrgResponse> {
    try {
      return await this.userOrgRepository.getUserByUserIdOrgId(userId, orgId);
    } catch (error) {
      throw error;
    }
  }

  async getUserOrgs(userId: string): Promise<IUserOrgDetailResponse[]> {
    try {
      return await this.userOrgRepository.getUserOrgs(userId);
    } catch (error) {
      throw error;
    }
  }

  async addUserOrgForUser(
    userId: string,
    name: string
  ): Promise<IUserOrgDetailResponse> {
    try {
      return await this.userOrgRepository.addUserOrgForUser(userId, name);
    } catch (error) {
      throw error;
    }
  }

  async addUserOrg(
    userId: string,
    hashCode: string
  ): Promise<IUserOrgDetailResponse> {
    try {
      return await this.userOrgRepository.addUserOrg(userId, hashCode);
    } catch (error) {
      throw error;
    }
  }

  async getUserOrgMembers(orgId: string): Promise<IUserOrgMember[]> {
    try {
      return await this.userOrgRepository.getUserOrgMembers(orgId);
    } catch (error) {
      throw error;
    }
  }
}
