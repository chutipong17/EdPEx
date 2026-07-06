import prismaInstance from "@/app/server/config/prismaClientInstance";
import { HTTPException } from "hono/http-exception";
import { customLog } from "@/app/server/util/custom-log";
import { Auth, Prisma, RefreshToken } from "@prisma/client";

export class AuthRepository {
  private readonly prisma = prismaInstance;

  async getAuth(): Promise<Auth> {
    try {
      return {} as Auth;
    } catch (error) {
      customLog.error("Error fetching auth", { error });
      throw new HTTPException(400, { message: "Failed to fetch auth" });
    }
  }

  async findAuthByUserName(userName: string) {
    try {
      return await this.prisma.auth.findUnique({
        where: { username: userName, isDeleted: false },
        select: {
          id: true,
          username: true,
          password: true,
          userId: true,
          isDeleted: true,
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
              isActive: true,
              isDeleted: true,
              createdAt: true,
              updatedAt: true,
              createdBy: true,
              updatedBy: true,
            },
          },
        },
      });
    } catch (error) {
      customLog.error("Error fetching auth", { error });
      throw new HTTPException(400, { message: "Failed to fetch auth" });
    }
  }

  async createAuthTransaction(tx: Prisma.TransactionClient, authData: Prisma.AuthCreateInput): Promise<Auth> {
    try {
      return await tx.auth.create({
        data: authData,
      });
    } catch (error) {
      customLog.error("Error creating auth", { error });
      throw new HTTPException(400, { message: "Failed to create auth" });
    }
  }

  async createOrUpdateRefreshToken(
    userId: number,
    token: string,
    expiryDate: Date
  ): Promise<RefreshToken> {
    try {
      return this.prisma.refreshToken.upsert({
        where: {
          userId,
        },
        update: {
          token,
          expiryDate,
          updatedAt: new Date(),
        },
        create: {
          userId,
          token,
          expiryDate,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: "system",
          updatedBy: "system",
        },
      });
    } catch (error) {
      customLog.error("Error creating refresh token", { error });
      throw new HTTPException(400, { message: "Failed to create refresh token" });
    }
  }

  async deleteRefreshToken(userId: number): Promise<Prisma.BatchPayload> {
    try {
      return this.prisma.refreshToken.deleteMany({
        where: {
          userId,
        }
      });
    } catch (error) {
      customLog.error("Error deleting refresh token", { error });
      throw new HTTPException(400, { message: "Failed to delete refresh token" });
    }
  }
}