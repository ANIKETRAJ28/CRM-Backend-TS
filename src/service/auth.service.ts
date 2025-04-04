import {
  IUserLogin,
  IUserRequest,
  IUserResponse,
} from "../interface/user.interface";
import { BadRequest } from "../utils/api.util";
import { UserService } from "./user.service";

export class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async signUp(data: IUserRequest): Promise<IUserResponse> {
    try {
      const user = await this.userService.createUser(data);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async signIn(data: IUserLogin): Promise<IUserResponse> {
    try {
      const user: IUserResponse | null = await this.userService.getUserByEmail(
        data.email
      );
      if (user == null) {
        throw new BadRequest("User not registered");
      }
      await this.userService.comparePassword(data.email, data.password);
      return user;
    } catch (error) {
      throw error;
    }
  }
}
