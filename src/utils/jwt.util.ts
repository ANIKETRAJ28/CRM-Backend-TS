import { IUserResponse } from "../interface/user.interface";
import jwt from "jsonwebtoken";

export function createJWTtoken(user: IUserResponse): string {
  const token = jwt.sign(user, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
  return token;
}

export function createORGToken({ orgId }: { orgId: string }): string {
  const token = jwt.sign({ orgId }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
  return token;
}

export function createProfileToken({ email }: { email: string }): string {
  const token = jwt.sign({ email }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
  return token;
}

export function createOtpToken({ email }: { email: string }): string {
  const token = jwt.sign({ email }, process.env.JWT_SECRET as string, {
    expiresIn: "1m",
  });
  return token;
}
