import { Request, Response } from "express";
import { UserService } from "../service/user.service";
import { IUserRequest, IUserResponse } from "../interface/user.interface";
import {
  BadRequest,
  Created,
  InternalServerError,
  sendResponse,
  Success,
  Unauthorized,
} from "../utils/api.util";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getUserByEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const email: string = req.params.email;
      const user: IUserResponse | null = await this.userService.getUserByEmail(
        email
      );
      if (user === null) {
        sendResponse(res, new BadRequest("User not found"));
        return;
      }
      sendResponse(res, new Success("User found", user));
    } catch (error) {
      if (error instanceof Error) {
        sendResponse(res, new InternalServerError("Error", error.message));
        return;
      }
      sendResponse(res, new Unauthorized("Error", error));
    }
  };
}
