import { customLog } from "@/app/server/util/custom-log";
import { Department, Prisma } from "@prisma/client";
import { DepartmentRepository } from "./department.repository";
import { Organization } from "../../enum/enum";
import { HTTPException } from "hono/http-exception";
import { DepartmentDto } from "../../dto/department.dto";

export class DepartmentService {
  constructor(private readonly departmentRepository = new DepartmentRepository()) {}

  async getDepartment(): Promise<Department[]> {
    try {
      customLog.info("Getting department service");
      return this.departmentRepository.getDepartment();
    } catch (error) {
      customLog.error("Error getting department", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      throw new HTTPException(status, { message: `${error}` || "Getting department failed" });
    }
  }

  async getDepartmentById(id: number): Promise<Department | null> {
    try {
      customLog.info("Getting department by ID service");
      const department = await this.departmentRepository.getDepartmentById(id);
      if (!department) {
        customLog.error("ไม่พบหน่วยงาน");
        throw new HTTPException(404, { message: "ไม่พบหน่วยงาน" });
      }
      return department;
    } catch (error) {
      customLog.error("Error getting department by ID", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      throw new HTTPException(status, { message: `${error}` || "Getting department by ID failed" });
    }
  }

  async createDepartment(body: DepartmentDto, updatedBy: string): Promise<Department> {
    try {
      customLog.info("Creating department service");
      const organization = await this.departmentRepository.getOrganizationsByCode(Organization.UBRU);
      if (!organization) {
        customLog.error("ไม่พบองค์กร");
        throw new HTTPException(400, { message: "ไม่พบองค์กร" });
      }
      const departmentData: Prisma.DepartmentCreateInput = {
        organization: { connect: { id: organization.id } },
        departmentName: body.departmentName,
        departmentCode: body.departmentCode?.toUpperCase() || null,
        isDeleted: false,
        createdBy: updatedBy ?? "system",
        updatedBy: updatedBy ?? "system",
      };
      return this.departmentRepository.createDepartment(departmentData);
    } catch (error) {
      const status = error instanceof HTTPException ? error.status : 500;
      customLog.error("Error creating department: ", { message: `${error}` || "Creating department failed" });
      throw new HTTPException(status, { message: `${error}` || "Creating department failed" });
    }
  }

  async updateDepartment(id: number, body: DepartmentDto, updatedBy: string): Promise<Department> {
    try {
      customLog.info("Updating department service");
      const departmentData: Prisma.DepartmentUpdateInput = {
        departmentName: body.departmentName,
        updatedAt: new Date(),
        updatedBy: updatedBy || "system",
      };

      if (body.departmentCode) {
        departmentData.departmentCode = body.departmentCode.toUpperCase();
      }
      return this.departmentRepository.updateDepartment(id, departmentData);
    } catch (error) {
      const status = error instanceof HTTPException ? error.status : 500;
      customLog.error("Error updating department: ", { message: `${error}` || "Updating department failed" });
      throw new HTTPException(status, { message: `${error}` || "Updating department failed" });
    }
  }

  async deleteDepartment(id: number, updatedBy: string): Promise<Department> {
    try {
      customLog.info("Deleting department service");
      return this.departmentRepository.deleteDepartment(id, updatedBy);
    } catch (error) {
      const status = error instanceof HTTPException ? error.status : 500;
      customLog.error("Error deleting department: ", { message: `${error}` || "Deleting department failed" });
      throw new HTTPException(status, { message: `${error}` || "Deleting department failed" });
    }
  }
}