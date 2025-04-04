import bcrypt from "bcrypt";
import { prisma } from "../config/db.config";
import {
  IUser,
  IUserResponse,
  IUserRequest,
} from "../interface/user.interface";
import { BadRequest, InternalServerError, NotFound } from "../utils/api.util";
import { SALT } from "../config/env.config";

export class UserRepository {
  async createUser(data: IUserRequest): Promise<IUserResponse> {
    try {
      const salt = await bcrypt.genSalt(+SALT);
      data.password = await bcrypt.hash(data.password, salt);
      const user: IUser = await prisma.user.create({
        data: data,
      });
      return {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      } else {
        throw new InternalServerError("An unknown error occurred", error);
      }
    }
  }

  async getUserById(id: string): Promise<IUserResponse> {
    try {
      const user: IUser | null = await prisma.user.findUnique({
        where: {
          id,
        },
      });
      if (user === null) {
        throw new NotFound("User not found");
      }
      return {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      } else {
        throw new InternalServerError("An unknown error occurred", error);
      }
    }
  }

  async getUserForRegister(email: string): Promise<boolean> {
    try {
      const user: IUser | null = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      return user !== null;
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      } else {
        throw new InternalServerError("An unknown error occurred", error);
      }
    }
  }

  async getUserByEmail(email: string): Promise<IUserResponse | null> {
    try {
      const user: IUser | null = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (user) {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      }
      throw new NotFound("User not found");
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      } else {
        throw new InternalServerError("An unknown error occurred", error);
      }
    }
  }

  async comparePassword(email: string, password: string): Promise<boolean> {
    try {
      const user: IUser | null = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (user === null) {
        throw new NotFound("User not registered");
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new BadRequest("Email or password incorrect");
      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      } else {
        throw new InternalServerError("An unknown error occurred", error);
      }
    }
  }
}
