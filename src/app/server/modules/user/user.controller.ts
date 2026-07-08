import { UserService } from "./user.service";
import { Context } from "hono";
import { customLog } from "@/app/server/util/custom-log";

export class UserController {
  constructor(
    private readonly userService = new UserService()
  ) {}

  getUserById = async (c: Context) => {
    try {
      const userId = c.req.param("id");
      const user = await this.userService.getUserById(Number(userId));

      return c.json({
        success: true,
        data: user,
      });
    } catch (error) {
      customLog.error("Error getting user", { error });
      return c.json(
        {
          success: false,
          error: { message: error instanceof Error ? error.message : "user failed" },
        },
        400,
      );
    }
  };
}