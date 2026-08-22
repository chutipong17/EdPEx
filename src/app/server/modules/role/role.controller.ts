import { RoleService } from "./role.service";
import { Context } from "hono";
import { customLog } from "@/app/server/util/custom-log";
import { HTTPException } from "hono/http-exception";

export class RoleController {
  constructor(
    private readonly roleService = new RoleService()
  ) {}

  getRole = async (c: Context) => {
    try {
      const role = await this.roleService.getRole();

      return c.json({
        success: true,
        data: role,
      });
    } catch (error) {
      customLog.error("Error getting role", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof HTTPException ? error.message : "Getting role failed";
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