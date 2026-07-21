import prismaInstance from "@/app/server/config/prismaClientInstance";
import { HTTPException } from "hono/http-exception";
import { customLog } from "@/app/server/util/custom-log";
import { Department, Organization, Prisma } from "@prisma/client";

export class DepartmentRepository {
  private readonly prisma = prismaInstance;

  async getOrganizationsByCode(orgCode: string): Promise<Organization | null> {
    try {
      return await this.prisma.organization.findUnique({
        where: { organizationCode: orgCode, isDeleted: false },
      });
    } catch (error) {
      customLog.error("Error fetching organization", { error });
      throw new HTTPException(400, { message: "Failed to fetch organization" });
    }
  }

  async getDepartment(): Promise<Department[]> {
    try {
      return await this.prisma.department.findMany({
        where: { isDeleted: false },
      });
    } catch (error) {
      customLog.error("Error fetching department", { error });
      throw new HTTPException(400, { message: "Failed to fetch department" });
    }
  }

  async getDepartmentById(id: number): Promise<Department | null> {
    try {
      return await this.prisma.department.findUnique({
        where: { id, isDeleted: false },
      });
    } catch (error) {
      customLog.error("Error fetching department by ID", { error });
      throw new HTTPException(400, { message: "Failed to fetch department by ID" });
    }
  }

  async createDepartment(departmentData: Prisma.DepartmentCreateInput): Promise<Department> {
    try {
      return await this.prisma.department.create({
        data: departmentData,
      });
    } catch (error) {
      customLog.error("Error creating department", { error });
      throw new HTTPException(400, { message: "Failed to create department" });
    }
  }

  async updateDepartment(
    id: number, 
    departmentData: Prisma.DepartmentUpdateInput
  ): Promise<Department> {
    try {
      return await this.prisma.department.update({
        where: { id, isDeleted: false },
        data: departmentData,
      });
    } catch (error) {
      customLog.error("Error updating department", { error });
      throw new HTTPException(400, { message: "Failed to update department" });
    }
  }

  async deleteDepartment(
      id: number,
      updatedBy: string
    ): Promise<Department> {
      try {
        return await this.prisma.department.update({
          where: { id, isDeleted: false },
          data: {
            isDeleted: true,
            updatedBy,
            updatedAt: new Date(),
          },
        });
      } catch (error) {
        customLog.error("Error deleting department", { error });
        throw new HTTPException(400, { message: "Failed to delete department" });
      }
    }
}