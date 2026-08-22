import { UserService } from "./user.service";
import { Context } from "hono";
import { customLog } from "@/app/server/util/custom-log";
import { HTTPException } from "hono/http-exception";
import { convertErrorMessage } from "../../util/common";
import { UserDto } from "../../dto/user.dto";

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
      customLog.error("Error getting user by ID", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof HTTPException ? convertErrorMessage(error.message) : "Getting user by ID failed";
      return c.json(
        {
          success: false,
          error: { message: errorMessage },
        },
        status,
      );
    }
  };

  getAllUsers = async (c: Context) => {
    try {
      const users = await this.userService.getAllUsers();

      return c.json({
        success: true,
        data: users,
      });
    } catch (error) {
      customLog.error("Error getting all users", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof HTTPException ? error.message : "Getting all users failed";
      return c.json(
        {
          success: false,
          error: { message: errorMessage },
        },
        status,
      );
    }
  };

  searchUsers = async (c: Context) => {
    try {
      const body = await c.req.json();
      const { searchValue, page = 1, pageSize = 10 } = body ?? {};
      const users = await this.userService.searchUsers(searchValue, page, pageSize);

      return c.json({
        success: true,
        data: users,
      });
    } catch (error) {
      customLog.error("Error searching users", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof HTTPException ? error.message : "Searching users failed";
      return c.json(
        {
          success: false,
          error: { message: errorMessage },
        },
        status,
      );
    }
  };

  updateUser = async (c: Context) => {
    try {
      const fullName = c.get("fullName");
      const id = Number(c.req.param("id"));
      const body: UserDto = await c.req.json();
      const parsed = UserDto.safeParse(body);
      if (!parsed.success) {
        throw new HTTPException(400, { message: "Invalid user data" });
      }
      const userDto = parsed.data;
      const user = await this.userService.updateUser(id, userDto, fullName);

      customLog.info("User updated :", { user });

      return c.json({
        success: true,
        data: user,
      }, 200);
    } catch (error) {
      customLog.error("Error updating user", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof HTTPException ? convertErrorMessage(error.message) : "Updating user failed";
      return c.json(
        {
          success: false,
          error: { message: errorMessage },
        },
        status,
      );
    }
  };

  deleteUser = async (c: Context) => {
    try {
      const fullName = c.get("fullName");
      const id = Number(c.req.param("id"));
      const user = await this.userService.deleteUser(id, fullName);

      customLog.info("User deleted :", { user });

      return c.json({
        success: true,
        message: "User deleted successfully",
      }, 200);
    } catch (error) {
      customLog.error("Error deleting user", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof HTTPException ? convertErrorMessage(error.message) : "Deleting user failed";
      return c.json(
        {
          success: false,
          error: { message: errorMessage },
        },
        status,
      );
    }
  };

  getUserByDepartment = async (c: Context) => {
    try {
      const departmentId = Number(c.req.param("id"));
      const users = await this.userService.getUserByDepartment(departmentId);

      return c.json({
        success: true,
        data: users,
      });
    } catch (error) {
      customLog.error("Error getting users by department", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof HTTPException ? convertErrorMessage(error.message) : "Getting users by department failed";
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