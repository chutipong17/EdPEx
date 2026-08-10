import prismaInstance from "@/app/server/config/prismaClientInstance";
import { customLog } from "@/app/server/util/custom-log";
import { Prisma, User } from "@prisma/client";
import { HTTPException } from "hono/http-exception";
import { UserDto } from "../../dto/user.dto";

export class UserRepository {
  private readonly prisma = prismaInstance;

  async getUserById(userId: number): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { 
          id: userId, 
          isDeleted: false 
        },
      });
    } catch (error) {
      customLog.error("Error fetching user by ID", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      throw new HTTPException(status, { message: "Failed to fetch user by ID" });
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      return await this.prisma.user.findFirst({
        where: { email },
      }) as User;
    } catch (error) {
      customLog.error("Error fetching user by email", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      throw new HTTPException(status, { message: "Failed to fetch user by email" });
    }
  }

  async createUserTransaction(tx: Prisma.TransactionClient, userData: Prisma.UserCreateInput): Promise<User> {
    try {
      return await tx.user.create({
        data: userData,
      });
    } catch (error) {
      customLog.error("Error creating user", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      throw new HTTPException(status, { message: "Failed to create user" });
    }
  }

  async getAllUser(): Promise<User[]> {
    try {
      return await this.prisma.user.findMany({
        where: { 
          isActive: true, 
          isDeleted: false 
        },
      });
    } catch (error) {
      customLog.error("Error fetching users", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      throw new HTTPException(status, { message: "Failed to fetch users" });
    }
  }

  async searchUsers(username?: string, department?: string): Promise<User[]> {
    try {
      const whereClause = this.buildWhereClause(username, department);
      return await this.prisma.user.findMany({
        where: { 
          isActive: true, 
          isDeleted: false,
          ...whereClause
        },
      });
    } catch (error) {
      customLog.error("Error searching users", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      throw new HTTPException(status, { message: "Failed to search users" });
    }
  }

  async updateUser(
    id: number,
    data: UserDto
  ): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { 
          id, 
          isDeleted: false 
        },
        data: {
          ...(data.firstName !== undefined && {
            firstName: data.firstName,
          }),
          ...(data.lastName !== undefined && {
            lastName: data.lastName,
          }),
          ...(data.email !== undefined && {
            email: data.email,
          }),
          ...(data.mobileNumber !== undefined && {
            mobileNumber: data.mobileNumber,
          }),
          ...(data.departmentId !== undefined && {
            departmentId: data.departmentId,
          }),
          updatedBy: data.updatedBy,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      customLog.error("Error updating user", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      throw new HTTPException(status, { message: "Failed to update user" });
    }
  }

  async deleteUser(
    id: number,
    updatedBy: string
  ): Promise<User> {
    try {
      const updatedAt = new Date();
      const user = await this.prisma.$transaction(async (tx) => {
        await tx.auth.updateMany({
          where: {
            userId: id,
          },
          data: {
            isDeleted: true,
            updatedBy,
            updatedAt,
          },
        });

        return await tx.user.update({
          where: {
            id,
          },
          data: {
            isDeleted: true,
            updatedBy,
            updatedAt,
          },
        });
      });

      return user;
    } catch (error) {
      customLog.error("Error deleting user", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      throw new HTTPException(status, { message: "Failed to delete user" });
    }
  }

  private buildWhereClause(username?: string, department?: string): Prisma.UserWhereInput {
    const whereClause: Prisma.UserWhereInput = {
      isDeleted: false,
    };

    if (username) {
      whereClause.OR = [
        {
          auth: {
            some: {
              username: {
                contains: username,
              },
              isDeleted: false,
            },
          },
        },
        {
          firstName: {
            contains: username,
          },
        },
        {
          lastName: {
            contains: username,
          },
        },
      ];
    }

    if (department) {
      whereClause.department = {
        departmentName: {
          contains: department,
        },
        isDeleted: false,
      };
    }

    return whereClause;
  }
}