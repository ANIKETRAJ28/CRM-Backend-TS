import { IOrgRequest, IOrgResponse } from "../interface/org.interface";
import { IUserOrgDetailResponse } from "../interface/user_org.interface";
import { OrgRepository } from "../repository/org.repository";

export class OrgService {
  private orgRepository: OrgRepository;

  constructor() {
    this.orgRepository = new OrgRepository();
  }

  async createOrg(data: IOrgRequest): Promise<IUserOrgDetailResponse> {
    try {
      return await this.orgRepository.createOrg(data);
    } catch (error) {
      throw error;
    }
  }

  async getOrgById(id: string): Promise<IOrgResponse> {
    try {
      return await this.orgRepository.getOrgById(id);
    } catch (error) {
      throw error;
    }
  }

  async getOrgByName(name: string): Promise<IOrgResponse> {
    try {
      return await this.orgRepository.getOrgByName(name);
    } catch (error) {
      throw error;
    }
  }
}
