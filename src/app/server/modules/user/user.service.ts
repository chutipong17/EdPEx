import { customLog } from "@/app/server/util/custom-log";
import { User } from "@prisma/client";
import { UserRepository } from "./user.repository";
import { HTTPException } from "hono/http-exception";
import { UserDto } from "../../dto/user.dto";

export class UserService {
  constructor(private readonly userRepository = new UserRepository()) {}

  async getUserById(userId: number): Promise<User | null> {
    try {
      customLog.info("Getting user service");
      return this.userRepository.getUserById(userId);
    } catch (error) {
      const status = error instanceof HTTPException ? error.status : 500;
      customLog.error("Error getting user: ", { message: `${error}` || "Getting user failed" });
      throw new HTTPException(status, { message: `${error}` || "Failed to get user" });
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      customLog.info("Getting all users service");
      return this.userRepository.getAllUser();
    } catch (error) {
      const status = error instanceof HTTPException ? error.status : 500;
      customLog.error("Error getting all users: ", { message: `${error}` || "Getting all users failed" });
      throw new HTTPException(status, { message: `${error}` || "Getting all users failed" });
    }
  }

  async searchUsers(
    searchValue?: string,
    page = 1,
    pageSize = 10,
  ): Promise<{
    data: User[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    try {
      customLog.info("Search users service");
      return this.userRepository.searchUsers(searchValue, page, pageSize);
    } catch (error) {
      const status = error instanceof HTTPException ? error.status : 500;
      customLog.error("Error searching users: ", { message: `${error}` || "Searching users failed" });
      throw new HTTPException(status, { message: `${error}` || "Searching users failed" });
    }
  }

  async updateUser(
    id: number, 
    data: UserDto, 
    updatedBy: string
  ): Promise<User> {
  try {
    customLog.info("Updating user service");
    data.updatedBy = updatedBy ?? "system";
    return this.userRepository.updateUser(id, data);
  } catch (error) {
    const status = error instanceof HTTPException ? error.status : 500;
      customLog.error("Error updating user: ", { message: `${error}` || "Updating user failed" });
      throw new HTTPException(status, { message: `${error}` || "Updating user failed" });
    }
  }

  async deleteUser(id: number, updatedBy: string): Promise<User> {
    try {
      customLog.info("Deleting user service");
      return this.userRepository.deleteUser(id, updatedBy ?? "system");
    } catch (error) {
      const status = error instanceof HTTPException ? error.status : 500;
      customLog.error("Error deleting user: ", { message: `${error}` || "Deleting user failed" });
      throw new HTTPException(status, { message: `${error}` || "Deleting user failed" });
    }
  }
}