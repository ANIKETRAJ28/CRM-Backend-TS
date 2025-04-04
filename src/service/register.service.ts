import { IRegister } from "../interface/register.interface";
import { RegisterRepository } from "../repository/register.reposiotry";

export class RegisterService {
  private registerRepository: RegisterRepository;

  constructor() {
    this.registerRepository = new RegisterRepository();
  }

  async registerUser(email: string): Promise<IRegister> {
    try {
      return await this.registerRepository.registerUser(email);
    } catch (error) {
      throw error;
    }
  }

  async updateRegisterUserByOTP(
    email: string,
    otp: string
  ): Promise<IRegister> {
    try {
      return await this.registerRepository.updateRegisterUserByOTP(email, otp);
    } catch (error) {
      throw error;
    }
  }
}
