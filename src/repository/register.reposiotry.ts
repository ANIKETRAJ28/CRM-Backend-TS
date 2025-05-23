import crypto from "crypto";

import { prisma } from "../config/db.config";
import { IRegister } from "../interface/register.interface";
import { BadRequest, InternalServerError } from "../utils/api.util";
import { UserRepository } from "./user.repository";
import { mail } from "../utils/mail.util";
import { otpTemplate } from "../utils/otpTemplate.util";
import { ENVIRONMENT, OTP } from "../config/env.config";

export class RegisterRepository {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async registerUser(email: string): Promise<IRegister> {
    try {
      const existingUser = await this.userRepository.getUserForRegister(email);
      if (existingUser) {
        throw new BadRequest("User already exists");
      }
      const user: IRegister | null = await prisma.register.findUnique({
        where: {
          email,
        },
      });
      if (user && user.isRegistered) {
        return user;
      }
      const otp =
        ENVIRONMENT === "development"
          ? OTP
          : crypto.randomInt(100000, 999999).toString();
      const newRegister: IRegister = await prisma.register.upsert({
        where: {
          email,
        },
        update: {
          otp,
        },
        create: {
          email,
          otp,
        },
      });
      if (ENVIRONMENT === "production") {
        mail.sendMail({
          to: email,
          subject: "OTP for Registration",
          text: `Your OTP is ${otp}`,
          html: otpTemplate(email, otp),
        });
      }
      return newRegister;
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
      throw new InternalServerError("An unknown error occurred", error);
    }
  }

  async updateRegisterUserByOTP(
    email: string,
    otp: string
  ): Promise<IRegister> {
    try {
      const user = await prisma.register.findUnique({
        where: {
          email,
        },
      });
      if (user === null) {
        throw new BadRequest("User not found");
      }
      if (user.otp !== otp) {
        throw new BadRequest("Invalid OTP");
      }
      if (user.isRegistered) {
        throw new BadRequest("User already registered");
      }
      await prisma.register.update({
        where: {
          email,
        },
        data: {
          isRegistered: true,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
      throw new InternalServerError("An unknown error occurred", error);
    }
  }
}
