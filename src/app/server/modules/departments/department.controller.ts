import { customLog } from "@/app/server/util/custom-log";
import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { DepartmentDto } from "../../dto/department.dto";
import { convertErrorMessage } from "../../util/common";
import { DepartmentService } from "./department.service";

export class DepartmentController {
  constructor(
    private readonly departmentService = new DepartmentService()
  ) {}

  getDepartment = async (c: Context) => {
    try {
      const department = await this.departmentService.getDepartment();

      return c.json({
        success: true,
        data: department,
      });
    } catch (error) {
      customLog.error("Error getting department", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof Error ? convertErrorMessage(error.message) : "Getting department failed";
      return c.json(
        {
          success: false,
          error: { message: errorMessage },
        },
        status,
      );
    }
  };

  getDepartmentById = async (c: Context) => {
    try {
      const id = Number(c.req.param("id"));
      const department = await this.departmentService.getDepartmentById(id);

      return c.json({
        success: true,
        data: department,
      });
    } catch (error) {
      customLog.error("Error getting department by ID", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof Error ? convertErrorMessage(error.message) : "Getting department by ID failed";
      return c.json(
        {
          success: false,
          error: { message: errorMessage },
        },
        status,
      );
    }
  };

  createDepartment = async (c: Context, body: DepartmentDto) => {
    try {
      const updatedBy = c.get("fullName");
      const department = await this.departmentService.createDepartment(body, updatedBy);

      customLog.info("Department created :", { department });

      return c.json({
        success: true,
        message: "Department created successfully",
      }, 201);
    } catch (error) {
      customLog.error("Error creating department", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof Error ? convertErrorMessage(error.message) : "Creating department failed";
      return c.json(
        {
          success: false,
          error: { message: errorMessage },
        },
        status,
      );
    }
  };

  updateDepartment = async (c: Context, body: DepartmentDto) => {
    try {
      const updatedBy = c.get("fullName");
      const department = await this.departmentService.updateDepartment(Number(c.req.param("id")), body, updatedBy);

      customLog.info("Department updated :", { department });

      return c.json({
        success: true,
        data: department,
      }, 200);
    } catch (error) {
      customLog.error("Error updating department", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof Error ? convertErrorMessage(error.message) : "Updating department failed";
      return c.json(
        {
          success: false,
          error: { message: errorMessage },
        },
        status,
      );
    }
  };

  deleteDepartment = async (c: Context) => {
    try {
      const updatedBy = c.get("fullName");
      const department = await this.departmentService.deleteDepartment(Number(c.req.param("id")), updatedBy);

      customLog.info("Department deleted :", { department });

      return c.json({
        success: true,
        message: "Department deleted successfully",
      }, 200);
    } catch (error) {
      customLog.error("Error deleting department", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof Error ? convertErrorMessage(error.message) : "Deleting department failed";
      return c.json(
        {
          success: false,
          error: { message: errorMessage },
        },
        status,
      );
    }
  };
}