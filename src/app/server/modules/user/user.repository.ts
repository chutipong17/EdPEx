import prismaInstance from "@/app/server/config/prismaClientInstance";
import { HTTPException } from "hono/http-exception";
import { customLog } from "@/app/server/util/custom-log";
import { Prisma, User } from "@prisma/client";

export class UserRepository {
  private readonly prisma = prismaInstance;

  async getUser(): Promise<User> {
    try {
      return {} as User;
    } catch (error) {
      customLog.error("Error fetching user", { error });
      throw new HTTPException(400, { message: "Failed to fetch user" });
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      return await this.prisma.user.findFirst({
        where: { email },
      }) as User;
    } catch (error) {
      customLog.error("Error fetching user by email", { error });
      throw new HTTPException(400, { message: "Failed to fetch user by email" });
    }
  }

  async findUserById(id: number): Promise<User | null> {
    try {
      return await this.prisma.user.findFirst({
        where: { id },
      });
    } catch (error) {
      customLog.error("Error fetching user by ID", { error });
      throw new HTTPException(400, { message: "Failed to fetch user by ID" });
    }
  }

  async createUserTransaction(tx: Prisma.TransactionClient, userData: Prisma.UserCreateInput): Promise<User> {
    try {
      return await tx.user.create({
        data: userData,
      });
    } catch (error) {
      customLog.error("Error creating user", { error });
      throw new HTTPException(400, { message: "Failed to create user" });
    }
  }
}