import { RoleService } from "./role.service";
import { Context } from "hono";
import { customLog } from "@/app/server/util/custom-log";

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
      return c.json(
        {
          success: false,
          error: { message: error instanceof Error ? error.message : "role failed" },
        },
        400,
      );
    }
  };
}