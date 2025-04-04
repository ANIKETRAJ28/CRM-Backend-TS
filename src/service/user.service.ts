import { IUserRequest, IUserResponse } from "../interface/user.interface";
import { UserRepository } from "../repository/user.repository";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(data: IUserRequest): Promise<IUserResponse> {
    try {
      return await this.userRepository.createUser(data);
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<IUserResponse | null> {
    try {
      return await this.userRepository.getUserByEmail(email);
    } catch (error) {
      throw error;
    }
  }

  async comparePassword(email: string, password: string): Promise<boolean> {
    try {
      return await this.userRepository.comparePassword(email, password);
    } catch (error) {
      throw error;
    }
  }
}
