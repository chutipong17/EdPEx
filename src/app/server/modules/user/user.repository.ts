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
      const user = await this.prisma.user.findMany({
        where: { 
          isActive: true, 
          isDeleted: false 
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          mobileNumber: true,
          departmentId: true,
          isActive: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
          createdBy: true,
          updatedBy: true,
          department: {
            where: {
              isDeleted: false,
            },
            select: {
              departmentName: true,
            },
          },
          auth: {
            where: {
              isDeleted: false,
            },
            select: {
              username: true,
            },
            take: 1,
          },
        },
      });

      return user.map(({ auth, department, ...user }) => ({
        ...user,
        username: auth[0]?.username ?? null,
        departmentName: department?.departmentName ?? null,
      }));
    } catch (error) {
      customLog.error("Error fetching users", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      throw new HTTPException(status, { message: "Failed to fetch users" });
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
      const safePage = Math.max(1, Number(page) || 1);
      const safePageSize = Math.min(100, Math.max(1, Number(pageSize) || 10));
      const skip = (safePage - 1) * safePageSize;
      const whereClause = this.buildWhereClause(searchValue);
      const where = {
        isActive: true,
        isDeleted: false,
        ...whereClause,
      };

      const [total, users] = await this.prisma.$transaction([
        this.prisma.user.count({ where }),
        this.prisma.user.findMany({
          where,
          skip,
          take: safePageSize,
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            mobileNumber: true,
            departmentId: true,
            isActive: true,
            isDeleted: true,
            createdAt: true,
            updatedAt: true,
            createdBy: true,
            updatedBy: true,
            department: {
              where: {
                isDeleted: false,
              },
              select: {
                departmentName: true,
              },
            },
            auth: {
              where: {
                isDeleted: false,
              },
              select: {
                username: true,
              },
              take: 1,
            },
          },
        }),
      ]);

      const data = users.map(({ auth, department, ...user }) => ({
        ...user,
        username: auth[0]?.username ?? null,
        departmentName: department?.departmentName ?? null,
      }));

      return {
        data,
        total,
        page: safePage,
        pageSize: safePageSize,
        totalPages: Math.max(1, Math.ceil(total / safePageSize)),
      };
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

  private buildWhereClause(searchValue?: string): Prisma.UserWhereInput {
    const whereClause: Prisma.UserWhereInput = {
      isDeleted: false,
    };

    if (searchValue) {
      whereClause.OR = [
        {
          auth: {
            some: {
              username: {
                contains: searchValue,
              },
              isDeleted: false,
            },
          },
        },
        {
          firstName: {
            contains: searchValue,
          },
        },
        {
          lastName: {
            contains: searchValue,
          },
        },
        {
          department: {
            is: {
              departmentName: {
                contains: searchValue,
              },
              isDeleted: false,
            },
          },
        },
      ];
    }

    return whereClause;
  }
}