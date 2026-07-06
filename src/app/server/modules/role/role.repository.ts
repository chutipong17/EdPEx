import prismaInstance from "@/app/server/config/prismaClientInstance";
import { customLog } from "@/app/server/util/custom-log";
import { Prisma, Role } from "@prisma/client";
import { HTTPException } from "hono/http-exception";

export class RoleRepository {
  private readonly prisma = prismaInstance;

  async getRole(): Promise<Role[]> {
    try {
      return await this.prisma.role.findMany();
    } catch (error) {
      customLog.error("Error fetching role", { error });
      throw new HTTPException(400, { message: "Failed to fetch role" });
    }
  }

  async createRolePermissionTransaction(tx: Prisma.TransactionClient, roleData: Prisma.RolePermissionCreateManyInput[]): Promise<Prisma.BatchPayload> {
      try {
        return await tx.rolePermission.createMany({
          data: roleData,
        });
      } catch (error) {
        customLog.error("Error creating role permission", { error });
        throw new HTTPException(400, { message: "Failed to create role permission" });
      }
    }
}