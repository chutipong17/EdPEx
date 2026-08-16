import { customLog } from "@/app/server/util/custom-log";
import { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { ChangePasswordDto } from "../../dto/change-password.dto";
import { SignInDto } from "../../dto/sign-in.dto";
import { SignUpDto } from "../../dto/sign-up.dto";
import { convertErrorMessage } from "../../util/common";
import { AuthService } from "./auth.service";

export class AuthController {
  constructor(
    private readonly authService = new AuthService()
  ) {}

  getAuth = async (c: Context) => {
    try {
      const auth = await this.authService.getAuth();

      return c.json({
        success: true,
        data: auth,
      });
    } catch (error) {
      customLog.error("Error getting auth", { error });
      return c.json(
        {
          success: false,
          error: { message: error instanceof Error ? error.message : "auth failed" },
        },
        400,
      );
    }
  };

  signUp = async (c: Context, body: SignUpDto) => {
    try {
      const userId = c.get("userId");
      const result = await this.authService.signUp(body, Number(userId));

      customLog.info("Sign up result :", { result });

      return c.json({
        success: true,
        message: "Sign Up successfully",
      }, 201);
    } catch (error) {
      customLog.error("Error signing up user", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      return c.json(
        {
          success: false,
          error: { message: error instanceof Error ? convertErrorMessage(error.message) : "auth failed" },
        },
        status,
      );
    }
  };

  signIn = async (c: Context, body: SignInDto) => {
    try {
      const result = await this.authService.signIn(body);

      customLog.info("Sign in result :", { result });

      setCookie(c, "edpex-session", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        path: "/",
        expires: result.expiresAt,
      });

      return c.json({
        success: true,
        data: result.user,
      }, 200);
    } catch (error) {
      customLog.error("Error signing in user", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      return c.json(
        {
          success: false,
          error: { message: error instanceof Error ? convertErrorMessage(error.message) : "auth failed" },
        },
        status,
      );
    }
  };

  signOut = async (c: Context) => {
    try {
      const token = getCookie(c, "edpex-session");
      if (!token) {
        return c.json({
          success: false,
          message: "Unauthorized",
        }, 401);
      }

      await this.authService.signOut(token);

      deleteCookie(c, "edpex-session", {
        path: "/",
      });

      return c.json({
        success: true,
        message: "Sign Out successfully",
      }, 200);
    } catch (error) {
      customLog.error("Error signing out user", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      return c.json(
        {
          success: false,
          error: { message: error instanceof Error ? convertErrorMessage(error.message) : "auth failed" },
        },
        status,
      );
    }
  };

  changePassword = async (c: Context, body: ChangePasswordDto) => {
    try {
      const updateBy = c.get("fullName");
      const result = await this.authService.changePassword(body, updateBy);

      return c.json({
        success: true,
        data: result,
      }, 200);
    } catch (error) {
      customLog.error("Error changing password", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      return c.json(
        {
          success: false,
          error: { message: error instanceof Error ? convertErrorMessage(error.message) : "auth failed" },
        },
        status,
      );
    }
  };
}