import { customLog } from "@/app/server/util/custom-log";
import { User } from "@prisma/client";
import { UserRepository } from "./user.repository";

export class UserService {
  constructor(private readonly userRepository = new UserRepository()) {}

  async getUserById(userId: number): Promise<User | null> {
    try {
      customLog.info("Getting user service");
      return this.userRepository.getUserById(userId);
    } catch (error) {
      customLog.error("Error getting user", { error });
      throw new Error("user failed");
    }
  }
}